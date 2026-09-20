import type { Config } from 'tailwindcss';
import baseConfig from './tailwind.config';

// Pro-only Tailwind: no Preflight, utilities/components only match inside .pro-theme
// so last-stylesheet-wins cannot restyle the shop after visiting /pro.
const config: Config = {
  ...baseConfig,
  content: [
    './app/pro/**/*.{js,ts,jsx,tsx,mdx}',
    './components/pro/**/*.{js,ts,jsx,tsx,mdx}',
    './components/features/services/card/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '.pro-theme',
  corePlugins: {
    preflight: false,
  },
};

export default config;
