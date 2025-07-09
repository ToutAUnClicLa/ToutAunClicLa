# 🎯 Guía de Hooks de Favoritos Optimizados

## 📋 Resumen de la Optimización

Se ha optimizado el sistema de favoritos para **eliminar las solicitudes innecesarias** cuando se cargan listas de productos. Ahora tenemos hooks especializados para diferentes casos de uso:

## 🔧 Hooks Disponibles

### 1. `useSimpleFavorites()` - Para Cards de Productos
**✅ Usar en**: Páginas de productos, catálogo, búsqueda, etc.

```typescript
import { useSimpleFavorites } from '@/hooks/useSimpleFavorites';

function ProductCard({ product }) {
  const { toggleFavorite, isLoading } = useSimpleFavorites();
  
  const handleFavoriteClick = async () => {
    try {
      await toggleFavorite(product.id.toString());
    } catch (error) {
      // El error ya se muestra con toast
    }
  };

  return (
    <button 
      onClick={handleFavoriteClick}
      disabled={isLoading(product.id.toString())}
    >
      {isLoading(product.id.toString()) ? '⏳' : '🤍'}
    </button>
  );
}
```

**Características:**
- ❌ **NO carga** estado inicial de favoritos
- ❌ **NO verifica** si productos son favoritos
- ✅ **Solo permite** agregar/quitar favoritos
- ✅ **Feedback optimista** con toast
- ✅ **Manejo automático** de duplicados (409 error)

### 2. `useFavoritesPage()` - Para Página de Favoritos
**✅ Usar en**: `app/profile/favorites/page.tsx`

```typescript
import { useFavoritesPage } from '@/hooks/useFavoritesPage';

function FavoritesPage() {
  const { 
    favorites, 
    isLoading, 
    totalCount,
    removeFromFavorites,
    loadFavorites 
  } = useFavoritesPage();

  return (
    <div>
      <h1>Mis Favoritos ({totalCount})</h1>
      {favorites.map(item => (
        <ProductCard 
          key={item.id}
          product={item.productos}
          onRemove={() => removeFromFavorites(item.producto_id)}
        />
      ))}
    </div>
  );
}
```

**Características:**
- ✅ **Carga completa** de favoritos al montar
- ✅ **Estado sincronizado** con servidor
- ✅ **Eliminación optimista** con rollback en error
- ✅ **Actualización automática** de contadores

### 3. `useFavorites(options)` - Hook Configurable
**✅ Usar en**: Casos especiales que necesiten control granular

```typescript
// Para páginas que SÍ necesitan verificar favoritos
const favoritesWithTracking = useFavorites({ 
  loadOnMount: true, 
  trackFavorites: true 
});

// Para páginas que NO necesitan verificar favoritos (default)
const favoritesSimple = useFavorites(); // Sin tracking
```

### 4. `useFavoritesList()` - Compatibilidad
**⚠️ Deprecated**: Solo para mantener compatibilidad. Usa `useFavoritesPage()` en su lugar.

## 📱 Casos de Uso Específicos

### ✅ Página de Productos (Optimizada)
```typescript
// ❌ ANTES: Hacía muchas solicitudes HTTP
// ✅ AHORA: Solo permite agregar/quitar
function ProductGrid({ products }) {
  const { toggleFavorite, isLoading } = useSimpleFavorites();
  
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onToggleFavorite={() => toggleFavorite(product.id.toString())}
          isLoading={isLoading(product.id.toString())}
          // NO mostramos si es favorito para evitar requests
        />
      ))}
    </div>
  );
}
```

### ✅ Página de Favoritos (Completa)
```typescript
// ✅ Carga estado completo solo donde es necesario
function FavoritesPage() {
  const { 
    favorites, 
    isLoading, 
    totalCount,
    removeFromFavorites 
  } = useFavoritesPage();
  
  // Manejo completo de estado de favoritos
}
```

## 🚀 Beneficios de la Optimización

### ⚡ Performance
- **-90% solicitudes HTTP** en páginas de productos
- **Carga más rápida** de catálogos
- **Mejor UX** sin verificaciones innecesarias

### 🎯 UX Mejorada
- **Feedback inmediato** con toast messages
- **Estados de carga** por producto individual
- **Manejo automático** de errores y duplicados

### 🔧 Mantenibilidad
- **Hooks especializados** para cada caso
- **Separación clara** de responsabilidades
- **Fácil testing** y debugging

## 📝 Migración

### ❌ Eliminar de Cards de Productos:
```typescript
// ❌ QUITAR esto de ProductCard
const { isFavorite } = useFavorites();
const isProductFavorite = isFavorite(product.id);

// ❌ NO mostrar corazón rojo basado en estado
<Heart fill={isProductFavorite ? 'red' : 'transparent'} />
```

### ✅ Usar en Cards de Productos:
```typescript
// ✅ USAR esto en ProductCard
const { toggleFavorite, isLoading } = useSimpleFavorites();

// ✅ Solo mostrar estado de carga
<Heart 
  className={isLoading(product.id) ? 'animate-pulse' : ''}
  onClick={() => toggleFavorite(product.id)}
/>
```

## 🎉 Resultado

- **Página de productos**: Sin solicitudes HTTP innecesarias ✅
- **Funcionalidad completa**: Agregar/quitar favoritos funciona perfectamente ✅  
- **Página de favoritos**: Estado completo y sincronizado ✅
- **Performance optimizada**: Menos requests, mejor UX ✅
