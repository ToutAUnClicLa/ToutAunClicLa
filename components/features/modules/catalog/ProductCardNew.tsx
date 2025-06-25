"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ShoppingBag, Truck, Shield, Clock, Package } from 'lucide-react';
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
import { cn, getImageUrl } from '@/lib/utils';

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
    ? Math.round(((product.precio_anterior! - product.precio) / product.precio_anterior!) * 100)
    : 0;

  // Funciones auxiliares
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

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

  // Componente de imagen del producto
  const ProductImage = () => (
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      <Image
        src={getImageUrl(product.imagen_principal)}
        alt={product.nombre}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setImageError(true)}
        sizes={
          variant === 'compact' 
            ? "(max-width: 640px) 50vw, 33vw"
            : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        }
      />
      
      {/* Overlay para productos sin stock */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Badge className="bg-white text-gray-900 font-medium">
            Sin stock
          </Badge>
        </div>
      )}

      {/* Badges superiores */}
      {showBadges && (
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <Badge className="bg-red-500 text-white text-xs font-bold">
              -{discountPercentage}%
            </Badge>
          )}
          
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-amber-500 text-white text-xs">
              ¡Solo {product.stock}!
            </Badge>
          )}
          
          {showCategory && product.categorias && (
            <Badge variant="secondary" className="text-xs">
              {product.categorias.nombre}
            </Badge>
          )}
          
          {showSubcategory && product.subcategorias && (
            <Badge variant="outline" className="text-xs bg-white/90">
              {product.subcategorias.nombre}
            </Badge>
          )}
        </div>
      )}

      {/* Rating badge */}
      {showRating && (product.averageRating || product.rating) && (
        <div className="absolute top-2 right-12 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium">
            {(product.averageRating || product.rating || 0).toFixed(1)}
          </span>
        </div>
      )}

      {/* Botón de favoritos */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
        onClick={handleToggleFavorite}
        disabled={favoritesLoading}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-colors",
            isProductFavorite 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-600'
          )} 
        />
      </Button>
    </div>
  );

  // Componente de información del producto
  const ProductInfo = () => (
    <div className="flex flex-col flex-grow space-y-2">
      <div className="flex-grow space-y-1">
        <h3 className={cn(
          "font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors",
          variant === 'compact' ? "text-sm min-h-[2rem]" : "text-base min-h-[2.5rem]"
        )}>
          {product.nombre}
        </h3>

        {showDescription && product.descripcion && variant !== 'compact' && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.descripcion}
          </p>
        )}

        {/* Rating con estrellas */}
        {showRating && (product.averageRating || product.rating) && variant !== 'compact' && (
          <div className="flex items-center gap-1">
            {getRatingStars(product.averageRating || product.rating || 0)}
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviewCount || product.estadisticas?.total_reviews || 0})
            </span>
          </div>
        )}
      </div>

      {/* Precio y información adicional */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-bold text-gray-900",
                variant === 'compact' ? "text-base" : "text-lg"
              )}>
                {formatPrice(product.precio)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.precio_anterior!)}
                </span>
              )}
            </div>
            
            {variant === 'detailed' && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Truck className="h-3 w-3" />
                  <span>Envío gratis</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Garantía</span>
                </div>
              </div>
            )}
          </div>
          
          {inCart && (
            <Badge variant="outline" className="text-xs">
              <ShoppingBag className="h-3 w-3 mr-1" />
              {cartQuantity}
            </Badge>
          )}
        </div>

        {/* Botones de acción */}
        {variant !== 'compact' && (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart || cartLoading}
              variant={inCart ? "outline" : "default"}
              size={variant === 'detailed' ? "default" : "sm"}
            >
              {isAddingToCart ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Agregando...</span>
                </div>
              ) : inCart ? (
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>En carrito</span>
                </div>
              ) : isOutOfStock ? (
                <span>Sin stock</span>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Agregar</span>
                </div>
              )}
            </Button>

            {variant === 'detailed' && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                disabled={favoritesLoading}
                className={cn(
                  "shrink-0",
                  isProductFavorite && 'border-red-300 bg-red-50'
                )}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4",
                    isProductFavorite 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600'
                  )} 
                />
              </Button>
            )}
          </div>
        )}
        
        {/* Botón compacto solo para mostrar precio */}
        {variant === 'compact' && (
          <Button
            className="w-full text-xs h-8"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart || cartLoading}
            variant={inCart ? "outline" : "default"}
          >
            {isAddingToCart ? (
              <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : inCart ? (
              <ShoppingBag className="h-3 w-3" />
            ) : (
              <ShoppingCart className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );

  // Renderizado según la variante
  const renderCard = () => {
    const cardContent = (
      <Card className={cn(
        "overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group",
        isOutOfStock && "opacity-75"
      )}>
        <ProductImage />
        <CardContent className={cn(
          "flex flex-col flex-grow",
          variant === 'compact' ? "p-3" : "p-4"
        )}>
          <ProductInfo />
        </CardContent>
      </Card>
    );

    if (variant === 'list') {
      return (
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex">
            <div className="w-48 shrink-0">
              <ProductImage />
            </div>
            <CardContent className="flex-1 p-4">
              <ProductInfo />
            </CardContent>
          </div>
        </Card>
      );
    }

    return cardContent;
  };

  return (
    <>
      <motion.div
        whileHover={{ y: variant === 'compact' ? -2 : -4 }}
        transition={{ duration: 0.2 }}
        className={cn("cursor-pointer h-full", className)}
        onClick={handleCardClick}
      >
        {onClick ? (
          renderCard()
        ) : (
          <Link href={getProductUrl()}>
            {renderCard()}
          </Link>
        )}
      </motion.div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        redirectUrl={getProductUrl()}
      />
    </>
  );
}
