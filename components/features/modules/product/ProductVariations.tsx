"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { Alert, AlertDescription } from '@/components/common/ui/alert';
import { formatPrice } from '@/lib/utils';
import {
  VariationGroup,
  SelectedVariation,
  VariationSelection,
  VariationValidationResult,
  ProductVariationsProps,
  VariationGroupProps,
  VariationOptionProps
} from '@/types/variations';

// Utility functions for variation calculations
const calculatePriceModifier = (selectedVariations: SelectedVariation[], allGroups: VariationGroup[]): number => {
  return selectedVariations.reduce((total, selection) => {
    const group = allGroups.find(g => g.id === selection.groupId);
    if (!group) return total;
    
    const variation = group.product_variations.find(v => v.id === selection.variationId);
    if (!variation) return total;
    
    return total + (variation.price_modifier * selection.quantity);
  }, 0);
};

const validateVariationSelection = (
  selectedVariations: SelectedVariation[], 
  groups: VariationGroup[]
): VariationValidationResult => {
  const errors: Array<{ groupId: number; groupName: string; error: string }> = [];
  const missingRequiredGroups: number[] = [];
  const invalidSelections: number[] = [];

  for (const group of groups) {
    const groupSelections = selectedVariations.filter(s => s.groupId === group.id);
    
    // Check required groups
    if (group.is_required && groupSelections.length === 0) {
      missingRequiredGroups.push(group.id);
      errors.push({
        groupId: group.id,
        groupName: group.group_name,
        error: 'Este grupo es requerido'
      });
      continue;
    }

    // Check min/max selections
    if (groupSelections.length < group.min_selections) {
      invalidSelections.push(group.id);
      errors.push({
        groupId: group.id,
        groupName: group.group_name,
        error: `Selecciona al menos ${group.min_selections} opción(es)`
      });
    }

    if (groupSelections.length > group.max_selections) {
      invalidSelections.push(group.id);
      errors.push({
        groupId: group.id,
        groupName: group.group_name,
        error: `Selecciona máximo ${group.max_selections} opción(es)`
      });
    }

    // Check stock availability
    for (const selection of groupSelections) {
      const variation = group.product_variations.find(v => v.id === selection.variationId);
      if (variation && variation.stock !== undefined && variation.stock < selection.quantity) {
        invalidSelections.push(group.id);
        errors.push({
          groupId: group.id,
          groupName: group.group_name,
          error: `Stock insuficiente para ${variation.name}`
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingRequiredGroups,
    invalidSelections
  };
};

// Individual Variation Option Component
const VariationOption: React.FC<VariationOptionProps> = ({
  variation,
  groupType,
  isSelected,
  quantity = 1,
  onSelect,
  disabled = false,
  showPrice = true,
  className = ""
}) => {
  const isOutOfStock = variation.stock !== undefined && variation.stock === 0;
  
  const handleSelect = () => {
    if (disabled || isOutOfStock) return;
    
    if (groupType === 'single') {
      onSelect(variation.id, !isSelected);
    } else {
      onSelect(variation.id, !isSelected, quantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (disabled || isOutOfStock) return;
    onSelect(variation.id, newQuantity > 0, Math.max(1, newQuantity));
  };

  return (
    <motion.div
      whileHover={!disabled && !isOutOfStock ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isOutOfStock ? { scale: 0.98 } : {}}
      className={`
        relative border rounded-lg p-3 sm:p-4 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
        }
        ${disabled || isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleSelect}
    >
      {/* Selection indicator */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <div className={`
              w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center
              ${groupType === 'single' 
                ? 'rounded-full' 
                : 'rounded-md'
              }
              ${isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
              }
            `}>
              {isSelected && (
                <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
              )}
            </div>
            <h4 className="font-medium text-sm sm:text-base text-gray-900">
              {variation.name}
            </h4>
          </div>
          
          {variation.description && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
              {variation.description}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            {showPrice && variation.price_modifier !== 0 && (
              <Badge 
                variant={variation.price_modifier > 0 ? "default" : "outline"}
                className={`text-xs ${
                  variation.price_modifier > 0 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}
              >
                {variation.price_modifier > 0 ? '+' : ''}{formatPrice(variation.price_modifier)}
              </Badge>
            )}
            
            {variation.is_default && (
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                Por defecto
              </Badge>
            )}
            
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )}
            
            {variation.stock !== undefined && variation.stock > 0 && variation.stock <= 5 && (
              <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                Solo {variation.stock} disponibles
              </Badge>
            )}
          </div>
        </div>
        
        {/* Quantity selector for multiple selection groups */}
        {groupType === 'multiple' && isSelected && (
          <div className="flex items-center border rounded-lg ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-r-none"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(quantity - 1);
              }}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-l-none"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(quantity + 1);
              }}
              disabled={variation.stock !== undefined && quantity >= variation.stock}
            >
              +
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Variation Group Component
const VariationGroupComponent: React.FC<VariationGroupProps> = ({
  group,
  selectedVariations,
  onSelectionChange,
  disabled = false,
  showPrices = true,
  className = ""
}) => {
  const groupSelections = selectedVariations.filter(s => s.groupId === group.id);

  const handleVariationSelect = (variationId: number, selected: boolean, quantity: number = 1) => {
    let newSelections: SelectedVariation[];

    if (group.group_type === 'single') {
      // For single selection, replace any existing selection
      newSelections = selected 
        ? [{ groupId: group.id, variationId, quantity: 1 }]
        : [];
    } else {
      // For multiple selection, add or update
      const existingIndex = groupSelections.findIndex(s => s.variationId === variationId);
      
      if (selected) {
        if (existingIndex >= 0) {
          // Update quantity
          newSelections = groupSelections.map((s, index) =>
            index === existingIndex ? { ...s, quantity } : s
          );
        } else {
          // Add new selection
          newSelections = [...groupSelections, { groupId: group.id, variationId, quantity }];
        }
      } else {
        // Remove selection
        newSelections = groupSelections.filter(s => s.variationId !== variationId);
      }
    }

    onSelectionChange(group.id, newSelections);
  };

  const sortedVariations = useMemo(() => {
    return [...group.product_variations].sort((a, b) => {
      // Sort by default first, then by name
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [group.product_variations]);

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            {group.group_name}
            {group.is_required && (
              <Badge variant="destructive" className="text-xs">
                Requerido
              </Badge>
            )}
          </CardTitle>
          <div className="text-sm text-gray-600">
            {groupSelections.length} / {group.max_selections > 1 ? group.max_selections : 1}
          </div>
        </div>
        
        {group.min_selections > 0 && (
          <p className="text-sm text-gray-600">
            {group.group_type === 'single' 
              ? 'Selecciona una opción'
              : `Selecciona ${group.min_selections} a ${group.max_selections} opciones`
            }
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid gap-3">
          {sortedVariations.map((variation) => {
            const selection = groupSelections.find(s => s.variationId === variation.id);
            const isSelected = !!selection;
            const quantity = selection?.quantity || 1;

            return (
              <VariationOption
                key={variation.id}
                variation={variation}
                groupType={group.group_type}
                isSelected={isSelected}
                quantity={quantity}
                onSelect={handleVariationSelect}
                disabled={disabled}
                showPrice={showPrices}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main ProductVariations Component
export const ProductVariations: React.FC<ProductVariationsProps> = ({
  product,
  onSelectionChange,
  initialSelection,
  disabled = false,
  showPriceBreakdown = true,
  className = ""
}) => {
  const [selectedVariations, setSelectedVariations] = useState<SelectedVariation[]>(
    initialSelection?.variations || []
  );

  // Memoized calculations
  const calculations = useMemo(() => {
    if (!product.variations) return null;
    
    const priceModifier = calculatePriceModifier(selectedVariations, product.variations);
    const finalPrice = product.precio + priceModifier;
    const validation = validateVariationSelection(selectedVariations, product.variations);
    
    return {
      priceModifier,
      finalPrice,
      validation,
      breakdown: {
        base: product.precio,
        additions: Math.max(0, priceModifier),
        discounts: Math.min(0, priceModifier),
        total: finalPrice
      }
    };
  }, [product.precio, product.variations, selectedVariations]);

  // Auto-select default variations on mount
  useEffect(() => {
    if (!product.variations || initialSelection) return;
    
    const defaultSelections: SelectedVariation[] = [];
    
    product.variations.forEach(group => {
      const defaultVariation = group.product_variations.find(v => v.is_default);
      if (defaultVariation && group.is_required) {
        defaultSelections.push({
          groupId: group.id,
          variationId: defaultVariation.id,
          quantity: 1
        });
      }
    });
    
    if (defaultSelections.length > 0) {
      setSelectedVariations(defaultSelections);
    }
  }, [product.variations, initialSelection]);

  // Notify parent of selection changes
  useEffect(() => {
    if (calculations) {
      const selection: VariationSelection = {
        productId: product.id,
        variations: selectedVariations,
        totalPriceModifier: calculations.priceModifier,
        finalPrice: calculations.finalPrice,
        isValid: calculations.validation.isValid,
        validationErrors: calculations.validation.errors.map(e => e.error)
      };
      
      onSelectionChange(selection);
    }
  }, [selectedVariations, calculations, product.id, onSelectionChange]);

  const handleGroupSelectionChange = useCallback((groupId: number, newSelections: SelectedVariation[]) => {
    setSelectedVariations(prev => {
      // Remove all previous selections for this group
      const otherSelections = prev.filter(s => s.groupId !== groupId);
      // Add new selections for this group
      return [...otherSelections, ...newSelections];
    });
  }, []);

  const sortedGroups = useMemo(() => {
    if (!product.variations || product.variations.length === 0) return [];
    
    return [...product.variations].sort((a, b) => {
      // Required groups first
      if (a.is_required && !b.is_required) return -1;
      if (!a.is_required && b.is_required) return 1;
      // Then by display order if available
      if (a.display_order !== undefined && b.display_order !== undefined) {
        return a.display_order - b.display_order;
      }
      // Finally by name
      return a.group_name.localeCompare(b.group_name);
    });
  }, [product.variations]);

  if (!product.variations || product.variations.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Validation Errors */}
      <AnimatePresence>
        {calculations?.validation?.errors && calculations.validation.errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-1">
                  {calculations.validation.errors.map((error, index) => (
                    <div key={index}>• {error.error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variation Groups */}
      <div className="space-y-4">
        {sortedGroups.map((group) => (
          <VariationGroupComponent
            key={group.id}
            group={group}
            selectedVariations={selectedVariations}
            onSelectionChange={handleGroupSelectionChange}
            disabled={disabled}
            showPrices={showPriceBreakdown}
          />
        ))}
      </div>

      {/* Price Breakdown */}
      {showPriceBreakdown && calculations && (
        <Card className="bg-gray-50 p-4 sm:p-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Resumen de Precio
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Precio base:</span>
                <span className="font-medium">{formatPrice(calculations.breakdown.base)}</span>
              </div>
              
              {calculations.breakdown.additions > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Opciones adicionales:</span>
                  <span className="font-medium">+{formatPrice(calculations.breakdown.additions)}</span>
                </div>
              )}
              
              {calculations.breakdown.discounts < 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span>Descuentos:</span>
                  <span className="font-medium">{formatPrice(calculations.breakdown.discounts)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(calculations.breakdown.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductVariations;