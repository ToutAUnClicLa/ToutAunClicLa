"use client";

import Link from 'next/link';
import { useProAuth } from '@/contexts/ProAuthContext';
import { ProLogo } from '@/components/pro/ProLogo';
import { Button } from '@/components/pro/ui/button';

export function ProLandingHeader() {
  const { proUser, loading } = useProAuth();

  return (
    <header className="flex h-16 items-center justify-between px-4 sm:px-6">
      <ProLogo />

      {loading ? (
        <span className="h-8 w-24" />
      ) : proUser ? (
        <Link href="/pro/dashboard" className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {proUser.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proUser.foto_url} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {(proUser.nombre || '?').slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="text-sm font-medium text-foreground">
              {`${proUser.nombre} ${proUser.apellido || ''}`.trim()}
            </span>
          </div>
          <Button size="sm">Dashboard</Button>
        </Link>
      ) : (
        <Link href="/pro/login" className="text-sm font-medium text-primary hover:underline">
          Iniciar sesión
        </Link>
      )}
    </header>
  );
}
