
/**
 * Utilidades para validación de direcciones de Montreal
 */

// FSAs válidos para Montreal y Rivera Sur (Forward Sortation Areas)
export const MONTREAL_FSA_CODES = [
  // Montreal específicos (según README backend)
  'H1N', 'H1M', 'H1P', 'H1H', 'H1R', 'H1S', 'H1T', 'H1V', 'H1W', 'H1X',
  // Códigos H2* (todos los que comienzan con H2)
  'H2A', 'H2B', 'H2C', 'H2E', 'H2G', 'H2H', 'H2J', 'H2K', 'H2L', 'H2M', 
  'H2N', 'H2P', 'H2R', 'H2S', 'H2T', 'H2V', 'H2W', 'H2X', 'H2Y', 'H2Z',
  // Códigos H3* (todos los que comienzan con H3)
  'H3A', 'H3B', 'H3C', 'H3E', 'H3G', 'H3H', 'H3J', 'H3K', 'H3L', 'H3M', 
  'H3N', 'H3P', 'H3R', 'H3S', 'H3T', 'H3V', 'H3W', 'H3X', 'H3Y', 'H3Z',
  // Códigos H4* (todos los que comienzan con H4)
  'H4A', 'H4B', 'H4C', 'H4E', 'H4G', 'H4H', 'H4J', 'H4K', 'H4L', 'H4M', 
  'H4N', 'H4P', 'H4R', 'H4S', 'H4T', 'H4V', 'H4W', 'H4X', 'H4Y', 'H4Z',
  // Códigos adicionales Montreal
  'H8Z', 'H8Y', 'H8T', 'H8S', 'H8R', 'H8N', 'H8P',
  // Códigos H9
  'H9R', 'H9S', 'H9G', 'H9A', 'H9B', 'H9P',
  // Rivera Sur códigos
  'J5R', 'J4B', 'J3Y', 'J4N', 'J4M', 'J4G', 'J4L', 'J4J', 'J4H', 'J4K', 
  'J4T', 'J4V', 'J4R', 'J4Z', 'J4S', 'J4W', 'J4X', 'J4Y', 'J3Z'
];

/**
 * Valida si una ciudad está en el área de servicio (Montreal y Rivera Sur)
 * @param city - Nombre de la ciudad
 * @returns boolean - true si es una ciudad válida
 */
export function isValidServiceCity(city: string): boolean {
  const cityLower = city.toLowerCase().trim();
  // Montreal y variaciones
  if (cityLower === 'montreal' || cityLower === 'montréal') {
    return true;
  }
  // Ciudades de Rivera Sur
  const riveraSurCities = [
    'longueuil', 'saint-lambert', 'brossard', 'saint-hubert', 
    'greenfield park', 'la prairie', 'candiac', 'delson',
    'saint-constant', 'sainte-catherine', 'châteauguay', 
    'mercier', 'kahnawake'
  ];
  return riveraSurCities.includes(cityLower);
}

/**
 * Mantener compatibilidad - alias para isValidServiceCity
 * @param city - Nombre de la ciudad
 * @returns boolean - true si es Montreal
 */
export function isMontrealCity(city: string): boolean {
  return isValidServiceCity(city);
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
 * Valida si un código postal pertenece al área de servicio (Montreal/Rivera Sur)
 * @param postalCode - Código postal a validar
 * @returns boolean - true si está en el área de servicio
 */
export function isServiceAreaPostalCode(postalCode: string): boolean {
  const cleanCode = postalCode.toUpperCase().replace(/\s/g, '');
  
  if (!isValidCanadianPostalCode(cleanCode)) {
    return false;
  }

  const fsa = cleanCode.substring(0, 3);
  return MONTREAL_FSA_CODES.includes(fsa);
}

/**
 * Mantener compatibilidad - alias para isServiceAreaPostalCode
 * @param postalCode - Código postal a validar
 * @returns boolean - true si es de Montreal
 */
export function isMontrealPostalCode(postalCode: string): boolean {
  return isServiceAreaPostalCode(postalCode);
}

/**
 * Valida completamente una dirección del área de servicio
 * @param city - Ciudad
 * @param postalCode - Código postal
 * @returns object - Resultado de la validación con detalles
 */
export function validateMontrealAddress(city: string, postalCode: string) {
  // Validar ciudad
  if (!isValidServiceCity(city)) {
    return {
      isValid: false,
      error: 'Solo se aceptan direcciones en Montreal y Rivera Sur'
    };
  }

  // Validar formato del código postal
  if (!isValidCanadianPostalCode(postalCode)) {
    return {
      isValid: false,
      error: 'El código postal debe tener formato canadiense (ej: H2X 1L4)'
    };
  }

  // Validar que sea del área de servicio
  if (!isServiceAreaPostalCode(postalCode)) {
    return {
      isValid: false,
      error: 'El código postal no pertenece al área de servicio (Montreal y Rivera Sur)'
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
