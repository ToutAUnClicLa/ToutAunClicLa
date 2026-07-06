import './pro-theme.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ProAuthProvider } from '@/contexts/ProAuthContext';
import { ProConsentBanner } from '@/components/pro/ProConsentBanner';
import { ProLangSync } from '@/components/pro/ProLangSync';
import { getProT, validLang } from '@/lib/pro/i18n';

export function generateMetadata(): Metadata {
  const lang = validLang(cookies().get('preferred-language')?.value);
  const t = getProT(lang).landing;
  return {
    title: {
      default: t.meta.title,
      template: '%s · TÀUCL Pro',
    },
    description: t.meta.description,
  };
}

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} pro-theme min-h-screen bg-background text-foreground antialiased`}
    >
      <ProAuthProvider>
        <ProLangSync />
        {children}
        <ProConsentBanner />
      </ProAuthProvider>
    </div>
  );
}
