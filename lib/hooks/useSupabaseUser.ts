"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase/client';

export function useSupabaseUser() {
  const { user: clerkUser, isLoaded } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSupabaseUser() {
      if (!clerkUser) {
        setSupabaseUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data: user, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('clerk_id', clerkUser.id)
          .single();

        if (error) throw error;
        setSupabaseUser(user);
      } catch (error) {
        console.error('Error loading Supabase user:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadSupabaseUser();
    }
  }, [clerkUser, isLoaded]);

  return { user: supabaseUser, loading: loading || !isLoaded };
}