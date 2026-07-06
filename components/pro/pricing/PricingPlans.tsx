"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { createCheckout } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { cn } from '@/lib/utils';

type Periodo = 'mensual' | 'anual';
type PlanId = 'free' | 'pro' | 'max';

// Solo datos estructurales (id, precio, destacado). Todo el texto sale de translations.
interface Plan {
  id: PlanId;
  precio: { mensual: number; anual: number };
  destacado?: boolean;
}

const PLANS: Plan[] = [
  { id: 'free', precio: { mensual: 0, anual: 0 } },
  { id: 'pro', precio: { mensual: 25, anual: 250 } },
  { id: 'max', precio: { mensual: 45, anual: 450 }, destacado: true },
];

const PLAN_FEATURE_KEYS: Record<PlanId, string[]> = {
  free: ['f1', 'f2'],
  pro: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
  max: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
};

export function PricingPlans() {
  const router = useRouter();
  const { proUser } = useProAuth();
  const { t } = useTranslation();
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
      toast.error((err as ProApiError).message || t('pro.pricingPage.checkoutError'));
      setLoadingPlan(null);
    }
  };

  const periodos: { id: Periodo; label: string }[] = [
    { id: 'mensual', label: t('pro.pricingPage.monthly') },
    { id: 'anual', label: t('pro.pricingPage.yearly') },
  ];

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex items-center justify-center">
        <div className="inline-flex rounded-[10px] border border-border p-1">
          {periodos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriodo(p.id)}
              className={cn(
                'rounded-[7px] px-4 py-1.5 text-sm font-medium transition-colors',
                periodo === p.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
              {p.id === 'anual' && (
                <span className="ml-1.5 text-xs opacity-90">{t('pro.pricingPage.yearlyNote')}</span>
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
          const nombre = t(`pro.pricingPage.plans.${plan.id}.name`);
          const descripcion = t(`pro.pricingPage.plans.${plan.id}.description`);
          const features = PLAN_FEATURE_KEYS[plan.id].map((k) =>
            t(`pro.pricingPage.plans.${plan.id}.${k}`),
          );
          const unidad = periodo === 'mensual' ? t('pro.pricingPage.perMonth') : t('pro.pricingPage.perYear');

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
                  {t('pro.pricingPage.recommended')}
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">{nombre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  ${precio}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.id === 'free' ? '' : ` CAD /${unidad}`}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {plan.id === 'free' ? (
                  esActual ? (
                    <Button variant="secondary" className="w-full" disabled>
                      {t('pro.pricingPage.currentPlan')}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => router.push(proUser ? '/pro/dashboard' : '/pro/register')}
                    >
                      {proUser ? t('pro.pricingPage.goToDashboard') : t('pro.pricingPage.createAccount')}
                    </Button>
                  )
                ) : esActual ? (
                  <Button variant="secondary" className="w-full" disabled>
                    {t('pro.pricingPage.currentPlan')}
                  </Button>
                ) : (
                  <Button
                    variant={plan.destacado ? 'primary' : 'secondary'}
                    className="w-full"
                    loading={loadingPlan === plan.id}
                    onClick={() => onSubscribe(plan.id as 'pro' | 'max')}
                  >
                    {proUser ? t('pro.pricingPage.subscribe') : t('pro.pricingPage.start')}
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
