import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://fscakmak.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': r('./src'),
        '@core': r('./src/core'),
        '@commands': r('./src/commands'),
        '@data': r('./src/data'),
        '@styles': r('./src/styles'),
        '@types': r('./src/types'),
        '@components': r('./src/components'),
        '@layouts': r('./src/layouts'),
        '@lib': r('./src/lib'),
      },
    },
  },
});
