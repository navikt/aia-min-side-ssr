import node from '@astrojs/node';
import react from '@astrojs/react';
import { defineConfig, envField } from 'astro/config';
import prefixer from 'postcss-prefix-selector';
import { rollupImportMapPlugin } from 'rollup-plugin-import-map';
import importmap from './importmap.json';

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: 'https://cdn.nav.no/min-side/aia-min-side-ssr',
    inlineStylesheets: 'always',
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: '.aia-min-side-ssr',
            ignoreFiles: [/module.css/],
          }),
        ],
      },
    },
  },
  integrations: [
    react(),
    {
      name: 'importmap',
      hooks: {
        'astro:build:setup': ({ vite, target }) => {
          if (target === 'client') {
            vite.plugins.push({
              ...rollupImportMapPlugin(importmap),
              enforce: 'pre',
              apply: 'build',
            });
          }
        },
      },
    },
  ],
  i18n: {
    defaultLocale: 'nb',
    locales: ['nb', 'nn', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  env: {
    schema: {
      SIDE_2_URL: envField.string({
        context: 'server',
        access: 'public',
        default: 'https://www.ansatt.dev.nav.no/arbeidssoekerregisteret',
      }),
      ARBEIDSSOEKERPERIODER_AGGREGERT_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:3000/arbeidssoekerperioder-aggregert',
      }),
      TILGJENGELIGE_BEKREFTELSER_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:3000/tilgjengelige-bekreftelser',
      }),
    },
  },
});
