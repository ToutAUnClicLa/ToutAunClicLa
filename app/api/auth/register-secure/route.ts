import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmailServer } from '@/lib/email/resend-server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, nombre, telefono } = body;
    
    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Validaciones de seguridad
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Usar cliente con service role para operaciones administrativas
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Obtener información de la solicitud para logs
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 1. Verificar si el email ya existe
    const { count, error: countError } = await supabaseAdmin
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('correo_electronico', email);
    
    if (countError) {
      console.error('Error al verificar si el email existe:', countError);
      return NextResponse.json(
        { error: 'Error al verificar email' },
        { status: 500 }
      );
    }
    
    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    // 2. Crear usuario en Supabase Auth usando admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Lo confirmaremos manualmente
      user_metadata: {
        nombre,
        telefono: telefono || undefined,
        full_name: nombre,
      }
    });
    
    if (authError || !authData.user) {
      console.error('Error al crear usuario en Auth:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Error al crear la cuenta' },
        { status: 500 }
      );
    }

    // 3. Crear registro en nuestra tabla de usuarios
    const { data: nuevoUsuario, error: dbError } = await supabaseAdmin
      .from('usuarios')
      .insert([
        {
          id: authData.user.id, // Usar el mismo ID que Auth
          correo_electronico: email,
          nombre,
          telefono: telefono || null,
          verificado: false,
          autenticacion_social: false,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();
    
    if (dbError || !nuevoUsuario) {
      console.error('Error al crear perfil de usuario:', dbError);
      // Limpiar el usuario de Auth
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Error al limpiar usuario de Auth:', cleanupError);
      }
      
      return NextResponse.json(
        { error: dbError?.message || 'Error al crear el perfil' },
        { status: 500 }
      );
    }

    // 4. Generar token de verificación usando función de seguridad
    const { data: token, error: tokenError } = await supabaseAdmin.rpc('generate_verification_token', {
      user_email: email
    });

    if (tokenError || !token) {
      console.error('Error al generar token de verificación:', tokenError);
      return NextResponse.json(
        { error: 'Error al generar el token de verificación' },
        { status: 500 }
      );
    }

    // 5. Enviar email de verificación
    try {
      await sendVerificationEmailServer({
        email,
        token: token,
        nombre,
      });
    } catch (emailError: any) {
      console.error('Error al enviar email de verificación:', emailError);
      return NextResponse.json(
        { 
          success: true, 
          warning: 'Usuario registrado pero hubo un problema al enviar el email de verificación' 
        },
        { status: 201 }
      );
    }

    // 6. Log del registro exitoso
    await supabaseAdmin
      .from('logs_acceso')
      .insert([
        {
          usuario_id: nuevoUsuario.id,
          tipo_evento: 'verificacion_email',
          ip_address: ipAddress,
          user_agent: userAgent,
          detalles: { email, nombre, telefono: telefono || null, accion: 'registro_usuario' }
        }
      ]);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.' 
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
