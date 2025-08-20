/**
 * Configuración de Supabase para el frontend
 * Utilizamos las mismas credenciales que el backend para consistencia
 */

import { createClient } from '@supabase/supabase-js';

// URLs y keys de Supabase desde variables de entorno
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Cliente público de Supabase para el frontend
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Configuración de URLs para redirección usando Supabase
export const AUTH_CONFIG = {
  // URL donde Supabase redirigirá después del login de Google
  GOOGLE_REDIRECT_URL: process.env.NODE_ENV === 'production' 
    ? 'https://www.toutaunclicla.com/auth/callback'
    : 'http://localhost:3000/auth/callback',
  
  // URL del backend para sincronizar usuario
  BACKEND_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  
  // URL base de Supabase para OAuth (se usa internamente)
  SUPABASE_AUTH_URL: SUPABASE_URL ? `${SUPABASE_URL}/auth/v1` : undefined
};

export default supabase;
