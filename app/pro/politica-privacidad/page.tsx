import Link from 'next/link';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import { ProLandingHeader } from '@/components/pro/ProLandingHeader';
import { getProT, validLang, type Lang } from '@/lib/pro/i18n';

// Mismo patrón que la landing: ?lang= > cookie > fr (Loi 96)
function resolveLang(paramLang?: string): Lang {
  if (paramLang) return validLang(paramLang);
  return validLang(cookies().get('preferred-language')?.value);
}

interface PageProps {
  searchParams?: { lang?: string };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const t = getProT(resolveLang(searchParams?.lang)).privacy;
  return { title: t.title, robots: { index: true, follow: true } };
}

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

export default function ProPrivacyPage({ searchParams }: PageProps) {
  const lang = resolveLang(searchParams?.lang);
  const t = getProT(lang).privacy;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProLandingHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-prose px-4 py-12 sm:px-6 lg:py-16">
          {/* Volver + selector de idioma */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/pro"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-[180ms] ease-out hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t.backToPro}
            </Link>
            <nav aria-label={t.langLabel} className="flex items-center gap-1">
              {LANGS.map(({ code, label }) => (
                <Link
                  key={code}
                  href={`/pro/politica-privacidad?lang=${code}`}
                  aria-current={lang === code ? 'true' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-md px-2 text-xs font-medium transition-colors duration-[180ms] ease-out ${
                    lang === code
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Encabezado */}
          <header className="mt-8">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground">{t.title}</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.05em] text-muted-foreground">
              {t.effective}
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{t.intro}</p>
          </header>

          {/* Secciones */}
          <div className="mt-10 space-y-8">
            {t.sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{s.h}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.p}</p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-prose px-4 py-8 text-center text-sm sm:px-6">
          <Link href="/pro" className="text-primary transition-colors hover:text-primary/80">
            {t.footerBack}
          </Link>
        </div>
      </footer>
    </div>
  );
}
