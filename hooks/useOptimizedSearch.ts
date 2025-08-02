import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedSearchOptions {
  minLength?: number;
  debounceDelay?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
}

export function useOptimizedSearch(
  onSearch: (value: string) => void,
  options: UseOptimizedSearchOptions = {}
) {
  const {
    minLength = 2,
    debounceDelay = 800,
    enableCache = true,
    cacheTimeout = 5 * 60 * 1000 // 5 minutos
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
    setIsSearching(newValue.length >= minLength);
  }, [minLength]);

  // Función para limpiar la búsqueda
  const clearSearch = useCallback(() => {
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

    const trimmedValue = searchValue.trim().toLowerCase();

    // Verificar caché si está habilitado
    if (enableCache && cacheRef.current.has(trimmedValue)) {
      console.log('Usando resultado desde caché para:', trimmedValue);
      setDebouncedValue(trimmedValue);
      setIsSearching(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      console.log('Ejecutando búsqueda para:', trimmedValue);
      setDebouncedValue(trimmedValue);
      setIsSearching(false);
      
      // Agregar a caché
      if (enableCache) {
        cacheRef.current.set(trimmedValue, Date.now());
      }
      
      onSearchRef.current(trimmedValue);
    }, debounceDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, minLength, debounceDelay, enableCache]);

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
