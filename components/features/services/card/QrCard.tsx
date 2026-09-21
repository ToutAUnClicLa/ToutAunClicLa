"use client";

import { useState } from 'react';
import { Download, QrCode } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  slug: string;
  dataUrl: string;
}

export function QrCard({ slug, dataUrl }: Props) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    setDownloading(true);
    try {
      // El dataUrl ya es un blob base64 -> se descarga directo, sin red.
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${slug}-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <QrCode className="h-4 w-4" aria-hidden />
        {t('pro.card.qrTitle')}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={t('pro.card.qrTitle')}
        width={200}
        height={200}
        className="h-48 w-48 rounded-lg"
      />
      <button
        type="button"
        onClick={onDownload}
        disabled={downloading}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors duration-[180ms] ease-out hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50"
      >
        <Download className="h-4 w-4" aria-hidden />
        {t('pro.card.qrDownload')}
      </button>
    </div>
  );
}
