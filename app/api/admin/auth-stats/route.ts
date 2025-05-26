import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authRateLimiter, withRateLimit } from '@/lib/security/rate-limiter';

interface AuthStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  blockedUsers: number;
  recentRegistrations: number;
  recentLogins: number;
  failedLoginAttempts: number;
  activeTokens: number;
  recentActivity: any[];
}

export async function GET(req: NextRequest) {
  return withRateLimit(authRateLimiter, async () => {
    try {
      // Basic authentication check (in production, implement proper admin auth)
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Get current date range for recent activity (last 24 hours)
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch user statistics
      const [
        totalUsersResult,
        verifiedUsersResult,
        unverifiedUsersResult,
        blockedUsersResult,
        recentRegistrationsResult,
        recentActivityResult,
        activeTokensResult
      ] = await Promise.all([
        // Total users
        supabaseAdmin
          .from('usuarios')
          .select('*', { count: 'exact', head: true }),
        
        // Verified users
        supabaseAdmin
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('verificado', true),
        
        // Unverified users
        supabaseAdmin
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('verificado', false),
        
        // Blocked users
        supabaseAdmin
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('cuenta_bloqueada', true),
        
        // Recent registrations (last 7 days)
        supabaseAdmin
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .gte('fecha_creacion', last7Days),
        
        // Recent activity from logs
        supabaseAdmin
          .from('logs_acceso')
          .select('*')
          .gte('timestamp', last24Hours)
          .order('timestamp', { ascending: false })
          .limit(50),
        
        // Active verification tokens
        supabaseAdmin
          .from('tokens_verificacion_email')
          .select('*', { count: 'exact', head: true })
          .gte('expires_at', new Date().toISOString())
      ]);

      // Process activity logs to get statistics
      const recentActivity = recentActivityResult.data || [];
      const recentLogins = recentActivity.filter(log => log.tipo_evento === 'login_exitoso').length;
      const failedLoginAttempts = recentActivity.filter(log => log.tipo_evento === 'login_fallido').length;

      // Compile statistics
      const stats: AuthStats = {
        totalUsers: totalUsersResult.count || 0,
        verifiedUsers: verifiedUsersResult.count || 0,
        unverifiedUsers: unverifiedUsersResult.count || 0,
        blockedUsers: blockedUsersResult.count || 0,
        recentRegistrations: recentRegistrationsResult.count || 0,
        recentLogins,
        failedLoginAttempts,
        activeTokens: activeTokensResult.count || 0,
        recentActivity: recentActivity.slice(0, 20) // Last 20 activities
      };

      // Calculate additional metrics
      const verificationRate = stats.totalUsers > 0 
        ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) 
        : 0;

      const loginSuccessRate = (recentLogins + failedLoginAttempts) > 0
        ? Math.round((recentLogins / (recentLogins + failedLoginAttempts)) * 100)
        : 100;

      return NextResponse.json({
        ...stats,
        metrics: {
          verificationRate,
          loginSuccessRate,
          averageRegistrationsPerDay: Math.round(stats.recentRegistrations / 7),
          averageLoginsPerDay: Math.round(recentLogins),
          securityAlerts: stats.failedLoginAttempts + stats.blockedUsers
        },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Error fetching auth stats:', error);
      return NextResponse.json(
        { error: error.message || 'Error fetching statistics' },
        { status: 500 }
      );
    }
  });
}
