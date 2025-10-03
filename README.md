# tms-microfrontend-template-ssr

Kan brukes som utgangspunkt for å opprette nye server-side rendrede microfrontends til Min Side.

# Kom i gang

## Tilpasse templatet til ditt prosjekt

1. `CMD + Shift + F` og søk etter `tms-microfrontend-template-ssr` og erstatt dette med ditt applikasjonsnavn.
2. Tilpass innholdet i `nais/dev-gcp/nais.yaml` og `nais/prod-gcp/nais.yaml` til ditt prosjekt.
3. Tilpass innholdet i `.github/workflows/deploy.yaml` til ditt prosjekt.
4. Be om tilgang til å oppdatere manifestet og deploye applikasjonen til nais på slack kanalen [#minside-microfrontends](https://nav-it.slack.com/archives/C04V21LT27P).
5. Kommenter ut `update-manifest-prod-gcp` og `deploy-prod-gcp` stegene i `.github/workflows/deploy.yaml`.

NOTE: Du bør se på konteksten i filen du endrer.

# Kjøre appen lokalt

1. Installer dependencies: `npm i`
2. Start hono mockserver: `npm run mock`
3. Med mockserver kjørende i egen terminal, start appen: `npm run dev`
4. Appen nås på http://localhost:4321/

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#minside-microfrontends](https://nav-it.slack.com/archives/C04V21LT27P).
