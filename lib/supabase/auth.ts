import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export const supabase = createClientComponentClient<Database>();

export type SignInWithEmailParams = {
  email: string;
  password: string;
};

export type SignUpWithEmailParams = {
  email: string;
  password: string;
  nombre: string;
};

export async function signInWithEmail({ email, password }: SignInWithEmailParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // After successful sign in, get the user profile
  const { data: profile, error: profileError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (profileError) {
    // If profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          nombre: email.split('@')[0], // Use email username as default name
          fecha_creacion: new Date().toISOString(),
        },
      ]);

    if (insertError) throw insertError;
  }

  return data;
}

export async function signUpWithEmail({ email, password, nombre }: SignUpWithEmailParams) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
      },
    },
  });

  if (authError) throw authError;

  // Create user profile in public.usuarios table
  const { error: profileError } = await supabase
    .from('usuarios')
    .insert([
      {
        nombre,
        email,
        fecha_creacion: new Date().toISOString(),
      },
    ]);

  if (profileError) throw profileError;

  return authData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}