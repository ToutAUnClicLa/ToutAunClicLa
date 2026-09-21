// Mapeo compartido plataforma → icono y nombre de marca para el módulo Pro.
// Mismos iconos que el perfil público (SocialLink) + WhatsApp del mockup.
import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Music2,
  Youtube,
} from 'lucide-react';
import { WhatsAppGlyph } from '@/components/pro/landing/SocialGlyphs';

export type SocialIcon = React.ComponentType<{ className?: string }>;

const ICONS: Record<string, SocialIcon> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: Music2,
  youtube: Youtube,
  whatsapp: WhatsAppGlyph,
  website: Globe,
};

// Nombres de marca: no se traducen y llevan su capitalización oficial.
// 'website' sí se traduce — resolver en el call site con t('pro.card.socialWebsite').
const BRAND_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
};

export const socialIcon = (plataforma: string): SocialIcon =>
  ICONS[plataforma.toLowerCase()] || ExternalLink;

export const socialBrandLabel = (plataforma: string): string | null =>
  BRAND_LABELS[plataforma.toLowerCase()] || null;
