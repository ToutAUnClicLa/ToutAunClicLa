import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Esta operación no está permitida en producción' },
        { status: 403 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Obtener tokens de verificación de email más recientes
    const { data: verificationTokens, error: verificationError } = await supabaseAdmin
      .from('tokens_verificacion_email')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Obtener usuarios más recientes
    const { data: users, error: usersError } = await supabaseAdmin
      .from('usuarios')
      .select('id, correo_electronico, nombre, verificado, fecha_creacion')
      .order('fecha_creacion', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      verification_tokens: verificationTokens || [],
      verification_error: verificationError?.message,
      recent_users: users || [],
      users_error: usersError?.message,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error getting debug info:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
