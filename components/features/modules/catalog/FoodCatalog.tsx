"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChefHat, Filter, Search, SlidersHorizontal, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { Badge } from '@/components/common/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { RestaurantList } from './RestaurantList';
import { ProductGrid } from './ProductGrid';
import { useSubcategoryTranslation } from '@/lib/utils';

interface FoodCatalogProps {
  categoryId: number;
  initialSubcategory?: number | null;
}

export function FoodCatalog({ categoryId, initialSubcategory = null }: FoodCatalogProps) {
  const { t } = useTranslation();
  const translateSubcategory = useSubcategoryTranslation(t);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: number;
    name: string;
  } | null>(initialSubcategory ? {
    id: initialSubcategory,
    name: translateSubcategory(initialSubcategory)
  } : null);
  const [showProducts, setShowProducts] = useState(!!initialSubcategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterBy, setFilterBy] = useState('all');

  // Si hay una subcategoría inicial, mostrar directamente los productos
  useEffect(() => {
    if (initialSubcategory) {
      setSelectedRestaurant({
        id: initialSubcategory,
        name: translateSubcategory(initialSubcategory)
      });
      setShowProducts(true);
    }
  }, [initialSubcategory, translateSubcategory]);

  const handleRestaurantSelect = (subcategoryId: number, restaurantName: string) => {
    setSelectedRestaurant({ id: subcategoryId, name: restaurantName });
    setShowProducts(true);
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setShowProducts(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/30">
      <div className={`mx-auto px-4 sm:px-6 py-6 sm:py-8 ${showProducts ? 'max-w-7xl' : 'container'}`}>
        
        {/* Vista principal: Listado de restaurantes */}
        {!showProducts && (
          <div className="mb-6">
            {/* Encabezado consistente con otras secciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Título y icono - Centrado en mobile, izquierda en desktop */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <ChefHat className="h-6 w-6 text-amber-600" strokeWidth={2} fill="none" />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{t('catalog.foodCatalog.title')}</h1>
                  <p className="text-sm text-gray-600">
                    {t('catalog.foodCatalog.subtitle')}
                  </p>
                </div>
              </div>

              {/* Buscador - Responsivo */}
              <div className="w-full sm:w-auto sm:max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder={t('catalog.foodCatalog.searchPlaceholder')}
                    className="pl-10 h-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Lista de restaurantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-1 sm:px-0"
            >
              <RestaurantList
                categoryId={categoryId}
              />
            </motion.div>
          </div>
        )}

        {/* Vista de productos del restaurante seleccionado */}
        <AnimatePresence mode="wait">
          {showProducts && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header mejorado con botón de regreso */}
              <div className="mb-6 sm:mb-8">
                {/* Título elegante con botón de regreso completamente responsive */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative text-center space-y-3 sm:space-y-4"
                >
                  {/* Botón de regreso responsive - esquina izquierda en desktop, arriba en mobile */}
                  <div className="absolute left-0 top-0 z-10 sm:left-0 sm:top-0">
                    <Button
                      variant="ghost"
                      onClick={handleBackToRestaurants}
                      className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 h-7 sm:h-8 text-xs sm:text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 rounded-lg font-medium touch-target-large"
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">{t('catalog.foodCatalog.backToRestaurants')}</span>
                      <span className="xs:hidden sm:hidden">Volver</span>
                    </Button>
                  </div>

                  {/* Título principal - responsive con padding adaptativo */}
                  <div className="pt-8 sm:pt-6 md:pt-4 px-4 sm:px-6">
                    <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight break-words">
                      {t('catalog.foodCatalog.menuTitle')} {selectedRestaurant?.name}
                    </h1>
                  </div>
                  
                  {/* Subtítulo con decoración - responsive */}
                  <div className="flex items-center justify-center gap-2 px-4 sm:px-6">
                    <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex-shrink-0" />
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 px-2 text-center leading-relaxed">
                      {t('catalog.foodCatalog.menuSubtitle')}
                    </p>
                    <div className="h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex-shrink-0" />
                  </div>
                </motion.div>
              </div>

              {/* ProductGrid sin el header propio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ProductGrid
                  categoryId={categoryId}
                  categoryName="comidas"
                  title=""
                  showHeader={false}
                  initialSubcategory={selectedRestaurant?.id || null}
                  restaurantName={selectedRestaurant?.name || undefined}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
