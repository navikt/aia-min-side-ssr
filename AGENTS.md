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
| `pnpm run lint` | Biome lint med autofix |
| `pnpm run build` | TypeCheck + produksjonsbygg |
| `pnpm run storybook` | Start Storybook (port 6006) |
| `pnpm run build-storybook` | Bygg Storybook for deploy |

Node.js-versjon styres av `.nvmrc`. Bruk `nvm use` før du starter.

## Arkitektur

### Flyt

```
Nettleser → Wonderwall (ID-porten) → aia-min-side-ssr (Astro SSR)
                                              │
                    ┌─────────────────────────┴──────────────────────────┐
                    ▼                                                     ▼
  paw-arbeidssoekerregisteret-api-oppslag-v2     paw-arbeidssoekerregisteret-api-bekreftelse
  (POST /api/v3/snapshot)                        (GET /api/v1/tilgjengelige-bekreftelser)
```

### Auth

- **TokenX** brukes for å kalle downstream-tjenester (innbygger har brukerkontext)
- Wonderwall/ID-porten autentiserer innbyggeren og setter token i request headers
- `src/middleware/index.ts` validerer TokenX-token på alle requests (unntatt `/internal`)
- OBO-tokens veksles med `@navikt/oasis` (`requestOboToken`) for hvert downstream-kall
- **Aldri bruk Azure AD client_credentials** — brukerkontext må bevares

### Nøkkelfiler

| Fil | Formål |
|---|---|
| `src/middleware/index.ts` | TokenX-validering for alle requests |
| `src/utils/token.ts` | OBO-token exchange med `@navikt/oasis` |
| `src/utils/fetch.ts` | HTTP-klienter mot downstream-APIer |
| `src/utils/environment.ts` | Miljøsjekker (`isLocal`, `isInternal`) |
| `src/pages/[locale]/index.astro` | Hoved-SSR-side: henter data, rendrer komponenter |
| `src/components/aia.tsx` | Rotkomponent for microfrontenden |
| `astro.config.mjs` | Astro-konfigurasjon, env-schema, i18n, CSS-prefix |
| `nais/dev-gcp/nais.yaml` | Nais-manifest for dev |
| `nais/prod-gcp/nais.yaml` | Nais-manifest for prod |
| `mock/server.ts` | Lokal Hono-mock for downstream-APIer |

## Kodekonvensjoner

### CSS-scoping

All CSS **må** være scoped til `.aia-min-side-ssr`-klassen. PostCSS-prefixer gjør dette automatisk for global CSS, men ved inline-stiler eller Tailwind-klasser i komponenter må du passe på at de brukes innenfor denne wrapperen.

```tsx
// ✅ Riktig — inne i .aia-min-side-ssr-wrapper
<div class="aia-min-side-ssr">
  <div className="mt-2">...</div>
</div>

// ❌ Feil — stiler kan lekke ut til resten av min-side
<div className="mt-2">...</div>
```

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
- Alle komponenter er React-komponenter (`.tsx`) — ikke Astro-komponenter — for gjenbruk i Storybook
- Astro-sider (`.astro`) brukes kun for SSR-datainnhenting og sideoppsett

### Miljøvariabler

Miljøvariabler defineres i `astro.config.mjs` under `env.schema` med `envField`. De er type-safe og server-side only. Importer dem alltid fra `astro:env/server`:

```ts
import { ARBEIDSSOEKERPERIODER_SNAPSHOT_URL } from 'astro:env/server';
```

Legg aldri til nye `process.env`-oppslag direkte — bruk `envField` i stedet.

### Logging

Logger med `pino` via `src/utils/logger.ts`.

```ts
import { logger } from '@src/utils/logger';
logger.info('Henter data fra API');
logger.error(error, 'Feilmelding');
```

**Aldri logg personopplysninger**: fnr, navn, adresse, helseopplysninger eller andre PII. Logg heller tekniske IDer og statuskoder.

## Sikkerhet

- **TokenX er påkrevd** — alle requests fra innbyggere må ha gyldig TokenX-token
- OBO-tokens veksles per kall — ikke cache tokens på tvers av brukere
- `accessPolicy` i Nais-manifest er minimal og eksplisitt — kun `tms-min-side` kan kalle inn
- Ikke legg til nye inbound-regler uten å forstå konsekvensene
- Ikke log PII — se loggingsreglene over

## Testing

Testrammeverket er **Vitest**. Tester plasseres ved siden av filen de tester (f.eks. `har-permittert-situasjon.test.ts` ved siden av `har-permittert-situasjon.ts`).

Storybook brukes for visuell testing og komponentdokumentasjon — stories plasseres som `*.stories.tsx` ved siden av komponenten.

- Ikke legg til nye testrammeverk
- Ikke legg til Playwright for unit-tester (Playwright er installert, men brukes kun av Storybook/`@storybook/addon-vitest`)
- Kjør alltid `pnpm run test:ci` og `pnpm run lint:ci` etter endringer

## Deployment

| Branch | Deploy-mål |
|---|---|
| `main` | dev-gcp + prod-gcp |
| `dev/*` | kun dev-gcp |

Bygg-pipeline (`.github/workflows/deploy.yaml`):
1. Lint (Biome)
2. Test (Vitest)
3. Knip (ubrukt kode-rapport)
4. Astro-bygg
5. Storybook-bygg
6. Last opp statiske assets til CDN (`cdn.nav.no/paw/aia-min-side-ssr`)
7. Docker push til NAIS registry
8. Oppdater mikrofrontend-manifest (`tms-deploy`)
9. Deploy til Nais

Nais-manifestene ligger i `nais/dev-gcp/nais.yaml` og `nais/prod-gcp/nais.yaml`.

## Vanlige feil

| Feil | Årsak | Løsning |
|---|---|---|
| 401 på alle requests | Wonderwall/TokenX ikke konfigurert lokalt | Kjør med mock-server (`pnpm run mock`) — lokal dev hopper over auth |
| CSS påvirker resten av min-side | Stiler utenfor `.aia-min-side-ssr`-wrapper | Sørg for at alt rendres innenfor wrapper-diven |
| `Cannot find module '@navikt/...'` | Mangler GitHub PAT-autentisering | Se "Kom i gang"-seksjonen |
| Env-variabel undefined | Bruker `process.env` direkte | Importer fra `astro:env/server` |
| OBO-token-feil i prod | Feil `clientId` i env | Sjekk `ARBEIDSSOKERREGISTERET_OPPSLAG_CLIENT_ID` i nais.yaml |
| Ny komponent vises ikke i Storybook | Mangler `.stories.tsx`-fil | Opprett stories-fil ved siden av komponenten |
