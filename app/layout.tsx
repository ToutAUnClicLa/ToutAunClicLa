import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/common/providers/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import StructuredData from './schema';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: 'Tout à un Clic LA - Productos Latinoamericanos en Montreal',
    template: '%s | Tout à un Clic LA - Montreal'
  },
  description: 'Descubre auténticos productos latinoamericanos en Montreal. Alimentos, artesanías, ropa típica, ingredientes de cocina y más con entrega a domicilio en Quebec y todo Canadá.',
  keywords: 'productos latinos, tienda latinoamericana, Montreal, Quebec, productos latinoamericanos, comida latina, boutique latina, artesanías, importaciones, Canada',
  creator: 'Tout à un Clic LA',
  publisher: 'Tout à un Clic LA',
  authors: [{ name: 'Tout à un Clic LA Team', url: 'https://toutaunclicla.com' }],
  metadataBase: new URL('https://toutaunclicla.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es': '/es',
      'fr': '/fr',
      'en': '/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['fr_CA', 'en_CA'],
    url: 'https://toutaunclicla.com',
    siteName: 'Tout à un Clic LA',
    title: 'Tout à un Clic LA - Productos Latinoamericanos en Montreal',
    description: 'Descubre auténticos productos latinoamericanos en Montreal. Alimentos, artesanías, ropa típica y más. Entrega a domicilio en Quebec y todo Canadá.',
    images: [
      {
        url: '/images/toutaunclicla-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tout à un Clic LA - Tienda de productos latinoamericanos en Montreal'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tout à un Clic LA - Productos Latinoamericanos en Montreal',
    description: 'Descubre auténticos productos latinoamericanos en Montreal. Alimentos, artesanías y más con entrega a domicilio en Quebec y todo Canadá.',
    images: ['/images/toutaunclicla-twitter-image.jpg'],
    creator: '@toutaunclicla',
    site: '@toutaunclicla',
  },
  icons: {
    icon: [
      {
        url: '/icons/FaviconFinal.png',
        type: 'image/png',
      },
      {
        url: '/icons/FaviconFinal.png',
        type: 'image/png',
        sizes: '32x32'
      },
      {
        url: '/icons/FaviconFinal-512x512.png',
        type: 'image/png',
        sizes: '512x512'
      }
    ],
    shortcut: '/icons/FaviconFinal.png',
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180'
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#4f46e5'
      }
    ]
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification=add-your-code-here',
    yandex: 'yandexwebmastercode',
    other: {
      'msvalidate.01': 'your-bing-code',
    }
  },
  category: 'ecommerce',
  classification: 'business',
  other: {
    'geo.region': 'CA-QC',
    'geo.placename': 'Montreal',
    'DC.language': 'es, fr, en'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/FaviconFinal.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Etiquetas hreflang para SEO multilingüe */}
        <link rel="alternate" hrefLang="es" href="https://toutaunclicla.com/es" />
        <link rel="alternate" hrefLang="fr" href="https://toutaunclicla.com/fr" />
        <link rel="alternate" hrefLang="en" href="https://toutaunclicla.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://toutaunclicla.com" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
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
          </AuthProvider>
        </LanguageProvider>
        <SpeedInsights />
        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}