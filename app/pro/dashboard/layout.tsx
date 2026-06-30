"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProAuth } from '@/contexts/ProAuthContext';
import { ProLogo } from '@/components/pro/ProLogo';
import { Button } from '@/components/pro/ui/button';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { proUser, loading, logout } = useProAuth();

  useEffect(() => {
    if (!loading && (!proUser || !proUser.verificado)) {
      router.replace('/pro/login');
    }
  }, [loading, proUser, router]);

  if (loading || !proUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
        <ProLogo />
        <div className="flex items-center gap-3">
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              logout();
              router.replace('/pro/login');
            }}
          >
            Salir
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
