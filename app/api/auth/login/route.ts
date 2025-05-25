import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
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
    const { data: userData, error: userError } = await supabase
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

    // 2. Si el usuario no existe, usar la función de seguridad para logear el intento
    if (!userData) {
      await supabase.rpc('handle_failed_login_attempt', {
        user_email: email,
        ip_addr: ipAddress,
        user_agent_str: userAgent
      });
      
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

    // 6. Si el login falla, usar la función de seguridad
    if (authError) {
      const { data: failureResult } = await supabase.rpc('handle_failed_login_attempt', {
        user_email: email,
        ip_addr: ipAddress,
        user_agent_str: userAgent
      });

      // Verificar si la cuenta se bloqueó
      if (failureResult?.blocked) {
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
          attemptsRemaining: Math.max(0, 5 - (failureResult?.attempts || 0))
        },
        { status: 401 }
      );
    }

    // 7. Login exitoso - resetear contadores usando la función de seguridad
    await supabase.rpc('reset_failed_login_attempts', {
      user_email: email,
      ip_addr: ipAddress,
      user_agent_str: userAgent
    });

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
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
