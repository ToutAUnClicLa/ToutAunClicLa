import { MetadataRoute } from 'next';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'never';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Definir las rutas estáticas principales
const staticRoutes: SitemapEntry[] = [
  {
    url: '/',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: '/productos',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: '/comidas',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: '/boutique',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: '/sobre-nosotros',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: '/contacto',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: '/faq',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: '/terminos',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  },
  {
    url: '/politicas',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  },
  {
    url: '/blog',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
];

// Categorías de productos
const productCategories: SitemapEntry[] = [
  {
    url: '/productos/harina-masa',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/productos/salsas-aderezos',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/productos/paquetes-snacks',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
];

// Regiones gastronómicas
const foodRegions: SitemapEntry[] = [
  {
    url: '/comidas/norte-america',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/comidas/centro-america',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/comidas/sur-america',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
];

// Categorías de boutique
const boutiqueCategories: SitemapEntry[] = [
  {
    url: '/boutique/ropa',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/boutique/accesorios',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/boutique/souvenirs',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
];

// Versiones multilingües
const languageVersions = ['es', 'fr', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Combine las rutas estáticas
  const routes = [
    ...staticRoutes,
    ...productCategories,
    ...foodRegions,
    ...boutiqueCategories,
  ];

  // Crear versiones multilingües de todas las rutas
  const multilingualRoutes = routes.flatMap(route => {
    return languageVersions.map(lang => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://toutaunclicla.com'}/${lang}${route.url}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
  });

  // Combinar rutas originales y multilingües
  const allRoutes = [
    ...routes.map(route => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://toutaunclicla.com'}${route.url}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...multilingualRoutes
  ];

  return allRoutes;
} 