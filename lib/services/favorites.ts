/**
 * Servicio para gestión de favoritos
 * Conecta con el backend de favoritos en Railway
 */

// Configuración para usar directamente el backend de producción
const FAVORITES_BASE_URL = 'https://backendtoutaunclicla-production.up.railway.app/api/v1/favorites';

// Headers comunes para todas las requests
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
    
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface FavoriteProduct {
  id: number;
  nombre: string;
  precio: number;
  imagen_principal: string;
  stock: number;
  activo?: boolean;
  categorias?: {
    nombre: string;
  };
}

export interface FavoriteItem {
  id: string;
  usuario_id: string;
  producto_id: number;
  fecha_agregado: string;
  productos: FavoriteProduct;
}

export interface FavoritesResponse {
  favorites: FavoriteItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface FavoriteStatus {
  isFavorite: boolean;
  favoriteId?: string;
  productId: number;
  addedAt?: string;
}

/**
 * Obtener lista de favoritos con paginación
 */
export async function getFavorites(page: number = 1, limit: number = 20): Promise<FavoritesResponse> {
  try {
    const response = await fetch(`${FAVORITES_BASE_URL}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al obtener favoritos');
    }

    return data;
  } catch (error: any) {
    console.error('Error en getFavorites:', error);
    throw error;
  }
}

/**
 * Agregar producto a favoritos
 */
export async function addToFavorites(productId: number): Promise<FavoriteItem> {
  try {
    const response = await fetch(`${FAVORITES_BASE_URL}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Este producto ya está en tus favoritos');
      }
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error(data.message || data.error || 'Error al agregar a favoritos');
    }

    return data.favorite;
  } catch (error: any) {
    console.error('Error en addToFavorites:', error);
    throw error;
  }
}

/**
 * Eliminar producto de favoritos
 */
export async function removeFromFavorites(productId: number): Promise<void> {
  try {
    const response = await fetch(`${FAVORITES_BASE_URL}/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      if (response.status === 404) {
        throw new Error('Este producto no está en tus favoritos');
      }
      throw new Error(data.message || data.error || 'Error al eliminar de favoritos');
    }
  } catch (error: any) {
    console.error('Error en removeFromFavorites:', error);
    throw error;
  }
}

/**
 * Verificar si un producto está en favoritos
 */
export async function getFavoriteStatus(productId: number): Promise<FavoriteStatus> {
  try {
    const response = await fetch(`${FAVORITES_BASE_URL}/status/${productId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return { isFavorite: false, productId };
      }
      throw new Error(data.message || data.error || 'Error al verificar estado de favorito');
    }

    return data;
  } catch (error: any) {
    console.error('Error en getFavoriteStatus:', error);
    throw error;
  }
}

/**
 * Toggle favorito - agregar o quitar según el estado actual
 */
export async function toggleFavorite(productId: number): Promise<{ isFavorite: boolean; message: string }> {
  try {
    const status = await getFavoriteStatus(productId);
    
    if (status.isFavorite) {
      await removeFromFavorites(productId);
      return { 
        isFavorite: false, 
        message: 'Producto eliminado de favoritos' 
      };
    } else {
      await addToFavorites(productId);
      return { 
        isFavorite: true, 
        message: 'Producto agregado a favoritos' 
      };
    }
  } catch (error: any) {
    console.error('Error en toggleFavorite:', error);
    throw error;
  }
}

/**
 * Obtener conteo total de favoritos
 */
export async function getFavoritesCount(): Promise<number> {
  try {
    const response = await getFavorites(1, 1);
    return response.pagination.totalItems;
  } catch (error: any) {
    console.error('Error en getFavoritesCount:', error);
    return 0;
  }
}
