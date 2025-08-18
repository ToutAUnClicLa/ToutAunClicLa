/**
 * Mapeo de subcategorías desde strings a IDs numéricos
 * Esto debe coincidir con los IDs de subcategorías en la base de datos
 */

export const SUBCATEGORY_MAPPING: Record<string, number> = {
  // Productos (categoría 1)
  'harinas-masas': 1,
  'salsas-aderezos': 2,
  'paquetes-snacks': 3,
  'bebidas': 12,
  
  // Comidas (categoría 2)
  'norte-america': 5,
  'centro-america-caribe': 6,
  'sur-america': 7,
  
  // Boutique (categoría 3)
  'ropa': 7,
  'accesorios': 8,
  'souvenirs': 9
};

export const REVERSE_SUBCATEGORY_MAPPING: Record<number, string> = Object.fromEntries(
  Object.entries(SUBCATEGORY_MAPPING).map(([key, value]) => [value, key])
);

/**
 * Convierte un string de subcategoría a su ID numérico
 */
export function getSubcategoryId(subcategoryString: string): number | null {
  return SUBCATEGORY_MAPPING[subcategoryString] || null;
}

/**
 * Convierte un ID numérico de subcategoría a su string
 */
export function getSubcategoryString(subcategoryId: number): string | null {
  return REVERSE_SUBCATEGORY_MAPPING[subcategoryId] || null;
}
