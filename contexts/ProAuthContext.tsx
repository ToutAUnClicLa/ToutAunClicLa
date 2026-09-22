"use client";

import { useEffect } from 'react';
import { useProAuthStore } from '@/lib/pro/authStore';

export type { ProUser } from '@/lib/pro/authStore';
export { useProAuth } from '@/lib/pro/authStore';

/** Primera hidratación del store Pro. No refetch si ya está hydrated. */
export function ProAuthHydrate() {
  const ensureSession = useProAuthStore((s) => s.ensureSession);
  useEffect(() => {
    void ensureSession();
  }, [ensureSession]);
  return null;
}
