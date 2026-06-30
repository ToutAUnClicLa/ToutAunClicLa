import Link from 'next/link';
import { ProLogo } from '@/components/pro/ProLogo';
import { BackButton } from '@/components/pro/ui/back-button';
import { PricingPlans } from '@/components/pro/pricing/PricingPlans';

export default function PricingPage() {
  return (
    <div>
      <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
        <Link href="/pro">
          <ProLogo />
        </Link>
        <Link href="/pro/login" className="text-sm font-medium text-primary hover:underline">
          Iniciar sesión
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <BackButton href="/pro" label="Inicio" />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Planes para profesionales
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Empieza gratis y sube a Pro o Max cuando quieras. Prueba de 7 días en los planes de pago.
          </p>
        </div>

        <PricingPlans />
      </main>
    </div>
  );
}
