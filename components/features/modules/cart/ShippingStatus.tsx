"use client";

import { MapPin, Info, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
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
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-800 mb-1">
              {t('cart.summary.addressRequiredForShipping')}
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              {summary.shippingMessage || 'Necesitamos tu dirección para calcular el costo de envío'}
            </p>
            <Button 
              onClick={() => router.push('/profile/addresses')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Configurar dirección
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MEJORA: Estado de shipping con mensaje (cálculo con error pero estimado)
  if (summary.shippingMessage) {
    return (
      <div className={`bg-orange-50 border border-orange-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">
                Envío estimado
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

  // ✅ MEJORA: Envío gratis aplicado
  if (summary.freeShippingApplied) {
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