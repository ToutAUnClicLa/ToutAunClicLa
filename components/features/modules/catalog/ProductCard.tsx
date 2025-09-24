"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
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
import { cn, getProductImageUrl, getBlurDataURL, formatPrice, isValidPrice, getDiscountPercentage, calculateCanadianTaxes, getTaxStatus } from '@/lib/utils';
import { ProductPriceDisplay } from './ProductPriceDisplay';
import { ProductWithVariations } from '@/types/variations';
import { getRestaurantUrlWithFallback } from '@/lib/utils/restaurant-routes';

interface ProductCardProps {
  product: Product & Partial<ProductWithVariations>;
  categoryName?: string;
  variant?: 'default' | 'compact' | 'detailed' | 'list';
  showCategory?: boolean;
  showRating?: boolean;
  showSubcategory?: boolean;
  showDescription?: boolean;
  showBadges?: boolean;
  className?: string;
  onClick?: (product: Product) => void;
  restaurantStatus?: {
    abierto: boolean;
    disponible: boolean;
  };
  restaurantLoading?: boolean;
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
  onClick,
  restaurantStatus,
  restaurantLoading = false
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
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  // Estados derivados del producto - memoización optimizada
  // Separar lógica base del producto de lógica de restaurante
  const productBaseData = useMemo(() => {
    const productIdStr = product.id.toString();
    const isProductFavorite = isFavorite(productIdStr);
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const inCart = isInCart(product.id);
    const cartQuantity = getProductQuantity(product.id);
    const hasDiscount = product.precio_anterior && product.precio_anterior > product.precio;
    const discountPercentage = hasDiscount
      ? getDiscountPercentage(product.precio_anterior!, product.precio)
      : 0;
    const hasValidPrice = isValidPrice(product.precio);
    const hasVariations = product.hasVariations || (product.variations && product.variations.length > 0);
    const isProductNotAvailableToday = product.disponible_hoy === false;

    // Cálculo de impuestos canadienses
    const taxCalculation = calculateCanadianTaxes(product.precio, product.TPS, product.TVQ, product.consigne);
    const taxStatus = getTaxStatus(product.categoria_id, product.TPS, product.TVQ, product.consigne);

    return {
      productIdStr,
      isProductFavorite,
      isOutOfStock,
      isLowStock,
      inCart,
      cartQuantity,
      hasDiscount,
      discountPercentage,
      hasValidPrice,
      hasVariations,
      isProductNotAvailableToday,
      taxCalculation,
      taxStatus
    };
  }, [
    product.id,
    product.stock,
    product.precio,
    product.precio_anterior,
    product.categoria_id,
    product.TPS,
    product.TVQ,
    product.consigne,
    product.hasVariations,
    product.variations,
    product.disponible_hoy,
    isFavorite,
    isInCart,
    getProductQuantity
  ]);

  // Lógica de restaurante separada - solo recalcula cuando cambia el estado del restaurante
  const restaurantData = useMemo(() => {
    const isRestaurantCheckRequired = categoryName === 'comidas';
    const isRestaurantClosed = restaurantStatus ? (!restaurantStatus.abierto || !restaurantStatus.disponible) : false;
    const isRestaurantDataLoading = isRestaurantCheckRequired && restaurantLoading;
    const restaurantCheckPassed = !isRestaurantCheckRequired || (!restaurantLoading && !isRestaurantClosed);

    return {
      isRestaurantClosed,
      isRestaurantDataLoading,
      restaurantCheckPassed
    };
  }, [categoryName, restaurantStatus, restaurantLoading]);

  // Combinar datos base con datos de restaurante
  const productData = useMemo(() => {
    const canAddToCart = !productBaseData.isOutOfStock &&
                        !productBaseData.isProductNotAvailableToday &&
                        restaurantData.restaurantCheckPassed &&
                        product.precio > 0;

    return {
      ...productBaseData,
      ...restaurantData,
      canAddToCart
    };
  }, [productBaseData, restaurantData, product.precio]);

  // Funciones auxiliares

  const getProductUrl = () => {
    // Si es un producto de comidas, SIEMPRE usar ruta de restaurante
    if (categoryName === 'comidas') {
      if (product.subcategorias?.nombre) {
        const restaurantUrl = getRestaurantUrlWithFallback(product.subcategorias.nombre);
        return `${restaurantUrl}/${product.id}`;
      } else {
        // Si no tiene restaurante, usar la ruta de categoria/productId genérica
        return `/${categoryName}/${product.id}`;
      }
    }
    
    // Para productos y boutique, usar la estructura estándar
    if (categoryName === 'productos' || categoryName === 'boutique') {
      return `/productos/${product.id}`;
    }
    
    // Para otras categorías, usar la estructura estándar: /categoria/productId
    return `/${categoryName}/${product.id}`;
  };

  // Manejadores de eventos
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(product);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, quantity = quantityToAdd) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!productData.canAddToCart) {
      if (productData.isOutOfStock) {
        toast.error(t('catalog.addToCartButton.productOutOfStock'));
      } else if (productData.isProductNotAvailableToday) {
        toast.error(t('catalog.addToCartButton.productNotAvailableToday'));
      } else if (productData.isRestaurantClosed) {
        toast.error(t('catalog.addToCartButton.restaurantClosed'));
      }
      return;
    }

    try {
      setIsAddingToCart(true);
      const success = await addToCart(product.id, quantity);
      
      if (success) {
        toast.success(t('catalog.addToCartButton.addedToCart'));
        // Reset quantity to 1 after successful add
        setQuantityToAdd(1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('catalog.addToCartButton.errorAddingToCart'));
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
      await toggleFavorite(productData.productIdStr);
      toast.success(
        productData.isProductFavorite 
          ? t('catalog.messages.removedFromFavorites')
          : t('catalog.messages.addedToFavorites')
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t('catalog.messages.errorTogglingFavorite'));
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
                    src={getProductImageUrl(product.imagen_principal, 'small')}
                    alt={product.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-300"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 640px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL()}
                    loading="lazy"
                  />
                
                {/* Badges */}
                {showBadges && (
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1">
                    {productData.isOutOfStock && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        {t('catalog.productCard.outOfStock')}
                      </Badge>
                    )}
                    {productData.isLowStock && !productData.isOutOfStock && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs px-1 py-0">
                        {t('catalog.productCard.limitedStockUnits').replace('{stock}', product.stock.toString())}
                      </Badge>
                    )}
                    {productData.hasDiscount && (
                      <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                        -{productData.discountPercentage}%
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
                      productData.isProductFavorite 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    )} 
                  />
                </Button>
              </div>

              <div className="p-2 sm:p-3">
                <h3 className="font-medium text-sm sm:text-sm lg:text-xs mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2}}>{product.nombre}</h3>
                <div className="flex items-center justify-between">
                  <ProductPriceDisplay 
                    product={product} 
                    variant="compact" 
                    className="flex-1"
                  />
                  {productData.inCart && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {productData.cartQuantity}
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
      <Link href={getProductUrl()} className="block h-full">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className={cn("group cursor-pointer h-full", className)}
        >
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={getProductImageUrl(product.imagen_principal, 'medium')}
                alt={product.nombre}
                fill
                className="object-cover transition-all duration-300"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL={getBlurDataURL()}
                loading="lazy"
              />
              
              {/* Overlay para productos sin stock */}
              {productData.isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-900">
                    {t('catalog.productCard.outOfStock')}
                  </span>
                </div>
              )}

              {/* Badges superiores */}
              {showBadges && (
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex flex-col gap-1">
                  {productData.isLowStock && !productData.isOutOfStock && (
                    <Badge className="bg-amber-500 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">
                      {t('catalog.productCard.limitedStockUnits').replace('{stock}', product.stock.toString())}
                    </Badge>
                  )}
                  
                  {productData.hasDiscount && (
                    <Badge className="bg-green-500 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">
                      -{productData.discountPercentage}%
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
              {showRating && (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white/90 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                  {(product.averageRating || product.rating) && ((product.averageRating || 0) > 0 || (product.rating || 0) > 0) && (
                    <span className="text-[10px] sm:text-xs font-medium">
                      {(product.averageRating || product.rating || 0).toFixed(1)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <CardContent className="p-2 sm:p-4 flex flex-col flex-grow">
              <div className="flex-grow space-y-1 sm:space-y-2">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-sm lg:text-sm leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2}}>
                  {product.nombre}
                </h3>

                {/* Mostrar descripción siempre para variantes no compactas */}
                {(variant === 'default' || variant === 'detailed' || variant === 'list') && showDescription && (
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {product.descripcion || 'Sin descripción disponible'}
                  </p>
                )}
              </div>

              <div className="mt-auto space-y-2 sm:space-y-3">
              {/* Precio y estado del carrito */}
              <div className="flex items-center justify-between">
                <ProductPriceDisplay 
                  product={product} 
                  variant="default" 
                  className="flex-1"
                />
                
                {productData.inCart && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px] sm:text-xs px-1 sm:px-2">
                    {productData.cartQuantity} en carrito
                  </Badge>
                )}
              </div>

              {/* Selector de cantidad */}
              {(productData.canAddToCart || productData.isRestaurantDataLoading) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">{t('catalog.addToCartButton.quantity')}:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantityToAdd(Math.max(1, quantityToAdd - 1));
                      }}
                      disabled={quantityToAdd <= 1 || productData.isRestaurantDataLoading}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-r-none"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium min-w-[2rem] text-center">
                      {productData.isRestaurantDataLoading ? '-' : quantityToAdd}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantityToAdd(Math.min(product.stock, quantityToAdd + 1));
                      }}
                      disabled={quantityToAdd >= product.stock || productData.isRestaurantDataLoading}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-l-none"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-[0.25rem]">
                <Button
                  className="text-xs sm:text-sm h-8 sm:h-10"
                  onClick={handleAddToCart}
                  disabled={!productData.canAddToCart || isAddingToCart || cartLoading || productData.isRestaurantDataLoading}
                  variant={productData.inCart ? "outline" : productData.isRestaurantDataLoading ? "outline" : "default"}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">{t('catalog.addToCartButton.addingToCart')}</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : productData.isRestaurantDataLoading ? (
                    <div className="flex items-center gap-1 sm:gap-2 text-white">
                      <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline text-xs sm:text-sm">{t('catalog.addToCartButton.checkingRestaurant')}</span>
                      <span className="sm:hidden text-[10px]">...</span>
                    </div>
                  ) : productData.isOutOfStock ? (
                    <div className="flex items-center gap-1 sm:gap-2 justify-center min-w-0">
                      <span className="text-[10px] sm:text-xs truncate">{t('catalog.addToCartButton.outOfStock')}</span>
                    </div>
                  ) : productData.isProductNotAvailableToday ? (
                    <div className="flex items-center gap-1 sm:gap-2 justify-center min-w-0">
                      <span className="text-[10px] sm:text-xs truncate">{t('catalog.addToCartButton.productNotAvailableToday')}</span>
                    </div>
                  ) : productData.isRestaurantClosed ? (
                    <div className="flex items-center gap-1 justify-center min-w-0">
                      <span className="text-[10px] sm:text-xs truncate">{t('catalog.addToCartButton.restaurantClosed')}</span>
                    </div>
                  ) : product.precio === 0 ? (
                    <div className="flex items-center gap-1 sm:gap-2 justify-center min-w-0">
                      <span className="text-[10px] sm:text-xs truncate">{t('catalog.price.notAvailable')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline text-xs sm:text-sm">
                        {t('catalog.addToCartButton.addToCart')} {quantityToAdd > 1 ? `(${quantityToAdd})` : ''}
                      </span>
                      <span className="sm:hidden text-[10px]">
                        +{quantityToAdd}
                      </span>
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={favoritesLoading}
                  className={cn(
                    "h-8 w-[1.75rem] sm:h-10 sm:w-[2rem] flex-shrink-0",
                    productData.isProductFavorite && 'border-red-300 bg-red-50'
                  )}
                >
                  <Heart 
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4",
                      productData.isProductFavorite 
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
      </Link>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        redirectUrl={getProductUrl()}
      />
    </>
  );
}
