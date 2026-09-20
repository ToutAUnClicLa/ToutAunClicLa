import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { BackButton } from '@/components/pro/ui/back-button';
import { PricingPlans } from '@/components/pro/pricing/PricingPlans';
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
  const t = getProT(resolveLang(searchParams?.lang)).pricingPage;
  return { title: t.metaTitle, description: t.metaDescription };
}

export default function PricingPage({ searchParams }: PageProps) {
  const lang = resolveLang(searchParams?.lang);
  const t = getProT(lang).pricingPage;

  return (
    <div className="min-h-screen">
      <ProLandingHeader />

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <BackButton href="/pro/dashboard" label={t.back} />
      </div>

      <div className="pro-wash mt-4 border-y border-border">
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t.subtitle}</p>
          </div>

          <PricingPlans />

          <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
            {t.trialOnceNote}
          </p>
        </main>
      </div>
    </div>
  );
}
