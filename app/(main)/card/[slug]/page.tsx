import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { lookupPublicProfile, fetchCategoriaById, fetchQrDataUrl, APP_URL, type PublicPro } from '@/lib/pro/publicProfile';
import { getProT, validLang, type Lang } from '@/lib/pro/i18n';
import { QrCard } from '@/components/features/services/card/QrCard';
import { ViewTracker } from '@/components/features/services/card/ViewTracker';
import { PublicGallery } from '@/components/features/services/card/PublicGallery';
import { PublicCardBody } from '@/components/features/services/card/PublicCardBody';

function resolveLang(paramLang?: string): Lang {
  if (paramLang) return validLang(paramLang);
  const cookieLang = cookies().get('preferred-language')?.value;
  return validLang(cookieLang);
}

interface PageProps {
  params: { slug: string };
  searchParams?: { lang?: string; src?: string };
}

const fullName = (pro: PublicPro) => `${pro.nombre} ${pro.apellido || ''}`.trim();

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const lang = resolveLang(searchParams?.lang);
  const t = getProT(lang);
  const lookup = await lookupPublicProfile(params.slug, lang);
  if (lookup.status !== 'ok') {
    return {
      title: lookup.status === 'unavailable' ? t.card.unavailableTitle : t.card.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }
  const pro = lookup.pro;
  const name = fullName(pro);
  const title = pro.titulo ? `${name} · ${pro.titulo}` : name;
  const description = pro.bio || pro.titulo || t.card.metaDefaultDescription;
  const url = `${APP_URL}/card/${pro.slug}`;
  const image = pro.foto_url || undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      siteName: 'Tout À Un Clic Là Pro',
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const lang = resolveLang(searchParams?.lang);
  const t = getProT(lang);
  const lookup = await lookupPublicProfile(params.slug, lang);
  if (lookup.status !== 'ok') {
    const unavailable = lookup.status === 'unavailable';
    return (
      <div className="min-h-[70vh] bg-zinc-100">
        <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            {unavailable ? t.card.unavailableTitle : t.card.notFoundTitle}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {unavailable ? t.card.unavailableText : t.card.notFoundText}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pro/pricing"
              className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {t.card.unavailableCta}
            </Link>
            <Link
              href="/servicios"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.card.backGeneric}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const pro = lookup.pro;

  const name = fullName(pro);
  const url = `${APP_URL}/card/${pro.slug}`;
  const [categoria, qrDataUrl] = await Promise.all([
    fetchCategoriaById(pro.categoria_id, lang),
    fetchQrDataUrl(pro.slug),
  ]);
  const backHref = categoria ? `/servicios/${categoria.slug}` : '/servicios';
  const backLabel = categoria?.nombre || t.card.backGeneric;
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: pro.titulo || undefined,
    worksFor: pro.empresa ? { '@type': 'Organization', name: pro.empresa } : undefined,
    image: pro.foto_url || undefined,
    telephone: pro.telefono || undefined,
    address: pro.ciudad ? { '@type': 'PostalAddress', addressLocality: pro.ciudad } : undefined,
    url,
    sameAs: pro.redes?.map((r) => r.url) || undefined,
  };

  return (
    <div className="bg-zinc-100">
      <ViewTracker slug={pro.slug} source={searchParams?.src} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-zinc-500 transition-colors duration-[180ms] ease-out hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <PublicCardBody
          pro={pro}
          name={name}
          url={url}
          t={{
            saveContact: t.card.saveContact,
            speaks: t.card.speaks,
            socialsSection: t.card.socialsSection,
            contactSection: t.card.contactSection,
          }}
          qr={qrDataUrl ? <QrCard slug={pro.slug} dataUrl={qrDataUrl} /> : undefined}
        />

        {pro.galeria && pro.galeria.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.card.gallery}
            </h2>
            <PublicGallery items={pro.galeria} />
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-zinc-400">
          <Mail className="mx-auto mb-1 h-3 w-3" aria-hidden />
          <p>{t.card.footerTagline}</p>
        </footer>
      </main>
    </div>
  );
}
