"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Heart, Trash2, ShoppingCart, ChevronLeft } from 'lucide-react';
import { getFavorites, removeFromFavorites } from '@/lib/services/favorites';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface FavoriteProduct {
  id: string;
  productos: {
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
  };
  fecha_agregado: string;
}

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

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadFavorites();
    }
  }, [user, loading, router]);

  async function loadFavorites() {
    try {
      const data = await getFavorites();
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Error al cargar los favoritos');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveFavorite(productId: string) {
    try {
      await removeFromFavorites(productId);
      setFavorites(favorites.filter(fav => fav.productos.id !== productId));
      toast.success('Producto eliminado de favoritos');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Error al eliminar el producto de favoritos');
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
              className="lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold">Mis Favoritos</h1>
                <p className="text-sm text-gray-500">
                  {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes productos favoritos
              </h2>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Explora nuestro catálogo y guarda tus productos favoritos aquí para comprarlos más tarde
              </p>
              <Button onClick={() => router.push('/productos')}>
                Explorar productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favorites.map((favorite) => (
                <motion.div key={favorite.id} variants={item}>
                  <Card className="group overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-square">
                      <Image
                        src={favorite.productos.imagen_principal}
                        alt={favorite.productos.nombre}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          className="translate-y-4 group-hover:translate-y-0 transition-transform"
                          onClick={() => router.push(`/productos/${favorite.productos.id}`)}
                        >
                          Ver detalles
                        </Button>
                      </div>
                      {favorite.productos.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Sin stock
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">
                        {favorite.productos.nombre}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {favorite.productos.subcategorias.nombre}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 line-clamp-2 text-sm mb-4">
                        {favorite.productos.descripcion}
                      </p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${favorite.productos.precio.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-auto pt-4">
                      <Button
                        className="flex-1 mr-2"
                        disabled={favorite.productos.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {favorite.productos.stock === 0 ? 'Sin stock' : 'Agregar'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFavorite(favorite.productos.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}