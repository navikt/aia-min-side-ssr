# AGENTS.md — aia-min-side-ssr

Instruksjoner for AI-kodingsagenter som arbeider i dette repoet.

## Hva er dette?

`aia-min-side-ssr` er en **server-side rendret microfrontend** for Arbeidssøkerregisteret, vist på nav.no/minside.
Den viser innbyggerens registreringsstatus, siste bekreftelsesdato og relevante lenker til arbeidssøkerregisteret.

- **Team**: PAW — `#team-paw-dev` på Slack
- **Namespace**: `paw`
- **Arketype**: Microfrontend (Astro SSR + React) integrert i `tms-min-side` via mikrofrontend-manifest
- **Brukere**: Innbyggere som er (eller nylig har vært) registrert som arbeidssøkere

## Kom i gang

Pakker hentes fra GitHub Package Registry og krever autentisering:

1. Opprett et GitHub PAT med `read:packages`-scope og konfigurer SSO mot NAVIKT
2. Logg inn: `pnpm login --registry https://npm.pkg.github.com`
3. Opprett `.npmrc` i rotmappen:
   ```
   @navikt:registry=https://npm.pkg.github.com
   registry=https://registry.npmjs.org
   engine-strict=true
   save-exact=true
   ```
4. Installer avhengigheter: `pnpm install`

## Kommandoer

| Kommando | Beskrivelse |
|---|---|
| `pnpm run mock` | Start Hono-basert mock-server (port 3000) — **må kjøre før `dev`** |
| `pnpm run dev` | Start Astro dev-server (port 4321) |
| `pnpm run test:ci` | Kjør Vitest-tester (brukes i CI) |
| `pnpm run lint:ci` | Kjør Biome lint (brukes i CI) |
| `pnpm run lint` | Kontroller formatering, lint og importorganisering med Biome (uten autofix) |
| `pnpm run build` | TypeCheck + produksjonsbygg |
| `pnpm run test:storybook` | Kjør Storybook-tester i Chromium, inkludert tilgjengelighetstester (brukes i CI) |
| `pnpm run storybook` | Start Storybook (port 6006) |
| `pnpm run build-storybook` | Bygg Storybook for deploy |

Node.js-versjon styres av `.nvmrc`. Bruk `nvm use` før du starter.

Git-hooks kjører følgende kontroller:
- Pre-commit kjører `astro check` og `lint-staged`. Sistnevnte formaterer og retter lint-feil i støttede staged filer.
- Pre-push kjører `pnpm run test:ci` (unit-tester).

## Arkitektur

### Flyt

```
tms-min-side → TokenX-token i brukerkontekst → aia-min-side-ssr (Astro SSR)
                                              │
                    ┌─────────────────────────┴──────────────────────────┐
                    ▼                                                     ▼
  paw-arbeidssoekerregisteret-api-oppslag-v2     paw-arbeidssoekerregisteret-api-bekreftelse
  (POST /api/v3/snapshot)                        (GET /api/v1/tilgjengelige-bekreftelser)
```

### Auth

- `tms-min-side` er tillatt innkommende tjeneste i Nais-manifestene og kaller SSR-appen med et TokenX-token i brukerkontekst.
- Innlogging skjer i den overordnede Min side-flyten. Dette repoet konfigurerer ikke Wonderwall/ID-porten.
- `src/middleware/index.ts` validerer TokenX-token og lagrer det i `context.locals.token` for beskyttede requests.
- Dagens middleware hopper over tokenvalidering når `NODE_ENV` er `development`, eller når hele request-URL-en inneholder `/internal` eller `/storybook/`. Dette er substring-sjekker, ikke eksakte rutematcher. Ikke bruk dem som mønster for nye auth-unntak.
- Health-endpointene er `/api/internal/isAlive` og `/api/internal/isReady`.
- OBO-tokens veksles med `@navikt/oasis` (`requestOboToken`) for hvert downstream-kall
- **Aldri bruk Azure AD client_credentials** — brukerkontext må bevares

### Feil og tomme resultater

- Hovedsiden henter OBO-tokens parallelt og deretter data fra de to downstream-API-ene parallelt.
- Hvis tokenveksling eller datainnhenting feiler, returnerer hovedsiden HTTP 503.
- Rotkomponenten rendrer ingenting når snapshot mangler `startet`.
- `src/pages/[locale]/fallback.astro` er tom og viser ingen reservevisning.

### Nøkkelfiler

| Fil | Formål |
|---|---|
| `src/middleware/index.ts` | TokenX-validering med unntakene beskrevet under Auth |
| `src/utils/token.ts` | OBO-token exchange med `@navikt/oasis` |
| `src/utils/fetch.ts` | HTTP-klienter mot downstream-APIer |
| `src/utils/environment.ts` | Utviklingsmodussjekk og URL-sjekker (`isLocal`, `isInternal`, `isStorybook`) |
| `src/pages/[locale]/index.astro` | Hoved-SSR-side: henter data, rendrer komponenter |
| `src/components/aia.tsx` | Rotkomponent for microfrontenden |
| `astro.config.mjs` | Astro-konfigurasjon, env-schema, i18n, CSS-prefix |
| `nais/dev-gcp/nais.yaml` | Nais-manifest for dev |
| `nais/prod-gcp/nais.yaml` | Nais-manifest for prod |
| `mock/server.ts` | Lokal Hono-mock for downstream-APIer |

## Kodekonvensjoner

### CSS-scoping

All CSS **må** være scoped til `.aia-min-side-ssr`-klassen eller avgrenset lokalt, for eksempel med CSS Modules. PostCSS-prefixeren i `astro.config.mjs` prefikser CSS, men unntar `module.css`. Wrapperen alene hindrer ikke CSS-lekkasje: CSS-selektorene må også være avgrenset. Bruk Tailwind-klasser og inline-stiler innenfor wrapperen.

```tsx
// ✅ Riktig — inne i .aia-min-side-ssr-wrapper
<div className="aia-min-side-ssr">
  <div className="mt-2">...</div>
</div>

// ❌ Feil — stiler kan lekke ut til resten av min-side
<div className="mt-2">...</div>
```

I React (`.tsx`) bruker du `className`. I Astro-sider (`.astro`) bruker du `class`. Storybook legger til wrapperen gjennom dekoratoren i `.storybook/preview.tsx`.

### Tekster og i18n

Støttede språk: `nb` (default), `nn`, `en`. Alle brukervendte tekster skal støtte alle tre språk.

Mønsteret er et `TEKSTER`-objekt per komponent med `lagHentTekstForSprak` fra `@navikt/arbeidssokerregisteret-utils`:

```tsx
const TEKSTER = {
  nb: { tittel: 'Du er registrert som arbeidssøker' },
  nn: { tittel: 'Du er registrert som arbeidssøkjar' },
  en: { tittel: 'You are registered as job seeker' },
};

const tekst = lagHentTekstForSprak(TEKSTER, sprak);
return <h3>{tekst('tittel')}</h3>;
```

Legg **aldri** til hardkodede norske strenger uten nn/en-varianter.

### Komponenter

- Bruk Aksel Design System (`@navikt/ds-react`) for alle UI-komponenter
- Aksel-ikoner fra `@navikt/aksel-icons`
- Aksel-CSS importeres selektivt i `src/styles/aksel.css`. Når du tar i bruk en ny Aksel-komponent, sjekk om tilhørende komponent-CSS må legges til der.
- Alle komponenter er React-komponenter (`.tsx`) — ikke Astro-komponenter — for gjenbruk i Storybook
- Astro-sider (`.astro`) brukes kun for SSR-datainnhenting og sideoppsett

### Miljøvariabler

Appens miljøvariabler defineres i `astro.config.mjs` under `env.schema` med `envField`. De eksisterende feltene er server-side only. For nye appvariabler følger du dette mønsteret og importerer dem fra `astro:env/server`:

```ts
import { ARBEIDSSOEKERPERIODER_SNAPSHOT_URL } from 'astro:env/server';
```

Legg aldri til nye `process.env`-oppslag direkte: bruk `envField` i stedet. Eksisterende unntak er at hovedsiden leser `SIDE_2_URL` med `getEnv` fra `astro/env/runtime`, og `src/utils/environment.ts` bruker `process.env.NODE_ENV` for utviklingsmodussjekken.

### Logging

Logger med `pino` via `src/utils/logger.ts`.

```ts
import { logger } from '@src/utils/logger';
logger.info('Henter data fra API');
logger.error(error, 'Feilmelding');
```

**Aldri logg personopplysninger**: fnr, navn, adresse, helseopplysninger eller andre PII. Logg heller tekniske IDer og statuskoder.

## Sikkerhet

- **TokenX er påkrevd** for beskyttede requests. Dagens unntak er beskrevet under Auth. Ikke utvid dem uten en egen sikkerhetsvurdering.
- OBO-tokens veksles per kall — ikke cache tokens på tvers av brukere
- `accessPolicy` i Nais-manifest er minimal og eksplisitt — kun `tms-min-side` kan kalle inn
- Ikke legg til nye inbound-regler uten å forstå konsekvensene
- Ikke log PII — se loggingsreglene over

## Testing

Testrammeverket er **Vitest**. Tester plasseres ved siden av filen de tester (f.eks. `har-permittert-situasjon.test.ts` ved siden av `har-permittert-situasjon.ts`).

Storybook brukes for komponentdokumentasjon og automatiserte nettlesertester. Stories plasseres som `*.stories.ts` eller `*.stories.tsx` ved siden av komponenten. `.storybook/preview.tsx` setter tilgjengelighetstesting til `test: 'error'`, slik at tilgjengelighetsbrudd feiler Storybook-testene.

- Ikke legg til nye testrammeverk
- Ikke legg til Playwright for unit-tester (Playwright er installert, men brukes kun av Storybook/`@storybook/addon-vitest`)
- Kjør alltid `pnpm run test:ci` og `pnpm run lint:ci` etter endringer
- Ved UI-endringer kjører du også `pnpm run test:storybook`. Testene krever Chromium, som installeres med `pnpm exec playwright install chromium` lokalt og med `--with-deps` i CI.

## Deployment

| Branch | Deploy-mål |
|---|---|
| `main` | dev-gcp + prod-gcp |
| `dev/*` | kun dev-gcp |

Bygg-pipeline (`.github/workflows/deploy.yaml`):
1. Lint (Biome)
2. Unit-tester (Vitest)
3. Storybook-tester i Chromium, inkludert tilgjengelighetstester
4. Knip (ubrukt kode-rapport, blokkerer ikke bygg ved funn)
5. Astro-typesjekk og produksjonsbygg
6. Storybook-bygg
7. Last opp statiske assets til CDN (`cdn.nav.no/paw/aia-min-side-ssr`)
8. Docker push til NAIS registry
9. Oppdater mikrofrontend-manifest (`tms-deploy`)
10. Deploy til Nais

Docker-imaget inkluderer Storybook-bygget under `dist/client/storybook`.

Nais-manifestene ligger i `nais/dev-gcp/nais.yaml` og `nais/prod-gcp/nais.yaml`.

## Vanlige feil

| Feil | Årsak | Løsning |
|---|---|---|
| 401 fra SSR-appen | Manglende eller ugyldig TokenX-token utenfor utviklingsmodus | Kontroller tokenet fra innkommende tjeneste. Ved lokal utvikling hopper `pnpm run dev` over auth; start også mock-serveren for downstream-kall |
| CSS påvirker resten av min-side | Stiler utenfor `.aia-min-side-ssr`-wrapper | Sørg for at alt rendres innenfor wrapper-diven |
| `Cannot find module '@navikt/...'` | Mangler GitHub PAT-autentisering | Se "Kom i gang"-seksjonen |
| Env-variabel undefined | Bruker `process.env` direkte | Importer fra `astro:env/server` |
| OBO-token-feil i prod | Feil `clientId` i env | Sjekk `ARBEIDSSOKERREGISTERET_OPPSLAG_CLIENT_ID` i nais.yaml |
| Ny komponent vises ikke i Storybook | Mangler `.stories.ts`- eller `.stories.tsx`-fil | Opprett stories-fil ved siden av komponenten |
