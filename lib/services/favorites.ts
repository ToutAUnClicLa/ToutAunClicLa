import { supabase } from '@/lib/supabase/client';

export async function addToFavorites(productId: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

  const { error } = await supabase
    .from('favoritos')
    .insert({
      usuario_id: userData.id,
      producto_id: productId
    });

  if (error) throw error;
}

export async function removeFromFavorites(productId: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

  const { error } = await supabase
    .from('favoritos')
    .delete()
    .match({ usuario_id: userData.id, producto_id: productId });

  if (error) throw error;
}

export async function getFavorites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

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

  if (error) throw error;
  return data;
}

export async function getFavoritesCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) return 0;

  const { count, error } = await supabase
    .from('favoritos')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', userData.id);

  if (error) return 0;
  return count || 0;
}

export async function isFavorite(productId: number): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) return false;

  const { data, error } = await supabase
    .from('favoritos')
    .select('id')
    .match({ usuario_id: userData.id, producto_id: productId })
    .single();

  if (error) return false;
  return !!data;
}