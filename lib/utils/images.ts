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
    return '/placeholder-product.svg';
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
 * Optimiza URL de imagen para diferentes tamaños usando transformaciones de Supabase
 * @param imagePath - Ruta de la imagen
 * @param width - Ancho deseado
 * @param height - Alto deseado (opcional)
 * @param quality - Calidad de la imagen (1-100, default: 80)
 * @returns URL optimizada con transformaciones
 */
export function getOptimizedImageUrl(
  imagePath?: string | null,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  const baseUrl = getImageUrl(imagePath);
  
  // Si es una imagen local o placeholder, no optimizar
  if (baseUrl.startsWith('/') || !baseUrl.includes(SUPABASE_STORAGE_URL)) {
    return baseUrl;
  }

  // Construir parámetros de transformación
  const transformParams: string[] = [];
  
  if (width) {
    transformParams.push(`width=${width}`);
  }
  
  if (height) {
    transformParams.push(`height=${height}`);
  }
  
  // Agregar calidad
  transformParams.push(`quality=${quality}`);
  
  // Agregar formato webp para mejor compresión
  transformParams.push('format=webp');
  
  // Si hay transformaciones, agregarlas a la URL
  if (transformParams.length > 0) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${transformParams.join('&')}`;
  }
  
  return baseUrl;
}

/**
 * Obtiene imagen optimizada para tarjetas de productos
 * @param imagePath - Ruta de la imagen
 * @param size - Tamaño: 'small' | 'medium' | 'large'
 * @returns URL optimizada
 */
export function getProductImageUrl(
  imagePath?: string | null,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const dimensions = {
    small: { width: 300, height: 300 },
    medium: { width: 500, height: 500 },
    large: { width: 800, height: 800 }
  };
  
  const { width, height } = dimensions[size];
  return getOptimizedImageUrl(imagePath, width, height, 85);
}

/**
 * Genera un placeholder blur data URL
 * @returns Base64 data URL para blur placeholder
 */
export function getBlurDataURL(): string {
  // SVG blur placeholder simple - compatible con el cliente
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" /><stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" /></svg>`;
  
  // Usar btoa que está disponible en el navegador
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  
  // Para SSR, usar un placeholder simple
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2Y0ZjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTVlN2ViO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+';
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
  fallbackUrl: string = '/placeholder-product.svg'
): string {
  const imageUrl = getImageUrl(primaryUrl);
  return imageUrl === '/placeholder-product.svg' ? fallbackUrl : imageUrl;
}
