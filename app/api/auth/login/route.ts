import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';
import { authRateLimiter, withRateLimit } from '@/lib/security/rate-limiter';
import { authLogger } from '@/lib/security/auth-logger';

export async function POST(req: NextRequest) {
  return withRateLimit(authRateLimiter, async () => {
    try {
      const { email, password } = await req.json();
      
      // Log login attempt
      authLogger.logLoginAttempt(email);
      
      if (!email || !password) {
        authLogger.logLoginFailed(email || 'unknown', 'Missing email or password');
        return NextResponse.json(
          { error: 'Email y contraseña son obligatorios' },
          { status: 400 }
        );
      }

    // Obtener información de la solicitud para logs de seguridad
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 1. Verificar si el usuario existe y si la cuenta está bloqueada
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id, correo_electronico, verificado, cuenta_bloqueada, intentos_login_fallidos')
      .eq('correo_electronico', email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error al buscar usuario:', userError);
      return NextResponse.json(
        { error: 'Error al verificar usuario' },
        { status: 500 }
      );
    }

    // 2. Si el usuario no existe, registrar el intento fallido
    if (!userData) {
      authLogger.logLoginFailed(email, 'User does not exist');
      try {
        // Intentar registrar en logs_acceso si existe la tabla
        await supabaseAdmin
          .from('logs_acceso')
          .insert([
            {
              usuario_id: null,
              tipo_evento: 'login_fallido',
              ip_address: ipAddress,
              user_agent: userAgent,
              detalles: { email, motivo: 'usuario_no_existe' }
            }
          ]);
      } catch (logError) {
        console.error('Error al registrar intento fallido:', logError);
      }
      
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // 3. Verificar si la cuenta está bloqueada
    if (userData.cuenta_bloqueada) {
      return NextResponse.json(
        { 
          error: 'Cuenta bloqueada por múltiples intentos fallidos. Contacta al soporte.',
          blocked: true
        },
        { status: 423 } // 423 Locked
      );
    }

    // 4. Verificar si el usuario está verificado
    if (!userData.verificado) {
      return NextResponse.json(
        { 
          error: 'Tu cuenta requiere verificación. Revisa tu correo electrónico.',
          needsVerification: true
        },
        { status: 403 }
      );
    }

    // 5. Intentar iniciar sesión con Supabase Auth
    const supabaseServer = createRouteHandlerClient({ cookies });
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    // 6. Si el login falla, manejar el intento fallido
    if (authError) {
      try {
        // Incrementar intentos fallidos manualmente
        const newAttempts = (userData.intentos_login_fallidos || 0) + 1;
        const shouldBlock = newAttempts >= 5;
        
        await supabaseAdmin
          .from('usuarios')
          .update({
            intentos_login_fallidos: newAttempts,
            cuenta_bloqueada: shouldBlock,
            fecha_bloqueo: shouldBlock ? new Date().toISOString() : null,
            razon_bloqueo: shouldBlock ? 'Múltiples intentos fallidos' : null,
            fecha_actualizacion: new Date().toISOString()
          })
          .eq('id', userData.id);

        // Registrar el intento fallido
        await supabaseAdmin
          .from('logs_acceso')
          .insert([
            {
              usuario_id: userData.id,
              tipo_evento: 'login_fallido',
              ip_address: ipAddress,
              user_agent: userAgent,
              detalles: { email, motivo: 'credenciales_invalidas', intentos: newAttempts }
            }
          ]);

        // Verificar si la cuenta se bloqueó
        if (shouldBlock) {
          return NextResponse.json(
            { 
              error: 'Demasiados intentos fallidos. Cuenta bloqueada.',
              blocked: true
            },
            { status: 423 }
          );
        }

        return NextResponse.json(
          { 
            error: 'Credenciales inválidas',
            attemptsRemaining: Math.max(0, 5 - newAttempts)
          },
          { status: 401 }
        );
      } catch (updateError) {
        console.error('Error al actualizar intentos fallidos:', updateError);
        return NextResponse.json(
          { error: 'Credenciales inválidas' },
          { status: 401 }
        );
      }
    }

    // 7. Login exitoso - resetear contadores
    authLogger.logLoginSuccess(userData.id, userData.correo_electronico);
    
    try {
      await supabaseAdmin
        .from('usuarios')
        .update({
          intentos_login_fallidos: 0,
          cuenta_bloqueada: false,
          fecha_bloqueo: null,
          razon_bloqueo: null,
          fecha_ultimo_login: new Date().toISOString(),
          ip_ultimo_acceso: ipAddress,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', userData.id);

      // Registrar login exitoso
      await supabaseAdmin
        .from('logs_acceso')
        .insert([
          {
            usuario_id: userData.id,
            tipo_evento: 'login_exitoso',
            ip_address: ipAddress,
            user_agent: userAgent,
            detalles: { email }
          }
        ]);
    } catch (logError) {
      console.error('Error al registrar login exitoso:', logError);
      // No bloqueamos el login por errores de logging
    }

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: userData.id,
        email: userData.correo_electronico,
        verified: userData.verificado
      }
    });

  } catch (error: any) {
    console.error('Error en login:', error);
    try {
      const body = await req.json();
      authLogger.logLoginFailed(body?.email || 'unknown', error.message || 'Unexpected error');
    } catch {
      authLogger.logLoginFailed('unknown', error.message || 'Unexpected error');
    }
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
  }); // End of withRateLimit
}
