import Link from 'next/link';
import { Button } from '@/components/pro/ui/button';
import { ProLandingHeader } from '@/components/pro/ProLandingHeader';

// Placeholder de la landing. La landing de ventas completa llega en el Día 15.
export default function ProHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ProLandingHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Pour les professionnels du Québec
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Ta carte professionnelle, en un clic.
        </h1>
        <p className="mt-4 max-w-xl text-balance text-muted-foreground">
          Crée ta carte digitale, partage-la par AirDrop et apparais dans le répertoire de services.
          Plus de papier, plus de clients.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/pro/register">
            <Button size="lg" className="w-full sm:w-auto">
              Crear cuenta
            </Button>
          </Link>
          <Link href="/pro/pricing">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Ver planes
            </Button>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground">
        Tout À Un Clic Là Pro · Montréal, Québec
      </footer>
    </div>
  );
}
