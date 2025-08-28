"use client";

import { useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Package, Shield, Truck, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/ui/tabs';
import {ReviewForm} from '@/components/features/modules/reviews/ReviewForm';
import {ReviewList} from '@/components/features/modules/reviews/ReviewList';
import { getProductDetail } from '@/lib/services/products';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { cn, getImageUrl, getProductImages } from '@/lib/utils';
import { getFavoriteStatus, addToFavorites, removeFromFavorites } from '@/lib/services/favorites';
import { addToCart } from '@/lib/services/cart';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/features/auth/AuthModal';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { ProductPriceDisplay } from '@/components/features/modules/catalog/ProductPriceDisplay';
import { ProductVariations } from '@/components/features/modules/product/ProductVariations';
import { ProductWithVariations, VariationSelection } from '@/types/variations';
import { hasValidVariations, formatSelectedVariations, logVariationDebug } from '@/lib/utils/variations';

// Dynamically import heavy components
const MotionImage = motion(Image);

const categoryColors = {
  productos: {
    bg: 'from-indigo-50 to-blue-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  comidas: {
    bg: 'from-amber-50 to-orange-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    button: 'bg-amber-600 hover:bg-amber-700'
  },
  boutique: {
    bg: 'from-purple-50 to-pink-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    button: 'bg-purple-600 hover:bg-purple-700'
  }
};

// Loading component
const LoadingState = () => (
  <div className="min-h-screen py-4 sm:py-6 bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="container max-w-5xl">
      <div className="animate-pulse">
        <div className="h-64 sm:h-80 bg-gray-200 rounded-lg mb-6" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

function ProductDetail({ product, colors, params }: { product: ProductWithVariations; colors: any; params: any }) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [variationSelection, setVariationSelection] = useState<VariationSelection | null>(null);
  const { user } = useAuth();
  
  // Check if product has variations
  const hasVariations = hasValidVariations(product);
  const canAddToCart = !hasVariations || (hasVariations && variationSelection?.isValid);
  const finalPrice = variationSelection?.finalPrice || product.precio;

  // Debug log for variations
  useEffect(() => {
    if (hasVariations && product.variations) {
      logVariationDebug(product.id, product.nombre, variationSelection, product.variations);
    }
  }, [product.id, product.nombre, hasVariations, product.variations, variationSelection]);

  const benefits = useMemo(() => [
    {
      icon: Package,
      title: t('catalog.productDetail.authentic'),
      description: t('catalog.productDetail.originalProduct')
    },
    {
      icon: Shield,
      title: t('catalog.productDetail.securePayment'),
      description: t('catalog.productDetail.securePayment')
    },
    {
      icon: Truck,
      title: t('catalog.productDetail.fastShipping'),
      description: "+$200"
    }
  ], [t]);

  // Memoizar las URLs de imágenes para evitar recalcular
  const imageUrls = useMemo(() => ({
    imagen_principal: product.imagen_principal,
    imagen_secundaria: product.imagen_secundaria,
    imagen_terciaria: product.imagen_terciaria
  }), [product.imagen_principal, product.imagen_secundaria, product.imagen_terciaria]);

  const images = useMemo(() => {
    return getProductImages(imageUrls);
  }, [imageUrls]);

  // Extraer IDs para dependencias estables
  const productId = product?.id;
  const userId = user?.id;

  // Verificar si el producto está en favoritos al cargar el componente
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        if (userId && productId) {
          const favoriteStatus = await getFavoriteStatus(productId);
          setIsFavorited(favoriteStatus.isFavorite);
        }
      } catch (error) {
        console.error('Error al verificar estado de favorito:', error);
      }
    };

    checkFavoriteStatus();
  }, [productId, userId]);

  const handleAddToCart = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Validate variations if product has them
    if (hasVariations && (!variationSelection || !variationSelection.isValid)) {
      toast.error('Por favor selecciona todas las opciones requeridas');
      return;
    }

    try {
      setIsLoading(true);
      
      if (hasVariations && variationSelection) {
        // Add to cart with variations
        const variations = variationSelection.variations.map(v => ({
          variationId: v.variationId,
          quantity: v.quantity
        }));
        
        console.log('🍔 Enviando producto al carrito con variaciones:', {
          productId: product.id,
          quantity,
          variations,
          finalPrice: variationSelection.finalPrice,
          totalPriceModifier: variationSelection.totalPriceModifier
        });
        
        await addToCart(product.id, quantity, undefined, variations);
        
        // Show detailed success message with variations info
        const variationNames = formatSelectedVariations(variationSelection, product.variations || []);
        
        toast.success(`${product.nombre} agregado al carrito con: ${variationNames}`);
      } else {
        // Regular add to cart without variations
        await addToCart(product.id, quantity);
        toast.success(t('catalog.productDetail.addedToCart'));
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(t('catalog.productDetail.errorAddingToCart'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVariationChange = useCallback((selection: VariationSelection) => {
    setVariationSelection(selection);
  }, []);

  const handleToggleFavorite = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const previousState = isFavorited;
    
    try {
      setIsFavorited(!previousState);
      if (previousState) {
        await removeFromFavorites(product.id);
        toast.success(t('catalog.productDetail.removedFromFavorites'));
      } else {
        await addToFavorites(product.id);
        toast.success(t('catalog.productDetail.addedToFavorites'));
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
      toast.error(t('catalog.productDetail.errorTogglingFavorite'));
      setIsFavorited(previousState); // Revertir al estado anterior
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-square rounded-lg overflow-hidden shadow">
            <AnimatePresence mode="wait">
              <MotionImage
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.nombre}
                fill
                className="object-cover"
                priority
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square rounded-md overflow-hidden",
                    selectedImage === index ? "ring-2 ring-offset-1 ring-indigo-600" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.nombre} - Vista ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          className="space-y-6 lg:space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", colors.text, colors.border)}>
                {product.subcategorias?.nombre}
              </span>
              {product.stock > 0 ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50 border border-green-100">
                  {t('catalog.productDetail.inStock')}
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-100">
                  {t('catalog.productDetail.outOfStock')}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-2">{product.nombre}</h1>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-600">
                  ({product.reviews?.length || 0})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  navigator.share({
                    title: product.nombre,
                    text: product.descripcion,
                    url: window.location.href,
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <ProductPriceDisplay 
              product={{
                ...product,
                hasVariations,
                precio: finalPrice
              }} 
              variant="detailed"
              selectedVariations={variationSelection?.variations}
              showBreakdown={hasVariations}
            />
            <p className="text-sm text-gray-600 leading-relaxed">{product.descripcion}</p>
            
            {/* Show variation count if product has variations */}
            {hasVariations && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <span>⚙️</span>
                <span>
                  {t('catalog.productDetail.optionGroupsAvailable', { count: product.variations?.length || 0 })}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 sm:p-3 rounded-lg text-center space-y-1",
                  colors.border,
                  "bg-white/50 backdrop-blur-sm"
                )}
              >
                <benefit.icon className={cn("h-4 w-4 mx-auto", colors.text)} />
                <p className="font-medium text-xs">{benefit.title}</p>
                <p className="text-[10px] text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Product Variations Section */}
          {hasVariations && product.variations && (
            <div className="py-6 border-y border-gray-200">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
                <span className="text-2xl">⚙️</span>
                Personaliza tu producto
              </h3>
              <ProductVariations
                product={product}
                onSelectionChange={handleVariationChange}
                showPriceBreakdown={true}
                className=""
              />
            </div>
          )}
          
          {/* Quantity and Stock Section */}
          <div className="space-y-6 py-6 border-y border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('catalog.productDetail.quantity')}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            {product.stock > 0 && (
              <p className="text-xs text-gray-500">
                {product.stock} {t('catalog.productDetail.unitsAvailable')}
              </p>
            )}
            
            {/* Variation selection status */}
            {hasVariations && (
              <div className="text-sm">
                {variationSelection?.isValid ? (
                  <div className="text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Opciones válidas seleccionadas</span>
                  </div>
                ) : (
                  <div className="text-amber-600 bg-amber-50 p-2 rounded-lg flex items-center gap-2">
                    <span>ℹ️</span>
                    <span>Selecciona todas las opciones requeridas para continuar</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              className={cn("flex-1 h-10", colors.button)}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isLoading || !canAddToCart}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('catalog.productCard.addingToCart')}
                </span>
              ) : product.stock === 0 ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('catalog.productCard.outOfStock')}
                </>
              ) : !canAddToCart ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Selecciona opciones
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {hasVariations ? 'Agregar personalizado' : t('catalog.productCard.addToCart')}
                  {quantity > 1 && ` (${quantity})`}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="description">{t('catalog.productDetail.description')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('catalog.productDetail.reviews')}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <h3 className="text-base font-semibold mb-2">{t('catalog.productDetail.productInfo')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.descripcion}</p>
                {product.caracteristicas && (
                  <ul className="mt-4 space-y-2">
                    {product.caracteristicas.map((caracteristica: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2 mt-1.5" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Suspense fallback={<div>{t('catalog.productDetail.loading')}</div>}>
                <ReviewForm productId={product.id.toString()} />
                <ReviewList reviews={product.reviews || []} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Related Products */}
      {product.productos_relacionados && product.productos_relacionados.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold">{t('catalog.productDetail.relatedProducts')}</h2>
            <Button variant="ghost" className="hidden sm:flex text-sm">
              {t('catalog.productDetail.seeMore')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {product.productos_relacionados.map((relatedProduct: any) => (
              <Link
                key={relatedProduct.id}
                href={`/${params.category}/${relatedProduct.id}`}
                className="group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                  <Image
                    src={getImageUrl(relatedProduct.imagen_principal)}
                    alt={relatedProduct.nombre}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-sm text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {relatedProduct.nombre}
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  ${relatedProduct.precio.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="login" 
      />
    </>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Ensure category is a string, not an array
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const colors = categoryColors[category as keyof typeof categoryColors];

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductDetail(Number(params.productId));
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    }

    if (params.productId) {
      loadProduct();
    }
  }, [params.productId]); // Solo depender del productId, no del objeto t

  if (isLoading) {
    return <LoadingState />;
  }

  if (!product) {
    return (
      <div className={cn("min-h-screen py-4 sm:py-6", colors?.bg)}>
        <div className="container max-w-5xl">
          <p className="text-center text-gray-500">{t('catalog.productDetail.productNotFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMetaTags page="product" product={product} categoryName={category} />
      <StructuredData type="product" product={product} categoryName={category} />
      <div className={cn("min-h-screen py-4 sm:py-6", colors.bg)}>
        <div className="container max-w-5xl">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-gray-900">{t('catalog.productDetail.home')}</Link>
            <ChevronRight className="h-4 w-4 mx-1 sm:mx-2 flex-shrink-0" />
            <Link href={`/${category}`} className="hover:text-gray-900 capitalize">
              {category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 sm:mx-2 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">{product.nombre}</span>
          </div>

          <ProductDetail product={product} colors={colors} params={params} />
        </div>
      </div>
    </>
  );
}