import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmailServer } from '@/lib/email/resend-server';

export async function POST(req: NextRequest) {
  try {
    const { email, token, nombre } = await req.json();
    
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    const result = await sendPasswordResetEmailServer({ email, token, nombre });
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error al enviar email de restablecimiento de contraseña:', error);
    return NextResponse.json(
      { error: error.message || 'Error al enviar email' },
      { status: 500 }
    );
  }
} 