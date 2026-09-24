"use client";

import { useEffect, useState } from 'react';
import { getProToken } from '@/lib/pro/api';
import { useProAuthStore } from '@/lib/pro/authStore';

export function useProHeaderAccountLoading() {
  const loading = useProAuthStore((s) => s.loading);
  const hydrated = useProAuthStore((s) => s.hydrated);
  const proUser = useProAuthStore((s) => s.proUser);
  const [awaitingTokenUser, setAwaitingTokenUser] = useState(false);

  useEffect(() => {
    if (!useProAuthStore.getState().hydrated && getProToken()) {
      setAwaitingTokenUser(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) setAwaitingTokenUser(false);
  }, [hydrated]);

  if (proUser) return false;
  return loading || awaitingTokenUser;
}

export function ProHeaderUserSkeleton() {
  return (
    <div className="flex items-center gap-2" aria-busy="true" aria-live="polite">
      <span className="pro-skeleton h-8 w-8 rounded-full" />
      <span className="pro-skeleton hidden h-4 w-24 sm:block" />
    </div>
  );
}
