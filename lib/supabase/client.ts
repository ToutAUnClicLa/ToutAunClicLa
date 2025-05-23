import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Definir la URL de redirección para autenticación
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return undefined;
};

// Crear cliente de Supabase para uso en contextos cliente (navegador)
// Usa las variables de entorno expuestas para cliente
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'custom-auth-flow',
      },
    },
  }
);

// Configurar opciones para inicio de sesión con proveedores OAuth
export const authOptions = {
  redirectTo: getRedirectUrl(),
  // Otras opciones comunes para autenticación social
  queryParams: {
    access_type: 'offline',
    prompt: 'consent',
  },
};