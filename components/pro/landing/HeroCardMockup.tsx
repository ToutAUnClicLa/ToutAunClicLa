import { MapPin } from 'lucide-react';
import type { getProT } from '@/lib/pro/i18n';
import { AirDropIcon } from './AirDropIcon';
import { HERO_SOCIALS } from './SocialGlyphs';

type LandingT = ReturnType<typeof getProT>['landing'];

export function HeroCardMockup({ t, qrDataUrl }: { t: LandingT; qrDataUrl?: string | null }) {
  const c = t.card;
  const initials = c.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="pro-mock relative w-full max-w-[360px]">
      <div className="pro-airdrop-chip absolute -top-2 right-2 z-10 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-sm)] backdrop-blur">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white"
        >
          <AirDropIcon className="h-3.5 w-3.5" />
        </span>
        {c.airdrop}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-md)]">
        <div className="h-16 bg-zinc-950" />

        <div className="px-5 pb-5">
          <div className="-mt-8 flex items-end justify-between">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-lg border-4 border-card bg-accent text-xl font-semibold text-accent-foreground">
              {initials}
            </div>
          </div>

          <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{c.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {c.title}
            <span className="text-muted-foreground/70"> · {c.company}</span>
          </p>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {c.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <span>{c.speaks}</span>
              {['FR', 'EN', 'ES'].map((l) => (
                <span
                  key={l}
                  className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-secondary-foreground"
                >
                  {l}
                </span>
              ))}
            </span>
          </div>

          <div className="mt-4 flex gap-2" aria-hidden>
            {HERO_SOCIALS.map(({ key, Icon }) => (
              <span
                key={key}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              {c.saveContact}
            </span>
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={c.qrAlt}
                width={44}
                height={44}
                className="h-12 w-12 shrink-0 rounded-md border border-border bg-white p-1"
              />
            ) : (
              <span aria-hidden className="h-12 w-12 shrink-0 rounded-md border border-border bg-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
