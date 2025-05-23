import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email no proporcionado' },
        { status: 400 }
      );
    }
    
    // 1. Verificar que el usuario existe en nuestra tabla y su estado
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, verificado')
      .eq('correo_electronico', email)
      .single();
    
    if (userError || !userData) {
      console.error('Error al buscar usuario en tabla personalizada:', userError);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // 2. Marcar al usuario como verificado en nuestra tabla personalizada
    // Este es el paso principal del endpoint - confiamos en nuestra propia tabla
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        verificado: true,
        fecha_actualizacion: new Date().toISOString() 
      })
      .eq('id', userData.id);
      
    if (updateError) {
      console.error('Error al actualizar estado de verificación en DB:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar estado de verificación' },
        { status: 500 }
      );
    }
    
    // 3. Log para análisis y respuesta exitosa
    console.log(`Usuario ${email} marcado como verificado en la base de datos`);
    
    return NextResponse.json({
      success: true,
      verified_in_db: true,
      message: 'Usuario verificado correctamente en la base de datos',
    });
    
  } catch (error: any) {
    console.error('Error al sincronizar verificación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 