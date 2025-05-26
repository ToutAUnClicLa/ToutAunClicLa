import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Usar cliente admin para todas las operaciones
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Obtener tokens de recuperación recientes
    const { data: resetTokens, error: tokensError } = await supabaseAdmin
      .from('tokens_recuperacion')
      .select('id, usuario_id, token, expires_at, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (tokensError) {
      console.error('Error obteniendo tokens de recuperación:', tokensError);
      return NextResponse.json({
        error: 'Error al obtener tokens',
        details: tokensError.message
      }, { status: 500 });
    }

    // Obtener información de usuarios para los tokens
    const tokensWithUsers = [];
    
    for (const token of resetTokens || []) {
      const { data: userData, error: userError } = await supabaseAdmin
        .from('usuarios')
        .select('correo_electronico, nombre')
        .eq('id', token.usuario_id)
        .single();

      tokensWithUsers.push({
        ...token,
        user_email: userData?.correo_electronico || 'Unknown',
        user_name: userData?.nombre || 'Unknown'
      });
    }

    return NextResponse.json({
      success: true,
      reset_tokens: tokensWithUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error en debug reset tokens:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
