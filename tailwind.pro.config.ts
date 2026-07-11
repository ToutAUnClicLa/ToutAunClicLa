import type { Config } from 'tailwindcss';
import baseConfig from './tailwind.config';

// Build de Tailwind acotado al módulo Pro: mismo theme/plugins que el config
// principal, pero con `content` limitado a /pro para no cargar en esas
// páginas las utilidades del resto del sitio (e-commerce, admin, restaurante).
const config: Config = {
  ...baseConfig,
  content: [
    './app/pro/**/*.{js,ts,jsx,tsx,mdx}',
    './components/pro/**/*.{js,ts,jsx,tsx,mdx}',
    './components/features/services/card/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
