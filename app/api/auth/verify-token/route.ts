import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { authRateLimiter, withRateLimit } from '@/lib/security/rate-limiter';
import { authLogger } from '@/lib/security/auth-logger';

export async function GET(req: NextRequest) {
  return withRateLimit(authRateLimiter, async () => {
    try {
      const token = req.nextUrl.searchParams.get('token');
      const type = req.nextUrl.searchParams.get('type'); // 'reset' or 'verification'
      
      if (!token || !type) {
        authLogger.logInvalidToken({ metadata: { reason: 'Missing token or type parameter' } });
        return NextResponse.json(
          { error: 'Token y tipo son requeridos' },
          { status: 400 }
        );
      }

    let tableName = '';
    if (type === 'reset') {
      tableName = 'tokens_recuperacion';
    } else if (type === 'verification') {
      tableName = 'tokens_verificacion_email';
    } else {
      return NextResponse.json(
        { error: 'Tipo de token no válido' },
        { status: 400 }
      );
    }

    // Verificar que el token existe y es válido
    const { data, error } = await supabase
      .from(tableName)
      .select('usuario_id, expires_at')
      .eq('token', token)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { error: 'Token no válido o expirado' },
        { status: 400 }
      );
    }

    // Comprobar que el token no ha expirado
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      userId: data.usuario_id
    });

  } catch (error: any) {
    console.error('Error al verificar token:', error);
    authLogger.logInvalidToken({ metadata: { error: error.message } });
    return NextResponse.json(
      { error: error.message || 'Error al verificar el token' },
      { status: 500 }
    );
  }
  }); // End of withRateLimit
}
