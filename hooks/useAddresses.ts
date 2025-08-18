"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as addressService from '@/lib/services/addresses';
import { validateMontrealAddress } from '@/lib/utils/montreal-validation';
import { toast } from 'sonner';

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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [primaryAddress, setPrimaryAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

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
      setError(err.message || 'Error al cargar direcciones');
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
      setError(err.message || 'Error al refrescar direcciones');
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
        throw new Error(validation.error || 'Dirección no válida para Montreal');
      }
      
      const newAddress = await addressService.createAddress(addressData);
      
      // Actualizar inmediatamente el estado local antes de refrescar
      setAddresses(prev => {
        const newAddresses = [...prev, newAddress];
        
        // Si es la primera dirección, establecerla como principal y seleccionada inmediatamente
        if (prev.length === 0) {
          setSelectedAddress(newAddress);
          setPrimaryAddress(newAddress);
        }
        
        return newAddresses;
      });
      
      // Refrescar las direcciones para obtener el estado actualizado del servidor
      // NOTA: No await aquí para que el estado local se actualice inmediatamente
      refreshAddresses().catch(console.error);
      
      toast.success('Dirección agregada correctamente');
      return newAddress;
    } catch (err: any) {
      console.error('Error al crear dirección:', err);
      const errorMessage = err.message || 'Error al crear dirección';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAddresses]);

  // Actualizar dirección
  const updateAddress = useCallback(async (addressId: string, addressData: CreateAddressData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar que la dirección sea de Montreal
      const validation = validateMontrealAddress(addressData.city, addressData.zipCode);
      
      if (!validation.isValid) {
        throw new Error(validation.error || 'Dirección no válida para Montreal');
      }
      
      const updatedAddress = await addressService.updateAddress(addressId, addressData);
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? updatedAddress : addr
      ));
      
      // Si la dirección actualizada es la seleccionada, actualizarla
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(updatedAddress);
      }
      
      toast.success('Dirección actualizada correctamente');
      return updatedAddress;
    } catch (err: any) {
      console.error('Error al actualizar dirección:', err);
      const errorMessage = err.message || 'Error al actualizar dirección';
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
      
      toast.success('Dirección eliminada correctamente');
    } catch (err: any) {
      console.error('Error al eliminar dirección:', err);
      const errorMessage = err.message || 'Error al eliminar dirección';
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
        
      } catch (err) {
        console.error('Error al establecer dirección como principal:', err);
        // Mantener la selección aunque falle establecer como principal
      }
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
      
      toast.success('Dirección principal actualizada correctamente');
      return newPrimary;
    } catch (err: any) {
      console.error('Error al establecer dirección principal:', err);
      const errorMessage = err.message || 'Error al establecer dirección principal';
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

  // Cargar direcciones al montar el componente
  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      loadAddresses();
    } else if (!isAuthenticated) {
      // Reset cuando el usuario se desautentica
      setAddresses([]);
      setSelectedAddress(null);
      setPrimaryAddress(null);
      setHasInitialized(false);
    }
  }, [isAuthenticated, hasInitialized]); // Solo cuando cambie autenticación y no se haya inicializado

  return {
    addresses,
    selectedAddress,
    primaryAddress,
    isLoading,
    error,
    
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
