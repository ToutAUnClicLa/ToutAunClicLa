"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getSubscription, openBillingPortal, type SubscriptionState } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';

const ESTADO_LABEL: Record<string, string> = {
  trialing: 'Prueba gratuita',
  active: 'Activo',
  past_due: 'Pago pendiente',
  canceled: 'Cancelado',
  unpaid: 'Sin pagar',
  incomplete: 'Incompleto',
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-CA', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function SubscriptionCard() {
  const router = useRouter();
  const [data, setData] = useState<SubscriptionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  const load = () =>
    getSubscription()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // Retorno desde Stripe Checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      toast.success('¡Suscripción activada!');
      window.history.replaceState({}, '', '/pro/dashboard');
      setTimeout(load, 1500); // dar tiempo al webhook
    }
  }, []);

  const onPortal = async () => {
    setPortalLoading(true);
    try {
      const url = await openBillingPortal();
      window.location.href = url;
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo abrir el portal.');
      setPortalLoading(false);
    }
  };

  const tier = data?.tier || 'free';
  const sub = data?.subscription;

  return (
    <div className="rounded-[14px] border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Tu plan</h2>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold uppercase text-accent-foreground">
          {tier}
        </span>
      </div>

      {loading ? (
        <p className="mt-3 text-sm text-muted-foreground">Cargando…</p>
      ) : sub ? (
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            Estado:{' '}
            <span className="font-medium text-foreground">
              {ESTADO_LABEL[sub.estado] || sub.estado}
            </span>
          </p>
          <p className="capitalize">
            Plan: <span className="font-medium text-foreground">{sub.plan} · {sub.periodo}</span>
          </p>
          {sub.estado === 'trialing' && sub.trial_fin && (
            <p>La prueba termina el {formatDate(sub.trial_fin)}.</p>
          )}
          {sub.estado !== 'trialing' && sub.periodo_actual_fin && (
            <p>
              {sub.cancelar_al_final ? 'Termina el ' : 'Se renueva el '}
              {formatDate(sub.periodo_actual_fin)}.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Estás en el plan gratuito. Suscríbete para tu tarjeta digital.
        </p>
      )}

      <div className="mt-5">
        {sub ? (
          <Button variant="secondary" size="sm" loading={portalLoading} onClick={onPortal}>
            Gestionar suscripción
          </Button>
        ) : (
          <Button size="sm" onClick={() => router.push('/pro/pricing')}>
            Ver planes
          </Button>
        )}
      </div>
    </div>
  );
}
