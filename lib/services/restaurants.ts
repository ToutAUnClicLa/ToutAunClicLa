/**
 * Servicio de restaurantes con información completa
 * Utiliza la nueva API de restaurants con horarios y disponibilidad
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

export interface Restaurant {
  id: number;
  nombre: string;
  Imagen?: string;
  Descripcion?: string;
  horario_apertura: string;
  horario_cierre: string;
  nacionalidades: string[];
  categorias: {
    id: number;
    nombre: string;
  };
  abierto: boolean;
  disponible: boolean;
  horario_entrega: {
    inicio: string;
    fin: string;
  };
  hora_limite_pedidos: string;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  currentTime: string;
}

/**
 * Obtener todos los restaurantes con información completa
 */
export async function getRestaurants(): Promise<RestaurantsResponse> {
  try {
    const cacheKey = 'restaurants_complete';
    const cachedData = apiCache.get<RestaurantsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${PRODUCTS_BASE_URL}/restaurants`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'omit',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener restaurantes`);
    }

    const result: RestaurantsResponse = {
      restaurants: data.restaurants || [],
      currentTime: data.currentTime || new Date().toLocaleTimeString()
    };
    
    // Cache por 5 minutos (actualización frecuente para disponibilidad en tiempo real)
    apiCache.set(cacheKey, result, 5 * 60 * 1000);
    
    return result;
  } catch (error: any) {
    console.error('Error en getRestaurants:', error);
    throw error;
  }
}

/**
 * Mapeo constante de países a códigos de bandera/emoji
 * Maneja diferentes variaciones de nombres de países
 */
export const countryFlags: Record<string, string> = {

  "Colombia": "🇨🇴",
  "Venezuela": "🇻🇪",
  "México": "🇲🇽",
  "Argentina": "🇦🇷",
  "Haití": "🇭🇹",
  "Canadá": "🇨🇦",
  "Cuba": "🇨🇺"
};

/**
 * Obtener las banderas de las nacionalidades de un restaurante
 */
export function getRestaurantFlags(nacionalidades: string[]): string {
  return nacionalidades
    .map(pais => countryFlags[pais] || "🏳️")
    .join(" ");
}

/**
 * Verificar si un restaurante puede recibir pedidos
 */
export function canOrderFrom(restaurant: Restaurant): boolean {
  return restaurant.abierto && restaurant.disponible;
}

/**
 * Obtener mensaje de disponibilidad para un restaurante
 */
export function getAvailabilityMessage(restaurant: Restaurant, t: (key: string, params?: any) => string): {
  message: string;
  color: 'green' | 'yellow' | 'red';
  status: 'available' | 'last_hour' | 'closed';
} {
  if (!restaurant.abierto) {
    return {
      message: t('catalog.restaurants.status.closed', { time: restaurant.horario_apertura }),
      color: 'red',
      status: 'closed'
    };
  }
  
  if (restaurant.disponible) {
    return {
      message: t('catalog.restaurants.status.available'),
      color: 'green',
      status: 'available'
    };
  }
  
  return {
    message: t('catalog.restaurants.status.lastHour', { time: restaurant.hora_limite_pedidos }),
    color: 'yellow',
    status: 'last_hour'
  };
}

/**
 * Ordenar restaurantes por disponibilidad
 */
export function sortRestaurantsByAvailability(restaurants: Restaurant[]): Restaurant[] {
  return [...restaurants].sort((a, b) => {
    // Primero: disponibles
    if (a.disponible && !b.disponible) return -1;
    if (!a.disponible && b.disponible) return 1;
    
    // Segundo: abiertos pero no disponibles
    if (a.abierto && !b.abierto) return -1;
    if (!a.abierto && b.abierto) return 1;
    
    // Tercero: alfabético
    return a.nombre.localeCompare(b.nombre);
  });
}

// Servicio unificado para restaurantes
export const restaurantsService = {
  getRestaurants,
  getRestaurantFlags,
  canOrderFrom,
  getAvailabilityMessage,
  sortRestaurantsByAvailability,
};