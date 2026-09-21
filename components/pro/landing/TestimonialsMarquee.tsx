import type { getProT } from '@/lib/pro/i18n';

type LandingT = ReturnType<typeof getProT>['landing'];

export function TestimonialsMarquee({ t }: { t: LandingT }) {
  const items = [
    { quote: t.testimonials.q1, name: t.testimonials.q1Name, niche: t.testimonials.q1Niche },
    { quote: t.testimonials.q2, name: t.testimonials.q2Name, niche: t.testimonials.q2Niche },
    { quote: t.testimonials.q3, name: t.testimonials.q3Name, niche: t.testimonials.q3Niche },
  ];

  // 8 copias idénticas: translateX(-50%) reinicia sin salto (loop infinito).
  const track = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];

  const Card = ({
    quote,
    name,
    niche,
  }: {
    quote: string;
    name: string;
    niche: string;
  }) => (
    <figure className="pro-card pro-card-hover flex w-[300px] shrink-0 flex-col sm:w-[340px]">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground">
        “{quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">{name}</span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
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
          <Card key={`${it.name}-${i}`} quote={it.quote} name={it.name} niche={it.niche} />
        ))}
      </div>
    </div>
  );
}
