import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authRateLimiter, withRateLimit } from '@/lib/security/rate-limiter';
import { authLogger } from '@/lib/security/auth-logger';

export async function POST(req: NextRequest) {
  return withRateLimit(authRateLimiter, async () => {
    try {
      const { token, newPassword } = await req.json();
      
      if (!token || !newPassword) {
        authLogger.logInvalidToken({ metadata: { reason: 'Missing token or password' } });
        return NextResponse.json(
          { error: 'Token y nueva contraseña son obligatorios' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
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

    // 1. Buscar el token de recuperación
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('tokens_recuperacion')
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
        { error: 'Token expirado. Solicita un nuevo enlace de recuperación.' },
        { status: 400 }
      );
    }

    // 3. Obtener datos del usuario
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('correo_electronico')
      .eq('id', tokenData.usuario_id)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 400 }
      );
    }

    // 4. Actualizar la contraseña en Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      tokenData.usuario_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Error al actualizar contraseña:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar la contraseña' },
        { status: 500 }
      );
    }

    // 5. Actualizar campos en nuestra tabla
    await supabaseAdmin
      .from('usuarios')
      .update({
        fecha_cambio_contrasena: new Date().toISOString(),
        intentos_login_fallidos: 0,
        cuenta_bloqueada: false,
        fecha_bloqueo: null,
        razon_bloqueo: null,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', tokenData.usuario_id);

    // 6. Eliminar el token usado
    await supabaseAdmin
      .from('tokens_recuperacion')
      .delete()
      .eq('id', tokenData.id);

    // 7. Registrar el cambio de contraseña
    authLogger.logPasswordResetSuccess(tokenData.usuario_id, userData.correo_electronico);
    
    try {
      await supabaseAdmin
        .from('logs_acceso')
        .insert([
          {
            usuario_id: tokenData.usuario_id,
            tipo_evento: 'cambio_contrasena',
            ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || 
                       req.headers.get('x-real-ip') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown',
            detalles: { email: userData.correo_electronico }
          }
        ]);
    } catch (logError) {
      console.error('Error al registrar cambio de contraseña:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error: any) {
    console.error('Error al restablecer contraseña:', error);
    authLogger.logInvalidToken({ metadata: { error: error.message } });
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
  }); // End of withRateLimit
}
