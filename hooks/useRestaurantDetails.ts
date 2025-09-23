import { useState, useEffect } from 'react';
import { DiaAbierto } from '@/lib/services/restaurants';

interface RestaurantDetails {
  id: number;
  nombre: string;
  Imagen?: string;
  Descripcion?: string;
  dias_abiertos?: DiaAbierto[];
  nacionalidades?: string[];
  disponible: boolean;
  abierto: boolean;
  puede_recibir_pedidos?: boolean;
  codigo_postal?: string;
  gmail?: string;
}

interface UseRestaurantDetailsReturn {
  restaurant: RestaurantDetails | null;
  loading: boolean;
  error: string | null;
}

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

export function useRestaurantDetails(restaurantName: string): UseRestaurantDetailsReturn {
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primero obtenemos todos los restaurantes
        const response = await fetch(`${PRODUCTS_BASE_URL}/restaurants`, {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'omit',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || `HTTP ${response.status}: Error al obtener restaurante`);
        }

        // Buscar el restaurante por nombre
        const foundRestaurant = data.restaurants?.find(
          (r: RestaurantDetails) => r.nombre.toLowerCase() === restaurantName.toLowerCase()
        );

        if (!foundRestaurant) {
          throw new Error(`Restaurante "${restaurantName}" no encontrado`);
        }

        if (isMounted) {
          setRestaurant(foundRestaurant);
        }
      } catch (err: any) {
        console.error('Error fetching restaurant details:', err);
        if (isMounted) {
          setError(err.message || 'Error al cargar los detalles del restaurante');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (restaurantName) {
      fetchRestaurantDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [restaurantName]);

  return { restaurant, loading, error };
}