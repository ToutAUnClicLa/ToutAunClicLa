import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { MapPin, Phone, Globe, ArrowLeft, Mail } from 'lucide-react';
import { fetchPublicProfile, fetchCategoriaById, fetchQrDataUrl, APP_URL, vcardUrl, type PublicPro } from '@/lib/pro/publicProfile';
import { getProT, validLang, type Lang } from '@/lib/pro/i18n';
import { QrCard } from '@/components/features/services/card/QrCard';

// Resuelve el idioma: ?lang= (explícito) > cookie del sitio > fr (Loi 96)
function resolveLang(paramLang?: string): Lang {
  if (paramLang) return validLang(paramLang);
  const cookieLang = cookies().get('preferred-language')?.value;
  return validLang(cookieLang);
}
import { ShareButton } from '@/components/features/services/card/ShareButton';
import { SocialLink } from '@/components/features/services/card/SocialLink';
import { ViewTracker } from '@/components/features/services/card/ViewTracker';
import { PublicGallery } from '@/components/features/services/card/PublicGallery';

interface PageProps {
  params: { slug: string };
  searchParams?: { lang?: string; src?: string };
}

const fullName = (pro: PublicPro) => `${pro.nombre} ${pro.apellido || ''}`.trim();

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const lang = resolveLang(searchParams?.lang);
  const t = getProT(lang);
  const pro = await fetchPublicProfile(params.slug, lang);
  if (!pro) return { title: t.card.notFoundTitle };
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
  const pro = await fetchPublicProfile(params.slug, lang);
  if (!pro) notFound();

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
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* Analytics no-bloqueante */}
      <ViewTracker slug={pro.slug} source={searchParams?.src} />

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top bar */}
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {/* Card principal */}
        <article className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Banda superior */}
          <div className="h-24 bg-gradient-to-br from-[#004d40] to-[#00332a] sm:h-28" />

          <div className="px-6 pb-8 sm:px-10">
            {/* Foto y acciones — marco 4:5 (retrato; las fotos de perfil suelen serlo, así no se recortan) */}
            <div className="-mt-16 flex flex-col gap-4 sm:-mt-24 sm:flex-row sm:items-end sm:justify-between">
              {pro.foto_url ? (
                <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-md dark:border-slate-900 sm:w-44">
                  <Image
                    src={pro.foto_url}
                    alt={name}
                    fill
                    priority
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-36 items-center justify-center rounded-2xl border-4 border-white dark:border-slate-900 bg-emerald-100 dark:bg-emerald-900/30 text-3xl font-semibold text-emerald-700 dark:text-emerald-300 shadow-md sm:w-44">
                  {(pro.nombre[0] || '') + (pro.apellido?.[0] || '')}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <ShareButton title={name} text={pro.titulo || undefined} url={url} />
                <a
                  href={vcardUrl(pro.slug)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  {t.card.saveContact}
                </a>
              </div>
            </div>

            {/* Identidad */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                {name}
              </h1>
              {pro.titulo && (
                <p className="mt-1 text-base text-slate-600 dark:text-slate-400">
                  {pro.titulo}
                  {pro.empresa && (
                    <span className="text-slate-400 dark:text-slate-500"> · {pro.empresa}</span>
                  )}
                </p>
              )}

              {/* Meta secundaria */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                {pro.ciudad && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden />
                    {pro.ciudad}
                  </span>
                )}
                {pro.idiomas_hablados && pro.idiomas_hablados.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-xs">{t.card.speaks}</span>
                    <span className="flex flex-wrap items-center gap-1">
                      {pro.idiomas_hablados.map((l) => (
                        <span
                          key={l}
                          className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                        >
                          {l}
                        </span>
                      ))}
                    </span>
                  </span>
                )}
              </div>

              {/* Bio */}
              {pro.bio && (
                <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                  {pro.bio}
                </p>
              )}
            </div>

            {/* Redes */}
            {pro.redes && pro.redes.length > 0 && (
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.card.socialsSection}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pro.redes.map((r) => (
                    <SocialLink key={r.plataforma + r.url} plataforma={r.plataforma} url={r.url} slug={pro.slug} />
                  ))}
                </div>
              </div>
            )}

            {/* Contacto directo */}
            {(pro.telefono || pro.email_contacto || pro.sitio_web) && (
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.card.contactSection}
                </p>
                <ul className="flex flex-col gap-2 text-sm">
                  {pro.telefono && (
                    <li>
                      <a
                        href={`tel:${pro.telefono}`}
                        className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                      >
                        <Phone className="h-4 w-4" aria-hidden />
                        {pro.telefono}
                      </a>
                    </li>
                  )}
                  {pro.email_contacto && (
                    <li>
                      <a
                        href={`mailto:${pro.email_contacto}`}
                        className="inline-flex items-center gap-2 break-all text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                      >
                        <Mail className="h-4 w-4 shrink-0" aria-hidden />
                        {pro.email_contacto}
                      </a>
                    </li>
                  )}
                  {pro.sitio_web && (
                    <li>
                      <a
                        href={pro.sitio_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                      >
                        <Globe className="h-4 w-4" aria-hidden />
                        {pro.sitio_web.replace(/^https?:\/\//, '')}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </article>

        {/* Galería (solo Max con fotos) */}
        {pro.galeria && pro.galeria.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
              {t.card.gallery}
            </h2>
            <PublicGallery items={pro.galeria} />
          </section>
        )}

        {/* QR de la tarjeta (data URL desde SSR → sin problemas de CORS/CSP) */}
        {qrDataUrl && (
          <section className="mt-8">
            <QrCard slug={pro.slug} dataUrl={qrDataUrl} />
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-slate-400">
          <Mail className="mx-auto mb-1 h-3 w-3" aria-hidden />
          <p>{t.card.footerTagline}</p>
        </footer>
      </main>
    </div>
  );
}
