"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MainContentWrapper } from './MainContentWrapper';

// Oculta el chrome del e-commerce (Navbar/Footer) en el módulo /pro,
// que provee su propia identidad y layout.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Solo el módulo /pro. `/profile` también empieza por esas letras.
  const isProModule = pathname === '/pro' || pathname?.startsWith('/pro/');
  if (isProModule) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <MainContentWrapper>{children}</MainContentWrapper>
      <Footer />
    </div>
  );
}
