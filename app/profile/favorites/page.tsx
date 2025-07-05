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
    name: 'Productos', 
    icon: Package, 
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-100'
  },
  comidas: { 
    name: 'Comidas', 
    icon: Utensils, 
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100'
  },
  boutique: { 
    name: 'Boutique', 
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
      toast.error('Producto agotado');
      return;
    }

    setAddingToCart(prev => new Set(prev).add(item.id));
    try {
      await addToCart(item.producto_id, 1);
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error('Error al agregar al carrito');
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
      toast.success('Producto eliminado de favoritos');
    } catch (error) {
      toast.error('Error al eliminar de favoritos');
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
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <Image
                  src={item.productos.imagen_principal}
                  alt={item.productos.nombre}
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.svg';
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">Agotado</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.productos.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.productos.categorias?.nombre || 'Sin categoría'}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-indigo-600">
                        {formatPrice(item.productos.precio)}
                      </span>
                      {item.productos.stock <= 5 && item.productos.stock > 0 && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                          Solo {item.productos.stock} disponibles
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

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Agregado: {new Date(item.fecha_agregado).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/productos/${item.producto_id}`)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Ver detalles
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      disabled={isAddingToCart || isOutOfStock}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      {isAddingToCart ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isOutOfStock ? 'Agotado' : 'Agregar'}
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
                <h3 className="font-semibold text-gray-900 mb-1">Cargando favoritos...</h3>
                <p className="text-sm text-gray-600">
                  Estamos preparando tus productos favoritos
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
                <h3 className="font-bold text-2xl text-gray-900 mb-2">¡Inicia sesión!</h3>
                <p className="text-gray-600 mb-6">
                  Para ver y gestionar tus productos favoritos necesitas iniciar sesión
                </p>
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Iniciar sesión
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
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
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
                <h3 className="font-bold text-2xl text-gray-900 mb-2">Sin favoritos aún</h3>
                <p className="text-gray-600 mb-6">
                  Descubre nuestros increíbles productos y añade algunos a tus favoritos
                </p>
                <Button 
                  onClick={() => router.push('/productos')}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Explorar productos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header con estilo de la página */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">Mis Favoritos</h1>
                    <Badge className="bg-white/20 hover:bg-white/30 w-fit text-white border-white/30">
                      {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-red-100">
                    <p className="text-sm">
                      Tus productos favoritos guardados
                    </p>
                    <p className="text-xs">
                      Agrega al carrito cuando estés listo
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-full">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-sm text-gray-600">Productos favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{sortedCategories.length}</p>
                  <p className="text-sm text-gray-600">Categorías</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-full">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter(f => f.productos.stock > 0).length}
                  </p>
                  <p className="text-sm text-gray-600">Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de favoritos */}
        <div className="space-y-8">
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
                  className="space-y-4"
                >
                  {/* Header de categoría */}
                  <div className={`flex items-center gap-4 px-6 py-4 rounded-xl ${categoryInfo.bgColor} border ${categoryInfo.borderColor}`}>
                    <div className={`p-3 rounded-lg ${categoryInfo.iconBg}`}>
                      <Icon className={`h-6 w-6 ${categoryInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className={`font-bold text-xl ${categoryInfo.color}`}>
                        {categoryInfo.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {categoryItems.length} {categoryItems.length === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                    <Badge className={`${categoryInfo.badgeColor} font-semibold px-3 py-1`}>
                      {categoryItems.length}
                    </Badge>
                  </div>
                  
                  {/* Items de la categoría */}
                  <div className="space-y-4">
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