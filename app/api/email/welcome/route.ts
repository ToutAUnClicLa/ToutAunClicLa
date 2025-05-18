import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmailServer } from '@/lib/email/resend-server';

export async function POST(req: NextRequest) {
  try {
    const { email, nombre } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Falta el email' },
        { status: 400 }
      );
    }
    
    const result = await sendWelcomeEmailServer({ email, nombre });
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error al enviar email de bienvenida:', error);
    return NextResponse.json(
      { error: error.message || 'Error al enviar email' },
      { status: 500 }
    );
  }
} 