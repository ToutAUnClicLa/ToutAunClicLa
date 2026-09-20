"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getSubscription,
  syncSubscription,
  openBillingPortal,
  type SubscriptionState,
} from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { CreditCard } from 'lucide-react';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/pro/ui/button';
import { cn } from '@/lib/utils';

// Badge por tier según la guía: Free gris, Pro verde, Max degradado verde→teal.
const TIER_BADGE: Record<string, string> = {
  free: 'bg-secondary text-muted-foreground',
  pro: 'bg-accent text-accent-foreground',
  max: 'bg-gradient-to-r from-[#00875A] to-teal-600 text-white',
};

// Mapa código de idioma -> locale de Intl para formatear fechas.
const DATE_LOCALE: Record<string, string> = {
  fr: 'fr-CA',
  en: 'en-CA',
  es: 'es-CA',
};

export function SubscriptionCard() {
  const router = useRouter();
  const { refresh } = useProAuth();
  const { t, locale } = useTranslation();
  const [data, setData] = useState<SubscriptionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  const formatDate = (iso: string | null): string => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(DATE_LOCALE[locale] || 'fr-CA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const load = () =>
    getSubscription()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));

  // Tras volver del checkout/portal: sincroniza desde Stripe (no espera al webhook)
  const syncFromStripe = async () => {
    try {
      const fresh = await syncSubscription();
      setData(fresh);
      await refresh(); // actualiza tier en toda la UI
    } catch {
      // fallback: lectura normal
      load();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const justCheckedOut = params.get('checkout') === 'success';
    const justUsedPortal = params.get('billing') === 'updated';
    // Tras checkout o portal, sincroniza desde Stripe (no dependas del timing
    // del webhook: al volver del portal el evento puede no haberse procesado aún).
    if (justCheckedOut || justUsedPortal) {
      if (justCheckedOut) toast.success(t('pro.subscription.activated'));
      window.history.replaceState({}, '', '/pro/dashboard');
      syncFromStripe();
    } else {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPortal = async () => {
    setPortalLoading(true);
    try {
      const url = await openBillingPortal();
      window.location.href = url;
    } catch (err) {
      toast.error((err as ProApiError).message || t('pro.subscription.portalError'));
      setPortalLoading(false);
    }
  };

  const tier = loading ? null : data?.tier || 'free';
  const sub = data?.subscription;
  const estadoLabel = (estado: string) => t(`pro.subscription.status.${estado}`) || estado;

  return (
    <div className="rounded-[14px] border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
          <CreditCard className="h-5 w-5" aria-hidden />
        </span>
        {tier ? (
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
              TIER_BADGE[tier] || TIER_BADGE.free,
            )}
          >
            {tier}
          </span>
        ) : (
          <span className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground">
            {t('pro.subscription.loading')}
          </span>
        )}
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground">
        {t('pro.subscription.title')}
      </h2>

      {loading ? (
        <div className="mt-3 space-y-2" aria-hidden>
          <div className="pro-skeleton h-4 w-2/3" />
          <div className="pro-skeleton h-4 w-1/2" />
        </div>
      ) : sub ? (
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            {t('pro.subscription.statusLabel')}{' '}
            <span className="font-medium text-foreground">{estadoLabel(sub.estado)}</span>
          </p>
          <p className="capitalize">
            {t('pro.subscription.planLabel')}{' '}
            <span className="font-medium text-foreground">
              {sub.plan} · {sub.periodo}
            </span>
          </p>
          {sub.estado === 'trialing' && sub.trial_fin && (
            <p>
              {sub.cancelar_al_final
                ? t('pro.subscription.endsOn', { date: formatDate(sub.trial_fin) })
                : t('pro.subscription.trialEnds', { date: formatDate(sub.trial_fin) })}
            </p>
          )}
          {sub.estado !== 'trialing' && sub.periodo_actual_fin && (
            <p>
              {sub.cancelar_al_final
                ? t('pro.subscription.endsOn', { date: formatDate(sub.periodo_actual_fin) })
                : t('pro.subscription.renewsOn', { date: formatDate(sub.periodo_actual_fin) })}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{t('pro.subscription.freeText')}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {sub ? (
          <>
            <Button size="sm" loading={portalLoading} onClick={onPortal}>
              {t('pro.subscription.manage')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.push('/pro/pricing')}>
              {t('pro.subscription.seePlans')}
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => router.push('/pro/pricing')}>
            {t('pro.subscription.seePlans')}
          </Button>
        )}
      </div>
    </div>
  );
}
