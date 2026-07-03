"use client";

import { ExternalLink, Instagram, Linkedin, Facebook, Youtube, Globe, Music2 } from 'lucide-react';
import { trackProEvent } from '@/lib/pro/publicProfile';
import { useTranslation } from '@/hooks/useTranslation';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
  website: Globe,
};

// Nombres de marca no se traducen. 'website' se resuelve dinámico en runtime.
const BRAND_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
};

interface Props {
  plataforma: string;
  url: string;
  slug: string;
}

export function SocialLink({ plataforma, url, slug }: Props) {
  const { t } = useTranslation();
  const key = plataforma.toLowerCase();
  const Icon = ICONS[key] || ExternalLink;
  const label = key === 'website' ? t('pro.card.socialWebsite') : (BRAND_LABELS[key] || plataforma);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackProEvent('clic_red', slug, { red: plataforma })}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
