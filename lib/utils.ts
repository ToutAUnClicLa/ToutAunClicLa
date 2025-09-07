import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  getImageUrl as getImageUrlFromImages, 
  getOptimizedImageUrl, 
  getProductImageUrl, 
  getBlurDataURL,
  getImageUrls,
  getImageWithFallback,
  isValidImageUrl
} from './utils/images';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export image functions
export { 
  getOptimizedImageUrl, 
  getProductImageUrl, 
  getBlurDataURL,
  getImageUrls,
  getImageWithFallback,
  isValidImageUrl
};

// Keep original getImageUrl for compatibility
export const getImageUrl = getImageUrlFromImages;

/**
 * Formatea un precio con manejo especial para casos de precio 0
 * @param price - Precio a formatear
 * @param showFree - Si mostrar "Gratis" cuando el precio es 0
 * @returns Precio formateado
 */
export function formatPrice(price: number, showFree: boolean = false): string {
  if (price === 0) {
    return showFree ? 'Gratis' : 'Precio no disponible';
  }

  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Verifica si un producto tiene un precio válido
 * @param price - Precio del producto
 * @returns True si el precio es válido (mayor a 0)
 */
export function isValidPrice(price?: number): boolean {
  return typeof price === 'number' && price > 0;
}

/**
 * Calcula el porcentaje de descuento
 * @param originalPrice - Precio original
 * @param currentPrice - Precio actual
 * @returns Porcentaje de descuento redondeado
 */
export function getDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Calcula el precio total con impuestos canadienses (TPS, TVQ y Consigne)
 * @param basePrice - Precio base del producto
 * @param tps - Porcentaje de TPS (Goods and Services Tax)
 * @param tvq - Porcentaje de TVQ (Quebec Sales Tax)
 * @param consigne - Cantidad fija de Consigne (Deposit/Handling Fee)
 * @returns Objeto con precios detallados
 */
export function calculateCanadianTaxes(basePrice: number, tps?: number, tvq?: number, consigne?: number) {
  const tpsAmount = tps ? (basePrice * tps) / 100 : 0;
  const tvqAmount = tvq ? (basePrice * tvq) / 100 : 0;
  const consigneAmount = consigne || 0;
  const totalPrice = basePrice + tpsAmount + tvqAmount + consigneAmount;

  return {
    basePrice,
    tpsAmount,
    tvqAmount,
    consigneAmount,
    totalPrice,
    hasTaxes: !!(tps || tvq || consigne)
  };
}

/**
 * Obtiene el estado de impuestos para un producto basado en su categoría
 * @param categoryId - ID de la categoría del producto
 * @param tps - Porcentaje de TPS
 * @param tvq - Porcentaje de TVQ
 * @param consigne - Cantidad fija de Consigne
 * @returns Estado de impuestos del producto
 */
export function getTaxStatus(categoryId: number, tps?: number, tvq?: number, consigne?: number): 'taxable' | 'non-taxable' | 'food-taxable' {
  // Para todas las categorías, aplicar la misma lógica
  // Un producto es taxable si tiene TPS o TVQ (consigne es independiente)
  const hasTaxes = !!(tps || tvq);
  
  // Categoría 2: Comida - pero sigue la misma lógica de impuestos
  if (categoryId === 2) {
    return hasTaxes ? 'food-taxable' : 'non-taxable';
  }
  
  // Todas las demás categorías (incluyendo productos generales)
  return hasTaxes ? 'taxable' : 'non-taxable';
}

/**
 * Obtiene todas las imágenes disponibles de un producto
 * @param product - Objeto del producto
 * @returns Array de URLs de imágenes válidas
 */
export function getProductImages(product: { 
  imagen_principal?: string; 
  imagen_secundaria?: string; 
  imagen_terciaria?: string; 
}): string[] {
  const images: string[] = [];
  
  if (product.imagen_principal) {
    images.push(getImageUrl(product.imagen_principal));
  }
  
  if (product.imagen_secundaria) {
    images.push(getImageUrl(product.imagen_secundaria));
  }
  
  if (product.imagen_terciaria) {
    images.push(getImageUrl(product.imagen_terciaria));
  }
  
  // Si no hay imágenes, devolver al menos una imagen por defecto
  if (images.length === 0) {
    images.push(getImageUrl(''));
  }
  
  return images;
}

/**
 * Obtiene la traducción de una subcategoría basándose en su ID
 * @param subcategoryId - ID de la subcategoría
 * @param translations - Objeto de traducciones desde useTranslation
 * @returns Nombre traducido de la subcategoría o el nombre original como fallback
 */
export function getTranslatedSubcategory(subcategoryId: number, translations: any): string {
  const subcategoriesTranslations = translations?.catalog?.productList?.subcategories;
  
  if (subcategoriesTranslations && subcategoriesTranslations[subcategoryId.toString()]) {
    return subcategoriesTranslations[subcategoryId.toString()];
  }
  
  // Fallback para IDs conocidos si no hay traducción disponible
  const fallbackNames: Record<number, string> = {
    1: "Harinas y Masas",
    12: "Bebidas", 
    3: "Paquetes y Snacks",
    2: "Salsas y Aderezos",
    8: "Accesorios",
    7: "Ropa",
    9: "Souvenirs"
  };
  
  return fallbackNames[subcategoryId] || `Subcategoría ${subcategoryId}`;
}

/**
 * Hook personalizado para traducir subcategorías (para usar con useTranslation)
 * @param t - Función de traducción desde useTranslation hook
 * @returns Función para traducir subcategorías por ID
 */
export function useSubcategoryTranslation(t: any) {
  return (subcategoryId: number): string => {
    return getTranslatedSubcategory(subcategoryId, { catalog: { productList: { subcategories: t('catalog.productList.subcategories', { returnObjects: true }) } } });
  };
}
