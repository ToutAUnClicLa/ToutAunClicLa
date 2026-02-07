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
}

export function ShippingStatus({ summary, className = '' }: ShippingStatusProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // ✅ MEJORA: Manejo completo de estados de shipping según backend
  if (summary.needsAddress) {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-2 ${className}`}>
        <div className="flex items-start justify-center">
          <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-800 mb-1">
              {t('cart.summary.addressRequiredForShipping')}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MEJORA: Envío gratis aplicado (incluye promoción Maison de Poulet y envío gratis regular)
  // IMPORTANTE: Esta verificación debe ir ANTES que shippingMessage para que la promoción tenga prioridad
  const isFreeShipping = summary.freeShippingApplied ||
    (summary.promotionApplied && summary.shippingDiscount && summary.shippingDiscount > 0) ||
    (summary.shippingCost === 0);

  console.log('🔍 ShippingStatus DEBUG:', {
    promotionApplied: summary.promotionApplied,
    shippingDiscount: summary.shippingDiscount,
    shippingCost: summary.shippingCost,
    freeShippingApplied: summary.freeShippingApplied,
    isFreeShipping: isFreeShipping,
    hasShippingMessage: !!summary.shippingMessage
  });

  if (isFreeShipping) {
    // Si es promoción Maison de Poulet, mostrar banner especial
    if (summary.promotionApplied && summary.shippingDiscount && summary.shippingDiscount > 0) {
      return (
        <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {t('cart.promotions.maisonPoulet.freeShipping')}
              </span>
            </div>
          </div>
          <div className="text-xs text-green-700 bg-green-100 rounded px-2 py-1">
            <div className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              <span className="font-medium">
                {t('cart.promotions.maisonPoulet.title')}
              </span>
            </div>
            <div className="mt-1">
              {t('cart.promotions.maisonPoulet.savings', { amount: formatPrice(summary.shippingDiscount) })}
            </div>
          </div>
        </div>
      );
    }

    // Envío gratis regular (cupones o monto mínimo)
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {t('cart.summary.freeShipping')}
            </span>
          </div>
        </div>
      </div>
    );
  }


  // ✅ NUEVO: Mensaje de pedido mínimo para promoción Herencia
  if (summary.isPromotionEligible && !isFreeShipping && summary.promotionThreshold) {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-sm font-medium text-amber-800">
              {t('cart.promotions.herencia.minimumOrder', { amount: formatPrice(summary.promotionThreshold) })}
            </span>
            <p className="text-xs text-amber-700 mt-1">
              {t('cart.promotions.herencia.exclusiveNote')}
            </p>
            {summary.shippingCost && summary.shippingCost > 0 && (
              <div className="mt-2 text-xs font-semibold text-amber-900">
                {t('cart.summary.shipping')}: {formatPrice(summary.shippingCost)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ MEJORA: Estado de shipping con mensaje (cálculo con error pero estimado)
  // SOLO si NO es envío gratis
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

  // ✅ MEJORA: Shipping normal con costo
  if (summary.shippingCost && summary.shippingCost > 0) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {t('cart.summary.shipping')}
            </span>
          </div>
          <span className="text-sm font-semibold text-blue-900">
            {formatPrice(summary.shippingCost)}
          </span>
        </div>
      </div>
    );
  }

  // ✅ MEJORA: Envío gratis por monto mínimo
  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            {t('cart.summary.freeShipping')}
          </span>
        </div>
      </div>
    </div>
  );
}