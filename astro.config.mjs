import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import prefixer from 'postcss-prefix-selector';

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: 'https://cdn.nav.no/paw/aia-min-side-ssr',
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
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
      name: 'importmap-externals',
      hooks: {
        'astro:build:setup': ({ vite, target }) => {
          if (target === 'client') {
            vite.build ??= {};
            vite.build.rollupOptions ??= {};
            vite.build.rollupOptions.external = [
              'react',
              'react/jsx-runtime',
              'react-dom',
              'react-dom/client',
              'scheduler',
            ];
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
      redirectToDefaultLocale: true,
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
        access: 'secret',
        default: 'https://www.nav.no/arbeidssoekerregisteret',
      }),
      ARBEIDSSOEKERPERIODER_SNAPSHOT_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:3000/arbeidssoekerperioder-aggregert',
      }),
      ARBEIDSSOKERREGISTERET_OPPSLAG_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
        default: 'dev-gcp:paw:paw-arbeidssoekerregisteret-api-oppslag-v2',
      }),
      TILGJENGELIGE_BEKREFTELSER_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:3000/tilgjengelige-bekreftelser',
      }),
      BEKREFTELSE_API_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
        default: 'dev-gcp:paw:paw-arbeidssoekerregisteret-api-bekreftelse',
      }),
    },
  },
});
