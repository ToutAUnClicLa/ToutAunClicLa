"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Truck } from 'lucide-react';
import { useTranslation, useOptimizedSearch } from '@/hooks';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductFilters } from '@/lib/services/products';
import { StateDisplay } from '@/components/common/StateDisplay';
import { Pagination } from '@/components/common/Pagination';
import { Input } from '@/components/common/ui/input';
import { Badge } from '@/components/common/ui/badge';
import { cn } from '@/lib/utils';
import { getRestaurantSubcategoryId } from '@/lib/utils/restaurant-routes';

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

  // Get the restaurant subcategory ID
  const restaurantSubcategoryId = getRestaurantSubcategoryId(restaurantName);

  // Filter to get products only from this restaurant using subcategory ID
  const filters: ProductFilters = {
    category: 2, // "comidas" category
    subcategory: restaurantSubcategoryId || undefined, // Filter by restaurant subcategory ID
    search: debouncedValue || undefined, // Only add search if user is searching
    page: currentPage,
    limit: itemsPerPage,
    sortBy: 'nombre',
    sortOrder: 'asc'
  };

  const { products, pagination, loading, error, refetch } = useProducts(filters);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when restaurant changes
  useEffect(() => {
    setCurrentPage(1);
  }, [restaurantName]);

  return (
    <div className="space-y-8">
      {/* Search Bar Only */}
      <div className="text-center">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
              isSearching ? "text-orange-500 animate-pulse" : "text-gray-400"
            )} />
            <Input
              type="search"
              placeholder="Buscar en el menú..."
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
            title={searchValue ? `No se encontraron productos para "${searchValue}"` : `No hay productos disponibles en ${restaurantName}`}
            message={searchValue ? "Intenta con otros términos de búsqueda" : "Este restaurante no tiene productos disponibles en este momento."}
            onRetry={searchValue ? () => updateSearchValue('') : refetch}
            retryLabel={searchValue ? "Limpiar búsqueda" : t('catalog.productList.retry')}
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
              {products.map((product, index) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard
                    product={product}
                    categoryName="comidas"
                    variant="default"
                    showCategory={false}
                    showRating={true}
                    showSubcategory={false}
                    className="h-full"
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
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} producto{pagination.totalItems !== 1 ? 's' : ''} de {restaurantName}
                {searchValue && <span className="text-orange-600 font-medium"> para "{searchValue}"</span>}
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
  );
}