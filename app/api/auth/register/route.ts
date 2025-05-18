import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmailServer } from '@/lib/email/resend-server';
import { supabase } from '@/lib/supabase/client';
import crypto from 'crypto';

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
    
    // 2. Registrar usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          telefono,
        },
        emailRedirectTo: undefined, // Desactivamos el email de Supabase
      },
    });
    
    if (authError || !authData.user) {
      console.error('Error al crear usuario en Auth:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Error al crear la cuenta' },
        { status: 500 }
      );
    }
    
    // 3. Generar token de verificación
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token válido por 24 horas
    
    // 4. Crear registro en nuestra tabla de usuarios
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .insert([
        {
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
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: userError?.message || 'Error al crear el perfil' },
        { status: 500 }
      );
    }
    
    // 5. Guardar token en la tabla de verificación
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
    
    // 6. Enviar email de verificación
    try {
      await sendVerificationEmailServer({
        email,
        token,
        nombre,
      });
    } catch (emailError: any) {
      console.error('Error al enviar email de verificación:', emailError);
      // No bloqueamos el registro si falla el email, pero notificamos
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