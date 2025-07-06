/**
 * Utilidades para validación de direcciones de Montreal
 */

// FSAs válidos para Montreal (Forward Sortation Areas)
export const MONTREAL_FSA_CODES = [
  // H1A - H1Z
  'H1A', 'H1B', 'H1C', 'H1D', 'H1E', 'H1F', 'H1G', 'H1H', 'H1J', 'H1K', 
  'H1L', 'H1M', 'H1N', 'H1P', 'H1R', 'H1S', 'H1T', 'H1V', 'H1W', 'H1X', 
  'H1Y', 'H1Z',
  // H2A - H2Z
  'H2A', 'H2B', 'H2C', 'H2E', 'H2G', 'H2H', 'H2J', 'H2K', 'H2L', 'H2M', 
  'H2N', 'H2P', 'H2R', 'H2S', 'H2T', 'H2V', 'H2W', 'H2X', 'H2Y', 'H2Z',
  // H3A - H3Z
  'H3A', 'H3B', 'H3C', 'H3E', 'H3G', 'H3H', 'H3J', 'H3K', 'H3L', 'H3M', 
  'H3N', 'H3P', 'H3R', 'H3S', 'H3T', 'H3V', 'H3W', 'H3X', 'H3Y', 'H3Z',
  // H4A - H4Z
  'H4A', 'H4B', 'H4C', 'H4E', 'H4G', 'H4H', 'H4J', 'H4K', 'H4L', 'H4M', 
  'H4N', 'H4P', 'H4R', 'H4S', 'H4T', 'H4V', 'H4W', 'H4X', 'H4Y', 'H4Z',
  // H5A, H5B
  'H5A', 'H5B'
];

/**
 * Valida si una ciudad corresponde a Montreal
 * @param city - Nombre de la ciudad
 * @returns boolean - true si es Montreal
 */
export function isMontrealCity(city: string): boolean {
  const cityLower = city.toLowerCase().trim();
  return cityLower === 'montreal' || cityLower === 'montréal';
}

/**
 * Valida el formato de un código postal canadiense
 * @param postalCode - Código postal a validar
 * @returns boolean - true si tiene formato válido
 */
export function isValidCanadianPostalCode(postalCode: string): boolean {
  const cleanCode = postalCode.toUpperCase().replace(/\s/g, '');
  const canadianPostalRegex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
  return canadianPostalRegex.test(cleanCode);
}

/**
 * Valida si un código postal pertenece a Montreal
 * @param postalCode - Código postal a validar
 * @returns boolean - true si es de Montreal
 */
export function isMontrealPostalCode(postalCode: string): boolean {
  const cleanCode = postalCode.toUpperCase().replace(/\s/g, '');
  
  if (!isValidCanadianPostalCode(cleanCode)) {
    return false;
  }

  const fsa = cleanCode.substring(0, 3);
  return MONTREAL_FSA_CODES.includes(fsa);
}

/**
 * Valida completamente una dirección de Montreal
 * @param city - Ciudad
 * @param postalCode - Código postal
 * @returns object - Resultado de la validación con detalles
 */
export function validateMontrealAddress(city: string, postalCode: string) {
  // Validar ciudad
  if (!isMontrealCity(city)) {
    return {
      isValid: false,
      error: 'Solo se aceptan direcciones en Montreal'
    };
  }

  // Validar formato del código postal
  if (!isValidCanadianPostalCode(postalCode)) {
    return {
      isValid: false,
      error: 'El código postal debe tener formato canadiense (ej: H2X 1L4)'
    };
  }

  // Validar que sea de Montreal
  if (!isMontrealPostalCode(postalCode)) {
    return {
      isValid: false,
      error: 'El código postal no pertenece al municipio de Montreal'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Formatea un código postal canadiense con espacio
 * @param postalCode - Código postal sin formato
 * @returns string - Código postal formateado
 */
export function formatCanadianPostalCode(postalCode: string): string {
  const cleanCode = postalCode.toUpperCase().replace(/\s/g, '');
  
  if (cleanCode.length === 6) {
    return `${cleanCode.substring(0, 3)} ${cleanCode.substring(3)}`;
  }
  
  return cleanCode;
}
