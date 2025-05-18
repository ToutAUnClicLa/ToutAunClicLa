import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmailServer } from '@/lib/email/resend-server';

export async function POST(req: NextRequest) {
  try {
    const { email, token, nombre } = await req.json();
    
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    const result = await sendVerificationEmailServer({ email, token, nombre });
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error al enviar email de verificación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al enviar email' },
      { status: 500 }
    );
  }
} 