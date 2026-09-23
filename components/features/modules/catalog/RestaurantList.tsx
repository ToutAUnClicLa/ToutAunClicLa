"use client";

import { useMemo } from 'react';
import { ChefHat, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant, restaurantsService } from '@/lib/services/restaurants';
import { Skeleton } from '@/components/common/ui/skeleton';
import { shopChrome, shopSection } from '@/lib/shop-theme';
import { cn, getImageUrl } from '@/lib/utils';
import { getRestaurantUrlWithFallback } from '@/lib/utils/restaurant-routes';

interface RestaurantListProps {
  categoryId?: number;
  searchTerm?: string;
  onRestaurantSelect?: (subcategoryId: number, restaurantName: string) => void;
}

const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function RestaurantList({ searchTerm = '' }: RestaurantListProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { restaurants, loading, error } = useRestaurants();

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (!restaurant.disponible) return;
    router.push(getRestaurantUrlWithFallback(restaurant.nombre));
  };

  const getAvailabilityStatus = (restaurant: Restaurant) => {
    return restaurantsService.getAvailabilityMessage(restaurant, t);
  };

  const getRestaurantFlags = (nacionalidades: string[]) => {
    return restaurantsService.getRestaurantFlags(nacionalidades);
  };

  const sortedRestaurants = useMemo(
    () => restaurantsService.sortRestaurantsByAvailability(restaurants),
    [restaurants],
  );

  const visible = useMemo(() => {
    const q = normalize(searchTerm.trim());
    if (!q) return sortedRestaurants;
    return sortedRestaurants.filter((r) => {
      const name = normalize(r.nombre || '');
      const desc = normalize(r.Descripcion || '');
      return name.includes(q) || desc.includes(q);
    });
  }, [sortedRestaurants, searchTerm]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
            <Skeleton className="mt-6 h-11 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--shop-hairline)] py-16 text-center">
        <ChefHat className={cn('mx-auto mb-4 h-8 w-8', shopSection.food.icon)} aria-hidden />
        <h3 className="text-lg font-medium text-[var(--shop-ink)]">
          {t('catalog.restaurantList.errorTitle')}
        </h3>
        <p className="mx-auto mt-2 max-w-md px-4 text-sm text-[var(--shop-muted)]">
          {t('catalog.restaurantList.errorDesc')}
        </p>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--shop-hairline)] py-16 text-center">
        <ChefHat className="mx-auto mb-4 h-8 w-8 text-[var(--shop-hairline)]" aria-hidden />
        <h3 className="text-lg font-medium text-[var(--shop-ink)]">
          {t('catalog.restaurantList.noRestaurants')}
        </h3>
        <p className="mx-auto mt-2 max-w-md px-4 text-sm text-[var(--shop-muted)]">
          {t('catalog.restaurantList.noRestaurantsDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {visible.map((restaurant) => {
        const availabilityStatus = getAvailabilityStatus(restaurant);
        const flags = getRestaurantFlags(restaurant.nacionalidades);

        return (
          <div
            key={restaurant.id}
            className={cn(
              'flex flex-col rounded-xl border bg-white p-5 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none',
              restaurant.disponible &&
                'cursor-pointer hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-md active:scale-[0.99]',
              shopSection.food.focus,
            )}
            onClick={() => handleRestaurantClick(restaurant)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRestaurantClick(restaurant);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={
              restaurant.disponible
                ? `${t('catalog.restaurantList.viewMenuFor')} ${restaurant.nombre}`
                : `${restaurant.nombre} - ${t('catalog.restaurantList.comingSoon')}`
            }
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <div className={cn('relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[var(--shop-hairline)]', shopSection.food.tile)}>
                  {restaurant.Imagen ? (
                    <Image
                      src={getImageUrl(restaurant.Imagen)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ChefHat className={cn('h-6 w-6', shopSection.food.icon)} aria-hidden />
                    </div>
                  )}
                </div>
                <h3 className="truncate text-base font-semibold text-[var(--shop-ink)] sm:text-lg">
                  {restaurant.nombre}
                </h3>
              </div>
              {flags ? <div className="shrink-0 text-sm leading-none">{flags}</div> : null}
            </div>

            <p className="min-h-[2.5rem] text-sm leading-relaxed text-[var(--shop-muted)] line-clamp-2">
              {restaurant.Descripcion || t('catalog.restaurantList.noDescription')}
            </p>

            <div className="mt-4 flex items-center gap-1.5">
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  availabilityStatus.color === 'green'
                    ? 'bg-emerald-500'
                    : availabilityStatus.color === 'yellow'
                      ? 'bg-yellow-500'
                      : availabilityStatus.color === 'blue'
                        ? 'bg-[var(--shop-purple)]'
                        : 'bg-red-500',
                )}
                aria-hidden
              />
              <span className="text-xs text-[var(--shop-muted)] sm:text-sm">
                {availabilityStatus.message}
              </span>
            </div>

            <button
              type="button"
              className={cn(
                'mt-5 w-full justify-center',
                restaurant.disponible
                  ? cn(shopChrome.aisleCta, shopSection.food.cta)
                  : cn(shopChrome.filterChip, 'h-11 min-h-11 text-[var(--shop-muted)]'),
                shopSection.food.focus,
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleRestaurantClick(restaurant);
              }}
              aria-label={
                restaurant.disponible
                  ? `${t('catalog.restaurantList.viewMenu')} - ${restaurant.nombre}`
                  : `${restaurant.nombre} - ${t('catalog.restaurantList.comingSoon')}`
              }
            >
              <span className="inline-flex items-center gap-1.5">
                {restaurant.disponible ? t('catalog.restaurantList.viewMenu') : t('catalog.restaurantList.comingSoon')}
                {restaurant.disponible ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
