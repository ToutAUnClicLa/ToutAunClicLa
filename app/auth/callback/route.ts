import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;

  // Si no hay código, redirigir a la página principal
  if (!code) {
    console.error('Error en callback de autenticación: No se recibió código');
    return NextResponse.redirect(`${origin}/auth/login?error=No_authorization_code`);
  }

  try {
    // Crear cliente Supabase con cookies para mantener la sesión
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Intercambiar código por sesión
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error al intercambiar código por sesión:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    // Verificar si necesitamos crear o actualizar el perfil del usuario
    if (data?.user) {
      // Verificar si el usuario ya existe en nuestra tabla personalizada
      const { data: existingUser, error: queryError } = await supabase
        .from('usuarios')
        .select('id, verificado')
        .eq('correo_electronico', data.user.email)
        .single();

      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 = No se encontró el registro
        console.error('Error al verificar usuario en base de datos:', queryError);
      }

      // Si no existe, crear nuevo perfil (principalmente para autenticación social)
      if (!existingUser) {
        // Extraer información básica del usuario
        const nombre = data.user.user_metadata?.full_name || 
                      data.user.user_metadata?.name || 
                      data.user.email?.split('@')[0] || 'Usuario';
        const avatarUrl = data.user.user_metadata?.avatar_url;
        const phone = data.user.user_metadata?.phone || data.user.phone;

        // Crear perfil en nuestra tabla personalizada
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert([
            {
              correo_electronico: data.user.email,
              contrasena_hash: 'autenticacion_social',
              nombre: nombre,
              telefono: phone || null,
              url_avatar: avatarUrl,
              verificado: true, // Autenticación social se considera verificada
              autenticacion_social: true,
              fecha_creacion: new Date().toISOString(),
              fecha_actualizacion: new Date().toISOString(),
            }
          ]);

        if (insertError) {
          console.error('Error al crear perfil de usuario:', insertError);
          // Continuamos a pesar del error para no interrumpir el flujo de autenticación
        }
      }
    }

    // Redirigir al usuario a la URL deseada (con estado de éxito)
    return NextResponse.redirect(`${origin}${redirectTo}?auth=success`);
  } catch (error: any) {
    console.error('Error general en el callback de autenticación:', error);
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message || 'Error_during_authentication')}`);
  }
}