import assert from 'node:assert/strict';
import { type ChildProcess, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { createServer as createNetServer, type Server as NetServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { type Browser, chromium, type Page } from 'playwright';
import { test } from 'vitest';
import { aktivPeriode, avsluttetPeriode, tilgjengeligeBekreftelser } from '../src/components/storybook-testdata';

const readinessTimeoutMs = 60_000;
const requestTimeoutMs = 15_000;
const processShutdownTimeoutMs = 5_000;
const locales = ['nb', 'nn', 'en'] as const;
type Locale = (typeof locales)[number];
type Scenario = 'active' | 'ended' | 'empty';

const localizedText: Record<Locale, { active: string; ended: string; confirmation: string }> = {
  nb: {
    active: 'Du er registrert som arbeidssøker',
    ended: 'Du er ikke registrert som arbeidssøker',
    confirmation: 'Bekreft at du vil være registrert som arbeidssøker hos Nav',
  },
  nn: {
    active: 'Du er registrert som arbeidssøkjar',
    ended: 'Du er ikkje registrert som arbeidssøkjar',
    confirmation: 'Stadfest at du vil vera registrert som arbeidssøkjar hos Nav',
  },
  en: {
    active: 'You are registered as job seeker',
    ended: 'You are not registered as job seeker',
    confirmation: 'Confirm that you want to be registered as a jobseeker with Nav',
  },
};

function sendJson(response: import('node:http').ServerResponse, value: unknown) {
  response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

async function listen(server: NetServer): Promise<number> {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
  const address = server.address();
  assert(address && typeof address !== 'string');
  return address.port;
}

async function chooseAvailablePort(): Promise<number> {
  const server = createNetServer();
  const port = await listen(server);
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

function childFailure(
  child: ChildProcess,
  error: Error | undefined,
  exitCode: number | null,
  signal: NodeJS.Signals | null,
) {
  if (error) {
    throw new Error(`Astro dev process failed to start: ${error.message}`);
  }
  if (exitCode !== null || signal !== null) {
    throw new Error(`Astro dev process exited before readiness (code ${exitCode}, signal ${signal})`);
  }
  if (child.exitCode !== null || child.signalCode !== null) {
    throw new Error(`Astro dev process exited before readiness (code ${child.exitCode}, signal ${child.signalCode})`);
  }
}

async function waitForAstro(url: string, child: ChildProcess): Promise<void> {
  const startedAt = Date.now();
  let lastStatus: number | undefined;
  let spawnError: Error | undefined;
  let exitCode: number | null = null;
  let exitSignal: NodeJS.Signals | null = null;
  child.once('error', (error) => {
    spawnError = error;
  });
  child.once('exit', (code, signal) => {
    exitCode = code;
    exitSignal = signal;
  });

  while (Date.now() - startedAt < readinessTimeoutMs) {
    childFailure(child, spawnError, exitCode, exitSignal);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      lastStatus = response.status;
      await response.body?.cancel();
      if (response.ok) return;
    } catch {
      // The server is not ready yet. Keep polling until the bounded deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  childFailure(child, spawnError, exitCode, exitSignal);
  throw new Error(`Astro dev server did not become ready within ${readinessTimeoutMs}ms (last status: ${lastStatus})`);
}

async function stopChild(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null || child.pid === undefined) return;

  const exited = new Promise<void>((resolve) => child.once('exit', () => resolve()));
  child.kill('SIGTERM');
  const didExit = await Promise.race([
    exited.then(() => true),
    new Promise<false>((resolve) => setTimeout(() => resolve(false), processShutdownTimeoutMs)),
  ]);
  if (didExit || child.exitCode !== null || child.signalCode !== null) return;

  child.kill('SIGKILL');
  await exited;
}

async function extractFragmentAndCss(page: Page) {
  await page.waitForFunction(
    () =>
      document.styleSheets.length > 0 &&
      [...document.styleSheets].some((sheet) => {
        try {
          return sheet.cssRules.length > 0;
        } catch {
          return false;
        }
      }),
    undefined,
    { timeout: 10_000 },
  );
  return page.evaluate(() => {
    const root = document.querySelector('.aia-min-side-ssr');
    if (!root) throw new Error('Astro response did not contain .aia-min-side-ssr');

    const styles = [...document.querySelectorAll('style, link[rel="stylesheet"]')].map((node) => {
      if (node instanceof HTMLLinkElement) {
        return `<link rel="stylesheet" href="${node.href.replaceAll('"', '&quot;')}">`;
      }
      return node.outerHTML;
    });

    return {
      fragment: root.outerHTML,
      css: styles.join('\n'),
      stylesheetCount: document.styleSheets.length,
      cssNodeCount: styles.length,
    };
  });
}

async function setHostPage(page: Page, fragment: string, css: string, locale: Locale): Promise<void> {
  // The host's lang is supplied by this fixture. It does not prove that the production microfrontend wrapper sets lang.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.setContent(
    `<!doctype html>
      <html lang="${locale}">
        <head><meta charset="utf-8"><title>Min side</title>${css}</head>
        <body>
          <main>
            <h1>Min side</h1>
            <h2>Arbeidssøkerstatus</h2>
            ${fragment}
          </main>
        </body>
      </html>`,
    { waitUntil: 'domcontentloaded', timeout: requestTimeoutMs },
  );
  await page.waitForFunction(() => document.styleSheets.length > 0, undefined, { timeout: 10_000 });
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo(0, 0);
  });
  assert.equal(await page.evaluate(() => document.activeElement === document.body), true);
}

async function assertNoNestedInteractiveElements(page: Page): Promise<void> {
  const nested = await page.locator('.aia-min-side-ssr').evaluate((root) => {
    const interactive = 'a, button, input, select, textarea, [role="button"], [role="link"]';
    return [...root.querySelectorAll(interactive)].some((element) => element.querySelector(interactive) !== null);
  });
  assert.equal(nested, false, 'The SSR fragment must not nest interactive elements');
}

async function assertReflowsAt320px(page: Page): Promise<void> {
  await page.setViewportSize({ width: 320, height: 900 });
  const geometry = await page.locator('.aia-min-side-ssr').evaluate((root) => {
    const bounds = root.getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      rootLeft: bounds.left,
      rootRight: bounds.right,
      viewportWidth: document.documentElement.clientWidth,
    };
  });
  assert(geometry.documentWidth <= 320, `Horizontal overflow at 320px: ${geometry.documentWidth}px`);
  assert(geometry.rootLeft >= 0, `SSR fragment begins outside viewport: ${geometry.rootLeft}px`);
  assert(geometry.rootRight <= geometry.viewportWidth, 'SSR fragment extends beyond the viewport');

  const links = await page.locator('.aia-min-side-ssr a').all();
  assert(links.length > 0, 'SSR content links must remain present at 320px');
  for (const link of links) {
    assert.equal(await link.isVisible(), true, 'SSR content link must remain visible at 320px');
    const bounds = await link.boundingBox();
    assert(bounds && bounds.width > 0 && bounds.height > 0, 'SSR content link must have visible geometry');
    assert(bounds.x >= 0 && bounds.x + bounds.width <= 320, 'SSR content link must fit within 320px');
  }
}

async function gotoAstroPage(page: Page, url: string): Promise<void> {
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: requestTimeoutMs,
  });
  assert.equal(response?.status(), 200, `Astro page ${url} should return HTTP 200`);
  await page.locator('.aia-min-side-ssr').waitFor({ state: 'attached', timeout: requestTimeoutMs });
}

async function fetchAstroPage(page: Page, url: string, expectedLocale: Locale) {
  await gotoAstroPage(page, url);
  assert.equal(await page.locator('.aia-min-side-ssr').getAttribute('lang'), expectedLocale);
  const result = await extractFragmentAndCss(page);
  assert(result.stylesheetCount > 0, `Astro page ${url} must have loaded CSS stylesheets`);
  assert(result.cssNodeCount > 0, `Astro page ${url} must expose CSS to copy with its SSR fragment`);
  return result;
}

function astroCliPath(): string {
  const require = createRequire(import.meta.url);
  const packageJsonPath = require.resolve('astro/package.json');
  const astroPackage = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    bin: { astro: string };
  };
  return resolve(dirname(packageJsonPath), astroPackage.bin.astro);
}

function astroEnvironment(overrides: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...overrides,
    // Astro skips its SSR middleware when VITEST is truthy. The standalone
    // child server must not inherit the parent test runner's marker.
    VITEST: undefined,
  };
}

test('the standalone Astro server does not inherit the Vitest environment marker', () => {
  assert(process.env.VITEST, 'The regression test must run inside Vitest');
  const environment = astroEnvironment({ NODE_ENV: 'development', SIDE_2_URL: 'https://side2.test' });
  assert.equal(environment.VITEST, undefined);
  assert.equal(environment.NODE_ENV, 'development');
  assert.equal(environment.SIDE_2_URL, 'https://side2.test');
  assert(process.env.VITEST, 'The parent test runner environment must remain unchanged');
});

test('Astro dev SSR fragments integrate with a host across locales and states', async () => {
  let scenario: Scenario = 'active';
  let child: ChildProcess | undefined;
  let browser: Browser | undefined;
  const mock = createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/snapshot') {
      sendJson(response, scenario === 'active' ? aktivPeriode : scenario === 'ended' ? avsluttetPeriode : null);
      return;
    }
    if (request.method === 'GET' && request.url === '/confirmations') {
      sendJson(response, scenario === 'active' ? tilgjengeligeBekreftelser : []);
      return;
    }
    response.writeHead(404);
    response.end();
  });

  try {
    const mockPort = await listen(mock);
    const astroPort = await chooseAvailablePort();
    const astroBaseUrl = `http://127.0.0.1:${astroPort}`;
    child = spawn(
      process.execPath,
      [astroCliPath(), 'dev', '--ignore-lock', '--host', '127.0.0.1', '--port', String(astroPort)],
      {
        cwd: process.cwd(),
        env: astroEnvironment({
          ASTRO_DEV_BACKGROUND: '0',
          NODE_ENV: 'development',
          ARBEIDSSOEKERPERIODER_SNAPSHOT_URL: `http://127.0.0.1:${mockPort}/snapshot`,
          TILGJENGELIGE_BEKREFTELSER_URL: `http://127.0.0.1:${mockPort}/confirmations`,
          ARBEIDSSOKERREGISTERET_OPPSLAG_CLIENT_ID: 'local-ssr-test',
          BEKREFTELSE_API_CLIENT_ID: 'local-ssr-test',
          SIDE_2_URL: 'https://side2.test',
        }),
        stdio: 'inherit',
      },
    );

    await waitForAstro(`${astroBaseUrl}/nb`, child);
    browser = await chromium.launch({ headless: true });
    const extractionPage = await browser.newPage();
    const hostPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    extractionPage.setDefaultTimeout(10_000);
    extractionPage.setDefaultNavigationTimeout(requestTimeoutMs);
    hostPage.setDefaultTimeout(10_000);
    hostPage.setDefaultNavigationTimeout(requestTimeoutMs);

    for (const locale of locales) {
      scenario = 'active';
      const active = await fetchAstroPage(extractionPage, `${astroBaseUrl}/${locale}`, locale);
      await setHostPage(hostPage, active.fragment, active.css, locale);

      assert.equal(await hostPage.getByRole('heading', { level: 3 }).textContent(), localizedText[locale].active);
      const cardLink = hostPage.locator('.aia-min-side-ssr a').first();
      assert.equal(await cardLink.getAttribute('href'), `https://side2.test${locale === 'nb' ? '' : `/${locale}`}`);
      const confirmationLink = hostPage.getByRole('link', {
        name: localizedText[locale].confirmation,
      });
      assert.equal(
        await confirmationLink.evaluate((link) => getComputedStyle(link).paddingTop),
        '16px',
        'The loaded Aksel link must retain its imported component styling in the host page',
      );
      assert.equal(
        await confirmationLink.getAttribute('href'),
        `https://side2.test${locale === 'nb' ? '' : `/${locale}`}/bekreftelse`,
      );

      await hostPage.keyboard.press('Tab');
      assert.equal(
        await hostPage.evaluate(() => (document.activeElement as HTMLAnchorElement).href),
        await cardLink.evaluate((link) => (link as HTMLAnchorElement).href),
      );
      await hostPage.keyboard.press('Tab');
      assert.equal(
        await hostPage.evaluate(() => (document.activeElement as HTMLAnchorElement).href),
        await confirmationLink.evaluate((link) => (link as HTMLAnchorElement).href),
      );
      await assertNoNestedInteractiveElements(hostPage);
      await assertReflowsAt320px(hostPage);
    }

    for (const locale of locales) {
      scenario = 'ended';
      const ended = await fetchAstroPage(extractionPage, `${astroBaseUrl}/${locale}`, locale);
      await setHostPage(hostPage, ended.fragment, ended.css, locale);
      assert.equal(await hostPage.getByRole('heading', { level: 3 }).textContent(), localizedText[locale].ended);
      assert.equal(await hostPage.locator('.aia-min-side-ssr a').count(), 1);
      await assertNoNestedInteractiveElements(hostPage);
    }

    for (const locale of locales) {
      scenario = 'empty';
      const empty = await fetchAstroPage(extractionPage, `${astroBaseUrl}/${locale}`, locale);
      await setHostPage(hostPage, empty.fragment, empty.css, locale);
      assert.equal(await hostPage.locator('.aia-min-side-ssr').textContent(), '');
      assert.equal(await hostPage.locator('.aia-min-side-ssr a').count(), 0);
    }

    await extractionPage.close();
    await hostPage.close();
  } finally {
    try {
      await browser?.close();
    } finally {
      try {
        if (child) await stopChild(child);
      } finally {
        if (mock.listening) {
          await new Promise<void>((resolve, reject) => mock.close((error) => (error ? reject(error) : resolve())));
        }
      }
    }
  }
}, 180_000);
