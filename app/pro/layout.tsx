import './pro-theme.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ProAuthProvider } from '@/contexts/ProAuthContext';
import { ProConsentBanner } from '@/components/pro/ProConsentBanner';

export const metadata: Metadata = {
  title: {
    default: 'Tout À Un Clic Là Pro',
    template: '%s · TÀUCL Pro',
  },
  description:
    'Tu tarjeta digital profesional y tu lugar en el directorio de servicios de Quebec.',
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} pro-theme min-h-screen bg-background text-foreground antialiased`}
    >
      <ProAuthProvider>
        {children}
        <ProConsentBanner />
      </ProAuthProvider>
    </div>
  );
}
