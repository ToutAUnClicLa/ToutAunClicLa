/**
 * Hook personalizado para manejar restaurantes con información completa
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Restaurant, 
  RestaurantsResponse,
  restaurantsService 
} from '@/lib/services/restaurants';

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  currentTime: string;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener todos los restaurantes con información completa
 */
export function useRestaurants(): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: RestaurantsResponse = await restaurantsService.getRestaurants();
      
      // Ordenar restaurantes por disponibilidad
      const sortedRestaurants = restaurantsService.sortRestaurantsByAvailability(data.restaurants);
      
      setRestaurants(sortedRestaurants);
      setCurrentTime(data.currentTime);
    } catch (err: any) {
      setError(err.message || 'Error al cargar restaurantes');
      console.error('Error en useRestaurants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    currentTime,
    refetch: fetchRestaurants,
  };
}

/**
 * Hook para obtener un restaurante específico por ID
 */
export function useRestaurant(id?: number) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los restaurantes y filtrar por ID
      const data = await restaurantsService.getRestaurants();
      const foundRestaurant = data.restaurants.find(r => r.id === id);
      
      if (!foundRestaurant) {
        throw new Error('Restaurante no encontrado');
      }
      
      setRestaurant(foundRestaurant);
    } catch (err: any) {
      setError(err.message || 'Error al cargar restaurante');
      console.error('Error en useRestaurant:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id, fetchRestaurant]);

  return {
    restaurant,
    loading,
    error,
    refetch: fetchRestaurant,
  };
}