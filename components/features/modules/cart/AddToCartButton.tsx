"use client";

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import AuthModal from '@/components/features/auth/AuthModal';

interface AddToCartButtonProps {
  productId: number;
  stock: number;
  price: number;
  productName: string;
  className?: string;
  showQuantitySelector?: boolean;
  showFavoriteButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AddToCartButton({
  productId,
  stock,
  price,
  productName,
  className = '',
  showQuantitySelector = true,
  showFavoriteButton = true,
  size = 'md'
}: AddToCartButtonProps) {
  const { user } = useAuth();
  const { addToCart, isLoading: cartLoading } = useCart();
  const { 
    isFavorite, 
    toggleFavorite, 
    isLoading: favoritesLoading 
  } = useFavorites();
  
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (stock === 0) {
      toast.error('Producto sin stock');
      return;
    }

    if (quantity > stock) {
      toast.error(`Solo hay ${stock} unidades disponibles`);
      return;
    }

    try {
      setIsAddingToCart(true);
      const success = await addToCart(productId, quantity);
      
      if (success) {
        // Resetear cantidad después de agregar exitosamente
        setQuantity(1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    await toggleFavorite(productId.toString());
  };

  const isProductFavorite = isFavorite(productId.toString());
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // Tamaños de botones
  const buttonSizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  return (
    <>
      <div className={`flex flex-col gap-3 ${className}`}>
        {/* Información de stock */}
        <div className="text-sm">
          {isOutOfStock ? (
            <span className="text-red-600 font-medium">Sin stock</span>
          ) : isLowStock ? (
            <span className="text-amber-600">¡Solo quedan {stock} unidades!</span>
          ) : (
            <span className="text-green-600">{stock} unidades disponibles</span>
          )}
        </div>

        {/* Selector de cantidad */}
        {showQuantitySelector && !isOutOfStock && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Cantidad:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart || cartLoading}
            className={`flex-1 ${buttonSizes[size]}`}
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <ShoppingCart className={iconSizes[size]} />
                {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
              </>
            )}
          </Button>

          {showFavoriteButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              disabled={favoritesLoading}
              className={`${buttonSizes[size]} w-auto aspect-square`}
            >
              <Heart 
                className={`${iconSizes[size]} ${
                  isProductFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`} 
              />
            </Button>
          )}
        </div>

        {/* Precio total */}
        {showQuantitySelector && quantity > 1 && (
          <div className="text-sm text-gray-600">
            Total: <span className="font-medium text-gray-900">
              ${(price * quantity).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
