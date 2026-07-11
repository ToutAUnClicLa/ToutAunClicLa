import { NextResponse } from 'next/server';
import { qrUrl } from '@/lib/pro/publicProfile';

// Proxy same-origin del QR del backend Pro: los componentes cliente (p. ej.
// el preview de /pro/dashboard/card) no pueden embeber qrUrl() directamente
// en un <img> por CORS/CORP (mismo motivo por el que fetchQrDataUrl existe
// para el SSR de la tarjeta pública).
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const res = await fetch(qrUrl(encodeURIComponent(params.slug)));
  if (!res.ok) return new NextResponse(null, { status: 404 });

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
