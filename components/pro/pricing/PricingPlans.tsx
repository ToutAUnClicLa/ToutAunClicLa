"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { createCheckout } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { cn } from '@/lib/utils';

type Periodo = 'mensual' | 'anual';
type PlanId = 'free' | 'pro' | 'max';

interface Plan {
  id: PlanId;
  nombre: string;
  precio: { mensual: number; anual: number };
  descripcion: string;
  features: string[];
  destacado?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    nombre: 'Free',
    precio: { mensual: 0, anual: 0 },
    descripcion: 'Para empezar a aparecer.',
    features: [
      'Listado básico en el directorio',
      'Nombre y categoría visibles',
    ],
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: { mensual: 25, anual: 250 },
    descripcion: 'Tu tarjeta digital completa.',
    features: [
      'Tarjeta digital + Apple Wallet y AirDrop',
      'Perfil público con URL única',
      'Hasta 5 redes sociales',
      'vCard descargable',
      'Listado estándar con foto',
      'Analítics básico',
    ],
  },
  {
    id: 'max',
    nombre: 'Max',
    precio: { mensual: 45, anual: 450 },
    descripcion: 'Máxima visibilidad y herramientas.',
    destacado: true,
    features: [
      'Todo lo de Pro',
      'Destacado primero en tu categoría',
      'Banner publicitario',
      'Galería de proyectos',
      'Redes sociales ilimitadas',
      'Analítics avanzado',
      '1 tarjeta física NFC incluida',
    ],
  },
];

export function PricingPlans() {
  const router = useRouter();
  const { proUser } = useProAuth();
  const [periodo, setPeriodo] = useState<Periodo>('mensual');
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const onSubscribe = async (plan: 'pro' | 'max') => {
    if (!proUser) {
      router.push('/pro/register');
      return;
    }
    setLoadingPlan(plan);
    try {
      const url = await createCheckout(plan, periodo);
      window.location.href = url;
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo iniciar el pago.');
      setLoadingPlan(null);
    }
  };

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex items-center justify-center">
        <div className="inline-flex rounded-[10px] border border-border p-1">
          {(['mensual', 'anual'] as Periodo[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriodo(p)}
              className={cn(
                'rounded-[7px] px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                periodo === p
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p}
              {p === 'anual' && (
                <span className="ml-1.5 text-xs opacity-90">· 2 meses gratis</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const precio = plan.precio[periodo];
          const esActual = proUser?.tier === plan.id;
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-[14px] border bg-card p-6 text-left',
                plan.destacado ? 'border-2 border-primary' : 'border-border',
              )}
            >
              {plan.destacado && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  Recomendado
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">{plan.nombre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.descripcion}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  ${precio}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.id === 'free' ? '' : ` CAD /${periodo === 'mensual' ? 'mes' : 'año'}`}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {plan.id === 'free' ? (
                  esActual ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Tu plan actual
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => router.push(proUser ? '/pro/dashboard' : '/pro/register')}
                    >
                      {proUser ? 'Ir al panel' : 'Crear cuenta'}
                    </Button>
                  )
                ) : esActual ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Tu plan actual
                  </Button>
                ) : (
                  <Button
                    variant={plan.destacado ? 'primary' : 'secondary'}
                    className="w-full"
                    loading={loadingPlan === plan.id}
                    onClick={() => onSubscribe(plan.id as 'pro' | 'max')}
                  >
                    {proUser ? 'Suscribirme' : 'Empezar'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
