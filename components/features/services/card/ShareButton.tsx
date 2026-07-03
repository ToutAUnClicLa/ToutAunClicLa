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
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      {copied ? t('pro.card.copied') : t('pro.card.share')}
    </button>
  );
}
