import { useEffect, useRef } from 'react';

/**
 * Hook to intelligently preload essential product data
 * This reduces the initial load time for search functionality
 */
export function useProductPreloader() {
  const preloadedRef = useRef(false);

  useEffect(() => {
    // Only preload once per session
    if (preloadedRef.current) return;

    const preloadProducts = async () => {
      try {
        // Preload on user interaction or after a short delay
        const preloadDelay = 2000; // 2 seconds after component mount

        setTimeout(async () => {
          console.log('🚀 Preloading essential product data...');
          
          const { getProducts } = await import('@/lib/services/products');
          
          // Preload a smaller subset of products for faster initial search
          const preloadPromises = [
            getProducts({ 
              category: 1, // Productos
              page: 1, 
              limit: 100, // Smaller initial set
              sortBy: 'nombre',
              sortOrder: 'asc'
            }),
            getProducts({ 
              category: 3, // Boutique  
              page: 1, 
              limit: 100,
              sortBy: 'nombre', 
              sortOrder: 'asc'
            })
          ];

          await Promise.all(preloadPromises);
          console.log('✅ Essential product data preloaded');
          preloadedRef.current = true;
        }, preloadDelay);
        
      } catch (error) {
        console.warn('⚠️ Product preloading failed:', error);
      }
    };

    // Start preloading
    preloadProducts();
  }, []);

  return {
    isPreloaded: preloadedRef.current
  };
}

/**
 * Hook for preloading on user interaction
 * More aggressive preloading triggered by user engagement
 */
export function useInteractionPreloader() {
  const hasPreloadedRef = useRef(false);

  const triggerPreload = async () => {
    if (hasPreloadedRef.current) return;
    hasPreloadedRef.current = true;

    try {
      console.log('👆 User interaction detected - preloading full product set...');
      
      const { getProducts } = await import('@/lib/services/products');
      
      // Load full product sets
      Promise.all([
        getProducts({ 
          category: 1, 
          page: 1, 
          limit: 500,
          sortBy: 'nombre',
          sortOrder: 'asc'
        }),
        getProducts({ 
          category: 3, 
          page: 1, 
          limit: 500,
          sortBy: 'nombre',
          sortOrder: 'asc'
        })
      ]).then(() => {
        console.log('✅ Full product cache ready for search');
      });
      
    } catch (error) {
      console.warn('⚠️ Interaction preloading failed:', error);
      hasPreloadedRef.current = false; // Allow retry
    }
  };

  return { triggerPreload };
}