"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChefHat, Search, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { RestaurantList } from './RestaurantList';
import { ProductGrid } from './ProductGrid';
import { useSubcategoryTranslation } from '@/lib/utils';
import { shopSection } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (initialSubcategory) {
      setSelectedRestaurant({
        id: initialSubcategory,
        name: translateSubcategory(initialSubcategory)
      });
      setShowProducts(true);
    }
  }, [initialSubcategory, translateSubcategory]);

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setShowProducts(false);
  };

  return (
    <div className="min-h-screen bg-white text-[var(--shop-ink)]">
      {!showProducts && (
        <div className="container pt-4 pb-10 sm:pt-5 sm:pb-12">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 sm:max-w-xl">
              <h1 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-[var(--shop-ink)] sm:text-xl">
                <ChefHat className={cn('h-4 w-4 shrink-0', shopSection.food.icon)} aria-hidden />
                {t('catalog.foodCatalog.title')}
              </h1>
              <p className="mt-0.5 text-xs leading-snug text-[var(--shop-muted)] sm:text-sm">
                {t('catalog.foodCatalog.subtitle')}
              </p>
            </div>
            <div className="flex h-9 w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--shop-hairline)] bg-white px-3 shadow-none focus-within:border-[var(--food-accent)] sm:w-56 md:w-64">
              <Search className="h-3.5 w-3.5 shrink-0 text-[var(--shop-muted)]" aria-hidden />
              <input
                className={cn(
                  shopSection.food.focus,
                  'h-9 min-w-0 flex-1 appearance-none bg-transparent text-sm text-[var(--shop-ink)] placeholder:text-gray-400 shadow-none',
                  '[&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-results-button]:appearance-none',
                )}
                type="search"
                placeholder={t('catalog.foodCatalog.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={t('catalog.foodCatalog.searchPlaceholder')}
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', shopSection.food.focus)}
                  aria-label={t('common.clearSearch')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>
          <RestaurantList categoryId={categoryId} searchTerm={searchTerm} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {showProducts && (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="container py-8 sm:py-12"
          >
            <button
              type="button"
              onClick={handleBackToRestaurants}
              className={cn(
                'inline-flex h-11 min-h-11 items-center gap-1.5 text-sm font-medium text-[var(--shop-muted)]',
                shopSection.food.hoverText,
                shopSection.food.focus,
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t('catalog.foodCatalog.backToRestaurants')}
            </button>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--shop-ink)] sm:text-3xl lg:text-4xl">
              {t('catalog.foodCatalog.menuTitle')} {selectedRestaurant?.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--shop-muted)] sm:text-base">
              {t('catalog.foodCatalog.menuSubtitle')}
            </p>
            <div className="mt-8">
              <ProductGrid
                categoryId={categoryId}
                categoryName="comidas"
                title=""
                showHeader={false}
                initialSubcategory={selectedRestaurant?.id || null}
                restaurantName={selectedRestaurant?.name || undefined}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
