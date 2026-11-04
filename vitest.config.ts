import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, defineProject } from 'vitest/config';

const storybookProject = (name: string, contextOptions?: { forcedColors?: 'active'; reducedMotion?: 'reduce' }) =>
  defineProject({
    plugins: [storybookTest({ configDir: fileURLToPath(new URL('./.storybook', import.meta.url)) })],
    test: {
      name,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(contextOptions ? { contextOptions } : undefined),
        instances: [{ browser: 'chromium', screenshotFailures: true }],
      },
    },
  });

export default defineConfig({
  test: {
    projects: [
      defineProject({
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
        },
      }),
      defineProject({
        test: {
          name: 'ssr',
          include: ['scripts/uu-ssr.test.ts'],
          environment: 'node',
          testTimeout: 180_000,
        },
      }),
      storybookProject('storybook'),
      storybookProject('storybook-forced-colors', { forcedColors: 'active' }),
      storybookProject('storybook-reduced-motion', { reducedMotion: 'reduce' }),
    ],
  },
});
