import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { verifyEmailToken, resendVerificationEmail } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { sendWelcomeEmailServer } from '@/lib/email/resend-server';
import { authLogger } from '@/lib/security/auth-logger';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  
  if (!token) {
    authLogger.logEmailVerificationFailed('unknown', 'Token not provided');
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 400 }
    );
  }
  
  try {
    // Usar cliente admin para todas las operaciones de base de datos
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Buscar el token en la base de datos
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('tokens_verificacion_email')
      .select('id, usuario_id, expires_at')
      .eq('token', token)
      .single();
    
    if (tokenError || !tokenData) {
      authLogger.logEmailVerificationFailed('unknown', 'Invalid or expired token');
      console.error('Token error:', tokenError);
      return NextResponse.json(
        { error: 'Token no válido o expirado' },
        { status: 400 }
      );
    }
    
    console.log('Token found for user ID:', tokenData.usuario_id);
    
    // 2. Verificar que el token no haya expirado
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      authLogger.logEmailVerificationFailed('unknown', 'Token expired');
      return NextResponse.json(
        { error: 'Token expirado. Solicita un nuevo enlace de verificación.' },
        { status: 400 }
      );
    }
    
    // 3. Obtener datos del usuario usando cliente admin
    const { data: userData, error: userDataError } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', tokenData.usuario_id)
      .single();
    
    console.log('User lookup result:', { userData, userDataError, userId: tokenData.usuario_id });
    
    if (userDataError || !userData) {
      console.error('Error al obtener datos del usuario:', userDataError);
      authLogger.logEmailVerificationFailed('unknown', 'User not found in database');
      return NextResponse.json(
        { error: 'Error al verificar la cuenta: usuario no encontrado' },
        { status: 500 }
      );
    }
    
    // 4. Marcar al usuario como verificado en nuestra tabla personalizada
    const { error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update({ 
        verificado: true,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq('id', tokenData.usuario_id);
    
    if (updateError) {
      console.error('Error al actualizar estado de verificación:', updateError);
      authLogger.logEmailVerificationFailed(userData?.correo_electronico || 'unknown', 'Database update failed');
      return NextResponse.json(
        { error: 'Error al verificar la cuenta' },
        { status: 500 }
      );
    }
    
    // 5. También verificar el email en Supabase Auth para permitir login
    try {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        tokenData.usuario_id,
        { email_confirm: true }
      );
      
      if (authUpdateError) {
        console.error('Error updating Auth verification status:', authUpdateError);
        // No fallar completamente, ya que la verificación en nuestra tabla funcionó
        authLogger.logEmailVerificationFailed(userData?.correo_electronico || 'unknown', 'Auth verification failed but custom table updated');
      } else {
        console.log('Email verification updated in both systems successfully');
      }
    } catch (authVerifyError) {
      console.error('Error verifying email in Auth:', authVerifyError);
      // No fallar completamente, continuar con el flujo
    }
    
    // 6. Eliminar el token usado
    await supabaseAdmin
      .from('tokens_verificacion_email')
      .delete()
      .eq('id', tokenData.id);
    
    // 7. Log successful verification
    authLogger.logEmailVerificationSuccess(userData.id, userData.correo_electronico);
    
    // 8. Enviar email de bienvenida
    try {
      await sendWelcomeEmailServer({
        email: userData.correo_electronico,
        nombre: userData.nombre,
      });
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError);
      // No bloqueamos la verificación si falla el envío del email
    }
    
    // 9. Generar URL para redirección
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/auth/login-after-verification?email=${encodeURIComponent(userData.correo_electronico)}`;
    
    // 10. Retornar respuesta exitosa
    return NextResponse.json({ 
      success: true,
      message: 'Email verificado correctamente en nuestra base de datos',
      redirectUrl: redirectUrl
    });
    
  } catch (error: any) {
    console.error('Error al verificar token:', error);
    authLogger.logEmailVerificationFailed('unknown', error.message || 'Unexpected verification error');
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