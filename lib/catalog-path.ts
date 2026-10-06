/** Public catalog for a category name. The API still calls this catalog "boutique". */
export function catalogPath(categoryName?: string | null): '/comidas' | '/souvenirs' | '/productos' {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('comida') || name.includes('food') || name.includes('snack')) return '/comidas';
  if (
    name.includes('boutique') ||
    name.includes('souvenir') ||
    name.includes('ropa') ||
    name.includes('accesorio')
  ) {
    return '/souvenirs';
  }
  return '/productos';
}
