"use client";

import { useMemo } from 'react';
import { Badge } from '@/components/common/ui/badge';
import { formatPrice, calculateCanadianTaxes, getTaxStatus, getDiscountPercentage } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  precio: number;
  precio_anterior?: number;
  categoria_id: number;
  TPS?: number;
  TVQ?: number;
  consigne?: number;
  ecoprecio?: boolean;
  provedor?: string;
}

interface ProductPriceDisplayProps {
  product: Product;
  variant?: 'compact' | 'default' | 'detailed';
  className?: string;
  showBreakdown?: boolean;
}

export function ProductPriceDisplay({
  product,
  variant = 'default',
  className = "",
  showBreakdown = false
}: ProductPriceDisplayProps) {
  const { t } = useTranslation();

  const priceData = useMemo(() => {
    const hasDiscount = product.precio_anterior && product.precio_anterior > product.precio;
    const discountPercentage = hasDiscount
      ? getDiscountPercentage(product.precio_anterior!, product.precio)
      : 0;
    const taxCalculation = calculateCanadianTaxes(product.precio, product.TPS, product.TVQ, product.consigne);
    const taxStatus = getTaxStatus(product.categoria_id, product.TPS, product.TVQ, product.consigne);
    const hasTaxesOrFees = Boolean(product.TPS || product.TVQ || product.consigne);

    // Simplificado tras eliminar variaciones
    const displayPrice = product.precio;
    const priceLabel = formatPrice(product.precio);

    return {
      hasDiscount,
      discountPercentage,
      taxCalculation,
      taxStatus,
      hasTaxesOrFees,
      displayPrice,
      priceLabel
    };
  }, [product.precio, product.precio_anterior, product.categoria_id, product.TPS, product.TVQ, product.consigne, t]);

  if (product.precio === 0) {
    return (
      <div className={className}>
        <span className="text-gray-500 font-bold">{t('catalog.price.notAvailable')}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Precio anterior (con descuento) */}
      {priceData.hasDiscount && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="line-through">{formatPrice(product.precio_anterior!)}</span>
          <Badge className="bg-green-100 text-green-700 border-green-200 text-[11px]">
            -{priceData.discountPercentage}%
          </Badge>
        </div>
      )}

      {/* Precio base (siempre en azul) */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className={`font-bold text-blue-600 ${
            // Si es "Precio a seleccionar", usar texto más pequeño
            priceData.priceLabel === t('catalog.price.selectPrice') ? (
              variant === 'compact' ? 'text-xs' : 'text-sm'
            ) : (
              variant === 'compact' ? 'text-sm' :
                variant === 'detailed' ? 'text-2xl' : 'text-lg'
            )
            }`}>
            {priceData.priceLabel}
          </span>
          {/* Eco fee text */}
          {product.ecoprecio && (
            <span className="text-xs text-emerald-600 font-medium">
              {t('cart.ecoFee')}
            </span>
          )}
        </div>

        {/* Mensaje simple de impuestos/consignas */}
        {priceData.hasTaxesOrFees ? (
          <div className={`text-xs ${variant === 'compact' ? 'text-gray-500' : 'text-gray-600'}`}>
            {t('catalog.tax.plusTaxesShort')}
          </div>
        ) : (
          variant !== 'compact' && (
            <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
              {t('catalog.tax.nonTaxable')}
            </Badge>
          )
        )}
      </div>
    </div>
  );
}
