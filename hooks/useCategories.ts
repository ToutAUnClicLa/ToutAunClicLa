/**
 * Hook personalizado para manejar categorías y subcategorías
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Category, 
  Subcategory, 
  CategoryWithSubcategories,
  categoriesService 
} from '@/lib/services/categories';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseSubcategoriesReturn {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseCategoriesWithSubsReturn {
  categoriesWithSubs: CategoryWithSubcategories[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener todas las categorías
 */
export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
      console.error('Error en useCategories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * Hook para obtener subcategorías de una categoría específica
 */
export function useSubcategories(categoryId?: number): UseSubcategoriesReturn {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar useRef para evitar llamadas innecesarias
  const categoryIdRef = useRef(categoryId);
  const isInitialMount = useRef(true);

  const fetchSubcategories = useCallback(async (id?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = id 
        ? await categoriesService.getSubcategoriesByCategory(id)
        : await categoriesService.getAllSubcategories();
      
      setSubcategories(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar subcategorías');
      console.error('Error en useSubcategories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Solo hacer la llamada inicial o cuando categoryId cambie realmente
    if (isInitialMount.current || categoryIdRef.current !== categoryId) {
      isInitialMount.current = false;
      categoryIdRef.current = categoryId;
      fetchSubcategories(categoryId);
    }
  }, [categoryId, fetchSubcategories]);

  return {
    subcategories,
    loading,
    error,
    refetch: fetchSubcategories,
  };
}

/**
 * Hook para obtener categorías con sus subcategorías
 */
export function useCategoriesWithSubcategories(): UseCategoriesWithSubsReturn {
  const [categoriesWithSubs, setCategoriesWithSubs] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoriesWithSubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getCategoriesWithSubcategories();
      setCategoriesWithSubs(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías con subcategorías');
      console.error('Error en useCategoriesWithSubcategories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesWithSubs();
  }, [fetchCategoriesWithSubs]);

  return {
    categoriesWithSubs,
    loading,
    error,
    refetch: fetchCategoriesWithSubs,
  };
}

/**
 * Hook para obtener restaurantes (subcategorías de comidas)
 */
export function useRestaurants(): UseSubcategoriesReturn {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getRestaurants();
      setSubcategories(data);
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
    subcategories,
    loading,
    error,
    refetch: fetchRestaurants,
  };
}

/**
 * Hook para obtener información de una subcategoría específica
 */
export function useSubcategory(id?: number) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubcategory = useCallback(async (subcategoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getSubcategoryById(subcategoryId);
      setSubcategory(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar subcategoría');
      console.error('Error en useSubcategory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchSubcategory(id);
    }
  }, [id, fetchSubcategory]);

  return {
    subcategory,
    loading,
    error,
    refetch: id ? () => fetchSubcategory(id) : () => Promise.resolve(),
  };
}
