/**
 * Hook personalizado para manejar catálogos de productos con filtros avanzados
 */

import { useState, useCallback, useMemo } from 'react';
import { useProducts } from './useProducts';
import { useSubcategories } from './useCategories';
import { ProductFilters, Product } from '@/lib/services/products';
import { Subcategory } from '@/lib/services/categories';

interface UseCatalogFilters {
  search: string;
  subcategory?: number;
  sortBy: 'nombre' | 'precio' | 'fecha_creacion' | 'rating';
  sortOrder: 'asc' | 'desc';
  priceRange: [number, number];
  inStock: boolean;
}

interface UseCatalogReturn {
  // Data
  products: Product[];
  subcategories: Subcategory[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  
  // Loading states
  loading: boolean;
  subcategoriesLoading: boolean;
  error: string | null;
  
  // Filters
  filters: UseCatalogFilters;
  activeFiltersCount: number;
  
  // Filter actions
  setSearch: (search: string) => void;
  setSubcategory: (subcategoryId?: number) => void;
  setSorting: (sortBy: UseCatalogFilters['sortBy'], sortOrder: UseCatalogFilters['sortOrder']) => void;
  setPriceRange: (range: [number, number]) => void;
  setInStockOnly: (inStock: boolean) => void;
  clearFilters: () => void;
  
  // Pagination
  currentPage: number;
  setPage: (page: number) => void;
  
  // Actions
  refetch: () => Promise<void>;
}

export function useCatalog(
  categoryId: number,
  initialSubcategory?: number,
  initialFilters?: Partial<UseCatalogFilters>
): UseCatalogReturn {
  
  const [filters, setFilters] = useState<UseCatalogFilters>({
    search: '',
    subcategory: initialSubcategory,
    sortBy: 'fecha_creacion',
    sortOrder: 'desc',
    priceRange: [0, 1000],
    inStock: false,
    ...initialFilters
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  // Convert filters to ProductFilters format
  const productFilters: ProductFilters = useMemo(() => ({
    category: categoryId,
    subcategory: filters.subcategory,
    search: filters.search || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    inStock: filters.inStock || undefined,
    page: currentPage,
    limit: 20
  }), [categoryId, filters, currentPage]);

  // Fetch products with current filters
  const { 
    products, 
    pagination, 
    loading, 
    error, 
    refetch 
  } = useProducts(productFilters);

  // Fetch subcategories for the category
  const { 
    subcategories, 
    loading: subcategoriesLoading 
  } = useSubcategories(categoryId);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.subcategory) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.inStock) count++;
    if (filters.sortBy !== 'fecha_creacion' || filters.sortOrder !== 'desc') count++;
    return count;
  }, [filters]);

  // Filter update functions
  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  }, []);

  const setSubcategory = useCallback((subcategoryId?: number) => {
    setFilters(prev => ({ ...prev, subcategory: subcategoryId }));
    setCurrentPage(1);
  }, []);

  const setSorting = useCallback((sortBy: UseCatalogFilters['sortBy'], sortOrder: UseCatalogFilters['sortOrder']) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    setCurrentPage(1);
  }, []);

  const setPriceRange = useCallback((priceRange: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange }));
    setCurrentPage(1);
  }, []);

  const setInStockOnly = useCallback((inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      subcategory: undefined,
      sortBy: 'fecha_creacion',
      sortOrder: 'desc',
      priceRange: [0, 1000],
      inStock: false
    });
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    // Data
    products,
    subcategories,
    pagination,
    
    // Loading states
    loading,
    subcategoriesLoading,
    error,
    
    // Filters
    filters,
    activeFiltersCount,
    
    // Filter actions
    setSearch,
    setSubcategory,
    setSorting,
    setPriceRange,
    setInStockOnly,
    clearFilters,
    
    // Pagination
    currentPage,
    setPage,
    
    // Actions
    refetch
  };
}
