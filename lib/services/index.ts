/**
 * Exportaciones principales de servicios
 * Proporciona acceso unificado a todos los servicios de la aplicación
 */

// Re-exportaciones principales organizadas
export { 
  productsService,
  type Product,
  type ProductsResponse,
  type ProductFilters,
  type Category,
  type Subcategory 
} from './products';

export {
  cartService,
  type CartItem,
  type CartProduct
} from './cart';

export {
  categoriesService
} from './categories';
