"use client";

import Link from 'next/link';
import { useProAuth } from '@/contexts/ProAuthContext';
import { SubscriptionCard } from '@/components/pro/dashboard/SubscriptionCard';

export default function DashboardPage() {
  const { proUser } = useProAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Hola, {proUser?.nombre}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Este es tu panel profesional. Edita tu perfil y gestiona tu suscripción.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/pro/dashboard/profile"
          className="rounded-[14px] border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-foreground">Tu perfil</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edita tu título, biografía, categoría, idiomas, redes y foto.
          </p>
        </Link>
        <SubscriptionCard />
      </div>
    </div>
  );
}
