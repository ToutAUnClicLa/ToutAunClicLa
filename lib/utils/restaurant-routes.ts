/**
 * Utilidades para manejar rutas de restaurantes
 */

/**
 * Genera un slug limpio desde el nombre del restaurante
 * Ejemplo: "Maison de Poulet" -> "maison-de-poulet"
 */
export function generateRestaurantSlug(restaurantName: string): string {
  return restaurantName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim();
}

/**
 * Genera la URL completa para un restaurante
 * Ejemplo: "Maison de Poulet" -> "/comidas/maison-de-poulet"
 */
export function getRestaurantUrl(restaurantName: string): string {
  const slug = generateRestaurantSlugNormalized(restaurantName);
  return `/comidas/${slug}`;
}

/**
 * Lista de restaurantes conocidos con sus slugs e IDs predefinidos
 * Esto permite tener control sobre las URLs específicas y mapear a subcategorías
 */
export const RESTAURANT_SLUGS: Record<string, string> = {
  "L'Arepa Express": "larepa-express",
  "Rue 20": "rue-20",
  "Bistro l'Arepa": "bistro-larepa", 
  "La Maison Du Grand Poulet": "la-maison-du-grand-poulet",
  "Ricuras Colombianas": "ricuras-colombianas",
  "Herencia Café": "herencia-cafe",
  "Assiette Lakay": "assiette-lakay",
  "Herencia RestoBar": "herencia-restobar",
  "Encanto Cafe et Boutique": "Encanto-Cafe-et-Boutique",
  "Encanto Café et Boutique": "Encanto-Cafe-et-Boutique",
  "Cake Bakery Bro":"Cake-Bakery-Bro"
};

/**
 * Mapeo de nombres de restaurante a IDs de subcategoría
 */
export const RESTAURANT_SUBCATEGORY_IDS: Record<string, number> = {
  "L'Arepa Express": 4,
  "Bistro l'Arepa": 11,
  "La Maison Du Grand Poulet": 13,
  "Ricuras Colombianas": 14,
  "Herencia Café": 15,
  "Assiette Lakay": 16,
  "Herencia RestoBar": 17,
  "Encanto Cafe et Boutique": 18,
  "Cake Bakery Bro" : 19
};

/**
 * Obtiene la URL usando slugs predefinidos o genera uno automáticamente
 */
export function getRestaurantUrlWithFallback(restaurantName: string): string {
  const normalizedName = normalizeRestaurantName(restaurantName);
  const predefinedSlug = Object.entries(RESTAURANT_SLUGS)
    .find(([name]) => normalizeRestaurantName(name) === normalizedName)?.[1];
  if (predefinedSlug) {
    return `/comidas/${predefinedSlug}`;
  }
  return getRestaurantUrl(restaurantName);
}

/**
 * Convierte un slug de vuelta al nombre del restaurante
 * Usado para la página dinámica [restaurante].tsx
 */
export function getRestaurantNameFromSlug(slug: string): string | null {
  // Buscar en slugs predefinidos
  const entry = Object.entries(RESTAURANT_SLUGS).find(([_, predefinedSlug]) => predefinedSlug === slug);
  if (entry) {
    return entry[0];
  }
  
  // Fallback: convertir slug a nombre (no muy confiable, pero funcional)
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Verifica si un producto pertenece a un restaurante específico
 */
export function isProductFromRestaurant(product: any, restaurantName: string): boolean {
  return product.subcategorias?.nombre === restaurantName;
}

/**
 * Obtiene todos los productos de un restaurante específico
 */
export function filterProductsByRestaurant(products: any[], restaurantName: string): any[] {
  return products.filter(product => isProductFromRestaurant(product, restaurantName));
}

/**
 * Obtiene el ID de subcategoría de un restaurante por su nombre
 */
export function getRestaurantSubcategoryId(restaurantName: string): number | null {
  const normalizedName = normalizeRestaurantName(restaurantName);
  const entry = Object.entries(RESTAURANT_SUBCATEGORY_IDS)
    .find(([name]) => normalizeRestaurantName(name) === normalizedName);
  return entry ? entry[1] : null;
}

/**
 * Normaliza un nombre y genera un slug sin acentos ni guiones al inicio/fin
 */
function generateRestaurantSlugNormalized(restaurantName: string): string {
  return normalizeRestaurantName(restaurantName)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normaliza un nombre de restaurante para comparaciones insensibles a acentos, mayúsculas y espacios extra
 */
function normalizeRestaurantName(name: string): string {
  return name
    .normalize('NFD') // separar diacríticos
    .replace(/[\u0300-\u036f]/g, '') // remover diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remover caracteres especiales
    .replace(/\s+/g, ' ') // colapsar espacios
    .replace(/-+/g, '-') // colapsar guiones
    .trim();
}
