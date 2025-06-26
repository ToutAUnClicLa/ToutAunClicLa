/**
 * Servicio de productos que se conecta al backend de Express
 * Usa proxy de Next.js en desarrollo, directo en producción
 */

import { apiCache, generateCacheKey } from '@/lib/utils/cache';

// Configuración de URLs - usar proxy en desarrollo, directo en producción
const isDev = process.env.NODE_ENV === 'development';
const PRODUCTS_BASE_URL = isDev 
  ? '/api/backend/products'  // Usar proxy de Next.js en desarrollo
  : 'https://backendtoutaunclicla-production.up.railway.app/api/v1/products'; // Directo en producción

// Headers comunes para todas las requests
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
    
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export interface Category {
  id: number;
  nombre: string;
  fecha_creacion: string;
}

export interface Subcategory {
  id: number;
  nombre: string;
  categoria_id: number;
  Imagen?: string;
  Descripcion?: string;
  categorias?: {
    id: number;
    nombre: string;
  };
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_anterior?: number;
  descuento_porcentaje?: number;
  stock: number;
  imagen_principal: string;
  imagenes?: string[];
  categoria_id: number;
  subcategoria_id?: number;
  provedor?: string;
  activo?: boolean;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  categorias: { 
    id: number;
    nombre: string; 
  };
  subcategorias?: { 
    id: number;
    nombre: string;
    Imagen?: string;
    Descripcion?: string;
  };
  reviews?: Array<{
    id: string;
    estrellas: number;
    comentario: string;
    fecha_creacion: string;
    usuarios?: {
      nombre: string;
    };
  }>;
  estadisticas?: {
    promedio_calificacion: number;
    total_reviews: number;
    total_favoritos: number;
    total_vendidos?: number;
    distribucion_calificaciones?: {
      "5": number;
      "4": number;
      "3": number;
      "2": number;
      "1": number;
    };
  };
  especificaciones?: Record<string, any>;
  disponibilidad?: {
    en_stock: boolean;
    cantidad_disponible: number;
    tiempo_entrega: string;
    envio_gratis: boolean;
  };
  // Propiedades computadas para compatibilidad
  rating?: number;
  reviewCount?: number;
  averageRating?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters?: {
    categories?: Array<{ id: number; nombre: string; count: number; }>;
    priceRange?: {
      min: number;
      max: number;
    };
  };
}

export interface CategoriesResponse {
  categories: Category[];
  message?: string;
  error?: string;
}

export interface SubcategoriesResponse {
  subcategories: Subcategory[];
  message?: string;
  error?: string;
}

export interface ProductDetailResponse {
  product?: Product;
  reviews_recientes?: Array<{
    id: string;
    estrellas: number;
    comentario: string;
    fecha_creacion: string;
    usuario: {
      nombre: string;
    };
  }>;
  productos_relacionados?: Product[];
  // Para compatibilidad con respuestas que no tienen wrapper
  id?: number;
  nombre?: string;
  [key: string]: any;
}

export interface ProductFilters {
  search?: string;
  category?: number;
  subcategory?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Obtener productos con filtros y paginación
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  try {
    // Generar clave de cache basada en los filtros
    const cacheKey = generateCacheKey('products', filters);
    
    // Verificar si tenemos datos en cache
    const cachedData = apiCache.get<ProductsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const params = new URLSearchParams();
    
    // Agregar filtros como query parameters
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.category) params.append('category', filters.category.toString());
    if (filters.subcategory) params.append('subcategory', filters.subcategory.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const url = `${PRODUCTS_BASE_URL}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al obtener productos');
    }

    // Mapear productos para agregar propiedades computadas de compatibilidad
    const mappedProducts = data.products.map((product: any) => ({
      ...product,
      rating: product.averageRating || product.estadisticas?.promedio_calificacion || 0,
      reviewCount: product.reviewCount || product.estadisticas?.total_reviews || 0,
      averageRating: product.averageRating || product.estadisticas?.promedio_calificacion || 0,
    }));

    const result = {
      products: mappedProducts,
      pagination: data.pagination
    };

    // Guardar en cache por 3 minutos
    apiCache.set(cacheKey, result, 3 * 60 * 1000);

    return result;
  } catch (error: any) {
    console.error('Error en getProducts:', error);
    throw error;
  }
}

/**
 * Obtener productos por categoría (para compatibilidad)
 */
export async function getProductsByCategory(
  categoriaId: number, 
  page: number = 1, 
  limit: number = 20,
  searchTerm?: string
): Promise<ProductsResponse> {
  return getProducts({
    category: categoriaId,
    page,
    limit,
    search: searchTerm
  });
}

/**
 * Obtener un producto específico por ID
 */
export async function getProductById(id: number): Promise<Product> {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data: ProductDetailResponse = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error(data.message || data.error || 'Error al obtener producto');
    }

    // Manejar tanto respuestas con wrapper como sin wrapper
    const product = data.product || data;

    // Agregar propiedades computadas para compatibilidad
    return {
      ...product,
      rating: product.averageRating || product.estadisticas?.promedio_calificacion || 0,
      reviewCount: product.reviewCount || product.estadisticas?.total_reviews || 0,
      averageRating: product.averageRating || product.estadisticas?.promedio_calificacion || 0,
    } as Product;
  } catch (error: any) {
    console.error('Error en getProductById:', error);
    throw error;
  }
}

/**
 * Búsqueda de productos
 */
export async function searchProducts(
  searchTerm: string,
  page: number = 1,
  limit: number = 20
): Promise<ProductsResponse> {
  return getProducts({
    search: searchTerm,
    page,
    limit
  });
}

/**
 * Obtener productos relacionados
 */
export async function getRelatedProducts(
  productId: number,
  categoryId: number,
  limit: number = 4
): Promise<Product[]> {
  try {
    const response = await getProductsByCategory(categoryId, 1, limit + 5);
    
    // Filtrar el producto actual y limitar resultados
    return response.products
      .filter(product => product.id !== productId)
      .slice(0, limit);
  } catch (error: any) {
    console.error('Error en getRelatedProducts:', error);
    return [];
  }
}

/**
 * Obtener todas las categorías
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/categories`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data: CategoriesResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al obtener categorías');
    }

    return data.categories;
  } catch (error: any) {
    console.error('Error en getCategories:', error);
    throw error;
  }
}

/**
 * Obtener subcategorías, opcionalmente filtradas por categoría
 */
export async function getSubcategories(categoryId?: number): Promise<Subcategory[]> {
  try {
    const params = new URLSearchParams();
    if (categoryId) {
      params.append('categoryId', categoryId.toString());
    }

    const url = `${PRODUCTS_BASE_URL}/subcategories?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data: SubcategoriesResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al obtener subcategorías');
    }

    return data.subcategories;
  } catch (error: any) {
    console.error('Error en getSubcategories:', error);
    throw error;
  }
}

/**
 * Obtener información detallada de una subcategoría
 */
export async function getSubcategoryById(id: number): Promise<Subcategory> {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/subcategories/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Subcategoría no encontrada');
      }
      throw new Error(data.message || data.error || 'Error al obtener subcategoría');
    }

    return data;
  } catch (error: any) {
    console.error('Error en getSubcategoryById:', error);
    throw error;
  }
}

/**
 * Obtener productos por subcategoría (restaurante)
 */
export async function getProductsBySubcategory(
  subcategoryId: number,
  page: number = 1,
  limit: number = 20,
  additionalFilters: Partial<ProductFilters> = {}
): Promise<ProductsResponse> {
  return getProducts({
    subcategory: subcategoryId,
    page,
    limit,
    ...additionalFilters
  });
}

/**
 * Obtener información completa de un restaurante con sus productos
 */
export async function getRestaurantWithProducts(
  subcategoryId: number,
  productFilters: Partial<ProductFilters> = {}
): Promise<{
  restaurant: Subcategory;
  products: ProductsResponse;
}> {
  try {
    const [restaurant, products] = await Promise.all([
      getSubcategoryById(subcategoryId),
      getProductsBySubcategory(subcategoryId, 1, 20, productFilters)
    ]);

    return {
      restaurant,
      products
    };
  } catch (error: any) {
    console.error('Error en getRestaurantWithProducts:', error);
    throw error;
  }
}

/**
 * Alias para getProductById para compatibilidad
 */
export async function getProductDetail(id: number): Promise<Product> {
  return getProductById(id);
}

// Servicio unificado para productos
export const productsService = {
  getProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  getRelatedProducts,
  getCategories,
  getSubcategories,
  getSubcategoryById,
  getProductsBySubcategory,
  getRestaurantWithProducts,
  getProductDetail,
};
