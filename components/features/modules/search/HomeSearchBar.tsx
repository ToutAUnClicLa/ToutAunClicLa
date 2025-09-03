"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { Search, X, Package, Store, Clock, ShoppingBag } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/services/products';
import { useInteractionPreloader } from '@/hooks/useProductPreloader';

interface SearchResult {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_principal: string;
  categoria_id: number;
  categoria_nombre: string;
  subcategoria?: string;
  stock: number;
}

// Global product cache for all search instances
interface ProductCache {
  products: Product[];
  lastUpdated: number;
  isLoading: boolean;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
// Categories: 1 = Productos, 3 = Boutique

// Singleton cache shared across all HomeSearchBar instances
let globalProductCache: ProductCache | null = null;
const cacheListeners = new Set<() => void>();

// Subscribe to cache updates
const subscribeToCacheUpdates = (callback: () => void) => {
  cacheListeners.add(callback);
  return () => cacheListeners.delete(callback);
};

// Notify all listeners when cache updates
const notifyCacheUpdate = () => {
  cacheListeners.forEach(callback => callback());
};

// Cache para normalización de texto (increased size)
const normalizeCache = new Map<string, string>();

// Cache para resultados de búsqueda filtrados
const searchResultsCache = new Map<string, { results: SearchResult[]; timestamp: number }>();
const SEARCH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Función debounce nativa (sin dependencias externas)
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(null, args);
      timeoutId = null;
    }, delay);
  }) as T & { cancel: () => void };
  
  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debouncedFunction;
}

// Función avanzada para normalizar texto (quitar acentos franceses, españoles, etc.) con cache
const normalizeText = (text: string): string => {
  if (!text) return '';
  
  if (normalizeCache.has(text)) {
    return normalizeCache.get(text)!;
  }
  
  const normalized = text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos (acentos, tildes, diéresis)
    // Reemplazos específicos para caracteres franceses y españoles
    .replace(/[àáâãäåāă]/g, 'a')
    .replace(/[èéêëēėę]/g, 'e')  
    .replace(/[ìíîïīįı]/g, 'i')
    .replace(/[òóôõöøōő]/g, 'o')
    .replace(/[ùúûüūų]/g, 'u')
    .replace(/[ýÿŷ]/g, 'y')
    .replace(/ñ/g, 'n')           // Ñ española
    .replace(/ç/g, 'c')           // Ç francesa
    .replace(/œ/g, 'oe')          // Ligadura francesa
    .replace(/æ/g, 'ae')          // Ligadura
    .replace(/ß/g, 'ss')          // Alemán
    .replace(/đ/g, 'd')           // Croata/vietnamita
    .replace(/ł/g, 'l')           // Polaco
    .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales pero mantener espacios
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim();
    
  normalizeCache.set(text, normalized);
  if (process.env.NODE_ENV === 'development' && text !== normalized && Math.random() < 0.1) {
    console.log(`📝 Normalización: "${text}" -> "${normalized}"`);
  }
  return normalized;
};

const HomeSearchBar = memo(function HomeSearchBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingPromiseRef = useRef<Promise<void> | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [cacheStatus, setCacheStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  
  // Use interaction preloader for performance optimization
  const { triggerPreload } = useInteractionPreloader();

  // Initialize product cache and load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Initialize cache if needed
    initializeProductCache();
    
    // Subscribe to cache updates
    const unsubscribe = subscribeToCacheUpdates(() => {
      if (globalProductCache) {
        setCacheStatus(globalProductCache.isLoading ? 'loading' : 'ready');
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize product cache with smart loading strategy and comprehensive error handling
  const initializeProductCache = useCallback(async () => {
    // Return if cache is fresh
    if (globalProductCache && 
        Date.now() - globalProductCache.lastUpdated < CACHE_DURATION && 
        !globalProductCache.isLoading) {
      setCacheStatus('ready');
      return;
    }
    
    // Prevent multiple simultaneous loads
    if (loadingPromiseRef.current) {
      await loadingPromiseRef.current;
      return;
    }
    
    setCacheStatus('loading');
    
    const loadPromise = (async () => {
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`🔄 Loading product cache... (attempt ${retryCount + 1}/${maxRetries})`);
          
          // Mark cache as loading
          globalProductCache = {
            products: globalProductCache?.products || [],
            lastUpdated: globalProductCache?.lastUpdated || 0,
            isLoading: true
          };
          notifyCacheUpdate();
          
          const { getProducts } = await import('@/lib/services/products');
          
          // Load with timeout and fallback strategy
          const loadPromises = [
            Promise.race([
              getProducts({ 
                category: 1, // Productos
                page: 1, 
                limit: 500, // Load more products for better local filtering
                sortBy: 'nombre',
                sortOrder: 'asc'
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout loading productos')), 15000)
              )
            ]),
            Promise.race([
              getProducts({ 
                category: 3, // Boutique
                page: 1, 
                limit: 500,
                sortBy: 'nombre',
                sortOrder: 'asc'
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout loading boutique')), 15000)
              )
            ])
          ];

          const results = await Promise.allSettled(loadPromises);
          
          // Process results and handle partial failures
          const allProducts: Product[] = [];
          let hasErrors = false;
          
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              const productResponse = result.value as { products: any[] };
              allProducts.push(...productResponse.products);
            } else {
              hasErrors = true;
              console.warn(`Failed to load category ${index === 0 ? 'productos' : 'boutique'}:`, result.reason);
            }
          });
          
          // Accept partial success if we have some products
          if (allProducts.length > 0) {
            // Update global cache
            globalProductCache = {
              products: allProducts,
              lastUpdated: Date.now(),
              isLoading: false
            };
            
            console.log(`✅ Product cache loaded: ${allProducts.length} products${hasErrors ? ' (with some errors)' : ''}`);
            setCacheStatus('ready');
            notifyCacheUpdate();
            return; // Success - exit retry loop
          } else {
            throw new Error('No products loaded from any category');
          }
          
        } catch (error) {
          retryCount++;
          console.error(`❌ Error loading product cache (attempt ${retryCount}):`, error);
          
          if (retryCount >= maxRetries) {
            // Keep old cache if available, but mark as not loading
            if (globalProductCache && globalProductCache.products.length > 0) {
              globalProductCache.isLoading = false;
              setCacheStatus('ready'); // Use stale cache
              console.log('🔄 Using stale cache due to loading errors');
            } else {
              setCacheStatus('error');
            }
            notifyCacheUpdate();
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          }
        }
      }
    })();
    
    loadingPromiseRef.current = loadPromise;
    await loadPromise;
    loadingPromiseRef.current = null;
  }, []);
  
  // Optimized search function using local cache
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    // Check search results cache first
    const cacheKey = normalizeText(query);
    const cachedResult = searchResultsCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < SEARCH_CACHE_DURATION) {
      console.log('💾 Using cached search results for:', query);
      setSearchResults(cachedResult.results.slice(0, 2));
      setTotalResults(cachedResult.results.length);
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('🔍 Searching locally:', query);
      
      // Ensure cache is ready
      if (!globalProductCache || globalProductCache.isLoading) {
        await initializeProductCache();
      }
      
      if (!globalProductCache || globalProductCache.products.length === 0) {
        console.warn('⚠️ No products in cache for search');
        setSearchResults([]);
        setTotalResults(0);
        return;
      }
      
      const allProducts = globalProductCache.products;
      
      console.log(`📦 Searching through ${allProducts.length} cached products`);
      
      // Only log debug info in development and for specific cases
      if (process.env.NODE_ENV === 'development' && query.length >= 3) {
        const directMatches = allProducts.filter(product => 
          product.nombre.toLowerCase().includes(query.toLowerCase())
        );
        console.log(`🔍 Direct matches for "${query}": ${directMatches.length}`);
      }
      
      // Filtrar y mapear productos con búsqueda inteligente
      const filteredProducts = allProducts.filter(product => {
        // Los productos ya están filtrados por categoría (1: productos, 3: boutique)
        // Ya no incluimos comidas (categoria_id === 2)

        // BÚSQUEDA POR PALABRA EXACTA con normalización
        const normalizedProductName = normalizeText(product.nombre || '');
        const normalizedDescription = normalizeText(product.descripcion || '');
        const normalizedSearchQuery = normalizeText(query);
        
        // Dividir en palabras (filtrar palabras muy cortas)
        const searchWords = normalizedSearchQuery.split(' ').filter(word => word.length >= 2);
        const nameWords = normalizedProductName.split(' ');
        const descriptionWords = normalizedDescription.split(' ');
        
        // Verificar si alguna palabra de búsqueda coincide exactamente
        let exactWordMatches = 0;
        
        searchWords.forEach(searchWord => {
          // Buscar coincidencia exacta de palabra en nombre
          if (nameWords.includes(searchWord)) {
            exactWordMatches++;
          }
          // Buscar coincidencia exacta de palabra en descripción
          else if (descriptionWords.includes(searchWord)) {
            exactWordMatches++;
          }
        });
        
        // CRITERIO: Debe tener al menos una palabra exacta en nombre o descripción
        const isMatch = exactWordMatches > 0;
        
        return isMatch;
      });

      // Calcular puntuación de relevancia basada en palabras exactas
      const scoredProducts = filteredProducts.map(product => {
        const normalizedProductName = normalizeText(product.nombre || '');
        const normalizedDescription = normalizeText(product.descripcion || '');
        const normalizedSearchQuery = normalizeText(query);
        
        const searchWords = normalizedSearchQuery.split(' ').filter(word => word.length >= 2);
        const nameWords = normalizedProductName.split(' ');
        const descriptionWords = normalizedDescription.split(' ');
        
        let score = 0;
        let nameMatches = 0;
        let descriptionMatches = 0;
        
        // Contar coincidencias exactas por ubicación
        searchWords.forEach(searchWord => {
          if (nameWords.includes(searchWord)) {
            nameMatches++;
          } else if (descriptionWords.includes(searchWord)) {
            descriptionMatches++;
          }
        });
        
        // Puntuación: priorizar nombre > descripción
        score += nameMatches * 1000;        // Palabras exactas en nombre: alta prioridad
        score += descriptionMatches * 300;   // Palabras exactas en descripción: media prioridad
        
        // Bonus por múltiples palabras encontradas
        const totalMatches = nameMatches + descriptionMatches;
        if (totalMatches > 1) {
          score += totalMatches * 100; // Bonus por múltiples coincidencias
        }
        
        // Pequeño bonus por stock disponible
        if (product.stock > 0) score += 5;
        
        // Only log scoring issues if score is unexpectedly 0
        if (process.env.NODE_ENV === 'development' && score === 0) {
          const originalName = product.nombre.toLowerCase();
          const searchTerm = query.toLowerCase();
          if (originalName.includes(searchTerm)) {
            console.warn(`❌ Scoring issue: "${product.nombre}" contains "${searchTerm}" but has score 0`);
          }
        }
        
        return { ...product, searchScore: score };
      });
      
      // Filtrar solo productos con score > 0 (que realmente coinciden)
      const validProducts = scoredProducts.filter(p => p.searchScore > 0);
      
      // Guardar el total de resultados VÁLIDOS para mostrar en el botón
      const totalResults = validProducts.length;
      
      console.log(`🎯 Found ${totalResults} matching products`);
      
      // Sort by relevance and create results
      const allResults: SearchResult[] = validProducts
        .sort((a, b) => b.searchScore - a.searchScore)
        .map(product => ({
          id: product.id,
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          imagen_principal: product.imagen_principal,
          categoria_id: product.categoria_id,
          categoria_nombre: product.categorias?.nombre || (product.categoria_id === 1 ? 'Productos' : 'Boutique'),
          subcategoria: product.subcategorias?.nombre,
          stock: product.stock
        }));
      
      // Cache the full results
      searchResultsCache.set(cacheKey, {
        results: allResults,
        timestamp: Date.now()
      });
      
      // Clean old cache entries periodically
      if (searchResultsCache.size > 100) {
        const now = Date.now();
        const entriesToDelete: string[] = [];
        
        searchResultsCache.forEach((value, key) => {
          if (now - value.timestamp > SEARCH_CACHE_DURATION) {
            entriesToDelete.push(key);
          }
        });
        
        entriesToDelete.forEach(key => {
          searchResultsCache.delete(key);
        });
      }
      
      // Return top 2 for preview
      const previewResults = allResults.slice(0, 2);
      
      console.log(`💾 Cached ${allResults.length} results, showing ${previewResults.length} in preview`);
      
      setSearchResults(previewResults);
      setTotalResults(totalResults);
    } catch (error) {
      console.error('❌ Error searching:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  }, [initializeProductCache]);

  // More aggressive debounce since we're using local cache
  const debouncedSearch = useMemo(
    () => debounce((query: string) => performSearch(query), 300), // Reduced from 600ms to 300ms for better UX
    [performSearch]
  );

  // Limpiar debounce al desmontar
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Manejar cambios en el input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Guardar búsqueda reciente
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Manejar búsqueda principal
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    console.log('🎯 Ejecutando búsqueda:', searchQuery);
    
    // Save the search query before clearing it
    const currentQuery = searchQuery.trim();
    saveRecentSearch(currentQuery);
    
    // Smart navigation based on cached results analysis
    const cacheKey = normalizeText(currentQuery);
    const cachedResult = searchResultsCache.get(cacheKey);
    
    if (cachedResult && cachedResult.results.length > 0) {
      // Use full cached results for navigation decision (more accurate than preview)
      const productsCount = cachedResult.results.filter(r => r.categoria_id === 1).length;
      const boutiqueCount = cachedResult.results.filter(r => r.categoria_id === 3).length;
      
      console.log(`🎯 Navigation decision based on ${cachedResult.results.length} cached results:`);
      console.log(`   📦 Products: ${productsCount}, 🏪 Boutique: ${boutiqueCount}`);
      
      if (boutiqueCount > productsCount) {
        console.log('→ Navigating to /boutique (majority in cached results)');
        router.push(`/boutique?search=${encodeURIComponent(currentQuery)}`);
      } else {
        console.log('→ Navigating to /productos (majority in cached results or tie)');
        router.push(`/productos?search=${encodeURIComponent(currentQuery)}`);
      }
    } else {
      // Fallback: search both categories and decide based on preview results
      if (searchResults.length > 0) {
        const productsCount = searchResults.filter(r => r.categoria_id === 1).length;
        const boutiqueCount = searchResults.filter(r => r.categoria_id === 3).length;
        
        console.log(`🎯 Fallback navigation based on ${searchResults.length} preview results:`);
        console.log(`   📦 Products: ${productsCount}, 🏪 Boutique: ${boutiqueCount}`);
        
        if (boutiqueCount > productsCount) {
          console.log('→ Navigating to /boutique (majority in preview results)');
          router.push(`/boutique?search=${encodeURIComponent(currentQuery)}`);
        } else {
          console.log('→ Navigating to /productos (majority in preview results or tie)');
          router.push(`/productos?search=${encodeURIComponent(currentQuery)}`);
        }
      } else {
        console.log('→ No results, navigating to /productos by default');
        router.push(`/productos?search=${encodeURIComponent(currentQuery)}`);
      }
    }
    
    // Clean up UI state after navigation
    setSearchQuery('');
    setIsFocused(false);
    setSearchResults([]);
    setTotalResults(0);
  }, [searchQuery, searchResults, saveRecentSearch, router]);

  // Manejar selección de resultado
  const handleResultClick = useCallback((result: SearchResult) => {
    saveRecentSearch(result.nombre);
    
    // Navegar directamente al producto (productos y boutique)
    if (result.categoria_id === 1) {
      router.push(`/productos/${result.id}`);
    } else if (result.categoria_id === 3) { // Boutique es categoria_id === 3
      router.push(`/boutique/${result.id}`);
    }
    
    // Limpiar
    setSearchQuery('');
    setIsFocused(false);
    setSearchResults([]);
    setTotalResults(0);
  }, [saveRecentSearch, router]);

  // Manejar búsqueda rápida
  const handleQuickSearch = useCallback((term: string) => {
    setSearchQuery(term);
    performSearch(term);
    inputRef.current?.focus();
  }, [performSearch]);

  // Función para formatear precio
  const formatPrice = useMemo(() => {
    const formatter = new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return (price: number) => formatter.format(price);
  }, []);

  // Función para limpiar búsquedas recientes
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/20 overflow-hidden transition-all duration-200 hover:shadow-xl">
          <div className="flex-1 flex items-center">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 ml-3 sm:ml-4" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                setIsFocused(true);
                // Trigger preload on first interaction
                triggerPreload();
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('landing.search.placeholder')}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 placeholder-gray-500 focus:outline-none text-sm sm:text-base bg-transparent"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setTotalResults(0);
                  inputRef.current?.focus();
                }}
                className="p-1.5 sm:p-2 hover:bg-gray-100/50 rounded-full mr-1 sm:mr-2 transition-colors"
                aria-label={t('landing.search.clearSearch')}
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
            aria-label={t('landing.search.button')}
          >
            <span className="hidden sm:inline text-sm">{t('landing.search.button')}</span>
            <Search className="h-4 w-4 sm:hidden" />
          </button>
        </div>

        {/* Dropdown de resultados - NO SE SUPERPONE, empuja contenido hacia abajo */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
              style={{ position: 'relative' }} // Cambiado de absolute a relative
            >
              {/* Estado de carga mejorado */}
              {(isSearching || cacheStatus === 'loading') && (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    {cacheStatus === 'loading' ? 'Cargando productos...' : t('landing.search.searchingMessage')}
                  </div>
                </div>
              )}
              
              {/* Error de caché con fallback */}
              {cacheStatus === 'error' && !isSearching && searchQuery.length >= 2 && (
                <div className="p-4 text-center text-red-500">
                  <div className="text-sm font-medium">Error al cargar productos</div>
                  <div className="text-xs mt-1">Búsqueda temporalmente limitada</div>
                  <div className="mt-3 space-y-2">
                    <button 
                      onClick={initializeProductCache}
                      className="block w-full px-3 py-2 bg-red-100 hover:bg-red-200 rounded text-sm transition-colors"
                    >
                      🔄 Reintentar carga
                    </button>
                    <button 
                      onClick={handleSearch}
                      className="block w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                    >
                      🔍 Buscar en línea
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    La búsqueda en línea puede ser más lenta
                  </div>
                </div>
              )}

              {/* Resultados con imágenes de productos - máximo 2 */}
              {!isSearching && cacheStatus === 'ready' && searchResults.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('landing.search.showingResults', { count: searchResults.length, plural: searchResults.length !== 1 ? 's' : '' })}</span>
                    <button
                      onClick={handleSearch}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium normal-case"
                    >
                      {t('landing.search.viewAllResults')} ({totalResults})
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchResults.map(result => (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-2 flex items-center hover:bg-gray-50 rounded-lg transition-colors group"
                        whileHover={{ x: 2 }}
                      >
                        {/* Imagen del producto */}
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 mr-3 rounded-lg overflow-hidden bg-gray-100">
                          {result.imagen_principal ? (
                            <Image
                              src={result.imagen_principal}
                              alt={result.nombre}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Información del producto */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
                            {result.nombre}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="flex items-center">
                              {result.categoria_id === 1 ? (
                                <Package className="h-3 w-3 mr-1 text-indigo-400" />
                              ) : result.categoria_id === 3 ? (
                                <Store className="h-3 w-3 mr-1 text-purple-400" />
                              ) : (
                                <Package className="h-3 w-3 mr-1 text-gray-400" />
                              )}
                              {result.categoria_id === 1 ? t('landing.search.products') : 
                               result.categoria_id === 3 ? t('landing.search.boutique') : 'Otro'}
                            </span>
                            {result.stock > 0 ? (
                              <span className="text-green-600 text-xs">• {t('landing.search.inStock')}</span>
                            ) : (
                              <span className="text-red-600 text-xs">• {t('landing.search.outOfStock')}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Precio */}
                        <div className="text-right ml-3">
                          <div className="text-sm font-bold text-gray-900">
                            {formatPrice(result.precio)}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Botón de ver todos los resultados en mobile */}
                  <div className="mt-3 px-2 sm:hidden">
                    <button
                      onClick={handleSearch}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      {t('landing.search.viewAllResults')} ({totalResults})
                    </button>
                  </div>
                </div>
              )}

              {/* Mensaje cuando se escribe solo 1 carácter */}
              {!isSearching && searchQuery.length === 1 && (
                <div className="p-6 text-center">
                  <div className="text-gray-400 mb-3">
                    <Search className="h-10 w-10 mx-auto mb-2" />
                  </div>
                  <p className="text-gray-600 font-medium text-sm">{t('landing.search.minCharactersTitle')}</p>
                  <p className="text-gray-500 text-xs mt-1">{t('landing.search.minCharactersMessage')}</p>
                </div>
              )}

              {/* Sin resultados después de buscar */}
              {!isSearching && cacheStatus === 'ready' && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="p-6 text-center">
                  <div className="text-gray-400 mb-3">
                    <Search className="h-10 w-10 mx-auto mb-2" />
                  </div>
                  <p className="text-gray-600 font-medium text-sm">{t('landing.search.keepTypingTitle')}</p>
                  <p className="text-gray-500 text-xs mt-1">{t('landing.search.keepTypingMessage')}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    {t('landing.search.searchingFor', { query: searchQuery })}
                  </div>
                </div>
              )}

              {/* Solo búsquedas recientes - sin sección de populares */}
              {!searchQuery && recentSearches.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {t('landing.search.recentSearches')}
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      {t('landing.search.clearSearch')}
                    </button>
                  </div>
                  <div className="px-2 pb-2">
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center group"
                      >
                        <Clock className="h-4 w-4 text-gray-400 mr-2 group-hover:text-indigo-500" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default HomeSearchBar;