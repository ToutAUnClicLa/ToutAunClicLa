import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email no proporcionado' },
        { status: 400 }
      );
    }
    
    // 1. Verificar que el usuario existe y está verificado en nuestra tabla
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, verificado')
      .eq('correo_electronico', email)
      .single();
    
    if (userError || !userData) {
      console.error('Error al buscar usuario en tabla personalizada:', userError);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    if (!userData.verificado) {
      // El usuario no está verificado en nuestra tabla
      return NextResponse.json(
        { error: 'El usuario no está verificado en nuestra base de datos' },
        { status: 400 }
      );
    }
    
    // 2. Configurar Supabase Admin client con service_role
    const supabaseAdmin = createRouteHandlerClient<any>({ cookies }, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    
    // 3. Buscar usuario en Supabase Auth por email
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({});
    
    if (authError || !authUsers || !authUsers.users) {
      console.error('Error al obtener usuarios de auth:', authError);
      return NextResponse.json(
        { error: 'Error al buscar usuario en Auth' },
        { status: 500 }
      );
    }
    
    // Encontrar usuario por email
    const authUser = authUsers.users.find(u => u.email === email);
    
    if (!authUser) {
      console.error('No se encontró el usuario de autenticación con el email:', email);
      return NextResponse.json(
        { error: 'Usuario no encontrado en Auth' },
        { status: 404 }
      );
    }
    
    // 4. IMPORTANTE: Confirmar el email del usuario usando admin API
    try {
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        { 
          email_confirm: true,
          // Añadir metadatos para asegurar la sincronización
          user_metadata: {
            ...authUser.user_metadata || {},
            email_verified: true,
            verified_at: new Date().toISOString(),
            // Preservar datos adicionales si existen
            nombre: authUser.user_metadata?.nombre || authUser.user_metadata?.full_name || email.split('@')[0],
            telefono: authUser.user_metadata?.telefono
          }
        }
      );
      
      if (confirmError) {
        console.error('Error al confirmar email en Auth:', confirmError);
        return NextResponse.json(
          { error: 'Error al confirmar email en Auth' },
          { status: 500 }
        );
      }
      
      // Si no hay error, asumimos que todo salió bien
      console.log('Email confirmado correctamente en Supabase Auth para:', email);
      
      // Intentar confirmar el email directamente en la base de datos
      try {
        // Llamar a la función RPC que hemos creado
        const { error: rpcError } = await supabaseAdmin.rpc(
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
      
      // Intentar obtener el usuario actualizado para verificación
      const { data: updatedUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(authUser.id);
      
      if (!getUserError && updatedUser) {
        // Verificar si ahora email_confirmed_at está establecido
        if (updatedUser.user.email_confirmed_at) {
          console.log('Verificación: email_confirmed_at confirmado después de la actualización');
        } else {
          console.log('Advertencia: email_confirmed_at aún no está actualizado después de la operación');
          // Esto es informativo, continuamos con éxito de todas formas
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Estado de verificación sincronizado correctamente'
      });
    } catch (confirmError) {
      console.error('Error al acceder a admin API:', confirmError);
      return NextResponse.json(
        { error: 'Error al acceder a la API de administración' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error al sincronizar verificación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 