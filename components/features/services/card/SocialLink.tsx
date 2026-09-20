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
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors duration-[180ms] ease-out hover:border-indigo-300 hover:text-indigo-700"
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
