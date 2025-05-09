import { supabase } from '@/lib/supabase/client';

export async function getUserProfile(email: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      email,
      fecha_creacion,
      direcciones_envio (
        id,
        direccion,
        ciudad,
        estado,
        codigo_postal,
        pais,
        telefono
      ),
      favoritos (
        id,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_principal
        )
      )
    `)
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, data: any) {
  const { error } = await supabase
    .from('usuarios')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
}

export async function addShippingAddress(userId: string, address: any) {
  const { error } = await supabase
    .from('direcciones_envio')
    .insert([{ ...address, usuario_id: userId }]);

  if (error) throw error;
}

export async function deleteShippingAddress(addressId: string) {
  const { error } = await supabase
    .from('direcciones_envio')
    .delete()
    .eq('id', addressId);

  if (error) throw error;
}

export async function toggleFavorite(userId: string, productId: string) {
  const { data: existingFavorite, error: checkError } = await supabase
    .from('favoritos')
    .select('id')
    .eq('usuario_id', userId)
    .eq('producto_id', productId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') throw checkError;

  if (existingFavorite) {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id', existingFavorite.id);

    if (error) throw error;
    return false; // Removed from favorites
  } else {
    const { error } = await supabase
      .from('favoritos')
      .insert([{ usuario_id: userId, producto_id: productId }]);

    if (error) throw error;
    return true; // Added to favorites
  }
}