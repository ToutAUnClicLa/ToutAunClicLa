import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Buscar usuario por email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('correo_electronico', email)
      .single();

    // Buscar token de verificación
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('tokens_verificacion_email')
      .select('*')
      .eq('usuario_id', userData?.id)
      .single();

    return NextResponse.json({
      success: true,
      user: userData || null,
      user_error: userError?.message || null,
      token: tokenData || null,
      token_error: tokenError?.message || null
    });

  } catch (error: any) {
    console.error('Error finding user by email:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
