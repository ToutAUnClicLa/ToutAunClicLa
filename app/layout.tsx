```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'A un clic la - E-commerce',
  description: 'E-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
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
            position="top-right"
            expand={false}
            richColors
            closeButton
            theme="light"
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
              },
              className: 'bg-white border border-gray-100 shadow-lg',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
```