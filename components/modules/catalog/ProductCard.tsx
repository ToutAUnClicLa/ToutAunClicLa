"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { addToFavorites, removeFromFavorites, isFavorite } from '@/lib/services/favorites';
import { addToCart } from '@/lib/services/cart';

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_principal: string;
  stock: number;
  rating: number;
  subcategorias: {
    nombre: string;
  };
}

interface ProductCardProps {
  product: Product;
  categoryName: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const status = await isFavorite(product.id);
      setIsFavorited(status);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [product.id]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, checkFavoriteStatus]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(product.id);
      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito');
    } finally {
      setIsLoading(false);
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
      setIsFavorited(!isFavorited);
      if (isFavorited) {
        await removeFromFavorites(product.id);
        toast.success('Eliminado de favoritos');
      } else {
        await addToFavorites(product.id);
        toast.success('Agregado a favoritos');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
      setIsFavorited(!isFavorited);
    }
  };

  return (
    <>
      <Link href={`/${categoryName}/${product.id}`}>
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col"
          whileHover={{ y: -4 }}
        >
          <div className="relative aspect-square w-full">
            <Image
              src={product.imagen_principal}
              alt={product.nombre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
            <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>

          <div className="flex flex-col flex-grow p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
              {product.nombre}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
              {product.descripcion}
            </p>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${product.precio.toFixed(2)}
                </span>
                {product.stock === 0 && (
                  <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    Sin stock
                  </span>
                )}
              </div>
              
              <Button
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={isLoading || product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? 'Sin stock' : 'Agregar'}
              </Button>
            </div>
          </div>
        </motion.div>
      </Link>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectUrl={`/${categoryName}/${product.id}`}
      />
    </>
  );
}