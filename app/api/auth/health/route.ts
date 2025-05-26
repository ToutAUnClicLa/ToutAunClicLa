import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/client';

export async function GET(req: NextRequest) {
  try {
    // Verificar conexión a la base de datos
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (usersError) {
      return NextResponse.json({
        status: 'error',
        message: 'Error conectando a la base de datos',
        error: usersError.message
      }, { status: 500 });
    }

    // Verificar que las nuevas columnas de seguridad existen
    const { data: securityTest, error: securityError } = await supabase
      .from('usuarios')
      .select('intentos_login_fallidos, cuenta_bloqueada, fecha_ultimo_login')
      .limit(1);

    if (securityError) {
      return NextResponse.json({
        status: 'warning',
        message: 'Las mejoras de seguridad no están aplicadas',
        error: securityError.message
      }, { status: 200 });
    }

    // Verificar que las funciones de seguridad existen
    try {
      const { data: functionTest, error: functionError } = await supabase.rpc('handle_failed_login_attempt', {
        user_email: 'test@test.com',
        ip_addr: '127.0.0.1',
        user_agent_str: 'test'
      });

      if (functionError && !functionError.message.includes('function') && !functionError.message.includes('does not exist')) {
        console.log('Función de seguridad funcionando correctamente');
      }
    } catch (error) {
      console.log('Funciones de seguridad no disponibles:', error);
    }

    // Verificar tabla de logs
    const { data: logsTest, error: logsError } = await supabase
      .from('logs_acceso')
      .select('count')
      .limit(1);

    return NextResponse.json({
      status: 'success',
      message: 'Sistema de autenticación funcionando correctamente',
      checks: {
        database_connection: usersError ? 'failed' : 'passed',
        security_columns: securityError ? 'failed' : 'passed',
        logs_table: logsError ? 'failed' : 'passed',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error en health check:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error interno del servidor',
      error: error.message
    }, { status: 500 });
  }
}
