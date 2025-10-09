import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, defineProject } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      defineProject({
        name: 'unit',
        include: ['src/**/*.test.{ts,tsx}'],
        environment: 'jsdom',
      } as any),
      //   defineProject({
      //     name: 'storybook',
      //     extends: true,
      //     plugins: [
      //       storybookTest({
      //         configDir: path.join(dirname, '.storybook'),
      //       }),
      //     ],
      //     test: {
      //       browser: {
      //         enabled: true,
      //         headless: true,
      //         provider: 'playwright',
      //         instances: [{ browser: 'chromium' }],
      //       },
      //       setupFiles: ['.storybook/vitest.setup.ts'],
      //     },
      //   } as any),
    ],
  },
});
