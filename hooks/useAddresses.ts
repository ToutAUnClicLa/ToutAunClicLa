"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useTranslation } from './useTranslation';
import * as addressService from '@/lib/services/addresses';
import { validateMontrealAddress } from '@/lib/utils/montreal-validation';
import { toast } from 'sonner';

// Función para notificar cambios de direcciones que requieren recarga del carrito
const notifyAddressChange = (action: string, address: any) => {
  console.log(`🏠 Dirección ${action}:`, {
    action,
    addressId: address?.id,
    city: address?.city,
    isPrimary: address?.isPrimary
  });
  
  // Disparar evento personalizado para que el carrito se recargue
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('addressChanged', {
      detail: { action, address }
    }));
  }
};

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary?: boolean;
}

export interface CreateAddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function useAddresses() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [primaryAddress, setPrimaryAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // ✅ NEW: Estado optimizado para prevenir race conditions en checkout
  const [isSyncingWithBackend, setIsSyncingWithBackend] = useState(false);
  const [lastSyncedAddressId, setLastSyncedAddressId] = useState<string | null>(null);
  const [syncStartTime, setSyncStartTime] = useState<number | null>(null);

  // Cargar direcciones
  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userAddresses = await addressService.getUserAddresses();
      setAddresses(userAddresses);
      
      // Encontrar la dirección principal
      const primary = userAddresses.find(addr => addr.isPrimary) || null;
      
      // Caso 1: Ya hay una dirección principal
      if (primary) {
        setPrimaryAddress(primary);
        setSelectedAddress(primary);
      } 
      // Caso 2: Solo hay una dirección y no es principal
      else if (userAddresses.length === 1) {
        try {
          await addressService.setPrimaryAddress(userAddresses[0].id);
          const updatedAddress = { ...userAddresses[0], isPrimary: true };
          setAddresses([updatedAddress]);
          setPrimaryAddress(updatedAddress);
          setSelectedAddress(updatedAddress);
        } catch (err) {
          console.error('Error al establecer dirección principal automáticamente:', err);
          setPrimaryAddress(null);
          setSelectedAddress(userAddresses[0]);
        }
      } 
      // Caso 3: Múltiples direcciones pero ninguna principal
      else if (userAddresses.length > 1) {
        try {
          await addressService.setPrimaryAddress(userAddresses[0].id);
          const updatedAddresses = userAddresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === userAddresses[0].id
          }));
          const newPrimary = updatedAddresses[0];
          setAddresses(updatedAddresses);
          setPrimaryAddress(newPrimary);
          setSelectedAddress(newPrimary);
        } catch (err) {
          console.error('Error al establecer dirección principal:', err);
          setPrimaryAddress(null);
          setSelectedAddress(userAddresses[0]);
        }
      } 
      // Caso 4: No hay direcciones
      else {
        setPrimaryAddress(null);
        setSelectedAddress(null);
      }
    } catch (err: any) {
      console.error('Error al cargar direcciones:', err);
      setError(err.message || t('addresses.errors.loadFailed'));
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  }, [isAuthenticated]); // SOLUCIÓN: quitar selectedAddress de las dependencias

  // Función para refrescar direcciones manualmente
  const refreshAddresses = useCallback(async () => {
    if (!isAuthenticated || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userAddresses = await addressService.getUserAddresses();
      setAddresses(userAddresses);
      
      // Encontrar la dirección principal
      const primary = userAddresses.find(addr => addr.isPrimary) || null;
      setPrimaryAddress(primary);
      
      // Sincronizar seleccionada con principal
      if (primary) {
        setSelectedAddress(primary);
      } else if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (err: any) {
      console.error('Error al refrescar direcciones:', err);
      setError(err.message || t('addresses.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Crear nueva dirección
  const createAddress = useCallback(async (addressData: CreateAddressData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar que la dirección sea de Montreal
      const validation = validateMontrealAddress(addressData.city, addressData.zipCode);
      
      if (!validation.isValid) {
        throw new Error(validation.error || t('addresses.validation.invalid'));
      }
      
      const newAddress = await addressService.createAddress(addressData);
      
      console.log('🏠 DIRECCIÓN CREADA - DEBUG COMPLETO:', {
        newAddress: {
          id: newAddress?.id,
          street: newAddress?.street,
          city: newAddress?.city,
          state: newAddress?.state,
          zipCode: newAddress?.zipCode,
          isPrimary: newAddress?.isPrimary,
          fullObject: newAddress
        },
        systemState: {
          currentAddressCount: addresses.length,
          wasFirstAddress: addresses.length === 0,
          timestamp: new Date().toISOString()
        },
        validation: {
          hasValidId: !!newAddress?.id,
          idType: typeof newAddress?.id,
          idLength: newAddress?.id?.length
        }
      });
      
      let finalAddress = { ...newAddress };
      
      // Si es la primera dirección, establecerla como principal automáticamente
      const wasFirstAddress = addresses.length === 0;
      
      if (wasFirstAddress) {
        // CRÍTICO: Establecer inmediatamente como principal sin esperar al backend
        finalAddress.isPrimary = true;
        
        console.log('✅ PRIMERA DIRECCIÓN - Auto-selección inmediata:', {
          finalAddress: {
            id: finalAddress.id,
            street: finalAddress.street,
            city: finalAddress.city,
            isPrimary: true
          },
          action: 'Auto-selected as first and primary address'
        });
        
        // Actualizar inmediatamente todos los estados
        setAddresses([finalAddress]);
        setSelectedAddress(finalAddress);
        setPrimaryAddress(finalAddress);
        
        // Intentar establecer como principal en backend (sin bloquear)
        addressService.setPrimaryAddress(finalAddress.id)
          .then(() => {
            console.log('✅ Backend confirmó dirección principal');
          })
          .catch((err) => {
            console.warn('⚠️ Backend no pudo confirmar principal, pero funciona localmente:', err);
          });
      } else {
        // Si ya hay direcciones, agregar la nueva pero mantener la principal actual
        const updatedAddresses = [...addresses, finalAddress];
        setAddresses(updatedAddresses);
        
        // Solo cambiar selección si la nueva dirección es principal
        if (finalAddress.isPrimary) {
          setSelectedAddress(finalAddress);
          setPrimaryAddress(finalAddress);
          // Actualizar las demás para que no sean principales
          const addressesWithUpdatedPrimary = updatedAddresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === finalAddress.id
          }));
          setAddresses(addressesWithUpdatedPrimary);
        }
      }
      
      // ✅ OPTIMIZED: Marcar inmediatamente como sincronizado para UX fluida
      console.log('🔄 Sincronización instantánea - Primera dirección lista para uso');
      
      // CRÍTICO: Marcar inmediatamente como sincronizado para permitir checkout sin delays
      setLastSyncedAddressId(finalAddress.id);
      
      // Solo para primera dirección, hacer verificación asíncrona en background
      if (wasFirstAddress) {
        // Verificación en background sin bloquear UX
        console.log('🔄 Verificando persistencia en backend (no bloqueante)');
        
        // Ejecutar verificación sin await para no bloquear
        Promise.resolve().then(async () => {
          try {
            // Esperar un momento para dar tiempo al backend
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verificar una sola vez
            const currentAddresses = await addressService.getUserAddresses();
            const primaryAddress = currentAddresses.find((addr: Address) => addr.isPrimary);
            
            if (primaryAddress && primaryAddress.id === finalAddress.id) {
              console.log('✅ Backend confirma dirección principal:', primaryAddress.id);
            } else if (currentAddresses.some(addr => addr.id === finalAddress.id)) {
              console.log('✅ Dirección confirmada en backend');
            } else {
              console.log('⚠️ Verificación pendiente - dirección funcional localmente');
            }
          } catch (error) {
            console.log('⚠️ Verificación en background falló - dirección funcional localmente');
          }
        });
      }
      
      // PASO 3: Notificar cambio inmediatamente
      console.log('✅ Notificando cambio de dirección');
      notifyAddressChange('creada', finalAddress);
      
      // PASO 4: Notificación adicional solo para primera dirección
      if (wasFirstAddress) {
        setTimeout(() => {
          console.log('🎉 Primera dirección creada exitosamente');
          notifyAddressChange('primera dirección creada', finalAddress);
        }, 50); // Reducido de 100ms a 50ms
      }
      
      // Mostrar mensaje éxito personalizado para primera dirección
      if (wasFirstAddress) {
        toast.success(t('addresses.success.firstAddressCreated') || t('addresses.success.created'));
      } else {
        toast.success(t('addresses.success.created'));
      }
      
      console.log('🎯 DIRECCIÓN FINAL RETORNADA:', {
        finalAddress: {
          id: finalAddress.id,
          street: finalAddress.street,
          city: finalAddress.city,
          isPrimary: finalAddress.isPrimary
        },
        currentSelectedAddress: selectedAddress ? {
          id: selectedAddress.id,
          city: selectedAddress.city,
          isPrimary: selectedAddress.isPrimary
        } : null,
        wasFirstAddress: addresses.length === 0,
        timestamp: new Date().toISOString()
      });
      
      return finalAddress;
    } catch (err: any) {
      console.error('Error al crear dirección:', err);
      const errorMessage = err.message || t('addresses.errors.saveFailed');
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addresses, refreshAddresses, t]);

  // Actualizar dirección
  const updateAddress = useCallback(async (addressId: string, addressData: CreateAddressData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar que la dirección sea de Montreal
      const validation = validateMontrealAddress(addressData.city, addressData.zipCode);
      
      if (!validation.isValid) {
        throw new Error(validation.error || t('addresses.validation.invalid'));
      }
      
      const updatedAddress = await addressService.updateAddress(addressId, addressData);
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? updatedAddress : addr
      ));
      
      // Si la dirección actualizada es la seleccionada, actualizarla
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(updatedAddress);
      }
      
      // Notificar actualización de dirección para recarga del carrito
      notifyAddressChange('actualizada', updatedAddress);
      
      toast.success(t('addresses.success.updated'));
      return updatedAddress;
    } catch (err: any) {
      console.error('Error al actualizar dirección:', err);
      const errorMessage = err.message || t('addresses.errors.saveFailed');
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedAddress]);

  // Eliminar dirección
  const deleteAddress = useCallback(async (addressId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await addressService.deleteAddress(addressId);
      
      // Obtener las direcciones restantes
      const remainingAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(remainingAddresses);
      
      // Si eliminamos la dirección principal o solo queda una dirección
      const wasDeleted = selectedAddress?.id === addressId || primaryAddress?.id === addressId;
      
      if (remainingAddresses.length === 1) {
        // Si solo queda una dirección, establecerla como principal automáticamente
        try {
          await addressService.setPrimaryAddress(remainingAddresses[0].id);
          const updatedAddress = { ...remainingAddresses[0], isPrimary: true };
          setAddresses([updatedAddress]);
          setPrimaryAddress(updatedAddress);
          setSelectedAddress(updatedAddress);
        } catch (err) {
          console.error('Error al establecer dirección principal:', err);
          setSelectedAddress(remainingAddresses[0]);
        }
      } else if (remainingAddresses.length > 1 && wasDeleted) {
        // Si había múltiples direcciones y eliminamos la principal, establecer la primera como principal
        try {
          await addressService.setPrimaryAddress(remainingAddresses[0].id);
          const updatedAddresses = remainingAddresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === remainingAddresses[0].id
          }));
          setAddresses(updatedAddresses);
          setPrimaryAddress(updatedAddresses[0]);
          setSelectedAddress(updatedAddresses[0]);
        } catch (err) {
          console.error('Error al establecer nueva dirección principal:', err);
          setSelectedAddress(remainingAddresses[0]);
        }
      } else if (remainingAddresses.length === 0) {
        // No quedan direcciones
        setSelectedAddress(null);
        setPrimaryAddress(null);
      }
      
      // Notificar eliminación de dirección para recarga del carrito
      notifyAddressChange('eliminada', { id: addressId });
      
      toast.success(t('addresses.success.deleted'));
    } catch (err: any) {
      console.error('Error al eliminar dirección:', err);
      const errorMessage = err.message || t('addresses.errors.deleteFailed');
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addresses, selectedAddress, primaryAddress]);

  // Seleccionar dirección - SIEMPRE la hace principal automáticamente
  const selectAddress = useCallback(async (address: Address) => {
    setSelectedAddress(address);
    
    // Si la dirección seleccionada no es la principal, establecerla como principal
    if (!address.isPrimary) {
      try {
        await addressService.setPrimaryAddress(address.id);
        
        // Actualizar el estado local inmediatamente
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isPrimary: addr.id === address.id
        })));
        
        // Actualizar la dirección principal
        setPrimaryAddress({ ...address, isPrimary: true });
        
        // Actualizar la dirección seleccionada con el flag isPrimary
        setSelectedAddress({ ...address, isPrimary: true });
        
        // Notificar cambio de dirección principal para recarga del carrito
        notifyAddressChange('establecida como principal', { ...address, isPrimary: true });
        
      } catch (err) {
        console.error('Error al establecer dirección como principal:', err);
        // Mantener la selección aunque falle establecer como principal
      }
    } else {
      // Si ya era principal, solo notificar selección
      notifyAddressChange('seleccionada', address);
    }
  }, []);

  // Establecer dirección principal
  const setPrimaryAddressFunc = useCallback(async (addressId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await addressService.setPrimaryAddress(addressId);
      
      // Actualizar el estado local
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isPrimary: addr.id === addressId
      })));
      
      const newPrimary = addresses.find(addr => addr.id === addressId) || null;
      setPrimaryAddress(newPrimary);
      
      // Notificar cambio de dirección principal para recarga del carrito
      notifyAddressChange('establecida como principal (directa)', newPrimary);
      
      toast.success(t('addresses.success.primarySet'));
      return newPrimary;
    } catch (err: any) {
      console.error('Error al establecer dirección principal:', err);
      const errorMessage = err.message || t('addresses.errors.primaryFailed');
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addresses]);

  // Limpiar dirección seleccionada
  const clearSelectedAddress = useCallback(() => {
    setSelectedAddress(null);
  }, []);

  // ✅ SIMPLIFIED: Verificación simple para checkout - si hay dirección seleccionada, es seguro
  const isAddressSafeForCheckout = useCallback(() => {
    const hasValidSelection = !!(selectedAddress?.id);
    
    console.log('🔍 CHECKOUT SAFETY CHECK:', {
      hasValidSelection,
      selectedAddressId: selectedAddress?.id,
      addressesCount: addresses.length
    });
    
    // ✅ SIMPLIFICADO: Si hay una dirección seleccionada con ID válido, permitir checkout
    // El backend ya maneja la validación real durante el checkout
    const isSafe = hasValidSelection;
    
    console.log('🎯 Checkout safe:', isSafe);
    return isSafe;
  }, [selectedAddress, addresses.length]);

  // Ya no necesitamos timeout porque no bloqueamos nunca

  // Cargar direcciones al montar el componente - Optimizado
  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      console.log('🔄 Inicializando hook useAddresses...');
      loadAddresses();
    } else if (!isAuthenticated) {
      // Reset cuando el usuario se desautentica
      console.log('🔄 Reseteando direcciones (usuario no autenticado)');
      setAddresses([]);
      setSelectedAddress(null);
      setPrimaryAddress(null);
      setHasInitialized(false);
      setIsSyncingWithBackend(false);
      setSyncStartTime(null);
      setLastSyncedAddressId(null);
    }
  }, [isAuthenticated, hasInitialized, loadAddresses]);

  return {
    addresses,
    selectedAddress,
    primaryAddress,
    isLoading,
    error,
    
    // 🚨 NEW: Estados críticos para checkout
    isSyncingWithBackend,
    lastSyncedAddressId,
    isAddressSafeForCheckout,
    
    // Acciones
    loadAddresses,
    refreshAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setPrimaryAddress: setPrimaryAddressFunc,
    clearSelectedAddress,
    
    // Utilidades
    hasAddresses: addresses.length > 0,
    addressCount: addresses.length,
  };
}
