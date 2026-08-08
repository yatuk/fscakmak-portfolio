import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://fscakmak.com',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          tr: 'tr',
        },
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        item.lastmod = new Date().toISOString();
        if (path === '/cv' || path === '/tr/cv') {
          return { ...item, priority: 0.9, changefreq: 'monthly' };
        }
        if (path.startsWith('/writeups') || path.startsWith('/tr/writeups')) {
          return { ...item, priority: 0.7, changefreq: 'weekly' };
        }
        if (path === '/' || path === '/tr') {
          return { ...item, priority: 0.5, changefreq: 'monthly' };
        }
        return item;
      },
    }),
  ],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    compressHTML: true,
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            /* Shared helpers get their own small chunk so the CV page
               doesn't pull the whole terminal commands bundle. */
            if (id.includes('src/lib/')) return 'lib';
            if (id.includes('src/commands/')) return 'commands';
            if (id.includes('src/core/')) return 'terminal-core';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': r('./src'),
        '@core': r('./src/core'),
        '@commands': r('./src/commands'),
        '@data': r('./src/data'),
        '@styles': r('./src/styles'),
        '@ptypes': r('./src/types'),
        '@components': r('./src/components'),
        '@layouts': r('./src/layouts'),
        '@lib': r('./src/lib'),
        '@config': r('./src/config'),
      },
    },
  },
});
