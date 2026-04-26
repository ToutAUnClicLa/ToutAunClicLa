/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['es', 'fr', 'en'],
    defaultLocale: 'es',
    localeDetection: false,
  },
  output: 'standalone',
  // Proxy para desarrollo - redirige /api/backend/* al backend real
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = isDev
      ? 'http://localhost:5500/api/v1'
      : 'https://backendtoutaunclicla-production.up.railway.app/api/v1';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'fthunnrkcpzygyspynus.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'toutaunclicla.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // 1 hora de cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimización adicional
    unoptimized: false, // Asegurar que las imágenes estén optimizadas
    loader: 'default'
  },
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;