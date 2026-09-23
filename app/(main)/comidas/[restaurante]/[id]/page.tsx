"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Package, Shield, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewForm } from '@/components/features/modules/reviews/ReviewForm';
import { ReviewList } from '@/components/features/modules/reviews/ReviewList';
import { getProductDetail } from '@/lib/services/products';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { cn, getImageUrl, getProductImages } from '@/lib/utils';
import { getFavoriteStatus, addToFavorites, removeFromFavorites } from '@/lib/services/favorites';
import { addToCart } from '@/lib/services/cart';
import { useAuth } from '@/hooks/useAuth';
import { loginPath } from '@/lib/shop-auth';
import { StructuredData } from '@/components/seo/StructuredData';
import { SEOMetaTags } from '@/components/seo/SEOMetaTags';
import { ProductPriceDisplay } from '@/components/features/modules/catalog/ProductPriceDisplay';
import { getRestaurantNameFromSlug, isProductFromRestaurant } from '@/lib/utils/restaurant-routes';
import { useRestaurantDetails } from '@/hooks/useRestaurantDetails';
import { shopChrome, shopSection } from '@/lib/shop-theme';

const LoadingState = () => (
  <div className="min-h-screen bg-white py-8 sm:py-12">
    <div className="container max-w-5xl">
      <div className="animate-pulse">
        <div className="mb-6 h-64 rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] sm:h-80" />
        <div className="mb-3 h-6 w-1/2 rounded bg-[var(--shop-canvas-muted)]" />
        <div className="mb-6 h-4 w-1/4 rounded bg-[var(--shop-canvas-muted)]" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-[var(--shop-canvas-muted)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--shop-canvas-muted)]" />
        </div>
      </div>
    </div>
  </div>
);

function ProductDetail({ product, params, onReviewDeleted }: {
  product: any;
  params: any;
  onReviewDeleted: (reviewId: string) => void;
}) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [favBusy, setFavBusy] = useState(false);

  const restaurantName = getRestaurantNameFromSlug(params.restaurante);
  const { restaurant, loading: restaurantLoading } = useRestaurantDetails(restaurantName || '');

  const isProductNotAvailableToday = product.disponible_hoy === false;
  const isRestaurantClosed = restaurant ? (!restaurant.abierto || !restaurant.disponible) : false;
  const isOutOfStock = product.stock === 0;
  const isRestaurantDataLoading = restaurantLoading;

  const canAddToCart = !isOutOfStock && !isProductNotAvailableToday && !isRestaurantClosed &&
    !isRestaurantDataLoading;
  const finalPrice = product.precio;

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

  const imageUrls = useMemo(() => ({
    imagen_principal: product.imagen_principal,
    imagen_secundaria: product.imagen_secundaria,
    imagen_terciaria: product.imagen_terciaria
  }), [product.imagen_principal, product.imagen_secundaria, product.imagen_terciaria]);

  const images = useMemo(() => {
    return getProductImages(imageUrls);
  }, [imageUrls]);

  const productId = product?.id;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !productId) {
        setIsFavorited(false);
        return;
      }
      try {
        const favoriteStatus = await getFavoriteStatus(Number(productId));
        setIsFavorited(Boolean(favoriteStatus?.isFavorite));
      } catch (error) {
        console.error('Error al verificar estado de favorito:', error);
      }
    };

    checkFavoriteStatus();
  }, [productId, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(loginPath(pathname));
      return;
    }

    if (!canAddToCart) {
      if (isOutOfStock) {
        toast.error(t('catalog.addToCartButton.productOutOfStock'));
      } else if (isProductNotAvailableToday) {
        toast.error(t('catalog.addToCartButton.productNotAvailableToday'));
      } else if (isRestaurantClosed) {
        toast.error(t('catalog.addToCartButton.restaurantClosed'));
      }
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(product.id, quantity);
      toast.success(t('catalog.productDetail.addedToCart'));
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(t('catalog.productDetail.errorAddingToCart'));
    } finally {
      setIsLoading(false);
    }
  };

  const alreadyFavorite = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err ?? '');
    return /ya está|already/i.test(msg);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user) {
      router.push(loginPath(pathname));
      return;
    }
    if (favBusy) return;

    const id = Number(product.id);
    const previousState = isFavorited;
    setFavBusy(true);
    setIsFavorited(!previousState);

    try {
      if (previousState) {
        await removeFromFavorites(id);
        toast.success(t('catalog.productDetail.removedFromFavorites'));
      } else {
        try {
          await addToFavorites(id);
          toast.success(t('catalog.productDetail.addedToFavorites'));
        } catch (addErr) {
          if (alreadyFavorite(addErr)) {
            await removeFromFavorites(id);
            setIsFavorited(false);
            toast.success(t('catalog.productDetail.removedFromFavorites'));
          } else {
            throw addErr;
          }
        }
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
      toast.error(t('catalog.productDetail.errorTogglingFavorite'));
      setIsFavorited(previousState);
    } finally {
      setFavBusy(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.nombre,
        text: product.descripcion,
        url: window.location.href,
      });
    } catch {
      // user cancelled or share unsupported
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)]">
            <Image
              key={selectedImage}
              src={images[selectedImage]}
              alt={product.nombre}
              fill
              className="object-cover"
              priority
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border border-[var(--shop-hairline)]",
                    shopChrome.tap,
                    shopSection.food.focus,
                    selectedImage === index
                      ? "ring-2 ring-[var(--food-accent)] ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.nombre} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:space-y-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {product.subcategorias?.nombre ? (
                <span className={cn(shopChrome.filterChip, 'border-transparent', shopSection.food.tile, shopSection.food.icon)}>
                  {product.subcategorias.nombre}
                </span>
              ) : null}
              {product.stock > 0 ? (
                <span className={cn(shopChrome.filterChip, 'text-emerald-700')}>
                  {t('catalog.productDetail.inStock')}
                </span>
              ) : (
                <span className={cn(shopChrome.filterChip, 'text-red-600')}>
                  {t('catalog.productDetail.outOfStock')}
                </span>
              )}
            </div>

            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--shop-ink)] sm:text-3xl">
              {product.nombre}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (product.rating || 0) ? 'fill-[var(--food-accent)] text-[var(--food-accent)]' : 'text-[var(--shop-hairline)]'
                      }`}
                  />
                ))}
                <span className="ml-1 text-xs text-[var(--shop-muted)]">
                  ({product.reviews?.length || 0})
                </span>
              </div>
              <button
                type="button"
                className={shopSection.food.iconBtn}
                onClick={handleShare}
                aria-label={t('catalog.productDetail.shareProduct')}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <ProductPriceDisplay
              product={{
                ...product,
                precio: finalPrice
              }}
              variant="detailed"
            />
            <p className="text-sm leading-relaxed text-[var(--shop-muted)]">{product.descripcion}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-center gap-1.5 rounded-xl border border-[var(--shop-hairline)] bg-white px-1.5 py-2 sm:flex-col sm:gap-1 sm:p-3 sm:text-center"
              >
                <benefit.icon className={cn("h-4 w-4 shrink-0", shopSection.food.icon)} />
                <p className="text-[10px] font-medium leading-tight text-[var(--shop-ink)] sm:text-xs">{benefit.title}</p>
                <p className="hidden text-[10px] text-[var(--shop-muted)] sm:block">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 border-y border-[var(--shop-hairline)] py-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--shop-ink)]">{t('catalog.productDetail.quantity')}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={cn(shopSection.food.iconBtn, 'rounded-full border border-[var(--shop-hairline)]')}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isRestaurantDataLoading}
                  aria-label={t('catalog.productDetail.decrease')}
                >
                  -
                </button>
                <span className="w-8 text-center text-sm text-[var(--shop-ink)]">{isRestaurantDataLoading ? '-' : quantity}</span>
                <button
                  type="button"
                  className={cn(shopSection.food.iconBtn, 'rounded-full border border-[var(--shop-hairline)]')}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isRestaurantDataLoading}
                  aria-label={t('catalog.productDetail.increase')}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className={cn("flex-1", shopChrome.aisleCta, shopSection.food.cta, shopSection.food.focus)}
              onClick={handleAddToCart}
              disabled={!canAddToCart || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('catalog.productCard.addingToCart')}
                </span>
              ) : isRestaurantDataLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('catalog.addToCartButton.checkingRestaurant')}
                </span>
              ) : isOutOfStock ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('catalog.addToCartButton.outOfStock')}
                </>
              ) : isProductNotAvailableToday ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('catalog.addToCartButton.productNotAvailableToday')}
                </>
              ) : isRestaurantClosed ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('catalog.addToCartButton.restaurantClosed')}
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('catalog.productCard.addToCart')}
                  {quantity > 1 && ` (${quantity})`}
                </>
              )}
            </button>
            <button
              type="button"
              className={cn(shopSection.food.iconBtn, 'rounded-full border border-[var(--shop-hairline)]')}
              onClick={handleToggleFavorite}
              disabled={favBusy}
              aria-label={isFavorited ? t('catalog.productDetail.removeFromFavorites') : t('catalog.productDetail.addToFavorites')}
            >
              <Heart
                className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>

          <div className="mt-8 border-t border-[var(--shop-hairline)] pt-6">
            <h3 className="mb-4 text-lg font-semibold text-[var(--shop-ink)]">{t('catalog.productDetail.reviews')}</h3>
            <Suspense fallback={<div className="text-sm text-[var(--shop-muted)]">{t('catalog.productDetail.loading')}</div>}>
              <ReviewForm productId={product.id.toString()} />
              <ReviewList
                reviews={product.reviews || []}
                onReviewDeleted={onReviewDeleted}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {product.productos_relacionados && product.productos_relacionados.length > 0 && (
        <div className="mt-10 sm:mt-14">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-[var(--shop-ink)] sm:mb-6 sm:text-xl">
            {t('catalog.productDetail.relatedProducts')}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {product.productos_relacionados.map((relatedProduct: any) => (
              <Link
                key={relatedProduct.id}
                href={`/comidas/${params.restaurante}/${relatedProduct.id}`}
                className={cn('group', shopSection.food.focus)}
              >
                <div className="relative mb-2 aspect-square overflow-hidden rounded-xl border border-[var(--shop-hairline)]">
                  <Image
                    src={getImageUrl(relatedProduct.imagen_principal)}
                    alt={relatedProduct.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className={cn('line-clamp-2 text-sm font-medium text-[var(--shop-ink)]', shopSection.food.hoverText)}>
                  {relatedProduct.nombre}
                </h3>
                <p className="mt-1 text-xs text-[var(--shop-muted)]">
                  ${relatedProduct.precio.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function RestaurantProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const handleReviewDeleted = (deletedReviewId: string) => {
    if (product && product.reviews) {
      setProduct({
        ...product,
        reviews: product.reviews.filter((review: any) => review.id !== deletedReviewId)
      });
    }
  };

  const restaurantSlug = Array.isArray(params.restaurante) ? params.restaurante[0] : params.restaurante;
  const restaurantName = getRestaurantNameFromSlug(restaurantSlug);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductDetail(Number(params.id));

        if (!isProductFromRestaurant(data, restaurantName || '')) {
          toast.error(t('notifications.productNotFromRestaurant'));
          router.push('/comidas');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error(t('notifications.loadError'));
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id && restaurantName) {
      loadProduct();
    }
  }, [params.id, restaurantName, router, t]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-8 sm:py-12">
        <div className="container max-w-5xl">
          <p className="text-center text-[var(--shop-muted)]">{t('catalog.productDetail.productNotFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMetaTags page="product" product={product} categoryName="comidas" />
      <StructuredData type="product" product={product} categoryName="comidas" />
      <div className="min-h-screen bg-white py-6 text-[var(--shop-ink)] sm:py-10">
        <div className="container max-w-5xl">
          <nav className="mb-6 flex items-center overflow-x-auto whitespace-nowrap text-xs text-[var(--shop-muted)] sm:mb-8 sm:text-sm">
            <Link href="/" className={cn(shopSection.food.hoverText, shopSection.food.focus)}>
              {t('catalog.productDetail.home')}
            </Link>
            <ChevronRight className="mx-1 h-4 w-4 shrink-0 sm:mx-2" aria-hidden />
            <Link href="/comidas" className={cn(shopSection.food.hoverText, shopSection.food.focus)}>
              {t('nav.foods')}
            </Link>
            <ChevronRight className="mx-1 h-4 w-4 shrink-0 sm:mx-2" aria-hidden />
            <Link href={`/comidas/${restaurantSlug}`} className={cn(shopSection.food.hoverText, shopSection.food.focus)}>
              {restaurantName}
            </Link>
            <ChevronRight className="mx-1 h-4 w-4 shrink-0 sm:mx-2" aria-hidden />
            <span className="truncate font-medium text-[var(--shop-ink)]">{product.nombre}</span>
          </nav>

          <ProductDetail
            product={product}
            params={params}
            onReviewDeleted={handleReviewDeleted}
          />
        </div>
      </div>
    </>
  );
}
