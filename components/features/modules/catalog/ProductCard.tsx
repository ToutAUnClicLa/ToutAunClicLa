"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from '@/hooks/useTranslation';
import { Product } from '@/lib/services/products';
import AuthModal from '@/components/features/auth/AuthModal';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { cn, getImageUrl, formatPrice, isValidPrice, getDiscountPercentage } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  variant?: 'default' | 'compact' | 'detailed' | 'list';
  showCategory?: boolean;
  showRating?: boolean;
  showSubcategory?: boolean;
  showDescription?: boolean;
  showBadges?: boolean;
  className?: string;
  onClick?: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  categoryName = 'productos',
  variant = 'default',
  showCategory = true,
  showRating = true,
  showSubcategory = false,
  showDescription = true,
  showBadges = true,
  className = "",
  onClick
}: ProductCardProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { addToCart, isInCart, getProductQuantity, isLoading: cartLoading } = useCart();
  const { 
    isFavorite, 
    toggleFavorite, 
    isLoading: favoritesLoading 
  } = useFavorites();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Estados derivados del producto
  const isProductFavorite = isFavorite(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const inCart = isInCart(product.id);
  const cartQuantity = getProductQuantity(product.id);
  const hasDiscount = product.precio_anterior && product.precio_anterior > product.precio;
  const discountPercentage = hasDiscount 
    ? getDiscountPercentage(product.precio_anterior!, product.precio)
    : 0;
  const hasValidPrice = isValidPrice(product.precio);

  // Funciones auxiliares
  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        )}
      />
    ));
  };

  const getProductUrl = () => {
    if (product.subcategoria_id && categoryName === 'comidas') {
      return `/comidas/${product.subcategoria_id}/${product.id}`;
    }
    return `/${categoryName}/${product.id}`;
  };

  // Manejadores de eventos
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(product);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isOutOfStock) {
      toast.error(t('catalog.messages.outOfStock') || 'Producto sin stock');
      return;
    }

    try {
      setIsAddingToCart(true);
      const success = await addToCart(product.id, 1);
      
      if (success) {
        toast.success(t('catalog.messages.addedToCart') || 'Producto agregado al carrito');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('catalog.messages.errorAddingToCart') || 'Error al agregar al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await toggleFavorite(product.id);
      toast.success(
        isProductFavorite 
          ? t('catalog.messages.removedFromFavorites') || 'Eliminado de favoritos'
          : t('catalog.messages.addedToFavorites') || 'Agregado a favoritos'
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t('catalog.messages.errorTogglingFavorite') || 'Error al gestionar favoritos');
    }
  };

  // Versión compacta del card
  if (variant === 'compact') {
    return (
      <>
        <motion.div
          whileHover={{ y: -2 }}
          className={cn("group cursor-pointer", className)}
        >
          <Link href={getProductUrl()}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="relative aspect-square">                  <Image
                    src={getImageUrl(product.imagen_principal)}
                    alt={product.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                
                {/* Badges */}
                {showBadges && (
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1">
                    {isOutOfStock && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        Sin stock
                      </Badge>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs px-1 py-0">
                        ¡Solo {product.stock}!
                      </Badge>
                    )}
                    {hasDiscount && (
                      <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                        -{discountPercentage}%
                      </Badge>
                    )}
                  </div>
                )}

                {/* Favorite button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={handleToggleFavorite}
                  disabled={favoritesLoading}
                >
                  <Heart 
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4",
                      isProductFavorite 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    )} 
                  />
                </Button>
              </div>

              <div className="p-2 sm:p-3">
                <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-2 min-h-[2rem] sm:min-h-[2.5rem]">{product.nombre}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.precio_anterior!)}
                      </span>
                    )}
                    <span className={cn(
                      "font-bold text-sm sm:text-base",
                      hasValidPrice ? "text-primary" : "text-gray-500"
                    )}>
                      {formatPrice(product.precio)}
                    </span>
                    {!hasValidPrice && (
                      <span className="text-xs text-amber-600">
                        Consultar precio
                      </span>
                    )}
                  </div>
                  {inCart && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {cartQuantity}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          redirectUrl={getProductUrl()}
        />
      </>
    );
  }

  // Versión por defecto y detallada
  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn("group cursor-pointer h-full", className)}
        onClick={handleCardClick}
      >
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          <Link href={getProductUrl()}>
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src={getImageUrl(product.imagen_principal)}
                alt={product.nombre}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              
              {/* Overlay para productos sin stock */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-900">
                    Sin stock
                  </span>
                </div>
              )}

              {/* Badges superiores */}
              {showBadges && (
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex flex-col gap-1">
                  {isLowStock && !isOutOfStock && (
                    <Badge className="bg-amber-500 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">
                      ¡Solo {product.stock}!
                    </Badge>
                  )}
                  
                  {hasDiscount && (
                    <Badge className="bg-green-500 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  
                  {showCategory && product.categorias && (
                    <Badge variant="outline" className="bg-white/90 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 hidden sm:flex">
                      {product.categorias.nombre}
                    </Badge>
                  )}
                  
                  {showSubcategory && product.subcategorias && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 hidden sm:flex">
                      {product.subcategorias.nombre}
                    </Badge>
                  )}
                </div>
              )}

              {/* Rating badge */}
              {showRating && (product.averageRating || product.rating) && (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white/90 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                  <span className="text-[10px] sm:text-xs font-medium">
                    {(product.averageRating || product.rating || 0).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </Link>

          <CardContent className="p-2 sm:p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-1 sm:space-y-2">
              <Link href={getProductUrl()}>
                <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors text-xs sm:text-sm lg:text-base leading-tight min-h-[2rem] sm:min-h-[2.5rem]">
                  {product.nombre}
                </h3>
              </Link>

              {variant === 'detailed' && showDescription && product.descripcion && (
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 hidden sm:block">
                  {product.descripcion}
                </p>
              )}

              {/* Rating estrellas */}
              {showRating && (product.averageRating || product.rating) && (
                <div className="hidden sm:flex items-center gap-1">
                  {getRatingStars(product.averageRating || product.rating || 0)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviewCount || product.estadisticas?.total_reviews || 0})
                  </span>
                </div>
              )}
            </div>

            <div className="mt-auto space-y-2 sm:space-y-3">
              {/* Precio y estado del carrito */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {hasDiscount && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      {formatPrice(product.precio_anterior!)}
                    </span>
                  )}
                  <span className={cn(
                    "font-bold text-sm sm:text-lg lg:text-xl",
                    hasValidPrice ? "text-primary" : "text-gray-500"
                  )}>
                    {formatPrice(product.precio)}
                  </span>
                  {!hasValidPrice && (
                    <span className="text-[10px] sm:text-xs text-amber-600">
                      Consultar precio
                    </span>
                  )}
                </div>
                
                {inCart && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px] sm:text-xs px-1 sm:px-2">
                    {cartQuantity} en carrito
                  </Badge>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-1 sm:gap-2">
                <Button
                  className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart || cartLoading || !hasValidPrice}
                  variant={inCart ? "outline" : "default"}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Agregando...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : inCart ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">En carrito</span>
                    </div>
                  ) : isOutOfStock ? (
                    <span className="text-xs sm:text-sm">Sin stock</span>
                  ) : !hasValidPrice ? (
                    <span className="text-xs sm:text-sm">Consultar</span>
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Agregar</span>
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={favoritesLoading}
                  className={cn(
                    "h-8 w-8 sm:h-10 sm:w-10",
                    isProductFavorite && 'border-red-300 bg-red-50'
                  )}
                >
                  <Heart 
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4",
                      isProductFavorite 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    )} 
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        redirectUrl={getProductUrl()}
      />
    </>
  );
}
