"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Grid, List, Filter, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';
import { Input } from '@/components/common/ui/input';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ProductCard } from '@/components/features/modules/catalog/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { Product } from '@/lib/services/products';
import { FavoriteProduct } from '@/lib/services/favorites';
import { getImageUrl } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortBy = 'recent' | 'name' | 'price-low' | 'price-high';
type FilterBy = 'all' | 'available' | 'out-of-stock' | 'discontinued';

// Función para convertir FavoriteProduct a Product para compatibilidad con ProductCard
const convertFavoriteToProduct = (favoriteProduct: FavoriteProduct): Product => {
  const product: Product = {
    id: favoriteProduct.id,
      nombre: favoriteProduct.nombre,
      descripcion: '', // FavoriteProduct no tiene descripción
      precio: favoriteProduct.precio,
      stock: favoriteProduct.stock,
      imagen_principal: getImageUrl(favoriteProduct.imagen_principal),
      categoria_id: 0, // Default value
      fecha_creacion: new Date().toISOString(), // Default value
      activo: favoriteProduct.activo ?? true,
      imagenes: [],
      rating: 0,
      reviewCount: 0,
      categorias: favoriteProduct.categorias ? {
        id: 0,
        nombre: favoriteProduct.categorias.nombre
      } : {
        id: 0,
        nombre: 'Sin categoría'
      }
    };
    
    return product;
  };

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { 
    favorites, 
    isLoading, 
    error, 
    pagination, 
    loadFavorites,
    removeFromFavorites,
    isEmpty,
    totalCount 
  } = useFavorites();
  const { addToCart } = useCart();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar favoritos al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites(currentPage);
    }
  }, [isAuthenticated, currentPage, loadFavorites]);

  // Filtrar y ordenar favoritos
  const filteredAndSortedFavorites = favorites
    .filter(favorite => {
      // Filtro por búsqueda
      const matchesSearch = favorite.productos.nombre
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Filtro por estado
      if (filterBy === 'all') return true;
      if (filterBy === 'available') return favorite.productos.stock > 0 && favorite.productos.activo !== false;
      if (filterBy === 'out-of-stock') return favorite.productos.stock === 0 && favorite.productos.activo !== false;
      if (filterBy === 'discontinued') return favorite.productos.activo === false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime();
        case 'name':
          return a.productos.nombre.localeCompare(b.productos.nombre);
        case 'price-low':
          return a.productos.precio - b.productos.precio;
        case 'price-high':
          return b.productos.precio - a.productos.precio;
        default:
          return 0;
      }
    });

  const handleRemoveFromFavorites = async (productId: number) => {
    await removeFromFavorites(productId);
  };

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockBadge = (product: any) => {
    if (product.activo === false) {
      return <Badge variant="secondary" className="bg-gray-500">Descontinuado</Badge>;
    }
    if (product.stock === 0) {
      return <Badge variant="destructive">Sin stock</Badge>;
    }
    if (product.stock <= 5) {
      return <Badge variant="secondary" className="bg-amber-500">Poco stock</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-500">Disponible</Badge>;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900">
            Inicia sesión para ver tus favoritos
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Debes estar autenticado para acceder a tu lista de favoritos
          </p>
          <Link href="/auth/login">
            <Button className="bg-red-500 hover:bg-red-600">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Error al cargar favoritos
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {error}
          </p>
          <Button onClick={() => loadFavorites(1)} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mis Favoritos
                </h1>
                <p className="text-gray-600">
                  {totalCount} productos guardados
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Status */}
            <Select value={filterBy} onValueChange={(value: FilterBy) => setFilterBy(value)}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="out-of-stock">Sin stock</SelectItem>
                <SelectItem value="discontinued">Descontinuados</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort by */}
            <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
              <SelectTrigger>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFilterBy('all');
                setSortBy('recent');
              }}
              className="w-full"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Content */}
        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center space-y-6">
              <Heart className="w-24 h-24 mx-auto text-gray-300" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {searchQuery || filterBy !== 'all' 
                    ? 'No se encontraron resultados' 
                    : 'Tu lista de favoritos está vacía'
                  }
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchQuery || filterBy !== 'all'
                    ? 'Intenta con otros filtros o términos de búsqueda'
                    : 'Explora nuestros productos y guarda tus favoritos aquí'
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(searchQuery || filterBy !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterBy('all');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
                <Link href="/productos">
                  <Button className="bg-red-500 hover:bg-red-600">
                    Explorar productos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Products Grid/List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${filteredAndSortedFavorites.length}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredAndSortedFavorites.map((favorite) => (
                  <motion.div
                    key={favorite.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard
                      product={convertFavoriteToProduct(favorite.productos)}
                      className={viewMode === 'list' ? 'flex-row h-32' : ''}
                      showCategory={true}
                      showRating={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando {((currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} productos
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={pagination.currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      {currentPage} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}