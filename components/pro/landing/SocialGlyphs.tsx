// Iconos de redes para el mockup del hero. Reutiliza los mismos lucide que el
// perfil público real (SocialLink.tsx): LinkedIn, Instagram, Facebook. lucide no
// trae WhatsApp, así que se incluye un SVG inline del glifo (currentColor).
import { Linkedin, Instagram, Facebook } from 'lucide-react';

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.24-.69.24-1.28.17-1.41-.07-.13-.27-.2-.56-.35Zm-5.4 7.37h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37A9.86 9.86 0 0 1 2.1 11.9C2.1 6.45 6.54 2 12.08 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.9-9.9 9.9Zm8.42-18.32A11.82 11.82 0 0 0 12.07 0C5.46 0 .08 5.38.08 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.16-1.62a11.94 11.94 0 0 0 5.9 1.5h.01c6.61 0 11.99-5.38 11.99-11.99 0-3.2-1.25-6.21-3.52-8.46Z" />
    </svg>
  );
}

// Orden y mapeo fiel al de SocialLink; WhatsApp incluido por completitud de la
// tarjeta real (redes típicas de un pro local).
export const HERO_SOCIALS: {
  key: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'linkedin', Icon: Linkedin },
  { key: 'instagram', Icon: Instagram },
  { key: 'facebook', Icon: Facebook },
  { key: 'whatsapp', Icon: WhatsAppGlyph },
];
