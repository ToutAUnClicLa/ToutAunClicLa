/**
 * Cart Backend Data Validation Utilities
 * Ensures cart data consistency and provides fallbacks for missing backend fields
 */

import { CartSummary, CartResponse } from '@/lib/services/cart';

// Display fallback values - NEVER use for pricing calculations
// Pricing is ALWAYS calculated by backend based on location, products, etc.
export const CART_DEFAULTS = {
  SHIPPING_THRESHOLD: 200,
  // NO FALLBACK_SHIPPING_COST - backend calculates based on location ($7 Riviera Sur, $17 Montreal)
  DEFAULT_TPS_RATE: 0.05, // 5%
  DEFAULT_TVQ_RATE: 0.09975, // 9.975%
  MIN_FREE_SHIPPING_AMOUNT: 200
} as const;

/**
 * Validates and enriches cart summary with fallbacks for missing backend data
 */
export function validateCartSummary(summary: Partial<CartSummary> | undefined): CartSummary {
  if (!summary) {
    return createEmptyCartSummary();
  }

  return {
    totalItems: summary.totalItems ?? 0,
    totalQuantity: summary.totalQuantity ?? 0,
    subtotal: summary.subtotal ?? 0,
    subtotalWithTaxes: summary.subtotalWithTaxes,
    subtotalWithConsigne: summary.subtotalWithConsigne,
    totalTPS: summary.totalTPS,
    totalTVQ: summary.totalTVQ,
    totalConsigne: summary.totalConsigne ?? 0,
    totalTaxes: summary.totalTaxes,
    shippingCost: summary.shippingCost,
    originalShippingCost: summary.originalShippingCost,
    shippingThreshold: summary.shippingThreshold ?? CART_DEFAULTS.SHIPPING_THRESHOLD,
    totalBeforeDiscount: summary.totalBeforeDiscount,
    total: summary.total ?? 0,
    discount: summary.discount,
    savings: summary.savings ?? 0,
    freeShippingApplied: summary.freeShippingApplied ?? false,
    // Critical shipping state fields
    shippingMessage: summary.shippingMessage ?? null,
    needsAddress: summary.needsAddress ?? false,
    isPromotionEligible: summary.isPromotionEligible ?? false,
    promotionThreshold: summary.promotionThreshold ?? 0
  };
}

/**
 * Creates an empty cart summary with proper defaults
 */
export function createEmptyCartSummary(): CartSummary {
  return {
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    total: 0,
    totalConsigne: 0,
    savings: 0,
    freeShippingApplied: false,
    shippingThreshold: CART_DEFAULTS.SHIPPING_THRESHOLD,
    shippingCost: 0,
    shippingMessage: null,
    needsAddress: false,
    isPromotionEligible: false,
    promotionThreshold: 0
  };
}

/**
 * Validates complete cart response from backend
 */
export function validateCartResponse(response: Partial<CartResponse> | undefined): CartResponse {
  if (!response) {
    return {
      cartItems: [],
      total: 0,
      itemCount: 0,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false
      },
      summary: createEmptyCartSummary()
    };
  }

  return {
    cartItems: response.cartItems ?? [],
    total: response.total ?? 0,
    itemCount: response.itemCount ?? 0,
    pagination: response.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
      hasNextPage: false,
      hasPrevPage: false
    },
    summary: validateCartSummary(response.summary)
  };
}

/**
 * Analyzes backend data completeness
 */
export function analyzeBackendDataQuality(summary: CartSummary): {
  completeness: number;
  hasEssentialData: boolean;
  missingCriticalFields: string[];
  hasAdvancedShipping: boolean;
  usingFallbacks: boolean;
} {
  const essentialFields = ['totalItems', 'totalQuantity', 'subtotal', 'total'];
  const optionalFields = ['totalTaxes', 'totalConsigne', 'shippingCost', 'shippingThreshold'];
  const advancedShippingFields = ['shippingMessage', 'needsAddress'];

  const allFields = [...essentialFields, ...optionalFields];
  const availableFields = allFields.filter(field =>
    summary[field as keyof CartSummary] !== undefined && summary[field as keyof CartSummary] !== null
  );

  const availableEssentialFields = essentialFields.filter(field =>
    summary[field as keyof CartSummary] !== undefined
  );

  const missingCriticalFields = essentialFields.filter(field =>
    summary[field as keyof CartSummary] === undefined
  );

  const hasAdvancedShipping = advancedShippingFields.some(field =>
    summary[field as keyof CartSummary] !== undefined && summary[field as keyof CartSummary] !== null
  );

  return {
    completeness: Math.round((availableFields.length / allFields.length) * 100),
    hasEssentialData: availableEssentialFields.length === essentialFields.length,
    missingCriticalFields,
    hasAdvancedShipping,
    usingFallbacks: availableFields.length < allFields.length
  };
}

/**
 * Logs backend data quality for debugging
 */
export function logBackendDataQuality(summary: CartSummary, context: string = '') {
  const quality = analyzeBackendDataQuality(summary);

  console.log(`🏛️ Backend Data Quality${context ? ` (${context})` : ''}:`, {
    completeness: `${quality.completeness}%`,
    hasEssentialData: quality.hasEssentialData,
    missingCriticalFields: quality.missingCriticalFields,
    hasAdvancedShipping: quality.hasAdvancedShipping,
    usingFallbacks: quality.usingFallbacks,
    summary: {
      itemCount: summary.totalItems,
      subtotal: summary.subtotal,
      total: summary.total,
      shipping: summary.shippingCost,
      needsAddress: summary.needsAddress,
      shippingMessage: !!summary.shippingMessage
    }
  });

  if (quality.missingCriticalFields.length > 0) {
    console.warn(`🚨 Missing critical backend fields: ${quality.missingCriticalFields.join(', ')}`);
  }
}