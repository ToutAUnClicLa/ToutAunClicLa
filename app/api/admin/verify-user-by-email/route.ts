import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    // Usar cliente admin para todas las operaciones
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Buscar el usuario en nuestra tabla
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id, correo_electronico, verificado')
      .eq('correo_electronico', email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 2. Actualizar verificación en nuestra tabla
    const { error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update({
        verificado: true,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', userData.id);

    if (updateError) {
      console.error('Error actualizando usuario:', updateError);
      console.error('Update details:', JSON.stringify(updateError, null, 2));
      return NextResponse.json(
        { 
          error: 'Error al verificar usuario en tabla personalizada',
          details: updateError.message,
          code: updateError.code
        },
        { status: 500 }
      );
    }

    // 3. Buscar el usuario en Supabase Auth y verificar
    const { data: authUsers, error: authListError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (authListError) {
      console.error('Error listando usuarios Auth:', authListError);
      return NextResponse.json(
        { 
          success: true,
          message: 'Usuario verificado en tabla personalizada, pero error al acceder a Auth users',
          customTableUpdated: true,
          authUpdated: false
        }
      );
    }

    const authUser = authUsers.users.find(u => u.email === email);

    if (authUser) {
      // 4. Verificar email en Supabase Auth
      const { data: authUpdateData, error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        { email_confirm: true }
      );

      if (authUpdateError) {
        console.error('Error verificando en Auth:', authUpdateError);
        return NextResponse.json(
          { 
            success: true,
            message: 'Usuario verificado en tabla personalizada, pero error al verificar en Auth',
            customTableUpdated: true,
            authUpdated: false
          }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Usuario verificado exitosamente en ambos sistemas',
        customTableUpdated: true,
        authUpdated: true,
        userId: userData.id,
        authUserId: authUser.id
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Usuario verificado en tabla personalizada, pero no encontrado en Auth',
        customTableUpdated: true,
        authUpdated: false,
        userId: userData.id
      });
    }

  } catch (error: any) {
    console.error('Error en verificación manual:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
