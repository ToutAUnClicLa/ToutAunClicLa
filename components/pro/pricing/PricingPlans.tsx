"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  createCheckout,
  getSubscription,
  changeSubscription,
  type SubscriptionState,
} from '@/lib/pro/endpoints';
import { Button } from '@/components/pro/ui/button';
import { cn } from '@/lib/utils';

type Periodo = 'mensual' | 'anual';
type PlanId = 'free' | 'pro' | 'max';

// Datos estructurales. El texto sale de translations. `antes` no se cobra.
interface Plan {
  id: PlanId;
  precio: { mensual: number; anual: number };
  // Lista anterior. Solo display; el cobro sigue siendo precio.
  antes?: { mensual: number; anual: number };
  destacado?: boolean;
}

const PLANS: Plan[] = [
  { id: 'free', precio: { mensual: 0, anual: 0 } },
  { id: 'pro', precio: { mensual: 25, anual: 250 }, antes: { mensual: 35, anual: 350 } },
  { id: 'max', precio: { mensual: 45, anual: 450 }, antes: { mensual: 55, anual: 550 }, destacado: true },
];

const PLAN_FEATURE_KEYS: Record<PlanId, string[]> = {
  free: ['f1', 'f2'],
  pro: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
  max: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
};

export function PricingPlans() {
  const router = useRouter();
  const { proUser, refresh } = useProAuth();
  const { t } = useTranslation();
  const [periodo, setPeriodo] = useState<Periodo>('mensual');
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [sub, setSub] = useState<SubscriptionState['subscription']>(null);

  // El plan actual se determina por plan + periodo + estado (viene de
  // /me/subscription), no solo por el tier — así Max mensual ≠ Max anual.
  useEffect(() => {
    if (!proUser) return;
    getSubscription()
      .then((s) => setSub(s.subscription))
      .catch(() => {});
  }, [proUser]);

  const hasActiveSub = !!sub && (sub.estado === 'active' || sub.estado === 'trialing');

  const onSubscribe = async (plan: 'pro' | 'max') => {
    if (!proUser) {
      router.push('/pro/register');
      return;
    }
    setLoadingPlan(plan);
    try {
      const url = await createCheckout(plan, periodo);
      window.location.href = url;
    } catch {
      toast.error(t('pro.pricingPage.checkoutError'));
      setLoadingPlan(null);
    }
  };

  // Misma suscripción Stripe (prorrateo). No pasa por el Customer Portal:
  // "Continue" del portal no avanza hasta elegir otro producto a mano.
  const onChangePlan = async (plan: PlanId) => {
    setLoadingPlan(plan);
    try {
      const next = await changeSubscription(plan, plan === 'free' ? undefined : periodo);
      setSub(next.subscription);
      await refresh();
      toast.success(t('pro.pricingPage.planUpdated'));
    } catch {
      toast.error(t('pro.pricingPage.changeError'));
    } finally {
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
        <div className="inline-flex rounded-lg border border-border p-1">
          {periodos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriodo(p.id)}
              className={cn(
                'min-h-11 rounded-md px-5 py-2 text-sm font-medium transition-colors duration-[180ms] ease-out',
                periodo === p.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
              {p.id === 'anual' && (
                <span className="ml-1.5 text-xs opacity-90">• {t('pro.pricingPage.yearlyNote')}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const precio = plan.precio[periodo];
          const antes = plan.antes?.[periodo];
          const muestraAntes = antes != null && antes > precio;
          // Free "actual" = logueado sin suscripción de pago. Pro/Max "actual" =
          // coincide plan Y periodo con la suscripción activa.
          const esActual =
            plan.id === 'free'
              ? !!proUser && !hasActiveSub
              : hasActiveSub && sub?.plan === plan.id && sub?.periodo === periodo;
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
                'pro-card relative flex flex-col',
                plan.destacado && 'pro-card-max',
              )}
            >
              {plan.destacado && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  {t('pro.pricingPage.recommended')}
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">{nombre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    ${precio}
                  </span>
                  {muestraAntes && (
                    <s className="text-base text-muted-foreground line-through tabular-nums">
                      {antes}
                    </s>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {plan.id === 'free' ? '' : ` /${unidad}`}
                  </span>
                </div>
                {muestraAntes && (
                  <span className="inline-flex shrink-0 flex-col text-right text-[10px] font-medium leading-tight text-primary">
                    <span>{t('pro.landing.pricing.launchDiscount').split(/\s+/).slice(0, -1).join(' ')}</span>
                    <span>{t('pro.landing.pricing.launchDiscount').split(/\s+/).at(-1)}</span>
                  </span>
                )}
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
                {esActual ? (
                  <Button variant="secondary" className="w-full" disabled>
                    {t('pro.pricingPage.currentPlan')}
                  </Button>
                ) : plan.id === 'free' ? (
                  hasActiveSub ? (
                    // Bajar a Free = cancelar al final del periodo (misma sub)
                    <Button
                      variant="secondary"
                      className="w-full"
                      loading={loadingPlan === 'free'}
                      onClick={() => onChangePlan('free')}
                    >
                      {t('pro.pricingPage.changePlan')}
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
                ) : hasActiveSub ? (
                  // Ya tiene suscripción: cambia el price in-app (misma sub)
                  <Button
                    variant={plan.destacado ? 'primary' : 'secondary'}
                    className="w-full"
                    loading={loadingPlan === plan.id}
                    onClick={() => onChangePlan(plan.id)}
                  >
                    {t('pro.pricingPage.changePlan')}
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
