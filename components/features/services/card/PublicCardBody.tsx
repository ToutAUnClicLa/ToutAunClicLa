import type { ReactNode } from 'react';
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
  qr?: ReactNode;
}

export function PublicCardBody({ pro, name, url, t, qr }: PublicCardBodyProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="h-20 bg-zinc-950 sm:h-24" />

      <div className="px-6 pb-8 sm:px-10">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          {pro.foto_url ? (
            <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-lg border-4 border-white shadow-sm sm:w-44">
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
            <div className="flex aspect-[4/5] w-36 items-center justify-center rounded-lg border-4 border-white bg-indigo-50 text-3xl font-semibold text-indigo-700 shadow-sm sm:w-44">
              {(pro.nombre[0] || '') + (pro.apellido?.[0] || '')}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <ShareButton title={name} text={pro.titulo || undefined} url={url} />
            <a
              href={vcardUrl(pro.slug)}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-[180ms] ease-out hover:bg-indigo-700"
            >
              {t.saveContact}
            </a>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{name}</h1>
          {pro.titulo && (
            <p className="mt-1 text-base text-zinc-600">
              {pro.titulo}
              {pro.empresa && <span className="text-zinc-400"> · {pro.empresa}</span>}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
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
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600"
                    >
                      {l}
                    </span>
                  ))}
                </span>
              </span>
            )}
          </div>

          {pro.bio && (
            <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-zinc-700">
              {pro.bio}
            </p>
          )}
        </div>

        {(!!pro.redes?.length || pro.telefono || pro.email_contacto || pro.sitio_web || qr) && (
          <div className="mt-8 border-t border-zinc-100 pt-6 sm:grid sm:grid-cols-2 sm:items-start sm:gap-8">
            <div className="flex flex-col gap-8">
              {pro.redes && pro.redes.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.socialsSection}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pro.redes.map((r) => (
                      <SocialLink key={r.plataforma + r.url} plataforma={r.plataforma} url={r.url} slug={pro.slug} />
                    ))}
                  </div>
                </div>
              )}

              {(pro.telefono || pro.email_contacto || pro.sitio_web) && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.contactSection}
                  </p>
                  <ul className="flex flex-col gap-2 text-sm">
                    {pro.telefono && (
                      <li>
                        <a
                          href={`tel:${pro.telefono}`}
                          className="inline-flex min-h-11 items-center gap-2 text-zinc-700 hover:text-indigo-600"
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
                          className="inline-flex min-h-11 items-center gap-2 break-all text-zinc-700 hover:text-indigo-600"
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
                          className="inline-flex min-h-11 items-center gap-2 text-zinc-700 hover:text-indigo-600"
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

            {qr && <div className="mt-8 sm:mt-0">{qr}</div>}
          </div>
        )}
      </div>
    </article>
  );
}
