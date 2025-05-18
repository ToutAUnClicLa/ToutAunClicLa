import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { verifyEmailToken, resendVerificationEmail } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { sendWelcomeEmailServer } from '@/lib/email/resend-server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 400 }
    );
  }
  
  try {
    // 1. Buscar el token en la base de datos
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens_verificacion_email')
      .select('id, usuario_id, expires_at')
      .eq('token', token)
      .single();
    
    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token no válido o expirado' },
        { status: 400 }
      );
    }
    
    // 2. Verificar que el token no haya expirado
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado. Solicita un nuevo enlace de verificación.' },
        { status: 400 }
      );
    }
    
    // 3. Marcar al usuario como verificado
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        verificado: true,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq('id', tokenData.usuario_id);
    
    if (updateError) {
      console.error('Error al actualizar estado de verificación:', updateError);
      return NextResponse.json(
        { error: 'Error al verificar la cuenta' },
        { status: 500 }
      );
    }
    
    // 4. Eliminar el token usado
    await supabase
      .from('tokens_verificacion_email')
      .delete()
      .eq('id', tokenData.id);
    
    // 5. Intentar enviar email de bienvenida (no bloqueante)
    try {
      // Obtener datos del usuario
      const { data: userData } = await supabase
        .from('usuarios')
        .select('nombre, correo_electronico')
        .eq('id', tokenData.usuario_id)
        .single();
      
      if (userData) {
        await sendWelcomeEmailServer({
          email: userData.correo_electronico,
          nombre: userData.nombre,
        });
      }
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError);
      // No bloqueamos la verificación si falla el envío del email
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Email verificado correctamente' 
    });
    
  } catch (error: any) {
    console.error('Error al verificar token:', error);
    return NextResponse.json(
      { error: error.message || 'Error al verificar el token' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email no proporcionado' },
        { status: 400 }
      );
    }
    
    const result = await resendVerificationEmail(email);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Email de verificación reenviado correctamente'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Error al reenviar el email de verificación' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error al reenviar verificación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 