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

export interface DiaAbierto {
  dia: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado
  abierto: boolean;
  hora_apertura?: string;
  hora_cierre?: string;
}

export interface Restaurant {
  id: number;
  nombre: string;
  Imagen?: string;
  Descripcion?: string;
  dias_abiertos?: DiaAbierto[];
  nacionalidades: string[];
  categorias: {
    id: number;
    nombre: string;
  };
  abierto: boolean;
  disponible: boolean;
  puede_recibir_pedidos?: boolean;
  horario_entrega: {
    inicio: string;
    fin: string;
  };
  hora_limite_pedidos: string;
  dia_actual?: DiaAbierto | null;
  abierto_hoy?: boolean;
  codigo_postal?: string | null;
  gmail?: string | null;
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
 * Obtener el horario de hoy para un restaurante
 */
export function getTodaySchedule(dias_abiertos?: DiaAbierto[]): DiaAbierto | null {
  if (!dias_abiertos || !Array.isArray(dias_abiertos)) return null;

  const today = new Date().getDay(); // 0=Domingo, 1=Lunes, etc.
  return dias_abiertos.find(dia => dia.dia === today) || null;
}

/**
 * Formatear hora de formato HH:MM a formato legible
 */
export function formatTime(time?: string): string {
  if (!time) return '';
  // Remover los segundos si existen (HH:MM:SS -> HH:MM)
  return time.split(':').slice(0, 2).join(':');
}

/**
 * Verificar si un restaurante puede recibir pedidos
 * Solo si está disponible y puede recibir pedidos
 */
export function canOrderFrom(restaurant: Restaurant): boolean {
  return restaurant.disponible && (restaurant.puede_recibir_pedidos ?? restaurant.abierto);
}

/**
 * Obtener mensaje de disponibilidad para un restaurante
 */
export function getAvailabilityMessage(restaurant: Restaurant, t: (key: string, params?: any) => string): {
  message: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
  status: 'available' | 'last_hour' | 'closed' | 'coming_soon';
} {
  // Si disponible es false, mostrar "Disponible muy pronto" independientemente del horario
  if (!restaurant.disponible) {
    return {
      message: t('catalog.restaurantList.comingSoon'),
      color: 'blue',
      status: 'coming_soon'
    };
  }

  // Si el restaurante no abre hoy
  if (restaurant.abierto_hoy === false) {
    return {
      message: t('catalog.restaurants.status.closedToday'),
      color: 'red',
      status: 'closed'
    };
  }

  // Si está cerrado pero abre hoy, mostrar hora de apertura
  if (!restaurant.abierto && restaurant.dia_actual?.abierto) {
    const apertura = restaurant.dia_actual.hora_apertura || restaurant.horario_entrega?.inicio || '12:00';
    return {
      message: t('catalog.restaurants.status.closed', { time: apertura }),
      color: 'red',
      status: 'closed'
    };
  }

  // Si no puede recibir pedidos (última hora antes del cierre)
  if (restaurant.abierto && !restaurant.puede_recibir_pedidos) {
    return {
      message: t('catalog.restaurants.status.lastHour', { time: restaurant.hora_limite_pedidos }),
      color: 'yellow',
      status: 'last_hour'
    };
  }

  // Si está abierto y puede recibir pedidos
  if (restaurant.abierto && restaurant.puede_recibir_pedidos) {
    return {
      message: t('catalog.restaurants.status.available'),
      color: 'green',
      status: 'available'
    };
  }

  // Estado por defecto: cerrado
  return {
    message: t('catalog.restaurants.status.closed'),
    color: 'red',
    status: 'closed'
  };
}

/**
 * Ordenar restaurantes por disponibilidad
 * Primero: disponibles y abiertos
 * Segundo: disponibles, cerrados pero abren hoy (con hora de apertura)
 * Tercero: disponibles pero cerrados completamente hoy
 * Cuarto: no disponibles (próximamente)
 * Dentro de cada grupo: orden alfabético
 */
export function sortRestaurantsByAvailability(restaurants: Restaurant[]): Restaurant[] {
  return [...restaurants].sort((a, b) => {
    // Primero: disponibles van antes que no disponibles
    if (a.disponible && !b.disponible) return -1;
    if (!a.disponible && b.disponible) return 1;

    // Si ambos están disponibles
    if (a.disponible && b.disponible) {
      // Prioridad 1: Abiertos y pueden recibir pedidos
      const aCanOrder = a.abierto && a.puede_recibir_pedidos;
      const bCanOrder = b.abierto && b.puede_recibir_pedidos;
      if (aCanOrder && !bCanOrder) return -1;
      if (!aCanOrder && bCanOrder) return 1;

      // Prioridad 2: Cerrados pero abren hoy (tienen horario de apertura)
      const aOpensToday = !a.abierto && a.dia_actual?.abierto === true;
      const bOpensToday = !b.abierto && b.dia_actual?.abierto === true;
      if (aOpensToday && !bOpensToday) return -1;
      if (!aOpensToday && bOpensToday) return 1;

      // Prioridad 3: Completamente cerrados hoy
      const aClosedToday = !a.abierto && a.abierto_hoy === false;
      const bClosedToday = !b.abierto && b.abierto_hoy === false;
      if (!aClosedToday && bClosedToday) return -1;
      if (aClosedToday && !bClosedToday) return 1;
    }

    // Si tienen el mismo estado, ordenar alfabéticamente
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
  getTodaySchedule,
  formatTime,
};