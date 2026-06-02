"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Truck } from 'lucide-react';
import { useTranslation, useOptimizedSearch } from '@/hooks';
import { useProducts } from '@/hooks/useProducts';
import { useRestaurantDetails } from '@/hooks/useRestaurantDetails';
import { ProductCard } from './ProductCard';
import { RestaurantSchedule } from './RestaurantSchedule';
import { ProductFilters } from '@/lib/services/products';
import { StateDisplay } from '@/components/common/StateDisplay';
import { Pagination } from '@/components/common/Pagination';
import { Input } from '@/components/common/ui/input';
import { Badge } from '@/components/common/ui/badge';
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

interface RestaurantProductGridProps {
  restaurantName: string;
}

export function RestaurantProductGrid({ restaurantName }: RestaurantProductGridProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener detalles del restaurante incluyendo horarios
  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurantDetails(restaurantName);

  // Handle search with optimization
  const handleSearch = useCallback((searchValue: string) => {
    setSearchTerm(searchValue);
  }, []);

  const {
    searchValue,
    debouncedValue,
    isSearching,
    updateSearchValue,
    clearSearch
  } = useOptimizedSearch(handleSearch, {
    minLength: 0,
    debounceDelay: 500
  });

  // Get the restaurant subcategory ID dynamically from the API response
  // This supports both hardcoded and dynamically created restaurants
  const restaurantSubcategoryId = restaurant?.id ?? null;

  // Filter to get products only from this restaurant using subcategory ID
  // Only apply subcategory filter once we have the restaurant ID from the API
  // Traemos el menú completo del restaurante y ordenamos/paginamos en el cliente.
  // Así garantizamos: disponibles primero, luego por precio (mayor a menor), con
  // un orden 100% consistente entre páginas (sin repetidos ni saltos).
  const filters: ProductFilters = {
    category: 2, // "comidas" category
    subcategory: restaurantSubcategoryId ?? undefined,
    search: debouncedValue || undefined,
    page: 1,
    limit: 200,
    sortBy: 'precio',
    sortOrder: 'desc'
  };

  const { products, loading, error, refetch } = useProducts(filters, !restaurantSubcategoryId);

  // Orden global: 1) disponibles hoy Y restaurante abierto primero,
  //               2) precio base desc, 3) id (desempate estable).
  // Si el restaurante está cerrado, NINGÚN producto cuenta como disponible
  // para el sort (aunque tenga dias_disponibles = todos los días).
  const sortedProducts = useMemo(() => {
    const today = new Date().getDay();
    const restaurantOpen = restaurant?.abierto === true;

    const isAvailableToday = (p: any) => {
      if (!restaurantOpen) return false; // restaurante cerrado → ninguno disponible
      if (typeof p?.disponible_hoy === 'boolean') return p.disponible_hoy;
      if (Array.isArray(p?.dias_disponibles)) return p.dias_disponibles.includes(today);
      return true;
    };

    return [...products].sort((a: any, b: any) => {
      const availDiff = (isAvailableToday(b) ? 1 : 0) - (isAvailableToday(a) ? 1 : 0);
      if (availDiff !== 0) return availDiff;
      // Precio BASE (sin descuento aplicado) para orden consistente
      const priceA = a?.precio_anterior ?? a?.precio ?? 0;
      const priceB = b?.precio_anterior ?? b?.precio ?? 0;
      const priceDiff = priceB - priceA;
      if (priceDiff !== 0) return priceDiff;
      return (a?.id ?? 0) - (b?.id ?? 0);
    });
  }, [products, restaurant?.abierto]);

  // Paginación del lado del cliente sobre la lista ya ordenada
  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const pagination = { currentPage, totalPages, totalItems, itemsPerPage };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll al tope de la página con animación suave
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when restaurant changes or when the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [restaurantName, debouncedValue]);

  // Si la página actual queda fuera de rango (p. ej. tras filtrar), volver a 1
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  return (
    <div className="lg:flex lg:gap-8">
      {/* Desktop Sidebar - Solo visible en desktop */}
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <div className="sticky top-20">
          {(restaurantLoading || loading) ? (
            // Skeleton del sidebar de horarios - mostrar mientras cargan productos o restaurante
            <div className="bg-white shadow-lg border-0 p-4 rounded-lg animate-pulse">
              {/* Header del horario */}
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Lista de días */}
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : restaurant ? (
            <RestaurantSchedule
              diasAbiertos={restaurant.dias_abiertos}
              restaurantName={restaurantName}
              variant="sidebar"
            />
          ) : null}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="lg:flex-1 space-y-8">
        {/* Mobile Schedule Button - Solo visible en mobile */}
        <div className="lg:hidden">
          {(restaurantLoading || loading) ? (
            // Skeleton del botón mobile - mostrar mientras cargan productos o restaurante
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
          ) : restaurant ? (
            <RestaurantSchedule
              diasAbiertos={restaurant.dias_abiertos}
              restaurantName={restaurantName}
              variant="modal"
            />
          ) : null}
        </div>

        {/* Search Bar */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                isSearching ? "text-orange-500 animate-pulse" : "text-gray-400"
              )} />
              <Input
                type="search"
                placeholder={t('catalog.productList.searchPlaceholder')}
                className="pl-10 h-12 text-base border-gray-200 focus:border-orange-300 focus:ring-orange-100"
                value={searchValue}
                onChange={(e) => updateSearchValue(e.target.value)}
                disabled={loading}
              />
              {(isSearching || loading) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Products Grid */}
      <section 
        role="region" 
        aria-label={`Productos de ${restaurantName}`}
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <StateDisplay 
            type="loading" 
            itemsCount={8}
            variant="grid"
            message={t('catalog.productList.loading')}
          />
        ) : error ? (
          <StateDisplay 
            type="error" 
            title={t('catalog.productList.error')}
            message={error}
            onRetry={refetch}
            retryLabel={t('catalog.productList.retry')}
          />
        ) : products.length === 0 ? (
          <StateDisplay 
            type="empty" 
            title={searchValue ? t('catalog.productList.noResultsFor', { search: searchValue }) : t('catalog.productList.noProductsAvailable', { restaurant: restaurantName })}
            message={searchValue ? t('catalog.productList.tryOtherTerms') : t('catalog.productList.restaurantNoProducts')}
            onRetry={searchValue ? () => updateSearchValue('') : refetch}
            retryLabel={searchValue ? t('common.clearSearch') : t('catalog.productList.retry')}
          />
        ) : (
          <AnimatePresence>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              role="grid"
              aria-label={`Cuadrícula de ${products.length} productos de ${restaurantName}`}
            >
              {pageProducts.map((product, index) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard
                    product={product}
                    categoryName="comidas"
                    variant="default"
                    showCategory={false}
                    showRating={true}
                    showSubcategory={false}
                    className="h-full"
                    restaurantStatus={restaurant ? {
                      abierto: restaurant.abierto,
                      disponible: restaurant.disponible
                    } : undefined}
                    restaurantLoading={restaurantLoading}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="text-center text-sm text-gray-600 mb-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                {t('pagination.loadingResults')}
              </div>
            ) : (
              <span>
                {t('pagination.showing')} {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} {t('common.of')} {pagination.totalItems} {pagination.totalItems !== 1 ? t('common.products') : t('common.product')} {t('common.of')} {restaurantName}
                {searchValue && <span className="text-orange-600 font-medium"> {t('common.for')} &quot;{searchValue}&quot;</span>}
              </span>
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
  );
}
