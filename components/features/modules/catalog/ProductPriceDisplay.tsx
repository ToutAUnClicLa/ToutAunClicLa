"use client";

import { useMemo } from 'react';
import { Badge } from '@/components/common/ui/badge';
import { formatPrice, calculateCanadianTaxes, getTaxStatus } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  precio: number;
  precio_anterior?: number;
  categoria_id: number;
  TPS?: number;
  TVQ?: number;
  provedor?: string;
}

interface ProductPriceDisplayProps {
  product: Product;
  variant?: 'compact' | 'default' | 'detailed';
  className?: string;
}

export function ProductPriceDisplay({ product, variant = 'default', className = "" }: ProductPriceDisplayProps) {
  const { t } = useTranslation();
  
  const priceData = useMemo(() => {
    const hasDiscount = product.precio_anterior && product.precio_anterior > product.precio;
    const taxCalculation = calculateCanadianTaxes(product.precio, product.TPS, product.TVQ);
    const taxStatus = getTaxStatus(product.categoria_id, product.TPS, product.TVQ);

    return {
      hasDiscount,
      taxCalculation,
      taxStatus
    };
  }, [product.precio, product.precio_anterior, product.categoria_id, product.TPS, product.TVQ]);

  if (product.precio === 0) {
    return (
      <div className={className}>
        <span className="text-gray-500 font-bold">{t('catalog.price.notAvailable')}</span>
      </div>
    );
  }

  // Precio final a mostrar (con impuestos si aplica)
  const finalPrice = priceData.taxCalculation.hasTaxes 
    ? priceData.taxCalculation.totalPrice 
    : product.precio;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Precio anterior (con descuento) */}
      {priceData.hasDiscount && (
        <div className="text-sm text-gray-500 line-through">
          {formatPrice(product.precio_anterior!)}
        </div>
      )}

      {/* Precio base (siempre en azul) */}
      <div className="space-y-1">
        <div className={`font-bold text-blue-600 ${
          variant === 'compact' ? 'text-sm' : 
          variant === 'detailed' ? 'text-2xl' : 'text-lg'
        }`}>
          {formatPrice(product.precio)}
        </div>

        {/* Información de impuestos - solo para productos taxables */}
        {priceData.taxStatus === 'taxable' && priceData.taxCalculation.hasTaxes && variant !== 'compact' && (
          <div className="space-y-1 text-xs text-gray-600">
            {product.TPS && (
              <div>
                TPS ({product.TPS}%): +{formatPrice(priceData.taxCalculation.tpsAmount)}
              </div>
            )}
            {product.TVQ && (
              <div>
                TVQ ({product.TVQ}%): +{formatPrice(priceData.taxCalculation.tvqAmount)}
              </div>
            )}
          </div>
        )}

        {/* Badge para productos no taxables */}
        {priceData.taxStatus === 'non-taxable' && variant !== 'compact' && (
          <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
            {t('catalog.tax.nonTaxable')}
          </Badge>
        )}
      </div>
    </div>
  );
}
