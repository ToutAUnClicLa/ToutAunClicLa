"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackProEvent } from '@/lib/pro/publicProfile';

// Registra 'vista_perfil' al montar; si viene ?src=qr también registra 'scan_qr'.
// Fire-and-forget, no bloquea el render.
export function ViewTracker({ slug, source }: { slug: string; source?: string | null }) {
  const params = useSearchParams();

  useEffect(() => {
    const src = source || params.get('src') || undefined;
    trackProEvent('vista_perfil', slug, { src });
    if (src === 'qr') trackProEvent('scan_qr', slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}
