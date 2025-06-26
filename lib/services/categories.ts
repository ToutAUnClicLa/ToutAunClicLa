/**
 * Servicio de categorías y subcategorías
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
  // Verificar si estamos en el cliente
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

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

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

/**
 * Obtener todas las categorías
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const cacheKey = 'categories';
    const cachedData = apiCache.get<Category[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${PRODUCTS_BASE_URL}/categories`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'omit',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener categorías`);
    }

    const result = data.categories || data || [];
    
    // Cache por 10 minutos (las categorías cambian poco)
    apiCache.set(cacheKey, result, 10 * 60 * 1000);
    
    return result;
  } catch (error: any) {
    console.error('Error en getCategories:', error);
    throw error;
  }
}

/**
 * Obtener subcategorías por categoría
 */
export async function getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
  try {
    const cacheKey = generateCacheKey('subcategories', { categoryId });
    const cachedData = apiCache.get<Subcategory[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${PRODUCTS_BASE_URL}/subcategories?categoryId=${categoryId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'omit',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener subcategorías`);
    }

    const result = data.subcategories || data || [];
    
    // Cache por 5 minutos
    apiCache.set(cacheKey, result, 5 * 60 * 1000);
    
    return result;
  } catch (error: any) {
    console.error('Error en getSubcategoriesByCategory:', error);
    throw error;
  }
}

/**
 * Obtener todas las subcategorías
 */
export async function getAllSubcategories(): Promise<Subcategory[]> {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/subcategories`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'omit',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener subcategorías`);
    }

    return data.subcategories || data || [];
  } catch (error: any) {
    console.error('Error en getAllSubcategories:', error);
    throw error;
  }
}

/**
 * Obtener información de una subcategoría específica (restaurante)
 */
export async function getSubcategoryById(id: number): Promise<Subcategory> {
  try {
    const response = await fetch(`${PRODUCTS_BASE_URL}/subcategories/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'omit',
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Subcategoría no encontrada');
      }
      throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener subcategoría`);
    }

    return data.subcategory || data;
  } catch (error: any) {
    console.error('Error en getSubcategoryById:', error);
    throw error;
  }
}

/**
 * Obtener categorías con sus subcategorías
 */
export async function getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
  try {
    const [categories, subcategories] = await Promise.all([
      getCategories(),
      getAllSubcategories()
    ]);

    return categories.map(category => ({
      ...category,
      subcategories: subcategories.filter(sub => sub.categoria_id === category.id)
    }));
  } catch (error: any) {
    console.error('Error en getCategoriesWithSubcategories:', error);
    throw error;
  }
}

/**
 * Obtener restaurantes (subcategorías de comidas)
 * Asume que la categoría de comidas tiene ID 2
 */
export async function getRestaurants(): Promise<Subcategory[]> {
  try {
    // Primero obtenemos todas las categorías para encontrar el ID de "comidas"
    const categories = await getCategories();
    const comidasCategory = categories.find(cat => 
      cat.nombre.toLowerCase().includes('comida') || 
      cat.nombre.toLowerCase().includes('restaurante') ||
      cat.nombre.toLowerCase().includes('food')
    );

    if (!comidasCategory) {
      console.warn('No se encontró categoría de comidas, devolviendo todas las subcategorías');
      return getAllSubcategories();
    }

    return getSubcategoriesByCategory(comidasCategory.id);
  } catch (error: any) {
    console.error('Error en getRestaurants:', error);
    throw error;
  }
}

// Servicio unificado para categorías
export const categoriesService = {
  getCategories,
  getSubcategoriesByCategory,
  getAllSubcategories,
  getSubcategoryById,
  getCategoriesWithSubcategories,
  getRestaurants,
};
