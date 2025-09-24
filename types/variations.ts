/**
 * Product Variations System - TypeScript Interfaces
 * 
 * This file contains all the TypeScript interfaces for the comprehensive
 * product variations system that handles different product options and 
 * their pricing modifiers.
 */

// Core variation interfaces based on backend structure
export interface ProductVariation {
  id: number;
  name: string;
  description: string;
  price_modifier: number; // Can be positive (adds cost) or negative (discount)
  is_default: boolean;
  stock?: number;
  available?: boolean;
}

export interface VariationGroup {
  id: number;
  group_name: string;
  group_type: "single" | "multiple"; // single = radio buttons, multiple = checkboxes
  is_required: boolean;
  min_selections: number; // Minimum selections (usually 1 for required groups)
  max_selections: number; // Maximum selections (1 for single, >1 for multiple)
  product_variations: ProductVariation[];
  display_order?: number;
}

// Product interface with variations support
export interface ProductWithVariations {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number; // Base price
  precio_anterior?: number;
  stock: number;
  imagen_principal: string;
  imagen_secundaria?: string;
  imagen_terciaria?: string;
  categoria_id: number;
  subcategoria_id?: number;
  TPS?: number;
  TVQ?: number;
  consigne?: number;
  activo?: boolean;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  
  // Variation-specific fields
  hasVariations?: boolean;
  variations?: VariationGroup[];
  
  // Additional product fields
  rating?: number;
  reviews?: any[];
  caracteristicas?: string[];
  productos_relacionados?: ProductWithVariations[];

  // Restaurant availability fields
  disponible_hoy?: boolean;
  dias_disponibles?: number[];
  
  // Relationships
  categorias: { 
    id: number;
    nombre: string; 
  };
  subcategorias?: { 
    id: number;
    nombre: string;
    Imagen?: string;
    Descripcion?: string;
  };
  
  // Pricing calculations
  minPrice?: number; // Minimum possible price with variations
  maxPrice?: number; // Maximum possible price with variations
  priceRange?: {
    min: number;
    max: number;
  };
}

// Selected variations for UI state management
export interface SelectedVariation {
  groupId: number;
  variationId: number;
  quantity: number; // For multiple selection groups
}

export interface VariationSelection {
  productId: number;
  variations: SelectedVariation[];
  totalPriceModifier: number; // Sum of all variation price modifiers
  finalPrice: number; // Base price + total modifier
  isValid: boolean; // All required groups have selections
  validationErrors?: string[];
}

// Cart-related interfaces for variations
export interface CartItemVariation {
  variation: ProductVariation & { 
    group_name: string;
    group_type: "single" | "multiple";
  };
  quantity: number;
}

export interface CartItemWithVariations {
  id: string;
  producto: ProductWithVariations;
  cantidad: number;
  selectedVariations: CartItemVariation[];
  baseSubtotal: number; // Base price × quantity
  variationModifier: number; // Total variation cost modifier
  finalSubtotal: number; // Base subtotal + variation modifier
  horaEntregaPreferida?: string;
  metodoEntrega?: 'puerta' | 'manos' | 'recepcion';
  notasEntrega?: string;
}

// API request/response interfaces
export interface AddToCartWithVariationsRequest {
  productId: number;
  quantity: number;
  variations: Array<{
    variationId: number;
    quantity: number;
  }>;
  horaEntregaPreferida?: string;
  metodoEntrega?: 'puerta' | 'manos' | 'recepcion';
  notasEntrega?: string;
}

export interface AddToCartWithVariationsResponse {
  cartItem: CartItemWithVariations;
  message: string;
  priceBreakdown: {
    basePrice: number;
    variationCost: number;
    totalPrice: number;
  };
}

// Validation helpers
export interface VariationValidationResult {
  isValid: boolean;
  errors: Array<{
    groupId: number;
    groupName: string;
    error: string;
  }>;
  missingRequiredGroups: number[];
  invalidSelections: number[];
}

// Pricing calculation helpers
export interface PriceCalculation {
  basePrice: number;
  variationModifiers: Array<{
    groupName: string;
    variationName: string;
    modifier: number;
  }>;
  totalModifier: number;
  finalPrice: number;
  breakdown: {
    base: number;
    additions: number;
    discounts: number;
    total: number;
  };
}

// UI Component prop types
export interface ProductVariationsProps {
  product: ProductWithVariations;
  onSelectionChange: (selection: VariationSelection) => void;
  initialSelection?: VariationSelection;
  disabled?: boolean;
  showPriceBreakdown?: boolean;
  className?: string;
}

export interface VariationGroupProps {
  group: VariationGroup;
  selectedVariations: SelectedVariation[];
  onSelectionChange: (groupId: number, selections: SelectedVariation[]) => void;
  disabled?: boolean;
  showPrices?: boolean;
  className?: string;
}

export interface VariationOptionProps {
  variation: ProductVariation;
  groupType: "single" | "multiple";
  isSelected: boolean;
  quantity?: number;
  onSelect: (variationId: number, selected: boolean, quantity?: number) => void;
  disabled?: boolean;
  showPrice?: boolean;
  className?: string;
}

// Product display enhancements
export interface ProductCardVariationInfo {
  hasVariations: boolean;
  priceLabel: string; // "Desde $X.XX" or regular price
  variationCount?: number;
  popularVariations?: ProductVariation[];
}

export interface ProductPriceDisplayVariationProps {
  basePrice: number;
  hasVariations: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  selectedVariations?: SelectedVariation[];
  showBreakdown?: boolean;
  variant?: 'compact' | 'default' | 'detailed';
}

// Utility types
export type VariationSelectionState = {
  [groupId: number]: SelectedVariation[];
};

export type VariationGroupType = "single" | "multiple";

export type VariationDisplayMode = "card" | "list" | "grid";

// Error types
export class VariationError extends Error {
  constructor(
    message: string,
    public code: string,
    public groupId?: number,
    public variationId?: number
  ) {
    super(message);
    this.name = 'VariationError';
  }
}

export enum VariationErrorCode {
  REQUIRED_GROUP_MISSING = 'REQUIRED_GROUP_MISSING',
  INVALID_SELECTION = 'INVALID_SELECTION',
  STOCK_INSUFFICIENT = 'STOCK_INSUFFICIENT',
  PRICE_CALCULATION_ERROR = 'PRICE_CALCULATION_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}