"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { Search, X, Package, Store, Clock, ShoppingBag } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

// Cache para normalización de texto
const normalizeCache = new Map<string, string>();

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
    .replace(/ñ/g, 'n') // Ñ específica
    .replace(/ç/g, 'c') // Ç específica
    .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales pero mantener espacios
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim();
    
  normalizeCache.set(text, normalized);
  console.log(`📝 Normalización: "${text}" -> "${normalized}"`);
  return normalized;
};

const HomeSearchBar = memo(function HomeSearchBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
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

  // Función de búsqueda con API real - optimizada con cache y solo 3 resultados
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('🔍 Buscando:', query);
      
      // Nueva estrategia: obtener productos generales y hacer búsqueda inteligente en frontend
      const { getProducts } = await import('@/lib/services/products');
      const response = await getProducts({ 
        page: 1, 
        limit: 100, // Obtener suficientes productos para buscar localmente
        sortBy: 'nombre', // Ordenar por nombre para mejor búsqueda
        sortOrder: 'asc'
      });
      
      console.log('📦 Productos obtenidos para búsqueda local:', response.products.length);
      
      // Debug: Ver categorías de los productos
      response.products.forEach(product => {
        console.log(`Producto: ${product.nombre}, Categoria ID: ${product.categoria_id}, Categoria: ${product.categorias.nombre}`);
      });
      
      // Filtrar y mapear productos con búsqueda inteligente
      const filteredProducts = response.products.filter(product => {
        // 1. Filtrar comidas por múltiples criterios
        const categoryName = product.categorias.nombre.toLowerCase();
        const isComidas = product.categoria_id === 3 || 
                         categoryName.includes('comida') ||
                         categoryName.includes('food') ||
                         categoryName.includes('aliment') ||
                         categoryName.includes('cuisine') ||
                         categoryName.includes('meal');
        
        if (isComidas) {
          console.log(`❌ Filtrado por comidas: ${product.nombre}`);
          return false;
        }

        // 2. Búsqueda inteligente con múltiples estrategias
        const normalizedProductName = normalizeText(product.nombre);
        const normalizedSearchQuery = normalizeText(query);
        const normalizedDescription = product.descripcion ? normalizeText(product.descripcion) : '';
        
        // Estrategia 1: Búsqueda exacta en texto normalizado
        const exactMatchName = normalizedProductName.includes(normalizedSearchQuery);
        const exactMatchDescription = normalizedDescription.includes(normalizedSearchQuery);
        
        // Estrategia 2: Búsqueda por palabras individuales
        const searchWords = normalizedSearchQuery.split(' ').filter(word => word.length > 1);
        const productWords = normalizedProductName.split(' ');
        const wordsMatch = searchWords.every(searchWord => 
          productWords.some(productWord => 
            productWord.includes(searchWord) || searchWord.includes(productWord)
          )
        );
        
        // Estrategia 3: Búsqueda al inicio de palabras (para "caf" -> "café")
        const startsWithMatch = productWords.some(productWord => 
          searchWords.some(searchWord => productWord.startsWith(searchWord))
        );
        
        const isMatch = exactMatchName || exactMatchDescription || wordsMatch || startsWithMatch;
        
        if (isMatch) {
          console.log(`✅ ENCONTRADO: "${product.nombre}"`);
          console.log(`   Producto normalizado: "${normalizedProductName}"`);
          console.log(`   Búsqueda normalizada: "${normalizedSearchQuery}"`);
          console.log(`   Exacta: ${exactMatchName}, Palabras: ${wordsMatch}, Inicio: ${startsWithMatch}`);
        }
        
        return isMatch;
      });

      // Calcular puntuación de relevancia y ordenar
      const scoredProducts = filteredProducts.map(product => {
        const normalizedProductName = normalizeText(product.nombre);
        const normalizedSearchQuery = normalizeText(query);
        
        let score = 0;
        
        // Puntuación más alta para coincidencia exacta
        if (normalizedProductName === normalizedSearchQuery) score += 100;
        
        // Puntuación alta para inicio de nombre
        if (normalizedProductName.startsWith(normalizedSearchQuery)) score += 80;
        
        // Puntuación media para contiene el término
        if (normalizedProductName.includes(normalizedSearchQuery)) score += 60;
        
        // Puntuación por palabras individuales
        const searchWords = normalizedSearchQuery.split(' ');
        const productWords = normalizedProductName.split(' ');
        const wordMatches = searchWords.filter(searchWord => 
          productWords.some(productWord => productWord.includes(searchWord))
        ).length;
        score += (wordMatches / searchWords.length) * 40;
        
        // Bonus por stock disponible
        if (product.stock > 0) score += 5;
        
        console.log(`📊 "${product.nombre}" - Score: ${score}`);
        
        return { ...product, searchScore: score };
      });
      
      // Guardar el total de resultados para mostrar en el botón
      const totalResults = scoredProducts.length;
      
      // Ordenar por relevancia y tomar solo 2 para preview
      const mappedResults: SearchResult[] = scoredProducts
        .sort((a, b) => b.searchScore - a.searchScore)
        .slice(0, 2)
        .map(product => ({
          id: product.id,
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          imagen_principal: product.imagen_principal,
          categoria_id: product.categoria_id,
          categoria_nombre: product.categorias.nombre,
          subcategoria: product.subcategorias?.nombre,
          stock: product.stock
        }));
      
      console.log('🎯 Productos después del filtro:', mappedResults.length);
      console.log('📊 Total de resultados encontrados:', totalResults);
      setSearchResults(mappedResults);
      setTotalResults(totalResults);
    } catch (error) {
      console.error('❌ Error searching:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce más agresivo para evitar demasiadas peticiones
  const debouncedSearch = useMemo(
    () => debounce((query: string) => performSearch(query), 600),
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
    saveRecentSearch(searchQuery);
    
    // Determinar a qué categoría ir basándose en los resultados (solo productos y boutique)
    if (searchResults.length > 0) {
      // Contar resultados por categoría (sin incluir comidas)
      const productsCount = searchResults.filter(r => r.categoria_id === 1).length;
      const boutiqueCount = searchResults.filter(r => r.categoria_id === 2).length;
      
      if (boutiqueCount > productsCount) {
        router.push(`/boutique?search=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(`/productos?search=${encodeURIComponent(searchQuery)}`);
      }
    } else {
      // Por defecto ir a productos
      router.push(`/productos?search=${encodeURIComponent(searchQuery)}`);
    }
    
    // Limpiar y cerrar
    setSearchQuery('');
    setIsFocused(false);
    setSearchResults([]);
    setTotalResults(0);
  }, [searchQuery, searchResults, saveRecentSearch, router]);

  // Manejar selección de resultado
  const handleResultClick = useCallback((result: SearchResult) => {
    saveRecentSearch(result.nombre);
    
    // Navegar directamente al producto (solo productos y boutique)
    if (result.categoria_id === 1) {
      router.push(`/productos/${result.id}`);
    } else if (result.categoria_id === 2) {
      router.push(`/boutique/${result.id}`);
    }
    // No incluimos categoria_id === 3 (comidas) ya que están filtradas
    
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
              onFocus={() => setIsFocused(true)}
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
              {/* Estado de carga */}
              {isSearching && (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    {t('landing.search.searchingMessage')}
                  </div>
                </div>
              )}

              {/* Resultados con imágenes de productos - máximo 3 */}
              {!isSearching && searchResults.length > 0 && (
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
                              ) : (
                                <Store className="h-3 w-3 mr-1 text-purple-400" />
                              )}
                              {result.categoria_id === 1 ? t('landing.search.products') : t('landing.search.boutique')}
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
              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
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