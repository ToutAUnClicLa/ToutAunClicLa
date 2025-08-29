"use client";

import { useMemo } from 'react';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { Info, Settings } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { CartItem } from '@/lib/services/cart';

interface CartItemVariationsProps {
  item: CartItem;
  showDetailed?: boolean;
  className?: string;
}

export function CartItemVariations({ 
  item, 
  showDetailed = false, 
  className = "" 
}: CartItemVariationsProps) {
  const { t } = useTranslation();
  
  const variationData = useMemo(() => {
    if (!item.variations || item.variations.length === 0) {
      return null;
    }

    let totalModifier = 0;
    const variationList = item.variations.map(variation => {
      const modifier = variation.price_at_time ?? variation.product_variations?.price_modifier ?? 0;
      const totalVariationCost = modifier * variation.quantity;
      totalModifier += totalVariationCost;

      return {
        name: variation.product_variations.name,
        description: variation.product_variations.description,
        quantity: variation.quantity,
        modifier,
        totalCost: totalVariationCost,
        isAddition: modifier > 0,
        isDiscount: modifier < 0,
        isNeutral: modifier === 0
      };
    });

    const basePrice = item.productos.precio;
    const baseSubtotal = basePrice * item.cantidad;
    const finalSubtotal = baseSubtotal + totalModifier;

    return {
      variations: variationList,
      totalModifier,
      basePrice,
      baseSubtotal,
      finalSubtotal,
      hasAdditions: variationList.some(v => v.isAddition),
      hasDiscounts: variationList.some(v => v.isDiscount),
      formattedSummary: variationList
        .map(v => v.quantity > 1 ? `${v.name} (${v.quantity})` : v.name)
        .join(', ')
    };
  }, [item.variations, item.productos.precio, item.cantidad]);

  if (!variationData) {
    return null;
  }

  if (!showDetailed) {
    // Compact display for cart list
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <Settings className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium truncate">
            {variationData.formattedSummary}
          </span>
          {variationData.totalModifier !== 0 && (
            <Badge 
              variant={variationData.totalModifier > 0 ? "default" : "outline"}
              className={`ml-auto text-xs ${
                variationData.totalModifier > 0 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {variationData.totalModifier > 0 ? '+' : ''}{formatPrice(variationData.totalModifier)}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Detailed display for expanded view
  return (
    <Card className={`bg-blue-50 border-blue-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-sm text-blue-900">
            {t('catalog.variations.cart.variationDetails')}
          </h4>
        </div>
        
        <div className="space-y-3">
          {/* Individual variations */}
          <div className="space-y-2">
            {variationData.variations.map((variation, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <div className="flex-1">
                    <span className="text-gray-800">{variation.name}</span>
                    {variation.quantity > 1 && (
                      <span className="text-gray-500 ml-1">× {variation.quantity}</span>
                    )}
                    {variation.description && (
                      <div className="text-xs text-gray-600 mt-1">
                        {variation.description}
                      </div>
                    )}
                  </div>
                </div>
                
                {!variation.isNeutral && (
                  <Badge 
                    variant={variation.isAddition ? "default" : "outline"}
                    className={`text-xs ${
                      variation.isAddition 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {variation.isAddition ? '+' : ''}{formatPrice(variation.totalCost)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          {/* Price breakdown */}
          <Separator className="bg-blue-200" />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('catalog.variations.cart.basePrice')}:</span>
              <span className="font-medium">{formatPrice(variationData.baseSubtotal)}</span>
            </div>
            
            {variationData.hasAdditions && (
              <div className="flex justify-between items-center text-green-600">
                <span>{t('catalog.variations.cart.variationCosts')}:</span>
                <span className="font-medium">
                  +{formatPrice(Math.abs(variationData.totalModifier))}
                </span>
              </div>
            )}
            
            {variationData.hasDiscounts && (
              <div className="flex justify-between items-center text-red-600">
                <span>Descuentos:</span>
                <span className="font-medium">
                  {formatPrice(variationData.totalModifier)}
                </span>
              </div>
            )}
            
            <Separator className="bg-blue-200" />
            
            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-blue-900">{t('catalog.variations.cart.totalWithVariations')}:</span>
              <span className="text-blue-600">{formatPrice(variationData.finalSubtotal)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItemVariations;