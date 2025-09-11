"use client";

import { useMemo } from 'react';
import { Badge } from '@/components/common/ui/badge';
import { formatPrice, calculateCanadianTaxes, getTaxStatus } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { SelectedVariation } from '@/types/variations';

interface Product {
  precio: number;
  precio_anterior?: number;
  categoria_id: number;
  TPS?: number;
  TVQ?: number;
  consigne?: number;
  ecoprecio?: boolean;
  provedor?: string;
  hasVariations?: boolean;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

interface ProductPriceDisplayProps {
  product: Product;
  variant?: 'compact' | 'default' | 'detailed';
  className?: string;
  selectedVariations?: SelectedVariation[];
  showBreakdown?: boolean;
}

export function ProductPriceDisplay({ 
  product, 
  variant = 'default', 
  className = "",
  selectedVariations = [],
  showBreakdown = false
}: ProductPriceDisplayProps) {
  const { t } = useTranslation();
  
  const priceData = useMemo(() => {
    const hasDiscount = product.precio_anterior && product.precio_anterior > product.precio;
    const taxCalculation = calculateCanadianTaxes(product.precio, product.TPS, product.TVQ, product.consigne);
    const taxStatus = getTaxStatus(product.categoria_id, product.TPS, product.TVQ, product.consigne);
    
    // Calculate variation-based pricing
    let displayPrice = product.precio;
    let priceLabel = formatPrice(product.precio);
    let hasVariations = product.hasVariations || false;
    let variationModifier = 0;
    
    // If product has variations, show translatable "Price to select" instead of "From $X"
    if (hasVariations && (!selectedVariations || selectedVariations.length === 0)) {
      const minPrice = product.minPrice || product.priceRange?.min || product.precio;
      priceLabel = t('catalog.price.selectPrice');
      displayPrice = minPrice;
    } else if (selectedVariations && selectedVariations.length > 0) {
      // Calculate price with selected variations
      // For now we'll use the already calculated final price from the parent component
      // since this component doesn't have access to the full variation groups
      displayPrice = product.precio; // This should be overridden by the parent passing finalPrice
      priceLabel = formatPrice(displayPrice);
      
      // Note: Real variation calculation should be done in the parent component
      // and passed as finalPrice in the product prop
    }

    return {
      hasDiscount,
      taxCalculation,
      taxStatus,
      displayPrice,
      priceLabel,
      hasVariations,
      variationModifier
    };
  }, [product.precio, product.precio_anterior, product.categoria_id, product.TPS, product.TVQ, product.consigne, product.hasVariations, product.minPrice, product.priceRange, selectedVariations, t]);

  if (product.precio === 0) {
    return (
      <div className={className}>
        <span className="text-gray-500 font-bold">{t('catalog.price.notAvailable')}</span>
      </div>
    );
  }

  // Precio final a mostrar (con impuestos si aplica) - TODO: Use this if needed
  // const finalPrice = priceData.taxCalculation.hasTaxes 
  //   ? calculateCanadianTaxes(priceData.displayPrice, product.TPS, product.TVQ, product.consigne).totalPrice
  //   : priceData.displayPrice;

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
        
        {/* Price range for variations if available */}
        {priceData.hasVariations && (!selectedVariations || selectedVariations.length === 0) && variant !== 'compact' && (
          product.priceRange && product.priceRange.max > product.priceRange.min && (
            <div className="text-xs text-gray-500 mt-1">
              Rango: {formatPrice(product.priceRange.min)} - {formatPrice(product.priceRange.max)}
            </div>
          )
        )}
        
        {/* Variation breakdown for selected variations */}
        {selectedVariations && selectedVariations.length > 0 && showBreakdown && variant !== 'compact' && (
          <div className="text-xs text-gray-600 space-y-1">
            <div>{t('catalog.variations.basePrice')}: {formatPrice(product.precio)}</div>
            {priceData.variationModifier !== 0 && (
              <div className={priceData.variationModifier > 0 ? 'text-green-600' : 'text-red-600'}>
                {priceData.variationModifier > 0 ? '+' : ''}{formatPrice(priceData.variationModifier)} {t('catalog.variations.optionsSelected')}
              </div>
            )}
          </div>
        )}

        {/* Información de impuestos - para todas las categorías */}
        {variant !== 'compact' && (
          <>
            {priceData.taxCalculation.hasTaxes ? (
              <div className="space-y-1 text-xs text-gray-600">
                {product.TPS && (
                  <div>
                    {t('catalog.tax.tps')} ({product.TPS}%): +{formatPrice(priceData.taxCalculation.tpsAmount)}
                  </div>
                )}
                {product.TVQ && (
                  <div>
                    {t('catalog.tax.tvq')} ({product.TVQ}%): +{formatPrice(priceData.taxCalculation.tvqAmount)}
                  </div>
                )}
              </div>
            ) : (
              // Badge para productos sin impuestos (sin TPS ni TVQ)
              !product.TPS && !product.TVQ && (
                <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
                  {t('catalog.tax.nonTaxable')}
                </Badge>
              )
            )}
          </>
        )}

        {/* Consigne - mostrar siempre si existe, independiente de si es taxable o no */}
        {product.consigne && variant !== 'compact' && (
          <div className="text-xs text-gray-600">
            {t('catalog.tax.consigne')}: +{formatPrice(priceData.taxCalculation.consigneAmount)}
          </div>
        )}
      </div>
    </div>
  );
}
