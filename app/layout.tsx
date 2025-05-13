import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Suspense } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'A un clic la - E-commerce',
  description: 'E-commerce platform',
  icons: {
    icon: [
      {
        url: '/logoaunclic.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icons/favicon.svg',
        type: 'image/svg+xml',
        sizes: '32x32'
      }
    ],
    shortcut: '/logoaunclic.svg',
    apple: '/logoaunclic.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logoaunclic.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/logoaunclic.svg" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Suspense fallback={
              <div className="flex min-h-screen items-center justify-center">
                <div className="animate-pulse text-lg">Loading...</div>
              </div>
            }>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 w-full pt-16">
                  {children}
                </main>
                <Footer />
              </div>
            </Suspense>
            <Toaster 
              position="bottom-right"
              expand={false}
              richColors
              closeButton
              theme="light"
              toastOptions={{
                style: {
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                className: 'font-medium',
                duration: 3000,
              }}
            />
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}