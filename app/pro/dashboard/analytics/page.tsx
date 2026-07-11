"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Apple,
  Download,
  Eye,
  Globe2,
  Lock,
  Monitor,
  MousePointerClick,
  QrCode,
  Smartphone,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useProAuth } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getAnalytics, type ProAnalytics } from '@/lib/pro/endpoints';
import { BackButton } from '@/components/pro/ui/back-button';
import { Button } from '@/components/pro/ui/button';

// Mismo mapeo que SubscriptionCard.tsx para formatear fechas por idioma.
const DATE_LOCALE: Record<string, string> = {
  fr: 'fr-CA',
  en: 'en-CA',
  es: 'es-CA',
};

const DEVICE_ICON: Record<string, typeof Smartphone> = {
  ios: Apple,
  android: Smartphone,
  desktop: Monitor,
};

const STATS = [
  { key: 'statVistas', pick: (t: ProAnalytics['totals']) => t.vistas, Icon: Eye },
  { key: 'statClics', pick: (t: ProAnalytics['totals']) => t.clics_redes, Icon: MousePointerClick },
  { key: 'statDescargas', pick: (t: ProAnalytics['totals']) => t.descargas_vcard, Icon: Download },
  { key: 'statScans', pick: (t: ProAnalytics['totals']) => t.scans_qr, Icon: QrCode },
] as const;

export default function AnalyticsPage() {
  const router = useRouter();
  const { proUser } = useProAuth();
  const { t, locale } = useTranslation();
  const [data, setData] = useState<ProAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const isFree = proUser?.tier === 'free';

  useEffect(() => {
    if (isFree) {
      setLoading(false);
      return;
    }
    getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isFree]);

  // Traduce si existe la key; si no, muestra el valor crudo del backend
  // (evita romper la UI ante una fuente/dispositivo nuevo no traducido aún).
  const trOrRaw = (key: string, raw: string): string => {
    const value = t(key);
    return value === key ? raw : value;
  };

  const chartData = useMemo(
    () =>
      (data?.weekly || []).map((point) => ({
        ...point,
        label: new Date(`${point.date}T00:00:00`).toLocaleDateString(
          DATE_LOCALE[locale] || 'fr-CA',
          { weekday: 'short' },
        ),
      })),
    [data, locale],
  );

  const hasActivity = !!data && Object.values(data.totals).some((v) => v > 0);

  if (isFree) {
    return (
      <div>
        <BackButton href="/pro/dashboard" label={t('pro.dashboard.analytics.back')} />
        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t('pro.dashboard.analytics.title')}
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center rounded-[14px] border border-dashed border-border bg-card p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="mt-4 text-base font-semibold text-foreground">
            {t('pro.dashboard.analytics.upsellTitle')}
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {t('pro.dashboard.analytics.upsellText')}
          </p>
          <Button className="mt-5" onClick={() => router.push('/pro/pricing')}>
            {t('pro.dashboard.analytics.upsellCta')}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div aria-busy="true">
        <div className="pro-skeleton h-5 w-36" />
        <div className="mt-6 space-y-2">
          <div className="pro-skeleton h-8 w-48" />
          <div className="pro-skeleton h-4 w-72 max-w-full" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[14px] border border-border bg-card p-6">
              <div className="pro-skeleton h-10 w-10 rounded-[10px]" />
              <div className="pro-skeleton mt-4 h-7 w-16" />
              <div className="pro-skeleton mt-2 h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[14px] border border-border bg-card p-6">
          <div className="pro-skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackButton href="/pro/dashboard" label={t('pro.dashboard.analytics.back')} />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t('pro.dashboard.analytics.title')}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t('pro.dashboard.analytics.subtitle')}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ key, pick, Icon }) => (
          <div key={key} className="rounded-[14px] border border-border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {data ? pick(data.totals) : 0}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`pro.dashboard.analytics.${key}`)}
            </p>
          </div>
        ))}
      </div>

      {!hasActivity && (
        <p className="mt-4 text-sm text-muted-foreground">
          {t('pro.dashboard.analytics.emptyState')}
        </p>
      )}

      <div className="mt-6 rounded-[14px] border border-border bg-card p-6">
        <h2 className="text-base font-semibold text-foreground">
          {t('pro.dashboard.analytics.chartTitle')}
        </h2>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="proAnalyticsVistas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))',
                  fontSize: 13,
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="vistas"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#proAnalyticsVistas)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {(data?.sources || data?.devices) && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {data?.sources && (
            <div className="rounded-[14px] border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Globe2 className="h-4 w-4 text-muted-foreground" aria-hidden />
                {t('pro.dashboard.analytics.sourcesTitle')}
              </h2>
              {data.sources.length ? (
                <ul className="mt-4 space-y-3">
                  {data.sources.map((s) => (
                    <li key={s.fuente} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        {trOrRaw(`pro.dashboard.analytics.sourceTypes.${s.fuente}`, s.fuente)}
                      </span>
                      <span className="font-medium text-foreground">{s.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('pro.dashboard.analytics.noData')}
                </p>
              )}
            </div>
          )}

          {data?.devices && (
            <div className="rounded-[14px] border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground">
                {t('pro.dashboard.analytics.devicesTitle')}
              </h2>
              {data.devices.length ? (
                <ul className="mt-4 space-y-3">
                  {data.devices.map((d) => {
                    const tipo = d.tipo.toLowerCase();
                    const Icon = DEVICE_ICON[tipo] || Monitor;
                    const label = trOrRaw(`pro.dashboard.analytics.deviceTypes.${tipo}`, d.tipo);
                    return (
                      <li key={d.tipo} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-foreground">
                          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                          {label}
                        </span>
                        <span className="font-medium text-foreground">{d.count}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('pro.dashboard.analytics.noData')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
