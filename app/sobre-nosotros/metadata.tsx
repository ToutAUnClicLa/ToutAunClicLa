import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - ToutAunClicLa | Productos Auténticos de América Latina',
  description: 'Conoce la historia de ToutAunClicLa, empresa fundada por emprendedores colombianos y venezolanos que lleva productos auténticos de América Latina a Montreal. Descubre nuestra misión, valores y compromiso con la comunidad.',
  keywords: ['sobre nosotros', 'ToutAunClicLa', 'productos latinos', 'Montreal', 'Colombia', 'Venezuela', 'América Latina', 'emprendedores', 'historia empresa'],
  openGraph: {
    title: 'Sobre Nosotros - ToutAunClicLa',
    description: 'Descubre la historia de ToutAunClicLa y cómo conectamos las Américas a través de productos auténticos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'ToutAunClicLa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nosotros - ToutAunClicLa',
    description: 'Conoce nuestra historia y misión de conectar las Américas con productos auténticos.',
  },
  alternates: {
    languages: {
      'es-ES': '/sobre-nosotros',
      'en-US': '/about-us',
      'fr-CA': '/a-propos',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};