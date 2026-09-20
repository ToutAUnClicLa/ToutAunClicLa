"use client";

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  title: string;
  text?: string;
  url: string;
}

export function ShareButton({ title, text, url }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    // Web Share API (móvil / navegadores compatibles)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // usuario canceló o falló → cae al fallback copy
      }
    }
    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t('pro.card.copyOk'));
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(t('pro.card.copyFail'));
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={t('pro.card.shareAria')}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors duration-[180ms] ease-out hover:border-indigo-300 hover:text-indigo-700"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      {copied ? t('pro.card.copied') : t('pro.card.share')}
    </button>
  );
}
