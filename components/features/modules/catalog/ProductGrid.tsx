"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Utensils, Store, Filter, Search, Grid, List, Clock, Shield, Truck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
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
  const [filters, setFilters] = useState<ProductFilters>({
    category: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
    subcategory: initialSubcategory || undefined,
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'fecha_creacion',
    sortOrder: 'desc'
  });

  // Usar el hook de productos con los filtros actuales
  const { products, pagination, loading, error, refetch } = useProducts(filters);
  
  // Debug logs
  useEffect(() => {
    console.log('Current filters:', filters);
    console.log('Current pagination:', pagination);
    console.log('Products count:', products.length);
    console.log('Loading state:', loading);
  }, [filters, pagination, products.length, loading]);
  
  // Obtener subcategorías para filtros
  const { 
    subcategories, 
    loading: subcategoriesLoading 
  } = useSubcategories(typeof categoryId === 'string' ? parseInt(categoryId) : categoryId);

  const colors = categoryColors[categoryName];
  const Icon = categoryIcons[categoryName];

  // Actualizar filtros cuando cambie la subcategoría inicial
  useEffect(() => {
    if (initialSubcategory !== null && initialSubcategory !== filters.subcategory) {
      setFilters(prev => ({
        ...prev,
        subcategory: initialSubcategory,
        page: 1
      }));
    }
  }, [initialSubcategory, filters.subcategory]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const handlePageChange = (page: number) => {
    console.log('Changing to page:', page); // Debug log
    setFilters(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      category: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
      search: '',
      subcategory: undefined,
      page: 1,
      limit: 20,
      sortBy: 'fecha_creacion',
      sortOrder: 'desc'
    });
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">{t('catalog.productList.subcategory')}</label>
        <Select
          value={filters.subcategory?.toString() || "all"}
          onValueChange={(value) => handleFilterChange('subcategory', value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger>
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

      <div>
        <label className="text-sm font-medium mb-2 block">{t('catalog.productList.priceRange')}</label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            min={0}
            placeholder={t('catalog.productList.minPrice')}
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
            className="w-24"
          />
          <span>-</span>
          <Input
            type="number"
            min={0}
            placeholder={t('catalog.productList.maxPrice')}
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 0 }))}
            className="w-24"
          />
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={handleClearFilters}
      >
        {t('catalog.productList.clearFilters')}
      </Button>
    </div>
  );

  const benefits = [
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
  ];

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
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t('catalog.productList.searchPlaceholder')}
                  className="pl-10 h-10 sm:h-auto"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex-1 sm:flex-none h-10 sm:h-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      {t('catalog.productList.filters')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>{t('catalog.productList.filters')}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as ProductFilters['sortBy'] }))}
                >
                  <SelectTrigger className="w-[120px] sm:w-[180px] h-10 sm:h-auto">
                    <SelectValue placeholder={t('catalog.productList.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nameAsc">{t('catalog.productList.sortOptions.nameAsc')}</SelectItem>
                    <SelectItem value="nameDesc">{t('catalog.productList.sortOptions.nameDesc')}</SelectItem>
                    <SelectItem value="priceAsc">{t('catalog.productList.sortOptions.priceAsc')}</SelectItem>
                    <SelectItem value="priceDesc">{t('catalog.productList.sortOptions.priceDesc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <StateDisplay 
                type="loading" 
                itemsCount={8}
                variant="grid"
              />
            ) : error ? (
              <StateDisplay 
                type="error" 
                title="Error al cargar productos"
                message={error}
                onRetry={refetch}
                retryLabel="Intentar de nuevo"
              />
            ) : products.length === 0 ? (
              <StateDisplay 
                type="empty" 
                title="No se encontraron productos"
                message="Intenta ajustar tus filtros o buscar con otros términos."
                onRetry={handleClearFilters}
                retryLabel="Limpiar filtros"
              />
            ) : (
              <AnimatePresence>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                >
                  {products.map((product) => (
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

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && !loading && (
              <div className="mt-8">
                <div className="text-center text-sm text-gray-600 mb-4">
                  Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} resultados
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}