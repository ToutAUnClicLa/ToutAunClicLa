/**
 * Utilidades para manejo de imágenes de Supabase
 */

// URL base del storage de Supabase
const SUPABASE_STORAGE_URL = 'https://fthunnrkcpzygyspynus.supabase.co/storage/v1/object/public';

/**
 * Convierte una ruta relativa de imagen a URL completa de Supabase
 * @param imagePath - Ruta relativa de la imagen (ej: "productos/comidas/L'ArepaExpress/CriolloBowl.jpeg")
 * @returns URL completa de Supabase o imagen placeholder si no es válida
 */
export function getImageUrl(imagePath?: string | null): string {
  // Si no hay imagen, devolver placeholder
  if (!imagePath) {
    return '/placeholder-product.jpg';
  }

  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si es una ruta local (empieza con /), devolverla tal como está
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Convertir ruta relativa a URL completa de Supabase
  // Asegurar que la ruta no empiece con "productos/" duplicado
  const cleanPath = imagePath.startsWith('productos/') 
    ? imagePath 
    : `productos/${imagePath}`;

  return `${SUPABASE_STORAGE_URL}/${cleanPath}`;
}

/**
 * Obtiene múltiples URLs de imágenes
 * @param imagePaths - Array de rutas de imágenes
 * @returns Array de URLs completas
 */
export function getImageUrls(imagePaths?: string[] | null): string[] {
  if (!imagePaths || !Array.isArray(imagePaths)) {
    return [];
  }

  return imagePaths.map(getImageUrl);
}

/**
 * Verifica si una URL de imagen es válida
 * @param imageUrl - URL de la imagen
 * @returns Promise que resuelve true si la imagen es válida
 */
export async function isValidImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

/**
 * Obtiene una imagen con fallback
 * @param primaryUrl - URL principal de la imagen
 * @param fallbackUrl - URL de fallback (opcional, por defecto placeholder)
 * @returns URL de imagen válida
 */
export function getImageWithFallback(
  primaryUrl?: string | null, 
  fallbackUrl: string = '/placeholder-product.jpg'
): string {
  const imageUrl = getImageUrl(primaryUrl);
  return imageUrl === '/placeholder-product.jpg' ? fallbackUrl : imageUrl;
}

/**
 * Optimiza URL de imagen para diferentes tamaños
 * @param imagePath - Ruta de la imagen
 * @param width - Ancho deseado
 * @param height - Alto deseado
 * @returns URL optimizada (por ahora retorna la URL original, se puede implementar transformaciones)
 */
export function getOptimizedImageUrl(
  imagePath?: string | null,
  width?: number,
  height?: number
): string {
  // Por ahora simplemente devolver la URL base
  // En el futuro se puede implementar transformaciones de Supabase
  return getImageUrl(imagePath);
}
