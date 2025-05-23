import { supabase } from '@/lib/supabase/client';

export async function addToFavorites(productId: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      throw new Error('User profile not found');
    }

    // Verificar si ya existe en favoritos para evitar duplicados
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userData.id)
      .eq('producto_id', productId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error al verificar favorito existente:', checkError);
    }
    
    if (existingFavorite) {
      // Ya existe, no necesitamos agregarlo nuevamente
      return;
    }

    const { error } = await supabase
      .from('favoritos')
      .insert({
        usuario_id: userData.id,
        producto_id: productId
      });

    if (error) {
      console.error('Error al añadir a favoritos:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error en addToFavorites:', err);
    throw err;
  }
}

export async function removeFromFavorites(productId: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      throw new Error('User profile not found');
    }

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', userData.id)
      .eq('producto_id', productId);

    if (error) {
      console.error('Error al eliminar de favoritos:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error en removeFromFavorites:', err);
    throw err;
  }
}

export async function getFavorites() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      throw new Error('User profile not found');
    }

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        id,
        fecha_agregado,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_principal,
          stock,
          rating,
          subcategorias (
            nombre
          )
        )
      `)
      .eq('usuario_id', userData.id)
      .order('fecha_agregado', { ascending: false });

    if (error) {
      console.error('Error al obtener favoritos:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Error en getFavorites:', err);
    throw err;
  }
}

export async function getFavoritesCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // Obtener primero el usuario_id de la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      return 0;
    }

    // Utilizar el id obtenido para consultar los favoritos
    const { count, error } = await supabase
      .from('favoritos')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', userData.id);

    if (error) {
      console.error('Error al obtener favoritos:', error);
      return 0;
    }
    
    return count || 0;
  } catch (err) {
    console.error('Error en getFavoritesCount:', err);
    return 0;
  }
}

export async function isFavorite(productId: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      return false;
    }

    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', userData.id)
      .eq('producto_id', productId)
      .single();

    if (error) {
      // Ignoramos el error PGRST116 (registro no encontrado)
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('Error al verificar favorito:', error);
      return false;
    }
    return !!data;
  } catch (err) {
    console.error('Error en isFavorite:', err);
    return false;
  }
}