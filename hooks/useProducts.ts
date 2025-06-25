/**
 * Hook personalizado para productos con soporte completo para categorías y subcategorías
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  ProductsResponse, 
  ProductFilters,
  productsService 
} from '@/lib/services/products';
import { Subcategory } from '@/lib/services/categories';

interface UseProductsReturn {
  products: Product[];
  pagination: ProductsResponse['pagination'];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseRestaurantMenuReturn {
  restaurant: Subcategory | null;
  products: Product[];
  pagination: ProductsResponse['pagination'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener productos con filtros
 */
export function useProducts(filters: ProductFilters = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductsResponse['pagination']>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getProducts(filters);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      console.error('Error en useProducts:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Hook para obtener un producto específico
 */
export function useProduct(id?: number): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getProductById(productId);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar producto');
      console.error('Error en useProduct:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: id ? () => fetchProduct(id) : () => Promise.resolve(),
  };
}

/**
 * Hook para obtener productos por categoría
 */
export function useProductsByCategory(
  categoryId?: number, 
  page: number = 1, 
  limit: number = 20,
  searchTerm?: string
): UseProductsReturn {
  return useProducts({
    category: categoryId,
    page,
    limit,
    search: searchTerm
  });
}

/**
 * Hook para obtener productos por subcategoría (restaurante)
 */
export function useProductsBySubcategory(
  subcategoryId?: number,
  filters: Partial<ProductFilters> = {}
): UseProductsReturn {
  return useProducts({
    subcategory: subcategoryId,
    ...filters
  });
}

/**
 * Hook para obtener información completa de un restaurante con sus productos
 */
export function useRestaurantMenu(
  restaurantId?: number,
  productFilters: Partial<ProductFilters> = {}
): UseRestaurantMenuReturn {
  const [restaurant, setRestaurant] = useState<Subcategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantMenu = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productsService.getRestaurantWithProducts(id, productFilters);
      setRestaurant(data.restaurant);
      setProducts(data.products.products);
      setPagination(data.products.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar menú del restaurante');
      console.error('Error en useRestaurantMenu:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(productFilters)]);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantMenu(restaurantId);
    }
  }, [restaurantId, fetchRestaurantMenu]);

  return {
    restaurant,
    products,
    pagination,
    loading,
    error,
    refetch: restaurantId ? () => fetchRestaurantMenu(restaurantId) : () => Promise.resolve(),
  };
}

/**
 * Hook para búsqueda de productos
 */
export function useProductSearch(searchTerm: string, filters: Partial<ProductFilters> = {}) {
  return useProducts({
    search: searchTerm,
    ...filters
  });
}

/**
 * Hook para obtener productos relacionados
 */
export function useRelatedProducts(productId?: number, categoryId?: number, limit: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedProducts = useCallback(async (prodId: number, catId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getRelatedProducts(prodId, catId, limit);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos relacionados');
      console.error('Error en useRelatedProducts:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (productId && categoryId) {
      fetchRelatedProducts(productId, categoryId);
    }
  }, [productId, categoryId, fetchRelatedProducts]);

  return {
    products,
    loading,
    error,
    refetch: (productId && categoryId) ? () => fetchRelatedProducts(productId, categoryId) : () => Promise.resolve(),
  };
}
