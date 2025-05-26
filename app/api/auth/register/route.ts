import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmailServer } from '@/lib/email/resend-server';
import { supabase } from '@/lib/database/client';
import crypto from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

    // Obtener información de la solicitud para logs
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 1. Verificar si el email ya existe
    const { count, error: countError } = await supabase
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
    
    // 2. Configurar el cliente Supabase
    const supabaseServer = createRouteHandlerClient({ cookies });
    
    // 3. Registrar usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          nombre,
          telefono: telefono || undefined,
          full_name: nombre,
          email_verification_handled_externally: true
        }
      }
    });
    
    if (authError || !authData.user) {
      console.error('Error al crear usuario en Auth:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Error al crear la cuenta' },
        { status: 500 }
      );
    }

    // 4. Crear registro en nuestra tabla de usuarios
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: authData.user.id, // Usar el mismo ID que Auth
          correo_electronico: email,
          contrasena_hash: 'gestionado_por_supabase',
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
    
    if (userError || !usuario) {
      console.error('Error al crear perfil de usuario:', userError);
      // Intentar limpiar el usuario creado en Auth
      try {
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const supabaseAdmin = createRouteHandlerClient({ cookies }, {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          });
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          console.log('Usuario eliminado de Auth tras error en DB:', authData.user.id);
        }
      } catch (cleanupError) {
        console.error('Error adicional al intentar limpiar:', cleanupError);
      }
      
      return NextResponse.json(
        { error: userError?.message || 'Error al crear el perfil' },
        { status: 500 }
      );
    }

    // 5. Generar token de verificación
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // 6. Guardar token en la tabla de verificación
    const { error: tokenError } = await supabase
      .from('tokens_verificacion_email')
      .insert([
        {
          usuario_id: usuario.id,
          token,
          expires_at: expiresAt.toISOString(),
        },
      ]);
    
    if (tokenError) {
      console.error('Error al guardar token de verificación:', tokenError);
      return NextResponse.json(
        { error: 'Error al generar el token de verificación' },
        { status: 500 }
      );
    }
    
    // 7. Enviar email de verificación
    try {
      await sendVerificationEmailServer({
        email,
        token,
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