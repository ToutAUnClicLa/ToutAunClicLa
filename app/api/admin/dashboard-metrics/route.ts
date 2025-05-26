import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Usar cliente admin para todas las operaciones
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Estadísticas de usuarios
    const { data: userStats, error: userStatsError } = await supabaseAdmin
      .from('usuarios')
      .select('id, verificado, cuenta_bloqueada, fecha_creacion, fecha_ultimo_login')
      .order('fecha_creacion', { ascending: false });

    if (userStatsError) {
      console.error('Error obteniendo estadísticas de usuarios:', userStatsError);
    }

    // 2. Estadísticas de logs de acceso
    const { data: loginStats, error: loginStatsError } = await supabaseAdmin
      .from('logs_acceso')
      .select('tipo_evento, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (loginStatsError) {
      console.error('Error obteniendo logs de acceso:', loginStatsError);
    }

    // 3. Tokens pendientes
    const { data: pendingTokens, error: tokensError } = await supabaseAdmin
      .from('tokens_verificacion_email')
      .select('id, created_at, expires_at')
      .gte('expires_at', new Date().toISOString());

    const { data: pendingResetTokens, error: resetTokensError } = await supabaseAdmin
      .from('tokens_recuperacion')
      .select('id, created_at, expires_at')
      .gte('expires_at', new Date().toISOString());

    // Calcular métricas
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const userMetrics = {
      total: userStats?.length || 0,
      verified: userStats?.filter(u => u.verificado)?.length || 0,
      unverified: userStats?.filter(u => !u.verificado)?.length || 0,
      blocked: userStats?.filter(u => u.cuenta_bloqueada)?.length || 0,
      registeredLast24h: userStats?.filter(u => new Date(u.fecha_creacion) > last24h)?.length || 0,
      registeredLast7d: userStats?.filter(u => new Date(u.fecha_creacion) > last7d)?.length || 0,
      activeUsers: userStats?.filter(u => u.fecha_ultimo_login && new Date(u.fecha_ultimo_login) > last7d)?.length || 0
    };

    const loginMetrics = {
      totalEvents: loginStats?.length || 0,
      loginSuccessful: loginStats?.filter(l => l.tipo_evento === 'login_exitoso')?.length || 0,
      loginFailed: loginStats?.filter(l => l.tipo_evento === 'login_fallido')?.length || 0,
      passwordResets: loginStats?.filter(l => l.tipo_evento === 'cambio_contrasena')?.length || 0,
      emailVerifications: loginStats?.filter(l => l.tipo_evento === 'email_verificado')?.length || 0
    };

    const tokenMetrics = {
      pendingEmailVerifications: pendingTokens?.length || 0,
      pendingPasswordResets: pendingResetTokens?.length || 0,
      expiredEmailTokens: 0, // Se calcularía con una consulta adicional
      expiredResetTokens: 0   // Se calcularía con una consulta adicional
    };

    // Actividad por día (últimos 7 días)
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));
      
      const dayRegistrations = userStats?.filter(u => {
        const created = new Date(u.fecha_creacion);
        return created >= dayStart && created <= dayEnd;
      })?.length || 0;

      const dayLogins = loginStats?.filter(l => {
        const created = new Date(l.created_at);
        return created >= dayStart && created <= dayEnd && l.tipo_evento === 'login_exitoso';
      })?.length || 0;

      dailyActivity.push({
        date: dayStart.toISOString().split('T')[0],
        registrations: dayRegistrations,
        logins: dayLogins
      });
    }

    // Eventos de seguridad recientes
    const securityEvents = loginStats?.filter(l => 
      l.tipo_evento === 'login_fallido' || 
      l.tipo_evento === 'cuenta_bloqueada' ||
      l.tipo_evento === 'intento_acceso_sospechoso'
    )?.slice(0, 10) || [];

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      metrics: {
        users: userMetrics,
        authentication: loginMetrics,
        tokens: tokenMetrics
      },
      activity: {
        daily: dailyActivity,
        recentSecurityEvents: securityEvents
      },
      systemHealth: {
        rateLimit: 'Active',
        logging: 'Active',
        emailService: 'Partial', // Pendiente de configurar completamente
        database: 'Connected'
      }
    });

  } catch (error: any) {
    console.error('Error en dashboard metrics:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
