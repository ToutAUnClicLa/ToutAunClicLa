/**
 * Utilities para el sistema de variaciones de productos
 */

import { ProductWithVariations, VariationGroup, SelectedVariation, VariationSelection } from '@/types/variations';

/**
 * Verifica si un producto tiene variaciones válidas
 */
export function hasValidVariations(product: ProductWithVariations): boolean {
  return !!(product.hasVariations || (product.variations && product.variations.length > 0));
}

/**
 * Obtiene el nombre de una variación específica
 */
export function getVariationName(
  variationId: number, 
  groupId: number, 
  variations: VariationGroup[]
): string | null {
  const group = variations.find(g => g.id === groupId);
  if (!group) return null;
  
  const variation = group.product_variations.find(v => v.id === variationId);
  return variation?.name || null;
}

/**
 * Formatea las variaciones seleccionadas para mostrar al usuario
 */
export function formatSelectedVariations(
  selection: VariationSelection,
  variations: VariationGroup[]
): string {
  const variationNames = selection.variations.map(v => {
    const group = variations.find(g => g.id === v.groupId);
    const variation = group?.product_variations.find(pv => pv.id === v.variationId);
    
    if (!variation || !group) return null;
    
    // Para grupos múltiples, incluir cantidad si es mayor a 1
    if (group.group_type === 'multiple' && v.quantity > 1) {
      return `${variation.name} (${v.quantity})`;
    }
    
    return variation.name;
  }).filter(Boolean);
  
  return variationNames.join(', ');
}

/**
 * Calcula el precio total con modificadores de variaciones
 */
export function calculateVariationPrice(
  basePrice: number,
  selectedVariations: SelectedVariation[],
  variationGroups: VariationGroup[]
): {
  basePrice: number;
  totalModifier: number;
  finalPrice: number;
  breakdown: Array<{
    groupName: string;
    variationName: string;
    modifier: number;
    quantity: number;
  }>;
} {
  let totalModifier = 0;
  const breakdown: Array<{
    groupName: string;
    variationName: string;
    modifier: number;
    quantity: number;
  }> = [];

  for (const selection of selectedVariations) {
    const group = variationGroups.find(g => g.id === selection.groupId);
    if (!group) continue;
    
    const variation = group.product_variations.find(v => v.id === selection.variationId);
    if (!variation) continue;
    
    const modifier = variation.price_modifier * selection.quantity;
    totalModifier += modifier;
    
    breakdown.push({
      groupName: group.group_name,
      variationName: variation.name,
      modifier: variation.price_modifier,
      quantity: selection.quantity
    });
  }

  return {
    basePrice,
    totalModifier,
    finalPrice: basePrice + totalModifier,
    breakdown
  };
}

/**
 * Valida que todas las selecciones requeridas estén completas
 */
export function validateVariationSelections(
  selectedVariations: SelectedVariation[],
  variationGroups: VariationGroup[]
): {
  isValid: boolean;
  missingRequired: string[];
  errors: string[];
} {
  const errors: string[] = [];
  const missingRequired: string[] = [];

  for (const group of variationGroups) {
    const groupSelections = selectedVariations.filter(s => s.groupId === group.id);
    
    // Verificar grupos requeridos
    if (group.is_required && groupSelections.length === 0) {
      missingRequired.push(group.group_name);
      errors.push(`${group.group_name} es requerido`);
    }
    
    // Verificar selecciones mínimas/máximas
    if (groupSelections.length < group.min_selections) {
      errors.push(`${group.group_name} requiere al menos ${group.min_selections} selección(es)`);
    }
    
    if (groupSelections.length > group.max_selections) {
      errors.push(`${group.group_name} permite máximo ${group.max_selections} selección(es)`);
    }
  }

  return {
    isValid: errors.length === 0,
    missingRequired,
    errors
  };
}

/**
 * Formatea las variaciones de un item del carrito
 */
export function formatCartItemVariations(
  variations: Array<{
    cart_item_id: string;
    quantity: number;
    price_at_time: number;
    product_variations: {
      id: number;
      name: string;
      description: string;
      price_modifier: number;
    };
  }>
): string {
  if (!variations || variations.length === 0) return '';
  
  const variationNames = variations.map(v => {
    const name = v.product_variations.name;
    // Para variaciones con cantidad mayor a 1, incluir cantidad
    if (v.quantity > 1) {
      return `${name} (${v.quantity})`;
    }
    return name;
  });
  
  return variationNames.join(', ');
}

/**
 * Calcula el total de modificadores de precio de las variaciones de un item del carrito
 */
export function calculateCartItemVariationModifier(
  variations: Array<{
    cart_item_id: string;
    quantity: number;
    price_at_time: number;
    product_variations: {
      id: number;
      name: string;
      description: string;
      price_modifier: number;
    };
  }>
): number {
  if (!variations || variations.length === 0) return 0;
  
  return variations.reduce((total, variation) => {
    // Usar price_at_time si está disponible, sino usar price_modifier
    const modifier = variation.price_at_time !== undefined 
      ? variation.price_at_time 
      : variation.product_variations.price_modifier;
    
    return total + (modifier * variation.quantity);
  }, 0);
}

/**
 * Calcula el precio final de un item del carrito incluyendo variaciones
 */
export function calculateCartItemFinalPrice(
  basePrice: number,
  quantity: number,
  variations: Array<{
    cart_item_id: string;
    quantity: number;
    price_at_time: number;
    product_variations: {
      id: number;
      name: string;
      description: string;
      price_modifier: number;
    };
  }>
): {
  baseSubtotal: number;
  variationModifier: number;
  finalSubtotal: number;
} {
  const baseSubtotal = basePrice * quantity;
  const variationModifier = calculateCartItemVariationModifier(variations);
  const finalSubtotal = baseSubtotal + variationModifier;
  
  return {
    baseSubtotal,
    variationModifier,
    finalSubtotal
  };
}

/**
 * Debug helper para logging de variaciones
 */
export function logVariationDebug(
  productId: number,
  productName: string,
  selection: VariationSelection | null,
  variationGroups: VariationGroup[]
): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group(`🔧 Debug Variaciones - ${productName} (ID: ${productId})`);
  
  console.log('Grupos de variaciones disponibles:', variationGroups.map(g => ({
    id: g.id,
    name: g.group_name,
    type: g.group_type,
    required: g.is_required,
    options: g.product_variations.length
  })));
  
  if (selection) {
    console.log('Selección actual:', {
      isValid: selection.isValid,
      finalPrice: selection.finalPrice,
      totalPriceModifier: selection.totalPriceModifier,
      selections: selection.variations.map(v => ({
        groupId: v.groupId,
        variationId: v.variationId,
        quantity: v.quantity,
        name: getVariationName(v.variationId, v.groupId, variationGroups)
      }))
    });
    
    const formatted = formatSelectedVariations(selection, variationGroups);
    console.log('Texto formateado:', formatted);
    
    const validation = validateVariationSelections(selection.variations, variationGroups);
    console.log('Validación:', validation);
  } else {
    console.log('❌ No hay selección de variaciones');
  }
  
  console.groupEnd();
}