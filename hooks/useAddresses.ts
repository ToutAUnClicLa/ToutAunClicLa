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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar direcciones
  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userAddresses = await addressService.getUserAddresses();
      setAddresses(userAddresses);
      
      // Si hay direcciones y no hay una seleccionada, seleccionar la primera
      if (userAddresses.length > 0 && !selectedAddress) {
        setSelectedAddress(userAddresses[0]);
      }
    } catch (err: any) {
      console.error('Error al cargar direcciones:', err);
      setError(err.message || 'Error al cargar direcciones');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedAddress]);

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
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress); // Seleccionar la nueva dirección
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
  }, []);

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
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      // Si la dirección eliminada era la seleccionada, seleccionar otra
      if (selectedAddress?.id === addressId) {
        const remainingAddresses = addresses.filter(addr => addr.id !== addressId);
        setSelectedAddress(remainingAddresses.length > 0 ? remainingAddresses[0] : null);
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
  }, [addresses, selectedAddress]);

  // Seleccionar dirección
  const selectAddress = useCallback((address: Address) => {
    setSelectedAddress(address);
  }, []);

  // Limpiar dirección seleccionada
  const clearSelectedAddress = useCallback(() => {
    setSelectedAddress(null);
  }, []);

  // Cargar direcciones al montar el componente
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return {
    addresses,
    selectedAddress,
    isLoading,
    error,
    
    // Acciones
    loadAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    clearSelectedAddress,
    
    // Utilidades
    hasAddresses: addresses.length > 0,
    addressCount: addresses.length,
  };
}
