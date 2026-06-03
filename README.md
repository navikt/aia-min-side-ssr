# aia-min-side-ssr

Arbeidssøkerregisteret sin microfrontend på Min Side.
En server-side rendret (SSR) app, bygget med Astro.

## Formål
Vi viser innhold fra Arbeidssøkerregisteret
- Om du er registrert
- Registrert dato
- Siste bekreftelse
- Lenke til se og endre opplysninger
- Lenke til bekreftelse, dersom du har en uforstående bekreftelse

## Storybook
Storybook for microfrontenden ligger på [https://aia-min-side.ansatt.dev.nav.no](https://aia-min-side.ansatt.dev.nav.no) (krever tilgang til ansatt.dev.nav.no ingressen)


## Kjøre appen lokalt

Bruk Node.js 24 `nvm use` (dersom du bruker nvm til versjonshåndtering av Node.js).

Siden noen av modulene hentes fra GitHubs package registry må du også gjøre litt ekstra konfigurasjon for å kjøre løsningen lokalt.

- Opprett et PAT (github => settings => developer settings => personal access tokens => tokens (classic)) med `read:packages` scope
- Konfigurer SSO mot NAVIKT for tokenet
- Bruk tokenet som passord ved login `pnpm login --registry https://npm.pkg.github.com`
- På roten av repoet lager du en `.npmrc` fil med dette innholdet

```
@navikt:registry=https://npm.pkg.github.com
registry=https://registry.npmjs.org
engine-strict=true
save-exact=true
```

Deretter fortsette du med
1. klon repo
2. bruk rett versjon av Node.js `nvm use`
3. Installer dependencies: `pnpm i`
4. Start hono mockserver: `pnpm run mock`
5. Med mockserver kjørende i egen terminal, start appen: `pnpm run dev`
6. Appen nås på http://localhost:4321/

## Deploye kun til dev

Ved å prefikse branch-navn med `dev/`, så vil branchen kun deployes i dev.

```
git checkout -b dev/<navn på branch>
```

## Test

For å se løsningen i dev bruker du [https://www.ansatt.dev.nav.no/minside](https://www.ansatt.dev.nav.no/minside)

Du vil trenger en syntetisk testbruker for å logge inn.
Slike brukere kan du opprette på [Dolly](https://dolly.ekstern.dev.nav.no/)

Microfrontenden vil bare vises dersom testpersonen er registrert arbeidssøker eller har vært det de siste 21 dagene.

## Ekstern dokumentasjon

- [Storybook](https://storybook.js.org/)
- [Aksel - komponenter](https://aksel.nav.no/komponenter)
- [Tailwind.css](https://tailwindcss.com/)

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på github.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75)
