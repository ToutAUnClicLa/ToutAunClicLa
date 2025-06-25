const API_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1';

export interface Review {
  id: string;
  usuario_id: string;
  producto_id: number;
  estrellas: number;
  comentario?: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  usuarios: {
    nombre: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  statistics: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: string]: number;
    };
  };
}

export interface CreateReviewData {
  productId: number;
  estrellas: number;
  comentario?: string;
}

export interface UpdateReviewData {
  estrellas: number;
  comentario?: string;
}

/**
 * Obtener todas las reseñas de un producto
 */
export async function getProductReviews(
  productId: number,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/product/${productId}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al obtener reseñas del producto:', error);
    throw error;
  }
}

/**
 * Crear una nueva reseña
 */
export async function createReview(reviewData: CreateReviewData): Promise<Review> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.review;
  } catch (error: any) {
    console.error('Error al crear reseña:', error);
    throw error;
  }
}

/**
 * Actualizar una reseña existente
 */
export async function updateReview(reviewId: string, reviewData: UpdateReviewData): Promise<Review> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.review;
  } catch (error: any) {
    console.error('Error al actualizar reseña:', error);
    throw error;
  }
}

/**
 * Eliminar una reseña
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error al eliminar reseña:', error);
    throw error;
  }
}
