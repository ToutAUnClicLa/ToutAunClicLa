"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, ShoppingBag, Plus, X, Package, Utensils, Store } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useFavoritesList } from '@/hooks/useFavoritesList';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE } from '@/lib/shop-profile';
import { addToCart } from '@/lib/services/cart';
import { removeFromFavorites, FavoriteItem } from '@/lib/services/favorites';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ProfileCard,
  ProfilePageHeader,
  ProfileFavoritesSkeleton,
  profileCtaClass,
  profileOutlineClass,
} from '@/components/features/profile/ProfileChrome';
import { cn } from '@/lib/utils';

const categoryMap = {
  productos: { name: 'productos', icon: Package },
  comidas: { name: 'comidas', icon: Utensils },
  boutique: { name: 'boutique', icon: Store },
};

const getItemCategory = (item: FavoriteItem): string => {
  const categoryName = item.productos.categorias?.nombre?.toLowerCase() || '';
  if (categoryName.includes('comida') || categoryName.includes('food') || categoryName.includes('snack')) {
    return 'comidas';
  }
  if (categoryName.includes('boutique') || categoryName.includes('ropa') || categoryName.includes('accesorio')) {
    return 'boutique';
  }
  return 'productos';
};

const categoryOrder = ['productos', 'comidas', 'boutique'];

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { favorites, isLoading, totalCount, loadFavorites } = useFavoritesList();

  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(loginPath(PROFILE.favorites));
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) loadFavorites();
  }, [user, loadFavorites]);

  const itemsByCategory = useMemo(() => {
    const grouped: { [key: string]: FavoriteItem[] } = {};
    favorites.forEach((item) => {
      const category = getItemCategory(item);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  }, [favorites]);

  const sortedCategories = useMemo(
    () => categoryOrder.filter((category) => itemsByCategory[category]?.length > 0),
    [itemsByCategory]
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);

  const handleAddToCart = async (item: FavoriteItem) => {
    if (item.productos.stock === 0) {
      toast.error(t('favorites.messages.outOfStock'));
      return;
    }
    setAddingToCart((prev) => new Set(prev).add(item.id));
    try {
      await addToCart(item.producto_id, 1);
      toast.success(t('favorites.messages.addedToCart'));
    } catch {
      toast.error(t('favorites.messages.errorAdd'));
    } finally {
      setAddingToCart((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleRemoveFromFavorites = async (item: FavoriteItem) => {
    setLoadingItems((prev) => new Set(prev).add(item.id));
    try {
      await removeFromFavorites(item.producto_id);
      await loadFavorites();
      toast.success(t('favorites.messages.removed'));
    } catch {
      toast.error(t('favorites.messages.errorRemove'));
    } finally {
      setLoadingItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  if (authLoading || isLoading || !user) {
    return <ProfileFavoritesSkeleton />;
  }

  return (
    <div>
      <ProfilePageHeader
        title={t('favorites.headerTitle')}
        description={
          totalCount === 0
            ? t('favorites.headerSubtitle')
            : t('favorites.headerSubtitleWithCount')
        }
        action={
          <Button className={profileCtaClass()} onClick={() => router.push('/productos')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('favorites.buttons.explore')}
          </Button>
        }
      />

      {favorites.length === 0 ? (
        <ProfileCard className="px-5 py-12 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[var(--shop-ink)]">
            {t('favorites.empty.title')}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--shop-muted)]">
            {t('favorites.empty.description')}
          </p>
          <Button className={cn('mt-6', profileCtaClass())} onClick={() => router.push('/productos')}>
            {t('favorites.empty.button')}
          </Button>
        </ProfileCard>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ProfileCard className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-[var(--shop-purple)]" />
                <div>
                  <p className="text-lg font-semibold text-[var(--shop-ink)]">{totalCount}</p>
                  <p className="text-xs text-[var(--shop-muted)]">{t('favorites.stats.favorites')}</p>
                </div>
              </div>
            </ProfileCard>
            <ProfileCard className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-[var(--shop-purple)]" />
                <div>
                  <p className="text-lg font-semibold text-[var(--shop-ink)]">{sortedCategories.length}</p>
                  <p className="text-xs text-[var(--shop-muted)]">{t('favorites.stats.categories')}</p>
                </div>
              </div>
            </ProfileCard>
            <ProfileCard className="col-span-2 p-4 sm:col-span-1">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-[var(--shop-purple)]" />
                <div>
                  <p className="text-lg font-semibold text-[var(--shop-ink)]">
                    {favorites.filter((f) => f.productos.stock > 0).length}
                  </p>
                  <p className="text-xs text-[var(--shop-muted)]">{t('favorites.stats.available')}</p>
                </div>
              </div>
            </ProfileCard>
          </div>

          <div className="space-y-6">
            {sortedCategories.map((categoryKey) => {
              const categoryItems = itemsByCategory[categoryKey];
              const categoryInfo = categoryMap[categoryKey as keyof typeof categoryMap];
              const Icon = categoryInfo.icon;
              return (
                <section key={categoryKey} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-medium text-[var(--shop-ink)]">
                        {t(`favorites.items.categories.${categoryInfo.name}`)}
                      </h2>
                      <p className="text-xs text-[var(--shop-muted)]">
                        {categoryItems.length}{' '}
                        {categoryItems.length === 1
                          ? t('favorites.stats.product')
                          : t('favorites.stats.products')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {categoryItems.map((item) => {
                      const isItemLoading = loadingItems.has(item.id);
                      const isAddingToCart = addingToCart.has(item.id);
                      const isOutOfStock = item.productos.stock === 0;
                      return (
                        <ProfileCard
                          key={item.id}
                          className={cn('p-4 sm:p-5', isItemLoading && 'opacity-50')}
                        >
                          <div className="flex gap-3 sm:gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--shop-canvas-muted)] sm:h-20 sm:w-20">
                              <Image
                                src={item.productos.imagen_principal}
                                alt={item.productos.nombre}
                                fill
                                className="object-cover"
                                sizes="80px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-product.svg';
                                }}
                              />
                              {isOutOfStock ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <span className="text-xs font-medium text-white">
                                    {t('favorites.items.outOfStock')}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="line-clamp-2 font-medium text-[var(--shop-ink)]">
                                    {item.productos.nombre}
                                  </h3>
                                  <p className="mt-0.5 truncate text-sm text-[var(--shop-muted)]">
                                    {item.productos.categorias?.nombre || t('favorites.items.noCategory')}
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-[var(--shop-purple)]">
                                    {formatPrice(item.productos.precio)}
                                  </p>
                                  {item.productos.stock <= 5 && item.productos.stock > 0 ? (
                                    <Badge variant="secondary" className="mt-1 bg-amber-50 text-amber-800">
                                      {t('favorites.items.stock')} {item.productos.stock}
                                    </Badge>
                                  ) : null}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-11 w-11 shrink-0 p-0 text-[var(--shop-muted)] hover:text-red-600"
                                  onClick={() => handleRemoveFromFavorites(item)}
                                  disabled={isItemLoading}
                                  aria-label={t('favorites.messages.removed')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => router.push(`/productos/${item.producto_id}`)}
                                  className={profileOutlineClass()}
                                >
                                  {t('favorites.items.view')}
                                </Button>
                                <Button
                                  onClick={() => handleAddToCart(item)}
                                  disabled={isAddingToCart || isOutOfStock}
                                  className={profileCtaClass()}
                                >
                                  {isAddingToCart ? (
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  ) : (
                                    <>
                                      <ShoppingCart className="mr-1 h-3 w-3" />
                                      {isOutOfStock
                                        ? t('favorites.items.outOfStock')
                                        : t('favorites.items.addToCart')}
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </ProfileCard>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
