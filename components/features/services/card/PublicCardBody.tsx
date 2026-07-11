import Image from 'next/image';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';
import { vcardUrl, type PublicPro } from '@/lib/pro/publicProfile';
import { ShareButton } from './ShareButton';
import { SocialLink } from './SocialLink';

interface PublicCardBodyStrings {
  saveContact: string;
  speaks: string;
  socialsSection: string;
  contactSection: string;
}

interface PublicCardBodyProps {
  pro: PublicPro;
  name: string;
  url: string;
  t: PublicCardBodyStrings;
}

// Cuerpo visual de la tarjeta pública (app/(main)/card/[slug]/page.tsx).
// Extraído para reutilizarlo tal cual en la vista previa del dashboard Pro.
export function PublicCardBody({ pro, name, url, t }: PublicCardBodyProps) {
  return (
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
              {t.saveContact}
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
                <span className="text-xs">{t.speaks}</span>
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
              {t.socialsSection}
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
              {t.contactSection}
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
  );
}
