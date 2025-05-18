import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { verifyEmailToken, resendVerificationEmail } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { sendWelcomeEmailServer } from '@/lib/email/resend-server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 400 }
    );
  }
  
  try {
    // 1. Buscar el token en la base de datos
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens_verificacion_email')
      .select('id, usuario_id, expires_at')
      .eq('token', token)
      .single();
    
    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token no válido o expirado' },
        { status: 400 }
      );
    }
    
    // 2. Verificar que el token no haya expirado
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado. Solicita un nuevo enlace de verificación.' },
        { status: 400 }
      );
    }
    
    // 3. Obtener datos del usuario para la sincronización
    const { data: userData, error: userDataError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', tokenData.usuario_id)
      .single();
    
    if (userDataError || !userData) {
      console.error('Error al obtener datos del usuario:', userDataError);
      return NextResponse.json(
        { error: 'Error al verificar la cuenta: datos de usuario no encontrados' },
        { status: 500 }
      );
    }
    
    // 4. Marcar al usuario como verificado en nuestra tabla personalizada
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        verificado: true,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq('id', tokenData.usuario_id);
    
    if (updateError) {
      console.error('Error al actualizar estado de verificación:', updateError);
      return NextResponse.json(
        { error: 'Error al verificar la cuenta' },
        { status: 500 }
      );
    }
    
    // 5. Configurar Supabase Admin client con cookies para acceso seguro
    const supabaseAdmin = createRouteHandlerClient<any>({ cookies }, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    
    // 6. Buscar usuario en Supabase Auth por email
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({});
      
    if (authError || !authUsers || !authUsers.users) {
      console.error('Error al obtener usuarios de auth:', authError);
    } else {
      // Encontrar usuario por email
      const authUser = authUsers.users.find(u => u.email === userData.correo_electronico);
      
      if (authUser) {
        // 7. IMPORTANTE: Confirmar el email del usuario usando admin API
        try {
          // Aquí estamos usando updateUserById con email_confirm: true
          // Esto debería marcar el email como confirmado en Supabase Auth
          const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
            authUser.id,
            { 
              email_confirm: true,
              user_metadata: {
                ...authUser.user_metadata,
                nombre: userData.nombre,
                telefono: userData.telefono || undefined,
                full_name: userData.nombre,
                // Añadimos metadatos adicionales para indicar que el usuario está verificado
                email_verified: true,
                verified_at: new Date().toISOString()
              }
            }
          );
          
          if (confirmError) {
            console.error('Error al confirmar email en Auth:', confirmError);
          } else {
            console.log('Email confirmado correctamente en Supabase Auth para:', userData.correo_electronico);
            
            // Intentar confirmar el email directamente en la base de datos
            try {
              // Llamar a la función RPC que hemos creado
              const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
                'confirm_user_email_rpc',
                { user_id: authUser.id }
              );
              
              if (rpcError) {
                console.log('Nota: No se pudo llamar a la función RPC de confirmación:', rpcError.message);
                console.log('Esto es esperado si la función aún no está creada en la base de datos');
              } else {
                console.log('Email confirmado adicionalmente mediante RPC directo a la base de datos');
              }
            } catch (rpcCallError) {
              // Es posible que la función no exista, lo que es esperado si no se ha ejecutado el script SQL
              console.log('Error al intentar llamar función RPC (probablemente no existe aún):', rpcCallError);
            }
            
            // Verificar si necesita un paso adicional
            if (!authUser.email_confirmed_at) {
              console.log('Nota: email_confirmed_at aún no está establecido, esto puede requerir configuración adicional en Supabase');
              // Aquí podrías implementar lógica adicional si fuera necesario
            }
          }
        } catch (confirmError) {
          console.error('Error al acceder a admin API:', confirmError);
        }
      } else {
        console.error('No se encontró el usuario de autenticación con el email:', userData.correo_electronico);
      }
    }
    
    // 8. Eliminar el token usado
    await supabase
      .from('tokens_verificacion_email')
      .delete()
      .eq('id', tokenData.id);
    
    // 9. Enviar email de bienvenida
    try {
      await sendWelcomeEmailServer({
        email: userData.correo_electronico,
        nombre: userData.nombre,
      });
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError);
      // No bloqueamos la verificación si falla el envío del email
    }
    
    // 10. Generar URLs para redirección
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/auth/login-after-verification?email=${encodeURIComponent(userData.correo_electronico)}`;
    
    return NextResponse.json({ 
      success: true,
      message: 'Email verificado correctamente',
      redirectUrl: redirectUrl
    });
    
  } catch (error: any) {
    console.error('Error al verificar token:', error);
    return NextResponse.json(
      { error: error.message || 'Error al verificar el token' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email no proporcionado' },
        { status: 400 }
      );
    }
    
    const result = await resendVerificationEmail(email);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Email de verificación reenviado correctamente'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Error al reenviar el email de verificación' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error al reenviar verificación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 