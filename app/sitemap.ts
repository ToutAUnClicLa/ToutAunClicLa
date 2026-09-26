import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.toutaunclicla.com';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: '/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: '/productos', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: '/comidas', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: '/boutique', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: '/servicios', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: '/pro', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: '/pro/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: '/pro/politica-privacidad', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  { url: '/sobre-nosotros', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: '/terminos', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: '/politicas', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    ...route,
    url: `${BASE_URL}${route.url}`,
  }));
}
