import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

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
    },
  }
);