import { useState, useEffect, useCallback, useRef } from 'react';

// Cache para normalización de texto
const normalizeCache = new Map<string, string>();

// Función avanzada para normalizar texto (quitar acentos, tildes, etc.) con cache
const normalizeText = (text: string): string => {
  if (!text) return '';
  
  if (normalizeCache.has(text)) {
    return normalizeCache.get(text)!;
  }
  
  const normalized = text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos (acentos, tildes)
    // Reemplazo exhaustivo de caracteres especiales
    .replace(/[àáâãäåāă]/g, 'a')
    .replace(/[èéêëēėę]/g, 'e')  
    .replace(/[ìíîïīįı]/g, 'i')
    .replace(/[òóôõöøōő]/g, 'o')
    .replace(/[ùúûüūų]/g, 'u')
    .replace(/[ýÿŷ]/g, 'y')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/đ/g, 'd')
    .replace(/ł/g, 'l')
    .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales pero mantener espacios
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim();
    
  normalizeCache.set(text, normalized);
  return normalized;
};

interface UseOptimizedSearchOptions {
  minLength?: number;
  debounceDelay?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
  normalizeSearch?: boolean; // Nueva opción para habilitar normalización
}

export function useOptimizedSearch(
  onSearch: (value: string) => void,
  options: UseOptimizedSearchOptions = {}
) {
  const {
    minLength = 2,
    debounceDelay = 800,
    enableCache = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutos
    normalizeSearch = true // Por defecto habilitado
  } = options;

  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Usar useRef para el caché para evitar re-renders
  const cacheRef = useRef<Map<string, number>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cacheTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Memoizar la función onSearch para evitar cambios innecesarios
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Función para actualizar el valor de búsqueda
  const updateSearchValue = useCallback((newValue: string) => {
    setSearchValue(newValue);
    setIsSearching(newValue.length >= minLength && newValue.trim() !== '');
  }, [minLength]);

  // Función para limpiar la búsqueda
  const clearSearch = useCallback(() => {
    console.log('🧹 useOptimizedSearch: clearSearch() llamado');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSearchValue('');
    setDebouncedValue('');
    setIsSearching(false);
    onSearchRef.current('');
  }, []);

  // Función para limpiar el caché
  const clearCache = useCallback(() => {
    cacheRef.current = new Map();
  }, []);

  // Efecto principal para el debounce de búsqueda
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si no hay texto o es muy corto, limpiar inmediatamente
    if (!searchValue.trim() || searchValue.trim().length < minLength) {
      if (!searchValue.trim()) {
        setDebouncedValue('');
        setIsSearching(false);
        onSearchRef.current('');
      } else {
        setIsSearching(false);
      }
      return;
    }

    // Normalizar la búsqueda si está habilitado
    const processedValue = normalizeSearch ? normalizeText(searchValue.trim()) : searchValue.trim().toLowerCase();

    // Debug de normalización
    if (normalizeSearch && searchValue.trim() !== processedValue) {
      console.log(`📝 Normalización: "${searchValue.trim()}" -> "${processedValue}"`);
    }

    // Verificar caché si está habilitado
    if (enableCache && cacheRef.current.has(processedValue)) {
      console.log('Usando resultado desde caché para:', processedValue);
      setDebouncedValue(processedValue);
      setIsSearching(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      console.log('🔍 Ejecutando búsqueda para:', processedValue);
      setDebouncedValue(processedValue);
      setIsSearching(false);
      
      // Agregar a caché
      if (enableCache) {
        cacheRef.current.set(processedValue, Date.now());
      }
      
      onSearchRef.current(processedValue);
    }, debounceDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, minLength, debounceDelay, enableCache, normalizeSearch]);

  // Efecto para limpiar caché automáticamente
  useEffect(() => {
    if (!enableCache) return;

    cacheTimeoutRef.current = setInterval(() => {
      console.log('Limpiando caché de búsquedas automáticamente');
      clearCache();
    }, cacheTimeout);

    return () => {
      if (cacheTimeoutRef.current) {
        clearInterval(cacheTimeoutRef.current);
      }
    };
  }, [enableCache, cacheTimeout, clearCache]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (cacheTimeoutRef.current) {
        clearInterval(cacheTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchValue,
    debouncedValue,
    isSearching,
    cacheSize: cacheRef.current.size,
    updateSearchValue,
    clearSearch,
    clearCache,
    // Estados útiles para la UI
    hasSearchText: searchValue.length > 0
  };
}
