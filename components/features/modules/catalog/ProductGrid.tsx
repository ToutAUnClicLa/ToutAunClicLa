"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Utensils, Store, Filter, Search, Grid, List, Clock, Shield, Truck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation, useOptimizedSearch } from '@/hooks';
import { useProducts, useProductsByCategory } from '@/hooks/useProducts';
import { useSubcategories } from '@/hooks/useCategories';
import { ProductCard } from './ProductCard';
import { Product, ProductFilters } from '@/lib/services/products';
import { Subcategory } from '@/lib/services/categories';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { Badge } from '@/components/common/ui/badge';
import { Skeleton } from '@/components/common/ui/skeleton';
import { Card, CardContent } from '@/components/common/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/common/ui/sheet';
import { StateDisplay } from '@/components/common/StateDisplay';
import { Pagination } from '@/components/common/Pagination';
import { cn } from '@/lib/utils';

const container = {  
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

type CategoryName = 'productos' | 'comidas' | 'boutique';

const categoryColors = {
  productos: {
    bg: 'from-indigo-50 to-blue-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100'
  },
  comidas: {
    bg: 'from-amber-50 to-orange-50',
    text: 'text-amber-600',
    border: 'border-amber-100'
  },
  boutique: {
    bg: 'from-purple-50 to-pink-50',
    text: 'text-purple-600',
    border: 'border-purple-100'
  }
} as const;

const categoryIcons = {
  productos: Package,
  comidas: Utensils,
  boutique: Store
} as const;

interface ProductGridProps {
  categoryId: string | number;
  categoryName: CategoryName;
  title: string;
  initialSubcategory?: number | null;
  showHeader?: boolean;
}

export function ProductGrid({ 
  categoryId, 
  categoryName, 
  title, 
  initialSubcategory = null, 
  showHeader = true 
}: ProductGridProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<ProductFilters>({
    category: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
    subcategory: initialSubcategory || undefined,
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'precio',
    sortOrder: 'desc'
  });
  const [filters, setFilters] = useState<ProductFilters>(tempFilters);

  // Hook optimizado para búsqueda - memoizamos la función callback
  const handleSearch = useCallback((searchTerm: string) => {
    const startTime = Date.now();
    
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
    
    // Debug de performance en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Iniciando búsqueda: "${searchTerm}" a las ${new Date().toLocaleTimeString()}`);
      
      // Medir tiempo de respuesta
      const measurePerformance = () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`⚡ Búsqueda completada en ${duration}ms`);
        
        if (duration > 2000) {
          console.warn(`🐌 Búsqueda lenta detectada: ${duration}ms para "${searchTerm}"`);
        }
      };
      
      // Usar setTimeout para medir cuando termine la búsqueda
      setTimeout(measurePerformance, 100);
    }
  }, []);

  const {
    searchValue,
    debouncedValue,
    isSearching,
    cacheSize,
    updateSearchValue,
    clearSearch,
    hasSearchText
  } = useOptimizedSearch(handleSearch, {
    minLength: 2,
    debounceDelay: 800,
    enableCache: true,
    cacheTimeout: 5 * 60 * 1000 // 5 minutos
  });

  // Usar el hook de productos con los filtros actuales
  const { products, pagination, loading, error, refetch } = useProducts(filters);
  
  // Obtener subcategorías para filtros
  const { 
    subcategories, 
    loading: subcategoriesLoading 
  } = useSubcategories(typeof categoryId === 'string' ? parseInt(categoryId) : categoryId);

  const colors = categoryColors[categoryName];
  const Icon = categoryIcons[categoryName];

  // Actualizar filtros cuando cambie la subcategoría inicial (solo una vez)
  useEffect(() => {
    if (initialSubcategory !== null) {
      setFilters(prev => ({
        ...prev,
        subcategory: initialSubcategory,
        page: 1
      }));
    }
  }, [initialSubcategory]); // Removemos filters.subcategory para evitar bucles



  const handleFilterChange = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  }, []);

  const handleTempFilterChange = useCallback((key: keyof ProductFilters, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  }, []);

  const applyMobileFilters = useCallback(() => {
    setFilters({ ...tempFilters });
    setIsFilterOpen(false);
    toast.success(t('catalog.productList.notifications.filtersApplied'));
  }, [tempFilters, t]);

  const resetMobileFilters = useCallback(() => {
    const resetFilters = {
      category: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
      search: filters.search, // Mantener la búsqueda
      subcategory: undefined,
      page: 1,
      limit: 20,
      sortBy: 'precio',
      sortOrder: 'desc' as const
    };
    setTempFilters(resetFilters);
  }, [categoryId, filters.search]);

  const cancelMobileFilters = useCallback(() => {
    setTempFilters({ ...filters });
    setIsFilterOpen(false);
  }, [filters]);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearFilters = useCallback(() => {
    clearSearch(); // Usar la función del hook optimizado
    setFilters({
      category: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
      search: '',
      subcategory: undefined,
      page: 1,
      limit: 20,
      sortBy: 'precio',
      sortOrder: 'desc'
    });
    
    // Notificación de confirmación
    toast.success(t('catalog.productList.notifications.filtersCleared'));
  }, [clearSearch, categoryId, t]);

  const LoadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-2 sm:p-4 space-y-2">
            <Skeleton className="h-3 sm:h-4 w-3/4" />
            <Skeleton className="h-2 sm:h-3 w-1/2" />
            <Skeleton className="h-4 sm:h-6 w-1/4" />
            <Skeleton className="h-6 sm:h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  ), []);

  const FilterContent = useCallback(() => (
    <div className="space-y-4 sm:space-y-6">
      {/* Filtro por Subcategoría */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t('catalog.productList.subcategory')}</label>
        <Select
          value={filters.subcategory?.toString() || "all"}
          onValueChange={(value) => handleFilterChange('subcategory', value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('catalog.productList.allSubcategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('catalog.productList.allSubcategories')}</SelectItem>
            {subcategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.id.toString()}>
                {sub.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Rango de Precios */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t('catalog.productList.priceRange')}</label>
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={0}
              placeholder={t('catalog.productList.minPrice')}
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || undefined)}
              className="flex-1"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              min={0}
              placeholder={t('catalog.productList.maxPrice')}
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || undefined)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Botón Limpiar Filtros */}
      <Button 
        variant="outline"
        className="w-full"
        onClick={handleClearFilters}
      >
        {t('catalog.productList.clearFilters')}
      </Button>
    </div>
  ), [t, filters.subcategory, filters.minPrice, filters.maxPrice, subcategories, handleFilterChange, handleClearFilters]);

  const MobileFilterContent = useCallback(() => (
    <div className="space-y-4 sm:space-y-6">
      {/* Filtro por Subcategoría */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t('catalog.productList.subcategory')}</label>
        <Select
          value={tempFilters.subcategory?.toString() || "all"}
          onValueChange={(value) => handleTempFilterChange('subcategory', value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('catalog.productList.allSubcategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('catalog.productList.allSubcategories')}</SelectItem>
            {subcategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.id.toString()}>
                {sub.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Rango de Precios */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t('catalog.productList.priceRange')}</label>
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={0}
              placeholder={t('catalog.productList.minPrice')}
              value={tempFilters.minPrice || ''}
              onChange={(e) => handleTempFilterChange('minPrice', parseInt(e.target.value) || undefined)}
              className="flex-1"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              min={0}
              placeholder={t('catalog.productList.maxPrice')}
              value={tempFilters.maxPrice || ''}
              onChange={(e) => handleTempFilterChange('maxPrice', parseInt(e.target.value) || undefined)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 pt-4">
        <Button 
          variant="outline"
          className="flex-1"
          onClick={resetMobileFilters}
        >
          {t('catalog.productList.mobileFilters.reset')}
        </Button>
        <Button 
          className="flex-1"
          onClick={applyMobileFilters}
        >
          {t('catalog.productList.mobileFilters.apply')}
        </Button>
      </div>
    </div>
  ), [t, tempFilters.subcategory, tempFilters.minPrice, tempFilters.maxPrice, subcategories, handleTempFilterChange, resetMobileFilters, applyMobileFilters]);

  const benefits = useMemo(() => [
    {
      icon: Clock,
      title: t('catalog.productList.benefits.fastDelivery.title'),
      description: t('catalog.productList.benefits.fastDelivery.description')
    },
    {
      icon: Shield,
      title: t('catalog.productList.benefits.qualityGuarantee.title'),
      description: t('catalog.productList.benefits.qualityGuarantee.description')
    },
    {
      icon: Truck,
      title: t('catalog.productList.benefits.freeShipping.title'),
      description: t('catalog.productList.benefits.freeShipping.description')
    }
  ], [t]);

  return (
    <div className={cn("min-h-screen py-6", showHeader ? colors.bg : 'bg-white')}>
      <div className={showHeader ? "container" : "max-w-7xl mx-auto px-4"}>
        {showHeader && (
          <div className="flex items-center gap-3 mb-6">
            <Icon className={cn("h-6 w-6", colors.text)} />
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-gray-600">
                {categoryName === 'productos' 
                  ? t('catalog.productList.productsSubtitle')
                  : categoryName === 'comidas'
                  ? t('catalog.productList.comidasSubtitle')
                  : t('catalog.productList.boutiqueSubtitle')
                }
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className={cn("p-4 rounded-lg border", colors.border)}>
              <h3 className="font-semibold mb-4">{t('catalog.productList.filters')}</h3>
              <FilterContent />
            </div>

            <div className={cn("p-4 rounded-lg border", colors.border)}>
              <h3 className="font-semibold mb-4">{t('catalog.productList.benefits.fastDelivery.title')}</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <benefit.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-sm">{benefit.title}</h4>
                      <p className="text-xs text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {/* Metadatos para accesibilidad y SEO */}
            <div className="sr-only">
              <h2>Búsqueda y filtros de productos</h2>
              <p>
                {pagination?.totalItems || products.length} productos encontrados
                {searchValue && ` para la búsqueda "${searchValue}"`}
                {filters.subcategory && ` en la categoría ${subcategories.find(s => s.id === filters.subcategory)?.nombre}`}
              </p>
            </div>
            {/* Controles de búsqueda y filtros optimizados para mobile */}
            <div className="space-y-3 mb-6">
              {/* Buscador optimizado */}
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                  isSearching ? "text-blue-500 animate-pulse" : "text-gray-400"
                )} />
                <Input
                  type="search"
                  placeholder={t('catalog.productList.searchPlaceholder')}
                  className={cn(
                    "pl-10 h-12 text-base transition-colors border-gray-200",
                    "focus:border-blue-300 focus:ring-0 focus:ring-offset-0 focus:shadow-none",
                    isSearching && "border-blue-300",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                  value={searchValue}
                  onChange={(e) => updateSearchValue(e.target.value)}
                  disabled={loading}
                />
                
                {/* Loading spinner en el campo de búsqueda */}
                {(isSearching || loading) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
              </div>

              {/* Controles de filtro y ordenamiento */}
              <div className="flex gap-2">
                {/* Filtros móviles */}
                <Sheet 
                  open={isFilterOpen} 
                  onOpenChange={(open) => {
                    if (open) {
                      // Sincronizar filtros temporales al abrir
                      setTempFilters({ ...filters });
                    }
                    setIsFilterOpen(open);
                  }}
                >
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "lg:hidden flex-1 h-12 justify-center relative transition-all",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={loading}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {t('catalog.productList.filters')}
                      {(filters.subcategory || filters.minPrice || filters.maxPrice) && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
                    <SheetHeader className="text-left pb-4 border-b">
                      <SheetTitle className="text-lg font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Filter className="h-5 w-5" />
                          {t('catalog.productList.mobileFilters.title')}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={cancelMobileFilters}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-full pb-6">
                      <MobileFilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Ordenamiento */}
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-') as [ProductFilters['sortBy'], 'asc' | 'desc'];
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className={cn(
                    "w-[160px] h-12 transition-all",
                    loading && "opacity-50 cursor-not-allowed"
                  )}>
                    <SelectValue placeholder={t('catalog.productList.sortBy')} />
                    {loading && (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin ml-2"></div>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="precio-desc">
                      {t('catalog.productList.sortOptions.priceDesc')}
                    </SelectItem>
                    <SelectItem value="precio-asc">
                      {t('catalog.productList.sortOptions.priceAsc')}
                    </SelectItem>
                    <SelectItem value="fecha_creacion-desc">
                      {t('catalog.productList.sortOptions.newest')}
                    </SelectItem>
                    <SelectItem value="nombre-asc">
                      {t('catalog.productList.sortOptions.nameAsc')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Indicadores de filtros activos */}
              {(filters.subcategory || filters.minPrice || filters.maxPrice || searchValue) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {filters.subcategory && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs flex items-center gap-1 transition-all hover:bg-gray-300",
                        loading && "opacity-50"
                      )}
                    >
                      📂 {subcategories.find(s => s.id === filters.subcategory)?.nombre}
                      <button
                        onClick={() => !loading && handleFilterChange('subcategory', undefined)}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        disabled={loading}
                        aria-label="Remover filtro de categoría"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs flex items-center gap-1 transition-all hover:bg-gray-300",
                        loading && "opacity-50"
                      )}
                    >
                      💰 ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                      <button
                        onClick={() => {
                          if (!loading) {
                            handleFilterChange('minPrice', undefined);
                            handleFilterChange('maxPrice', undefined);
                          }
                        }}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        disabled={loading}
                        aria-label="Remover filtro de precio"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {searchValue && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs flex items-center gap-1 transition-all hover:bg-gray-300",
                        loading && "opacity-50"
                      )}
                    >
                      🔍 &ldquo;{searchValue}&rdquo;
                      <button
                        onClick={() => !loading && updateSearchValue('')}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        disabled={loading}
                        aria-label="Limpiar búsqueda"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {/* Botón para limpiar todos los filtros */}
                  {(filters.subcategory || filters.minPrice || filters.maxPrice || searchValue) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      disabled={loading}
                      className={cn(
                        "h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-all",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {t('catalog.productList.pagination.clearAll')}
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Área de resultados de productos */}
            <section 
              role="region" 
              aria-label="Resultados de productos"
              aria-live="polite"
              aria-busy={loading}
            >
              {loading ? (
                <StateDisplay 
                  type="loading" 
                  itemsCount={8}
                  variant="grid"
                  message={searchValue ? `${t('catalog.productList.searching')} "${searchValue}"...` : t('catalog.productList.loading')}
                />
              ) : error ? (
                <StateDisplay 
                  type="error" 
                  title={t('catalog.productList.error')}
                  message={error.includes('peticiones') ? 
                    "Se realizaron demasiadas búsquedas muy rápido. Por favor, espera un momento e inténtalo de nuevo." : 
                    error}
                  onRetry={refetch}
                  retryLabel={t('catalog.productList.retry')}
                />
              ) : products.length === 0 ? (
                <StateDisplay 
                  type="empty" 
                  title={searchValue ? `${t('catalog.productList.noProducts')} para "${searchValue}"` : t('catalog.productList.noProducts')}
                  message={searchValue ? 
                    t('catalog.productList.noProductsMessage') :
                    filters.subcategory || filters.minPrice || filters.maxPrice ?
                    t('catalog.productList.noProductsMessage') :
                    t('catalog.productList.noProducts')
                  }
                  onRetry={handleClearFilters}
                  retryLabel={searchValue || filters.subcategory || filters.minPrice || filters.maxPrice ? 
                    t('catalog.productList.clearFilters') : 
                    t('catalog.productList.retry')
                  }
                />
              ) : (
                <AnimatePresence>
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                    role="grid"
                    aria-label={`Cuadrícula de ${products.length} productos`}
                  >
                    {products.map((product, index) => (
                      <motion.div key={product.id} variants={item}>
                        <ProductCard
                          product={product}
                          categoryName={categoryName}
                          variant="default"
                          showCategory={showHeader}
                          showRating={true}
                          showSubcategory={categoryName === 'comidas'}
                          className="h-full"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8"
              >
                <div className="text-center text-sm text-gray-600 mb-4 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      {t('catalog.productList.pagination.loadingResults')}
                    </>
                  ) : (
                    <>
                      {t('catalog.productList.pagination.showingResults')
                        .replace('{start}', ((pagination.currentPage - 1) * pagination.itemsPerPage + 1).toString())
                        .replace('{end}', Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems).toString())
                        .replace('{total}', pagination.totalItems.toString())
                        .replace('{plural}', pagination.totalItems !== 1 ? 's' : '')}
                      {searchValue && (
                        <span className="text-blue-600 font-medium">
                          {t('catalog.productList.pagination.searchResultsFor').replace('{search}', searchValue)}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={handlePageChange}
                  disabled={loading}
                  className="justify-center"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}