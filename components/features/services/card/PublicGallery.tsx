"use client";

import Image from 'next/image';
import type { PublicGaleriaItem } from '@/lib/pro/publicProfile';

// Galería con scroll horizontal snap. En < 640px cada foto ocupa ~90% del ancho.
export function PublicGallery({ items }: { items: PublicGaleriaItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Galería" className="-mx-4 sm:mx-0">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-0">
        {items.map((it, idx) => (
          <figure
            key={idx}
            className="snap-start shrink-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
            style={{ width: 'min(340px, 90vw)' }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={it.imagen_url}
                alt={it.titulo || ''}
                fill
                sizes="min(340px, 90vw)"
                className="object-cover"
              />
            </div>
            {(it.titulo || it.descripcion) && (
              <figcaption className="p-3 text-xs">
                {it.titulo && <p className="font-medium text-slate-800 dark:text-slate-200">{it.titulo}</p>}
                {it.descripcion && <p className="mt-0.5 text-slate-500 dark:text-slate-400">{it.descripcion}</p>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
