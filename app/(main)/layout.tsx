import './globals.css';
import { Suspense } from 'react';
import { SiteChrome } from '@/components/shared/layout/SiteChrome';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      }
    >
      <SiteChrome>{children}</SiteChrome>
    </Suspense>
  );
}
