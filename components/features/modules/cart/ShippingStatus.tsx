"use client";

import { MapPin, Info, Truck, CheckCircle, AlertTriangle, Gift } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/utils';
import { CartSummary } from '@/lib/services/cart';

interface ShippingStatusProps {
  summary: CartSummary;
  className?: string;
  variant?: 'box' | 'inline';
}

export function ShippingStatus({ summary, className = '', variant = 'box' }: ShippingStatusProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // ✅ Inline variant: Solo muestra el costo o "Gratis" como un badge
  if (variant === 'inline') {
    const isFree = summary.freeShippingApplied ||
      (summary.promotionApplied && summary.shippingDiscount && summary.shippingDiscount > 0) ||
      (summary.shippingCost === 0);

    if (summary.deliverable === false) {
      return (
        <span className="text-sm font-medium text-red-600 sm:text-base">
          {summary.shippingMessage || t('cart.errors.notDeliverable')}
        </span>
      );
    }

    if (summary.needsAddress) {
      return (
        <span className="text-sm font-medium text-[var(--shop-purple)] sm:text-base">
          {t('cart.summary.addressRequired')}
        </span>
      );
    }

    if (isFree) {
      return (
        <span className="whitespace-nowrap text-sm font-medium text-[var(--shop-purple)] sm:text-base">
          {t('cart.summary.freeShipping')}
        </span>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <span className="whitespace-nowrap text-sm font-medium text-[var(--shop-ink)] sm:text-base">
          {formatPrice(summary.shippingCost || 0)}
        </span>
      </div>
    );
  }

  // ✅ Box variant: Muestra información detallada (alertas, promociones, etc.)

  // 0. Fuera de zona de cobertura
  if (summary.deliverable === false) {
    return (
      <div className={`rounded-xl border border-[var(--shop-hairline)] bg-white p-2 ${className}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
          <span className="text-xs font-medium text-[var(--shop-ink)]">
            {summary.shippingMessage || t('cart.errors.notDeliverable')}
          </span>
        </div>
      </div>
    );
  }

  // 1. Necesita dirección
  if (summary.needsAddress) {
    return (
      <div className={`rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] p-2 ${className}`}>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-[var(--shop-purple)]" />
          <span className="text-xs font-medium text-[var(--shop-ink)]">
            {t('cart.summary.addressRequiredForShipping')}
          </span>
        </div>
      </div>
    );
  }

  const isFreeShipping = summary.freeShippingApplied ||
    (summary.promotionApplied && summary.shippingDiscount && summary.shippingDiscount > 0) ||
    (summary.shippingCost === 0);

  // 2. Envío gratis aplicado (con banner especial de Maison de Poulet)
  if (isFreeShipping && summary.promotionApplied && summary.shippingDiscount && summary.shippingDiscount > 0) {
    return (
      <div className={`rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-purple-wash)] p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[var(--shop-purple)]" />
          <span className="text-sm font-medium text-[var(--shop-ink)]">
            {t('cart.promotions.maisonPoulet.freeShipping')}
          </span>
        </div>
        <div className="mt-2 flex w-fit items-center gap-1 rounded-full border border-[var(--shop-hairline)] bg-white px-2 py-0.5 text-[10px] text-[var(--shop-muted)]">
          <Gift className="h-3 w-3" />
          <span>{t('cart.promotions.maisonPoulet.title')}</span>
        </div>
      </div>
    );
  }

  // 3. Nudge para promoción (especialmente Herencia)
  if (summary.isPromotionEligible && !isFreeShipping && summary.promotionThreshold) {
    return (
      <div className={`rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] p-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 flex-shrink-0 text-[var(--shop-purple)]" />
          <div className="flex-1 leading-tight">
            <span className="text-[11px] font-medium text-[var(--shop-ink)] sm:text-xs">
              {t('cart.promotions.herencia.minimumOrder', { amount: formatPrice(summary.promotionThreshold) })}
            </span>
            <p className="mt-0.5 text-[9px] italic text-[var(--shop-muted)]">
              {t('cart.promotions.herencia.exclusiveNote')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Mensaje de error/estimado del backend
  if (summary.shippingMessage && !isFreeShipping) {
    return (
      <div className={`rounded-xl border border-[var(--shop-hairline)] bg-white p-3 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--shop-purple)]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-[var(--shop-ink)]">
                {t('shipping.estimated')}
              </span>
              <span className="text-sm font-semibold text-[var(--shop-ink)]">
                {formatPrice(summary.shippingCost || 0)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--shop-muted)]">
              {summary.shippingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. Envío gratis regular
  if (isFreeShipping) {
    return (
      <div className={`rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-purple-wash)] p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-[var(--shop-purple)]" />
          <span className="text-sm font-medium text-[var(--shop-ink)]">
            {t('cart.summary.freeShipping')}
          </span>
        </div>
      </div>
    );
  }

  // Default: Mostrar solo si hay costo relevante pero no promoción
  return null;
}