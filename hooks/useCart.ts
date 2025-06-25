"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  cartService,
  type CartItem,
  type CartSummary,
  type Coupon
} from '@/lib/services/cart';
import { useAuth } from '@/hooks/useAuth';

interface UseCartOptions {
  autoLoad?: boolean;
  page?: number;
  limit?: number;
}

export function useCart(options: UseCartOptions = {}) {
  const { autoLoad = true, page = 1, limit = 20 } = options;
  const { user, isAuthenticated } = useAuth();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Cargar carrito del usuario
  const loadCart = useCallback(async (pageNum = page, limitNum = limit) => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, clearing cart state');
      setItems([]);
      setSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        total: 0,
      });
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading cart for user:', user.id);
      const response = await cartService.getCart(pageNum, limitNum);
      console.log('Cart loaded successfully:', response);
      
      setItems(response.cartItems || []);
      setSummary(response.summary);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Error loading cart:', err);
      
      // Si es un error de autenticación, no mostrar como error
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        console.log('Authentication error, user needs to login');
        setError(null);
      } else {
        setError('Error al cargar el carrito');
        toast.error('Error al cargar el carrito');
      }
      
      setItems([]);
      setSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        total: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, isAuthenticated, user]);

  // Agregar producto al carrito
  const addToCart = useCallback(async (productId: number, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return false;
    }

    try {
      setError(null);
      console.log('Adding product to cart:', { productId, quantity });
      
      const newItem = await cartService.addToCart(productId, quantity);
      console.log('Product added successfully:', newItem);
      
      // Recargar carrito para obtener datos actualizados
      await loadCart();
      toast.success('Producto agregado al carrito');
      return true;
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError('Error al agregar producto al carrito');
      
      // Mostrar error específico al usuario
      if (err.message?.includes('unidades disponibles')) {
        toast.error(err.message);
      } else if (err.message?.includes('no encontrado')) {
        toast.error('Producto no encontrado');
      } else if (err.message?.includes('iniciar sesión')) {
        toast.error('Debes iniciar sesión para agregar productos');
      } else {
        toast.error('Error al agregar producto al carrito');
      }
      return false;
    }
  }, [isAuthenticated, user, loadCart]);

  // Actualizar cantidad de un producto
  const updateQuantity = useCallback(async (itemId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para actualizar el carrito');
      return false;
    }

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      setError(null);
      
      await cartService.updateCartItem(itemId, quantity);
      
      // Actualizar estado local
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, cantidad: quantity }
          : item
      ));
      
      // Recargar carrito para obtener totales actualizados
      await loadCart();
      toast.success('Cantidad actualizada');
      return true;
    } catch (err: any) {
      console.error('Error updating cart quantity:', err);
      setError('Error al actualizar cantidad');
      toast.error(err.message || 'Error al actualizar cantidad');
      return false;
    }
  }, [isAuthenticated, user, loadCart]);

  // Remover producto del carrito
  const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para modificar el carrito');
      return false;
    }

    try {
      setError(null);
      
      await cartService.removeFromCart(itemId);
      
      // Actualizar estado local
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      // Recargar carrito para obtener totales actualizados
      await loadCart();
      toast.success('Producto eliminado del carrito');
      return true;
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      setError('Error al eliminar producto del carrito');
      toast.error(err.message || 'Error al eliminar producto del carrito');
      return false;
    }
  }, [isAuthenticated, user, loadCart]);

  // Limpiar carrito completo
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para limpiar el carrito');
      return false;
    }

    try {
      setError(null);
      
      const result = await cartService.clearCart();
      
      setItems([]);
      setSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        total: 0,
      });
      setAppliedCoupon(null);
      
      toast.success(`Carrito limpiado (${result.itemsRemoved} productos eliminados)`);
      return true;
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      setError('Error al limpiar carrito');
      toast.error(err.message || 'Error al limpiar carrito');
      return false;
    }
  }, [isAuthenticated, user]);

  // Aplicar cupón
  const applyCoupon = useCallback(async (couponCode: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para aplicar cupones');
      return false;
    }

    try {
      setError(null);
      
      const result = await cartService.applyCoupon(couponCode);
      
      setAppliedCoupon(result.coupon);
      setSummary(result.summary);
      
      toast.success('Cupón aplicado correctamente');
      return true;
    } catch (err: any) {
      console.error('Error applying coupon:', err);
      setError('Error al aplicar cupón');
      toast.error(err.message || 'Error al aplicar cupón');
      return false;
    }
  }, [isAuthenticated, user]);

  // Función pública para refrescar carrito
  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  // Verificar si un producto está en el carrito
  const isInCart = useCallback((productId: number) => {
    return items.some(item => item.producto_id === productId);
  }, [items]);

  // Obtener cantidad de un producto en el carrito
  const getProductQuantity = useCallback((productId: number) => {
    const item = items.find(item => item.producto_id === productId);
    return item?.cantidad || 0;
  }, [items]);

  // Cargar carrito cuando el usuario cambie
  useEffect(() => {
    if (autoLoad) {
      loadCart();
    }
  }, [autoLoad, loadCart]);

  // Limpiar estado cuando el usuario se deslogea
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      setError(null);
      setSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        total: 0,
      });
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setAppliedCoupon(null);
    }
  }, [isAuthenticated]);

  return {
    // Estado
    items,
    isLoading,
    error,
    summary,
    pagination,
    appliedCoupon,
    
    // Funciones
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    refreshCart,
    
    // Utilidades
    isInCart,
    getProductQuantity,
    
    // Estado derivado
    isEmpty: items.length === 0,
    totalItems: summary?.totalItems || 0,
    totalQuantity: summary?.totalQuantity || 0,
    subtotal: summary?.subtotal || 0,
    total: summary?.total || 0,
  };
}
