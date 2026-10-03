
/**
 * Utilidades para validación de direcciones de Montreal
 */

// FSAs con tarifa. Mismo conjunto y orden alfabético que
// SHIPPING_COSTS_BY_POSTAL_PREFIX en el backend.
export const MONTREAL_FSA_CODES = [
  'H1A', 'H1B', 'H1C', 'H1D', 'H1E', 'H1F', 'H1G', 'H1H',
  'H1J', 'H1K', 'H1L', 'H1M', 'H1P', 'H1R', 'H1S', 'H1T',
  'H1V', 'H1W', 'H1X', 'H1Y', 'H1Z', 'H2A', 'H2B', 'H2C',
  'H2E', 'H2G', 'H2H', 'H2J', 'H2K', 'H2L', 'H2M', 'H2P',
  'H2R', 'H2S', 'H2T', 'H2V', 'H2W', 'H2X', 'H2Y', 'H2Z',
  'H3A', 'H3B', 'H3C', 'H3D', 'H3E', 'H3F', 'H3G', 'H3H',
  'H3J', 'H3K', 'H3L', 'H3M', 'H3N', 'H3P', 'H3R', 'H3S',
  'H3T', 'H3V', 'H3W', 'H3Y', 'H3Z', 'H4A', 'H4B', 'H4E',
  'H4G', 'H4H', 'H4N', 'H4P', 'H4V', 'H4W', 'H4X', 'H7A',
  'H7B', 'H7C', 'H7D', 'H7E', 'H7F', 'H7G', 'H7H', 'H7K',
  'H7L', 'H7M', 'H7P', 'H7R', 'H7V', 'H7W', 'H7X', 'H7Y',
  'H8N', 'H8P', 'H8R', 'J0L', 'J2W', 'J2X', 'J2Y', 'J3A',
  'J3B', 'J3E', 'J3G', 'J3L', 'J3V', 'J3X', 'J3Y', 'J3Z',
  'J4B', 'J4G', 'J4H', 'J4J', 'J4K', 'J4L', 'J4M', 'J4N',
  'J4P', 'J4R', 'J4S', 'J4T', 'J4V', 'J4W', 'J4X', 'J4Y',
  'J4Z', 'J5A', 'J5B', 'J5C', 'J5R', 'J6A', 'J6V', 'J7A',
  'J7B', 'J7E', 'J7G', 'J7H', 'J7P'
];

/**
 * Valida si una ciudad está en el área de servicio (Montreal y Rivera Sur)
 * @param city - Nombre de la ciudad
 * @returns boolean - true si es una ciudad válida
 */
export function isValidServiceCity(city: string): boolean {
  const cityLower = city.toLowerCase().trim();
  // Montreal island municipalities and South Shore cities
  const validCities = [
    'montreal', 'montréal',
    'mont-royal', 'westmount', 'côté-saint-luc', 'cote-saint-luc',
    'montreal-ouest', 'montréal-ouest', 'hampstead', 'pointe-claire',
    'dollard-des ormeaux', 'dorval', 'kirkland', 'beaconsfield',
    'baie-d\'urfé', 'sainte-anne-de-bellevue', 'senneville',
    'longueuil', 'saint-lambert', 'brossard', 'saint-hubert',
    'greenfield park', 'la prairie', 'candiac', 'delson',
    'saint-constant', 'sainte-catherine', 'châteauguay',
    'mercier', 'kahnawake', 'boucherville',
    // Nuevas ciudades de domicilio
    'saint-bruno-de-montarville', 'saint bruno de montarville', 'saint-bruno',
    'varennes',
    'chambly',
    'saint-catherine', // ya estaba como sainte-catherine
    'saint-julie',
    'beloeil'
  ];
  return validCities.includes(cityLower);
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
