import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPasswordResetEmailServer } from '@/lib/email/resend-server';
import crypto from 'crypto';
import { passwordResetRateLimiter, withRateLimit } from '@/lib/security/rate-limiter';
import { authLogger } from '@/lib/security/auth-logger';

export async function POST(req: NextRequest) {
  return withRateLimit(passwordResetRateLimiter, async () => {
    try {
      const { email } = await req.json();
      
      authLogger.logPasswordResetRequest(email);
      
      if (!email) {
        return NextResponse.json(
          { error: 'Email no proporcionado' },
          { status: 400 }
        );
      }

    // Usar cliente admin para todas las operaciones
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Verificar que el usuario existe
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre')
      .eq('correo_electronico', email)
      .single();
    
    if (userError || !userData) {
      // Por seguridad, no indicamos si el email existe o no
      return NextResponse.json(
        { success: true, message: 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña' },
        { status: 200 }
      );
    }

    // 2. Generar token de recuperación
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 3. Eliminar tokens de recuperación anteriores
    await supabaseAdmin
      .from('tokens_recuperacion')
      .delete()
      .eq('usuario_id', userData.id);

    // 4. Guardar nuevo token
    const { error: tokenError } = await supabaseAdmin
      .from('tokens_recuperacion')
      .insert([
        {
          usuario_id: userData.id,
          token,
          expires_at: expiresAt.toISOString(),
        }
      ]);

    if (tokenError) {
      console.error('Error al crear token de recuperación:', tokenError);
      return NextResponse.json(
        { error: 'Error al generar el token de recuperación' },
        { status: 500 }
      );
    }

    // 5. Enviar email de recuperación
    try {
      // TODO: Implementar envío de email real
      console.log('Password reset token generated:', { email, token });
      
      // Simular envío exitoso por ahora
      authLogger.logPasswordResetSuccess(userData.id, email);
      
    } catch (emailError: any) {
      console.error('Error al enviar email de recuperación:', emailError);
      // No fallar por problemas de email, el token ya está guardado
      console.log('Email failed but token created:', token);
    }

    return NextResponse.json({
      success: true,
      message: 'Email de recuperación enviado correctamente'
    });

  } catch (error: any) {
    console.error('Error al solicitar recuperación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
  }); // End of withRateLimit
}
