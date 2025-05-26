import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Esta operación no está permitida en producción' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'Usuario ID requerido' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar el email en Supabase Auth
    const { data: updatedUser, error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );
    
    if (authUpdateError) {
      return NextResponse.json({
        success: false,
        error: authUpdateError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email verification updated in Auth',
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Error updating auth verification:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
