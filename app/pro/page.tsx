import Link from 'next/link';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import QRCode from 'qrcode';
import {
  UserPlus,
  PenLine,
  Wallet,
  MapPin,
  QrCode,
  BarChart3,
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/pro/ui/button';
import { ProLandingHeader } from '@/components/pro/ProLandingHeader';
import { HeroCardMockup } from '@/components/pro/landing/HeroCardMockup';
import { AirDropIcon } from '@/components/pro/landing/AirDropIcon';
import { TestimonialsMarquee } from '@/components/pro/landing/TestimonialsMarquee';
import { LandingMotion } from '@/components/pro/landing/LandingMotion';
import { getProT, validLang, type Lang } from '@/lib/pro/i18n';
import { APP_URL } from '@/lib/pro/publicProfile';

// Resuelve el idioma igual que app/card/[slug]: ?lang= > cookie > fr (Loi 96)
function resolveLang(paramLang?: string): Lang {
  if (paramLang) return validLang(paramLang);
  return validLang(cookies().get('preferred-language')?.value);
}

interface PageProps {
  searchParams?: { lang?: string };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const t = getProT(resolveLang(searchParams?.lang)).landing;
  return { title: t.meta.title, description: t.meta.description };
}

export default async function ProHomePage({ searchParams }: PageProps) {
  const lang = resolveLang(searchParams?.lang);
  const t = getProT(lang).landing;
  const q = lang === 'fr' ? '' : `?lang=${lang}`;

  // QR real que apunta a la página de registro (así quien escanee el hero cae de
  // verdad en el registro). Se genera en el server como data URL.
  const qrDataUrl = await QRCode.toDataURL(`${APP_URL}/pro/register?src=qr-landing`, {
    margin: 1,
    width: 96,
    color: { dark: '#0f172a', light: '#ffffff' },
  }).catch(() => null);

  return (
    <div className="pro-canvas flex min-h-screen flex-col">
      <ProLandingHeader />

      <main className="flex-1">
        {/* ---------- HERO ---------- */}
        <section className="pro-hero-bg overflow-hidden border-b border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="text-center lg:text-left">
              <span
                data-hero-item
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1 text-xs font-medium text-accent-foreground"
              >
                {t.hero.badge}
              </span>
              {/* Sin data-hero-item a propósito: es el elemento LCP de la página,
                  no debe depender de que GSAP ejecute para volverse visible. */}
              <h1
                className="mt-5 text-balance font-semibold tracking-[-0.03em] text-foreground [font-size:clamp(2.5rem,5vw,3.75rem)] [line-height:1.05]"
              >
                {t.hero.headline}
              </h1>
              <p
                data-hero-item
                className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground lg:mx-0"
              >
                {t.hero.subhead}
              </p>
              <div
                data-hero-item
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link href="/pro/register">
                  <Button size="lg" className="h-11 w-full px-6 sm:w-auto">
                    {t.hero.ctaPrimary}
                  </Button>
                </Link>
                <Link href="/pro/pricing">
                  <Button size="lg" variant="secondary" className="h-11 w-full px-6 sm:w-auto">
                    {t.hero.ctaSecondary}
                  </Button>
                </Link>
              </div>
              <p data-hero-item className="mt-4 text-sm text-muted-foreground">
                {t.hero.microcopy}
              </p>
            </div>

            <div data-hero-item data-hero-mockup className="flex justify-center lg:justify-end">
              <HeroCardMockup t={t} qrDataUrl={qrDataUrl} />
            </div>
          </div>
        </section>

        {/* ---------- BARRA DE CONFIANZA ---------- */}
        <section className="pro-band border-y border-border">
          <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <li>{t.trust.madeInQuebec}</li>
            <li className="hidden sm:block" aria-hidden>·</li>
            <li>{t.trust.loi25}</li>
            <li className="hidden sm:block" aria-hidden>·</li>
            <li>{t.trust.stripe}</li>
            <li className="hidden sm:block" aria-hidden>·</li>
            <li>{t.trust.languages}</li>
          </ul>
        </section>

        {/* ---------- COMMENT ÇA MARCHE ---------- */}
        <section className="pro-section" data-animate-section data-animate="steps">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker={t.how.kicker} title={t.how.title} subtitle={t.how.subtitle} />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { n: '01', Icon: UserPlus, title: t.how.step1Title, desc: t.how.step1Desc },
                { n: '02', Icon: PenLine, title: t.how.step2Title, desc: t.how.step2Desc },
                { n: '03', Icon: AirDropIcon, title: t.how.step3Title, desc: t.how.step3Desc },
              ].map(({ n, Icon, title, desc }) => (
                <div
                  key={n}
                  data-animate-item
                  className="pro-card pro-card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span data-step-icon className="pro-icon-tile">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-mono text-sm font-medium tabular-nums text-muted-foreground">
                      {n}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FEATURES (bento) ---------- */}
        <section
          className="pro-section pro-wash border-y border-border"
          data-animate-section
          data-animate="bento"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t.features.kicker}
              title={t.features.title}
              subtitle={t.features.subtitle}
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                large
                Icon={Wallet}
                title={t.features.walletTitle}
                desc={t.features.walletDesc}
              />
              <FeatureCard
                Icon={MapPin}
                title={t.features.directoryTitle}
                desc={t.features.directoryDesc}
              />
              <FeatureCard
                Icon={QrCode}
                title={t.features.vcardTitle}
                desc={t.features.vcardDesc}
              />
              <FeatureCard
                large
                Icon={BarChart3}
                title={t.features.statsTitle}
                desc={t.features.statsDesc}
              />
            </div>
          </div>
        </section>

        {/* ---------- PRICING (cards estáticas) ---------- */}
        <section className="pro-section" data-animate-section data-animate="pricing">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t.pricing.kicker}
              title={t.pricing.title}
              subtitle={t.pricing.subtitle}
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <PricingCard
                name={t.pricing.free.name}
                price={t.pricing.free.price}
                tagline={t.pricing.free.tagline}
                perMonth={t.pricing.perMonth}
                features={[
                  t.pricing.free.f1,
                  t.pricing.free.f2,
                  t.pricing.free.f3,
                  t.pricing.free.f4,
                ]}
              />
              <PricingCard
                name={t.pricing.pro.name}
                price={t.pricing.pro.price}
                tagline={t.pricing.pro.tagline}
                perMonth={t.pricing.perMonth}
                features={[
                  t.pricing.pro.f1,
                  t.pricing.pro.f2,
                  t.pricing.pro.f3,
                  t.pricing.pro.f4,
                  t.pricing.pro.f5,
                ]}
              />
              <PricingCard
                name={t.pricing.max.name}
                price={t.pricing.max.price}
                tagline={t.pricing.max.tagline}
                perMonth={t.pricing.perMonth}
                featured
                badge={t.pricing.badgeRecommended}
                features={[
                  t.pricing.max.f1,
                  t.pricing.max.f2,
                  t.pricing.max.f3,
                  t.pricing.max.f4,
                  t.pricing.max.f5,
                ]}
              />
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/pro/pricing"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors duration-[180ms] ease-out hover:text-primary/80"
              >
                {t.pricing.seeAll}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- TESTIMONIOS (marquee infinito) ---------- */}
        <section
          className="pro-section pro-band border-y border-border"
          data-animate-section
          data-animate="fade"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t.testimonials.kicker}
              title={t.testimonials.title}
              subtitle={t.testimonials.subtitle}
            />
          </div>
          <div data-animate-item>
            <TestimonialsMarquee t={t} />
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="pro-section pro-wash border-y border-border" data-animate-section data-animate="faq">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHead kicker={t.faq.kicker} title={t.faq.title} />
            <div
              data-animate-item
              className="mt-10 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card"
            >
              {[
                { q: t.faq.q1, a: t.faq.a1 },
                { q: t.faq.q2, a: t.faq.a2 },
                { q: t.faq.q3, a: t.faq.a3 },
                { q: t.faq.q4, a: t.faq.a4 },
              ].map(({ q, a }, i) => (
                <details key={i} className="group px-5 py-1">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-medium text-foreground">
                    {q}
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA FINAL ---------- */}
        <section className="pro-band-deep px-4 py-16 sm:px-6 lg:px-8" data-animate-section data-animate="cta">
          <div
            data-animate-item
            className="mx-auto max-w-5xl overflow-hidden rounded-lg bg-zinc-950 px-6 py-14 text-center sm:px-12 sm:py-16"
          >
            <h2
              data-cta-item
              className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl"
            >
              {t.finalCta.title}
            </h2>
            <p data-cta-item className="mx-auto mt-4 max-w-lg text-balance text-zinc-300">
              {t.finalCta.subtitle}
            </p>
            <div data-cta-item className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/pro/register">
                <Button
                  size="lg"
                  className="h-11 w-full bg-white px-6 text-zinc-950 hover:bg-zinc-100 sm:w-auto"
                >
                  {t.finalCta.ctaPrimary}
                </Button>
              </Link>
              <Link href="/pro/pricing">
                <Button
                  size="lg"
                  className="h-11 w-full border border-white/30 bg-transparent px-6 text-white hover:bg-white/10 sm:w-auto"
                >
                  {t.finalCta.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="pro-band border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
                Tout À Un Clic Là
                <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                  Pro
                </span>
              </span>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t.footer.tagline}</p>
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <Link href="/pro/pricing" className="inline-flex min-h-11 items-center rounded-md transition-colors duration-[180ms] ease-out hover:text-foreground">
                {t.footer.plans}
              </Link>
              <Link href="/pro/login" className="inline-flex min-h-11 items-center rounded-md transition-colors duration-[180ms] ease-out hover:text-foreground">
                {t.footer.signIn}
              </Link>
              <Link
                href={`/pro/politica-privacidad${q}`}
                className="inline-flex min-h-11 items-center rounded-md transition-colors duration-[180ms] ease-out hover:text-foreground"
              >
                {t.footer.privacy}
              </Link>
              <Link href="/terminos" className="inline-flex min-h-11 items-center rounded-md transition-colors duration-[180ms] ease-out hover:text-foreground">
                {t.footer.terms}
              </Link>
              <Link href="/servicios" className="inline-flex min-h-11 items-center rounded-md transition-colors duration-[180ms] ease-out hover:text-foreground">
                {t.footer.directory}
              </Link>
            </nav>
          </div>
          <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
            {t.footer.legal}
          </p>
        </div>
      </footer>

      {/* Animaciones de entrada (GSAP + ScrollTrigger). No convierte la página en
          client component: se monta al final y anima por data-attributes. */}
      <LandingMotion />
    </div>
  );
}

/* ---------- Subcomponentes de sección (server) ---------- */

function SectionHead({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div data-animate-head className="mx-auto max-w-2xl text-center">
      <span className="pro-kicker">
        {kicker}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-[1.875rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-balance text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({
  Icon,
  title,
  desc,
  large,
}: {
  Icon: typeof Wallet;
  title: string;
  desc: string;
  large?: boolean;
}) {
  return (
    <div
      data-animate-item
      className={`pro-card pro-card-hover ${large ? 'sm:col-span-1' : ''}`}
    >
      <span className="pro-icon-tile">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  tagline,
  perMonth,
  features,
  featured,
  badge,
}: {
  name: string;
  price: string;
  tagline: string;
  perMonth: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}) {
  return (
    <div
      data-animate-item
      {...(featured ? { 'data-featured': '' } : {})}
      className={`pro-card pro-card-hover relative flex flex-col ${
        featured ? 'border-primary shadow-[var(--shadow-sm)]' : ''
      }`}
    >
      {badge && (
        <span
          data-pricing-badge
          className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground"
        >
          {badge}
        </span>
      )}
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          {price}
        </span>
        {price !== '$0' && price !== '0 $' && (
          <span className="text-sm text-muted-foreground">{perMonth}</span>
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
    </div>
  );
}
