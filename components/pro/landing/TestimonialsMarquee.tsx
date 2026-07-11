import type { getProT } from '@/lib/pro/i18n';

type LandingT = ReturnType<typeof getProT>['landing'];

// Carrusel marquee infinito y continuo (CSS puro, server-renderable). La lista
// se duplica (aria-hidden en la copia) y la pista se desplaza translateX(-50%)
// en loop lineal perpetuo. Pausa en hover y focus-within. Máscara de degradado
// en los bordes. Con prefers-reduced-motion: grid estático de 3 columnas.
export function TestimonialsMarquee({ t }: { t: LandingT }) {
  const items = [
    { quote: t.testimonials.q1, niche: t.testimonials.q1Niche },
    { quote: t.testimonials.q2, niche: t.testimonials.q2Niche },
    { quote: t.testimonials.q3, niche: t.testimonials.q3Niche },
  ];

  // Duplicamos el set para cubrir pantallas anchas sin hueco. La pista contiene
  // dos copias idénticas del bloque; translateX(-50%) reinicia sin salto.
  const track = [...items, ...items, ...items];

  const Card = ({
    quote,
    niche,
  }: {
    quote: string;
    niche: string;
  }) => (
    <figure className="pro-card-hover flex w-[300px] shrink-0 flex-col rounded-[14px] border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:w-[340px]">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground">
        “{quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          P
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">{t.testimonials.betaName}</span>
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
              {t.testimonials.betaBadge}
            </span>
          </span>
          <span className="block text-xs text-muted-foreground">{niche}</span>
        </span>
      </figcaption>
    </figure>
  );

  return (
    <div className="pro-marquee mt-12">
      <div className="pro-marquee-track">
        {track.map((it, i) => (
          <Card key={i} quote={it.quote} niche={it.niche} />
        ))}
      </div>
    </div>
  );
}
