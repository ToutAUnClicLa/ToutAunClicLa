"use client";

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook para consumir el contexto de autenticación
 * Este hook reemplaza la implementación anterior que duplicaba lógica
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}
