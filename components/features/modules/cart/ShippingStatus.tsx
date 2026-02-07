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

    if (summary.needsAddress) {
      return (
        <span className="text-sm sm:text-base font-medium text-amber-600">
          {t('cart.summary.addressRequired')}
        </span>
      );
    }

    if (isFree) {
      return (
        <span className="text-sm sm:text-base font-medium text-green-600 whitespace-nowrap">
          {t('cart.summary.freeShipping')}
        </span>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <span className="text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap">
          {formatPrice(summary.shippingCost || 0)}
        </span>
      </div>
    );
  }

  // ✅ Box variant: Muestra información detallada (alertas, promociones, etc.)

  // 1. Necesita dirección
  if (summary.needsAddress) {
    return (
      <div className={`bg-amber-50/50 border border-amber-200/50 rounded-lg p-2 ${className}`}>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span className="text-xs font-medium text-amber-800">
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
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            {t('cart.promotions.maisonPoulet.freeShipping')}
          </span>
        </div>
        <div className="text-[10px] text-green-700 bg-green-100/50 rounded px-2 py-0.5 mt-2 flex items-center gap-1 w-fit">
          <Gift className="h-3 w-3" />
          <span>{t('cart.promotions.maisonPoulet.title')}</span>
        </div>
      </div>
    );
  }

  // 3. Nudge para promoción (especialmente Herencia)
  if (summary.isPromotionEligible && !isFreeShipping && summary.promotionThreshold) {
    return (
      <div className={`bg-amber-50 border border-amber-100 rounded-md p-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          <div className="flex-1 leading-tight">
            <span className="text-[11px] sm:text-xs font-medium text-amber-900">
              {t('cart.promotions.herencia.minimumOrder', { amount: formatPrice(summary.promotionThreshold) })}
            </span>
            <p className="text-[9px] text-amber-700/70 italic mt-0.5">
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
      <div className={`bg-orange-50 border border-orange-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">
                {t('shipping.estimated')}
              </span>
              <span className="text-sm font-semibold text-orange-900">
                {formatPrice(summary.shippingCost || 0)}
              </span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
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
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            {t('cart.summary.freeShipping')}
          </span>
        </div>
      </div>
    );
  }

  // Default: Mostrar solo si hay costo relevante pero no promoción
  return null;
}