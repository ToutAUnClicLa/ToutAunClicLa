import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { sendVerificationEmailServer } from '@/lib/email/resend-server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email no proporcionado' },
        { status: 400 }
      );
    }
    
    // 1. Verificar que el usuario existe y no está verificado
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre, verificado')
      .eq('correo_electronico', email)
      .single();
    
    if (userError || !userData) {
      // Por seguridad, no indicamos si el email existe o no
      return NextResponse.json(
        { success: true, message: 'Si tu email está registrado, recibirás un nuevo enlace de verificación' },
        { status: 200 }
      );
    }
    
    // Si el usuario ya está verificado, no hacemos nada pero no mostramos error
    if (userData.verificado) {
      return NextResponse.json(
        { success: true, message: 'Si tu email está registrado, recibirás un nuevo enlace de verificación' },
        { status: 200 }
      );
    }
    
    // 2. Generar nuevo token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // 3. Eliminar tokens antiguos
    await supabase
      .from('tokens_verificacion_email')
      .delete()
      .eq('usuario_id', userData.id);
    
    // 4. Guardar nuevo token
    const { error: tokenError } = await supabase
      .from('tokens_verificacion_email')
      .insert([
        {
          usuario_id: userData.id,
          token,
          expires_at: expiresAt.toISOString(),
        }
      ]);
    
    if (tokenError) {
      console.error('Error al crear token de verificación:', tokenError);
      return NextResponse.json(
        { error: 'Error al generar el token de verificación' },
        { status: 500 }
      );
    }
    
    // 5. Enviar email de verificación
    try {
      await sendVerificationEmailServer({
        email,
        token,
        nombre: userData.nombre,
      });
    } catch (emailError: any) {
      console.error('Error al enviar email de verificación:', emailError);
      return NextResponse.json(
        { error: 'Error al enviar el email de verificación' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email de verificación reenviado correctamente'
    });
    
  } catch (error: any) {
    console.error('Error al reenviar verificación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 