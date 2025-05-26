"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { 
  getProductsByCategory, 
  getSubcategories,
  type ProductFilters,
  Product,
  FormattedProduct,
  formatProduct
} from '@/lib/services/products';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { Button } from '@/components/common/ui/button';
import { Search, Package, ShoppingBag, Store, Truck, Shield, Clock, Filter, Utensils } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/common/ui/sheet';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

type CategoryName = 'productos' | 'comidas' | 'boutique';

const categoryColors = {
  productos: {
    bg: 'from-indigo-50 to-blue-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100'
  },
  comidas: {
    bg: 'from-amber-50 to-orange-50',
    text: 'text-amber-600',
    border: 'border-amber-100'
  },
  boutique: {
    bg: 'from-purple-50 to-pink-50',
    text: 'text-purple-600',
    border: 'border-purple-100'
  }
} as const;

const categoryIcons = {
  productos: Package,
  comidas: Utensils,
  boutique: Store
} as const;

interface ProductListProps {
  categoryId: string | number;
  categoryName: CategoryName;
  title: string;
  initialSubcategory?: number | null;
}

export function ProductList({ categoryId, categoryName, title, initialSubcategory = null }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    subcategory: initialSubcategory,
    minPrice: 0,
    maxPrice: 100,
    sortBy: 'nameAsc'
  });

  const colors = categoryColors[categoryName];
  const Icon = categoryIcons[categoryName];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const categoryIdNumber = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId;
        const [productsData, subcategoriesData] = await Promise.all([
          getProductsByCategory(categoryIdNumber, filters),
          getSubcategories(categoryIdNumber)
        ]);

        // Formatear los productos para que coincidan con la interfaz Product
        const formattedProducts = productsData.map((product: any) => ({
          id: Number(product.id),
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: Number(product.precio),
          imagen_principal: product.imagen_principal,
          stock: Number(product.stock),
          categoria_id: Number(product.categoria_id),
          subcategoria_id: Number(product.subcategoria_id),
          rating: Number(product.rating || 0),
          reviewCount: product.reviews?.length || 0,
          subcategorias: {
            nombre: product.subcategorias?.[0]?.nombre || ''
          },
          categorias: {
            nombre: product.categorias?.[0]?.nombre || ''
          },
          reviews: product.reviews || []
        }));

        setProducts(formattedProducts);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los productos. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [categoryId, filters]);

  useEffect(() => {
    if (initialSubcategory !== null) {
      setFilters(prev => ({
        ...prev,
        subcategory: initialSubcategory
      }));
    }
  }, [initialSubcategory]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Subcategorías</label>
        <Select
          value={filters.subcategory?.toString() || "all"}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            subcategory: value === "all" ? null : parseInt(value)
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las subcategorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {subcategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.id.toString()}>
                {sub.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Rango de Precios</label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
            className="w-24"
          />
          <span>-</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 0 }))}
            className="w-24"
          />
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={() => {
          setFilters({
            search: '',
            subcategory: null,
            minPrice: 0,
            maxPrice: 100,
            sortBy: 'nameAsc'
          });
          setIsFilterOpen(false);
        }}
      >
        Limpiar filtros
      </Button>
    </div>
  );

  const benefits = [
    {
      icon: Clock,
      title: "Entrega Rápida"
    },
    {
      icon: Shield,
      title: "Garantía de Calidad"
    },
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "En pedidos superiores a $200"
    }
  ];

  return (
    <div className={cn("min-h-screen py-6", colors.bg)}>
      <div className="container">
        <div className="flex items-center gap-3 mb-6">
          <Icon className={cn("h-6 w-6", colors.text)} />
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-600">
              Explora nuestra selección de productos auténticos de todas las Américas
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className={cn("p-4 rounded-lg border", colors.border)}>
              <h3 className="font-semibold mb-4">Filtros</h3>
              <FilterContent />
            </div>

            <div className={cn("p-4 rounded-lg border", colors.border)}>
              <h3 className="font-semibold mb-4">Beneficios</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <benefit.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-sm">{benefit.title}</h4>
                      <p className="text-xs text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as ProductFilters['sortBy'] }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nameAsc">Nombre (A-Z)</SelectItem>
                  <SelectItem value="nameDesc">Nombre (Z-A)</SelectItem>
                  <SelectItem value="priceAsc">Menor precio</SelectItem>
                  <SelectItem value="priceDesc">Mayor precio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl aspect-square"></div>
                    <div className="mt-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={item}>
                      <ProductCard
                        product={formatProduct(product, categoryName)}
                        categoryName={categoryName}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {products.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}