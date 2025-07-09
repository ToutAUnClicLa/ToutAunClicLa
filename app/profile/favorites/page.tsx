"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, ShoppingCart, ShoppingBag, Plus, X, Package, Utensils, Store, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavoritesList } from '@/hooks/useFavoritesList';
import AuthModal from '@/components/features/auth/AuthModal';
import { addToCart } from '@/lib/services/cart';
import { removeFromFavorites } from '@/lib/services/favorites';
import { toast } from 'sonner';
import { FavoriteItem } from '@/lib/services/favorites';
import { useTranslation } from '@/hooks/useTranslation';

// Mapeo de categorías con estilos modernos
const categoryMap = {
  productos: { 
    name: 'productos', 
    icon: Package, 
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-100'
  },
  comidas: { 
    name: 'comidas', 
    icon: Utensils, 
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100'
  },
  boutique: { 
    name: 'boutique', 
    icon: Store, 
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100'
  }
};

// Función para determinar la categoría de un item
const getItemCategory = (item: FavoriteItem): string => {
  const categoryName = item.productos.categorias?.nombre?.toLowerCase() || '';
  
  // Lógica para mapear categorías
  if (categoryName.includes('comida') || categoryName.includes('food') || categoryName.includes('snack')) {
    return 'comidas';
  } else if (categoryName.includes('boutique') || categoryName.includes('ropa') || categoryName.includes('accesorio')) {
    return 'boutique';
  } else {
    return 'productos';
  }
};

// Orden de categorías
const categoryOrder = ['productos', 'comidas', 'boutique'];

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { addToCart: addToCartHook } = useCart();
  const { 
    favorites, 
    isLoading, 
    totalCount, 
    loadFavorites, 
    removeFromFavorites: removeFavoriteHook 
  } = useFavoritesList();
  
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mostrar modal si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  // Agrupar favoritos por categoría
  const itemsByCategory = useMemo(() => {
    const grouped: { [key: string]: FavoriteItem[] } = {};
    
    favorites.forEach(item => {
      const category = getItemCategory(item);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    
    return grouped;
  }, [favorites]);

  // Ordenar categorías
  const sortedCategories = useMemo(() => {
    return categoryOrder.filter(category => itemsByCategory[category]?.length > 0);
  }, [itemsByCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleAddToCart = async (item: FavoriteItem) => {
    if (item.productos.stock === 0) {
      toast.error(t('favorites.messages.outOfStock'));
      return;
    }

    setAddingToCart(prev => new Set(prev).add(item.id));
    try {
      await addToCart(item.producto_id, 1);
      toast.success(t('favorites.messages.addedToCart'));
    } catch (error) {
      toast.error(t('favorites.messages.errorAdd'));
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleRemoveFromFavorites = async (item: FavoriteItem) => {
    setLoadingItems(prev => new Set(prev).add(item.id));
    try {
      await removeFromFavorites(item.producto_id);
      await loadFavorites(); // Recargar la lista
      toast.success(t('favorites.messages.removed'));
    } catch (error) {
      toast.error(t('favorites.messages.errorRemove'));
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const renderFavoriteItem = (item: FavoriteItem) => {
    const isItemLoading = loadingItems.has(item.id);
    const isAddingToCart = addingToCart.has(item.id);
    const isOutOfStock = item.productos.stock === 0;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`overflow-hidden transition-all duration-200 border-0 shadow-sm hover:shadow-md ${isItemLoading ? 'opacity-50' : ''}`}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex gap-3 sm:gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <Image
                  src={item.productos.imagen_principal}
                  alt={item.productos.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.svg';
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{t('favorites.items.outOfStock')}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-1 line-clamp-2">
                      {item.productos.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
                      {item.productos.categorias?.nombre || t('favorites.items.noCategory')}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">
                        {formatPrice(item.productos.precio)}
                      </span>
                      {item.productos.stock <= 5 && item.productos.stock > 0 && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                          {t('favorites.items.stock')} {item.productos.stock}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 rounded-full"
                    onClick={() => handleRemoveFromFavorites(item)}
                    disabled={isItemLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="text-xs sm:text-sm text-gray-500">
                    {new Date(item.fecha_agregado).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/productos/${item.producto_id}`)}
                      className="text-gray-600 hover:text-gray-900 h-8 text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      {t('favorites.items.view')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      disabled={isAddingToCart || isOutOfStock}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-8 text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      {isAddingToCart ? (
                        <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {isOutOfStock ? t('favorites.items.outOfStock') : t('favorites.items.addToCart')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="h-12 w-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('favorites.loading.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('favorites.loading.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6 p-8">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-10 w-10 text-red-600" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900 mb-2">{t('favorites.auth.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('favorites.auth.description')}
                </p>
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t('favorites.auth.login')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30">
        <div className="container max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6 p-8">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900 mb-2">{t('favorites.empty.title')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('favorites.empty.description')}
                </p>
                <Button 
                  onClick={() => router.push('/productos')}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t('favorites.empty.button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30">
      <div className="container max-w-6xl mx-auto py-2 sm:py-4 md:py-6 px-3 sm:px-4">
        {/* Header optimizado para móvil */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 p-3 sm:p-4 md:p-5 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-600/20"></div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                        {totalCount === 0 ? t('favorites.headerTitle') : `${totalCount} ${t('favorites.stats.favorites')}`}
                      </h1>
                      <p className="text-xs sm:text-sm text-red-100 opacity-90">
                        {totalCount === 0 ? t('favorites.headerSubtitle') : t('favorites.headerSubtitleWithCount')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/10 text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                      onClick={() => router.back()}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">{t('favorites.buttons.back')}</span>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white text-red-600 hover:bg-red-50 h-8 sm:h-9 px-2 sm:px-3"
                      onClick={() => router.push('/productos')}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">{t('favorites.buttons.explore')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Estadísticas más compactas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-red-50 rounded-full">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('favorites.stats.favorites')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-50 rounded-full">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{sortedCategories.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('favorites.stats.categories')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-purple-50 rounded-full">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {favorites.filter(f => f.productos.stock > 0).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('favorites.stats.available')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de favoritos optimizada */}
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence>
            {sortedCategories.map((categoryKey, index) => {
              const categoryItems = itemsByCategory[categoryKey];
              const categoryInfo = categoryMap[categoryKey as keyof typeof categoryMap];
              const Icon = categoryInfo.icon;
              
              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-3"
                >
                  {/* Header de categoría más compacto */}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${categoryInfo.bgColor} border ${categoryInfo.borderColor}`}>
                    <div className={`p-2 rounded-lg ${categoryInfo.iconBg}`}>
                      <Icon className={`h-5 w-5 ${categoryInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className={`font-semibold text-base sm:text-lg ${categoryInfo.color}`}>
                        {t(`favorites.items.categories.${categoryInfo.name}`)}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {categoryItems.length} {categoryItems.length === 1 ? t('favorites.stats.product') : t('favorites.stats.products')}
                      </p>
                    </div>
                    <Badge className={`${categoryInfo.badgeColor} font-medium px-2 py-1 text-xs`}>
                      {categoryItems.length}
                    </Badge>
                  </div>
                  
                  {/* Items de la categoría */}
                  <div className="space-y-3">
                    {categoryItems.map(item => renderFavoriteItem(item))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/profile/favorites"
      />
    </div>
  );
}