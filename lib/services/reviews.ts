import { supabase } from '@/lib/supabase/client';

interface CreateReviewParams {
  productId: string;
  rating: number;
  comment: string;
}

export async function createReview({ productId, rating, comment }: CreateReviewParams) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

  const { error } = await supabase
    .from('reviews')
    .insert({
      producto_id: productId,
      usuario_id: userData.id,
      estrellas: rating,
      comentario: comment,
      fecha_creacion: new Date().toISOString()
    });

  if (error) throw error;
}

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      estrellas,
      comentario,
      fecha_creacion,
      usuarios (
        id,
        nombre,
        email
      )
    `)
    .eq('producto_id', productId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
}