import { MapPin } from 'lucide-react';
import type { getProT } from '@/lib/pro/i18n';

type LandingT = ReturnType<typeof getProT>['landing'];

// Miniatura fiel del diseño real de app/card/[slug]/page.tsx.
// Datos ficticios; todo el texto sale de translations. Sin imágenes: avatar
// con iniciales sobre emerald y QR dibujado con un grid CSS.
export function HeroCardMockup({ t }: { t: LandingT }) {
  const c = t.card;
  const initials = c.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="relative w-full max-w-[360px]">
      {/* Chip flotante estilo iOS AirDrop */}
      <div className="pro-airdrop-chip absolute -top-2 right-2 z-10 flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3 py-1.5 text-xs font-medium text-white shadow-[0_12px_32px_-8px_rgb(2_6_23_/_0.18)] backdrop-blur">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#007aff] text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.66 15l1.74-1a8 8 0 1 1 13.84 0l1.74 1A10 10 0 0 0 12 2Zm0 4a6 6 0 0 0-5.2 9l1.75-1a4 4 0 1 1 6.9 0l1.75 1A6 6 0 0 0 12 6Zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
          </svg>
        </span>
        {c.airdrop}
      </div>

      {/* Tarjeta */}
      <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-[var(--shadow-lg)]">
        {/* Banda degradada de marca (misma que /card) */}
        <div className="h-20 bg-gradient-to-br from-[#004d40] to-[#00332a]" />

        <div className="px-5 pb-5">
          {/* Avatar + acción */}
          <div className="-mt-9 flex items-end justify-between">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-card bg-emerald-100 text-xl font-semibold text-emerald-700 shadow-md">
              {initials}
            </div>
          </div>

          {/* Identidad */}
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
                  className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-secondary-foreground"
                >
                  {l}
                </span>
              ))}
            </span>
          </div>

          {/* Redes (pills) */}
          <div className="mt-4 flex gap-2" aria-hidden>
            {['in', 'IG', 'FB', 'wa'].map((s) => (
              <span
                key={s}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Botón guardar + mini QR */}
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] bg-primary text-sm font-medium text-primary-foreground">
              {c.saveContact}
            </span>
            <QrGlyph label={c.scan} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini QR decorativo dibujado con un grid CSS (sin imágenes).
function QrGlyph({ label }: { label: string }) {
  // Patrón fijo 7x7 que evoca un QR con las tres esquinas de posición.
  const pattern = [
    1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 1, 1,
    1, 1, 1, 0, 1, 0, 1,
    0, 0, 0, 1, 0, 1, 0,
    1, 0, 1, 0, 1, 1, 1,
    1, 1, 0, 1, 0, 0, 1,
    1, 0, 1, 0, 1, 1, 1,
  ];
  return (
    <span
      role="img"
      aria-label={label}
      className="grid h-11 w-11 shrink-0 grid-cols-7 gap-px rounded-md border border-border bg-white p-1"
    >
      {pattern.map((on, i) => (
        <span key={i} className={on ? 'bg-slate-900' : 'bg-transparent'} />
      ))}
    </span>
  );
}
