import { supabase } from '@/lib/database/client';

interface CreateReviewParams {
  productId: string | number;
  rating: number;
  comment: string;
}

export async function createReview({ productId, rating, comment }: CreateReviewParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener usuario:', userError);
      throw new Error('User profile not found');
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        producto_id: productId,
        usuario_id: userData.id,
        estrellas: rating,
        comentario: comment,
        fecha_creacion: new Date().toISOString()
      });

    if (error) {
      console.error('Error al crear reseña:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error en createReview:', err);
    throw err;
  }
}

export async function getProductReviews(productId: string | number) {
  try {
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
          correo_electronico
        )
      `)
      .eq('producto_id', productId)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error al obtener reseñas:', error);
      throw error;
    }
    return data || [];
  } catch (err) {
    console.error('Error en getProductReviews:', err);
    throw err;
  }
}