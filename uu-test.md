# UU-testing

Dette dokumentet beskriver automatiske tester og manuell kontroll av universell utforming i `aia-min-side-ssr`.

Microfrontenden skal la innbyggeren lese registreringsstatus og datoer, gå til egne opplysninger og åpne en tilgjengelig bekreftelse. Testene skal støtte denne oppgaven på bokmål, nynorsk og engelsk.

Grønne tester viser bare at kontrollene som er kjørt, bestod. De er ikke bevis på at alle WCAG-krav er oppfylt. axe finner noen typer brudd, mens andre krav krever eksplisitte nettlesertester eller menneskelig vurdering.

## Kjør testene lokalt

Bruk Node-versjonen i `.nvmrc` og prosjektets pnpm-versjon:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run test:ci
pnpm run lint:ci
pnpm run test:storybook
pnpm run test:uu:ssr
pnpm exec astro check
```

Installasjon fra GitHub Package Registry krever oppsettet i `AGENTS.md`. Ikke legg tokens i testfiler eller testresultater.

Storybook-testene starter nettleseren selv. SSR-testen starter en egen Astro-prosess og en lokal mock med syntetiske testdata. Du skal ikke starte `pnpm run mock` eller `pnpm run dev` for disse testene.

For manuell komponentkontroll:

```sh
pnpm run storybook
```

Åpne en story i egen fane, uten Storybook-menyene, når du tester tastatur og skjermleser. Test også microfrontenden innbygd på Min side. Storybook gjenskaper ikke hele den siden.

## Hva testes automatisk?

### axe i Storybook

`.storybook/preview.tsx` konfigurerer `@storybook/addon-a11y`. Registrerte brudd får Storybook-testene til å feile. Skanningen skjer etter storyens `play`-funksjon, slik at DOM-en som står igjen etter interaksjonen, blir kontrollert.

Regelsettet inkluderer axe-tagene `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` og `best-practice`. WCAG 2.2 AA-kontrollene er et supplement til prosjektets WCAG 2.1 AA-grunnlag. Tagene betyr ikke at axe kan kontrollere alle krav i disse standardene.

`pnpm run test:storybook` velger alle tre nettleserprosjektene i `vitest.config.ts`: vanlig Chromium, Chromium med tvungne farger og Chromium med redusert bevegelse. De to siste bruker faktiske Playwright-innstillinger. En grønn kjøring viser ikke alene at farger og bevegelse fungerer godt visuelt. Feilskjermbilder lagres under `.vitest/attachments/failure-screenshots/`.

axe kontrollerer blant annet maskinelt vurderbare deler av:

- HTML- og ARIA-semantikk, inkludert gyldige attributter og roller.
- Tilgjengelige navn på lenker og andre interaktive elementer.
- Tekstkontrast der verktøyet kan fastslå forgrunn og bakgrunn. Bilder og gradienter kan kreve manuell vurdering.
- Alternativ tekst for bilder og enkelte krav til struktur og språk.

Et funn i `violations` er et registrert brudd. Et funn i `incomplete` krever vurdering og skal ikke tolkes som en bestått kontroll. Åpne den aktuelle storyen, se resultatet i Accessibility-panelet og undersøk elementet og kriteriet. Registrer vurderingen i PR-en eller teamets oppfølgingssystem.

Den installerte Storybook-addonen slår av axe-regelen `region` som standard fordi stories er komponentfragmenter. Dette er ikke en standardinnstilling i axe selv. Ikke legg til `main`, `h1` eller andre sideelementer i produksjonskomponenten for å tilfredsstille et isolert testmiljø. Vurder hele sidestrukturen på Min side.

### Tilstander, navn og tastatur

Kriteriene viser hvilke krav testene bidrar til å kontrollere. Tabellen betyr ikke at hvert kriterium er fullstendig testet. Hjelpefilen inneholder ikke selvstendige testtilfeller.

| Testfil | Kontroll | Relaterte WCAG-kriterier |
| --- | --- | --- |
| `src/components/aia.stories.tsx` | Synlig eller tom microfrontend, kombinasjoner av registreringsstatus og bekreftelse, språk og lenker | 1.3.1, 2.4.4, 4.1.2 |
| `src/components/lenke-til-side-2/LenkeTilSide2Kort.stories.ts` | Overskrift, datoer, språkspesifikke URL-er, lenkenavn og tastatur | 1.3.1, 2.1.1, 2.4.3, 2.4.4, 2.5.3, 4.1.2 |
| `src/components/registrert-tittel/registrert-tittel.stories.tsx` | Registrert, permittert, avsluttet og manglende opplysninger | 1.3.1 |
| `src/components/uu-testhjelpere.ts` | Hjelpefunksjoner for tastatur, tilgjengelige navn og layout under belastning | Brukes av story-testene |
| `scripts/uu-ssr.test.ts` | Faktisk Astro-respons satt inn i en representativ host-side, med kontroll av fragmentets språk, semantikk, lenker og smal visning. Ikke kjørt i denne sesjonen | 1.3.1, 1.4.10, 2.1.1, 2.4.3, 2.4.4, 3.1.2, 4.1.2 |

Testdataene omfatter aktiv og avsluttet periode, permittering, tilgjengelig bekreftelse, manglende siste bekreftelse og tomt resultat. Bokmål, nynorsk og engelsk skal inngå. Når en ny synlig tilstand legges til, må den få en story og forventninger til innhold og interaksjon.

Ikoner som bare gjentar teksten, skal ikke legge til ekstra innhold i lenkenes tilgjengelige navn. Tester av hele navnet skal fange opp blant annet at plassholderen `a11y-title` kommer tilbake.

### Layout og brukerinnstillinger

Testene supplerer axe med eksplisitte kontroller av smal visning og endret tekstpresentasjon. Ved tekstspacing brukes WCAG-verdiene: linjehøyde minst 1,5 ganger skriftstørrelsen, avstand etter avsnitt minst 2 ganger skriftstørrelsen, bokstavavstand 0,12 em og ordavstand 0,16 em. Avsnittsavstanden gjelder mellom tekstavsnitt, ikke marginen rundt hele kortet.

Story-testene kontrollerer først reflow i en målt 320 px bred beholder med normal tekststørrelse. De kontrollerer tekstspacing og simulert 200 % tekststørrelse separat ved vanlig beholderbredde. Dette er ikke en test av alle tilpasningene samtidig. Egne stress-stories på alle tre språk beholder teksttilpasningen under axe-skanningen. De vanlige storyene gjenoppretter tekst og layout før axe skanner normaltilstanden. Stiler ryddes opp mellom stories.

Automatisk tekstforstørring er en simulering av større tekst, ikke ekte nettleserzoom. En visningsbredde på 320 CSS-piksler gir en delvis reflow-kontroll, men erstatter ikke kontroll med 400 % zoom på Min side.

Geometriske tester kan finne horisontalt overløp og elementer som faller utenfor beholderen. De kan ikke alene avgjøre om teksten er lett å lese, om fokus er tydelig nok, eller om alt innhold er visuelt forståelig. Kontroller dette også manuelt.

En automatisk kontroll av `:focus-visible` og beregnet outline viser at fokusstilen finnes, ikke at den har nok kontrast eller er fri for tildekking på Min side. Tilsvarende kan en måling av lenkens målområde bidra til å teste 2.5.8, men ikke vise hvor lett lenken er å treffe i den faktiske oppgaven.

## Ansvar og begrensninger

Dette repoet har ansvar for kortets innhold, lenker, ikoner, lokale stiler og tastaturbetjening. Min side har ansvar for dokumentets språk, overordnet navigasjon, sidestruktur og hvordan microfrontenden settes inn og eventuelt erstattes med fallback.

SSR-wrapperen setter nå `lang` fra det valgte språket. SSR-testen kontrollerer attributtet på fragmentet fra serveren for aktiv, avsluttet og tom tilstand på alle tre språk. Den representative host-siden setter også dokumentets språk, men dette er testoppsett, ikke bevis på Min sides oppførsel. Kontroller språk og uttale innbygd på den ekte Min side.

SSR-testen bruker Astro i utviklingsmodus og lokale API-mocker. Den tester ikke TokenX, produksjonsbyggets CDN-ressurser, reelle API-er eller hele Min side. Den bruker eksisterende lokal utviklingsflyt uten å utvide auth-unntakene.

SSR-testen gjør eksplisitte semantikk- og layoutkontroller, ikke en egen axe-skanning. axe kjøres gjennom Storybook. Det gjenstår derfor å kontrollere hele den produksjonsbygde siden med dens faktiske CSS og omgivelser.

`pnpm run test:ci` kjører bare Vitest-unit-testene. SSR-testen kjøres separat med `pnpm run test:uu:ssr`, også gjennom Vitest. Deploy-workflowen kjører begge disse kommandoene og `pnpm run test:storybook` før bygg og deployment på `main` og `dev/*`. Teststatus står nederst. Det er ikke lagt til en egen PR-workflow eller endret CI-permisjoner.

Lyd, video, skjemaer og tidsbegrensede interaksjoner finnes ikke i dagens kort og har derfor ingen egne tester her. Kortet er statisk SSR-innhold uten dynamiske statusmeldinger. Det trenger ikke en `aria-live`-region ved første visning. Vurder kriterium 4.1.3 på nytt hvis innholdet senere oppdateres uten navigasjon.

Hovedsiden returnerer HTTP 503 ved feil i tokenveksling eller datainnhenting. `fallback.astro` er tom. Om innbyggeren får en forståelig feil og vei videre, må testes gjennom Min side. Et tomt komponentresultat er ikke det samme som en tilgjengelig feilvisning.

Lenkemålene ligger utenfor denne microfrontenden. Automatiske tester kontrollerer URL-er og aktivering uten å sende brukeren til de eksterne tjenestene. Hele oppgaven må også prøves gjennom de faktiske lenkene i testmiljøet.

## Manuell testoppskrift

Bruk syntetiske testbrukere. Ikke legg personopplysninger, tokens eller skjermbilder med ekte brukerdata i rapporten.

Test minst aktiv periode med og uten bekreftelse, permittert, avsluttet og tomt resultat. Gjenta språkavhengige kontroller på `nb`, `nn` og `en`.

### Tastatur og fokus

1. Åpne Min side og legg musen til side.
2. Bruk Tab fram til kortet. Bruk Shift+Tab tilbake til foregående element.
3. Fortsett gjennom kortet og eventuell bekreftelseslenke til neste del av Min side.
4. Aktiver begge lenkene med Enter. Gå tilbake og kontroller at du finner tilbake til oppgaven.

Forventet resultat:

- Fokusrekkefølgen følger innholdet. Dekorative ikoner får ikke fokus.
- Fokus er synlig på begge lenker og skjules ikke bak andre elementer, også ved zoom.
- Du sitter ikke fast i kortet. Tastaturet gir tilgang til de samme handlingene som musen.
- Enter åpner riktig side på riktig språk.

Relevante kriterier: 2.1.1, 2.1.2, 2.4.3 og 2.4.7. Kontroller også 2.4.11 (AA i WCAG 2.2) som forbedringsmål utover prosjektets WCAG 2.1 AA-grunnlag.

### Skjermleser

Bruk VoiceOver med Safari på macOS og NVDA med en støttet nettleser på Windows. Noter nettleser- og skjermleserversjon. I Safari må innstillingen for tastaturnavigasjon være aktivert når du tester Tab gjennom lenker.

1. Finn arbeidssøkerkortet via overskriftsnavigasjon.
2. Les innholdet i leserekkefølge og åpne skjermleserens lenkeliste.
3. Kontroller aktiv status, eventuell permittering, registreringsdato og siste bekreftelse.
4. Finn og aktiver bekreftelseslenken når den finnes.
5. Gjenta for avsluttet periode og alle språk.

Forventet resultat:

- Registreringsstatus og datoer leses i forståelig rekkefølge.
- Overskriften passer inn under Min sides overskrifter.
- Lenkenavn forklarer målet uten hjelp fra visuell plassering. Vurder også om det store kortets navn er lengre enn nødvendig.
- Ingen ikonnavn, `a11y-title` eller andre plassholdere leses opp.
- Skjermleseren bruker riktig språk og uttale. Kontroller arvet språk i nettleserens tilgjengelighetstre.

Relevante kriterier: 1.1.1, 1.3.1, 1.3.2, 2.4.4, 3.1.1 og 4.1.2. Kriterium 3.1.2 gjelder også dersom kortet inneholder tekstdeler på et annet språk enn resten av innholdet.

### Zoom, reflow og tekstspacing

1. Åpne Min side med et vindu som har 1280 CSS-pikslers innholdsbredde ved 100 % zoom.
2. Sett nettleserzoom til 200 %. Les og aktiver begge lenker.
3. Sett zoom til 400 %, tilsvarende omtrent 320 CSS-pikslers tilgjengelig bredde.
4. Kontroller også mobilvisning med 320 CSS-pikslers bredde.
5. Bruk en tekstspacing-bookmarklet eller DevTools til å sette WCAG-verdiene som er oppgitt over på tekst og avsnitt. Gjenta med de lengste engelske tekstene.
6. Snu mobilvisningen mellom stående og liggende. Kontroller at ingen handlinger krever én bestemt retning.

Forventet resultat: Ingen tekst eller handlinger forsvinner, overlapper eller klippes. Du trenger ikke rulle i to retninger for å lese kortet. Begge lenkene er tilgjengelige og fokusindikatoren er synlig.

Relevante kriterier: 1.3.4, 1.4.4, 1.4.10 og 1.4.12.

### Kontrast, farger og peker

1. Kontroller tekst og bakgrunn i normaltilstand, hover og tastaturfokus. Ta med den gule bekreftelsesdelen.
2. Bruk et kontrastverktøy der axe krever manuell vurdering. Normal tekst skal ha minst 4,5:1 kontrast. Stor tekst skal ha minst 3:1. Relevante grafiske elementer og tilstander må vurderes mot 1.4.11.
3. Aktiver Windows-høykontrast eller systemets tvungne farger. Kontroller at lenkene og fokus fortsatt kan skilles fra bakgrunnen.
4. Bruk berøring eller mobilvisning til å kontrollere at lenkene er lette å treffe uten feilaktivering av naboen. Vurder 24 × 24 CSS-piksler og unntakene i WCAG 2.2-kriterium 2.5.8.
5. Aktiver redusert bevegelse. Vurder om kortets hover-skalering gir plagsom bevegelse, og om den bør fjernes eller reduseres. Dette er et forbedringspunkt, ikke automatisk et WCAG 2.1 AA-brudd.

Farge skal ikke være eneste måte å forstå at en bekreftelse er tilgjengelig på (1.4.1). En målt fargeverdi alene beviser ikke at fokusindikatoren er tydelig. Hover-skalering må ikke skjule tekst eller andre handlinger. Hvis det senere legges til tooltip eller annet ekstra innhold ved hover eller fokus, må 1.4.13 testes særskilt.

### Integrasjon, tom tilstand og feil

1. Åpne microfrontenden på ekte Min side i testmiljøet, ikke bare i Storybook.
2. Kontroller overskriftshierarki, språk, nabokort og fokusrekkefølge. Ta med sidetittel, skip-lenke og landmarks som Min side har ansvar for.
3. Følg lenken til egne opplysninger og lenken til bekreftelse. Kontroller at du kan fullføre og kontrollere resultatet av oppgaven.
4. Bruk en testbruker uten periode. Kontroller at et tomt resultat ikke etterlater en tom overskrift eller et fokuspunkt.
5. Avtal en kontrollert feiltest med teamet i testmiljøet. Kontroller Min sides oppførsel ved 503 og tom fallback, og at resten av siden fortsatt kan brukes.

Ikke ta ned avhengigheter i produksjon for å teste feilvisning. Avtal hvordan dere utløser syntetiske feil uten å påvirke andre brukere.

## Rapportering og vedlikehold

Noter dato, commit eller branch, miljø, språk og tilstander, nettleser, operativsystem og hjelpemiddel for hver manuell testrunde. Noter trinn, forventet og faktisk resultat, relevant WCAG-kriterium og ansvarlig team for hvert funn. Bruk «ikke testet» der bevis mangler, ikke «bestått».

Ved automatiske brudd: reproduser den konkrete storyen eller SSR-testen, undersøk feilen og legg til en regresjonstest. Ikke slå av en axe-regel eller endre `test: 'error'` til `todo` for å skjule et brudd. Et begrunnet unntak må beskrive omfang, årsak og oppfølging.

Kjør testene ved endringer i komponenter, tekster, CSS, Aksel-versjon, Astro og Storybook. Gjenta manuell kontroll ved endret navigasjon, semantikk eller innbygging på Min side.

## Teststatus

Kontrollene for denne endringen bruker Node 26.13.0 via nvm. Nettlesertestene var først blokkert av `net::ERR_ACCESS_DENIED` mot den lokale Vitest-serveren. Etter at sandbox-tillatelsene ble endret, kunne de kjøre. Testhjelperens feilaktige forventning til beregnet `line-height` ble rettet. Siste kjøring av `pnpm run test:storybook` bestod med 90 tester: 30 stories i hvert av de tre Chromium-prosjektene.

| Kontroll | Resultat i denne sesjonen |
| --- | --- |
| `pnpm run test:ci` | 8 tester bestod |
| `pnpm run test:storybook` | 90 tester bestod |
| `pnpm run lint:ci` | Bestod |
| `pnpm exec tsc --noEmit` | Bestod. Dette erstatter ikke Astro-typesjekken av `.astro`-filer |
| Biome på testskript og konfigurasjonsfiler | Bestod |
| `git diff --check` | Bestod |
| Miljøregresjon i SSR-prosjektet | Bestod med navnefilter, uten å starte Astro |
| SSR-integrasjonstesten | Feilet med 404 i en lokal kjøring. Årsaken er rettet, men hele testen er ikke kjørt på nytt |
| `pnpm exec astro check` | Blokkert av sandboxen |
| Produksjonsbygg | Ikke kjørt |
| Manuell skjermleser- og Min side-test | Ikke utført |

En lokal kjøring av SSR-integrasjonstesten viste at Astro startet, men svarte 404 i oppstartskontrollen. Barneprosessen arvet `VITEST` fra testkjøreren. I den installerte Astro-versjonen gjør dette at SSR-middleware ikke blir satt opp. Testen fjerner nå `VITEST` fra barneprosessens miljø. En egen regresjonstest kontrollerer at foreldremiljøet beholdes, mens barneprosessen ikke får markøren. Regresjonstesten, TypeScript og Biome bestod etter rettingen. Hele SSR-integrasjonstesten må fortsatt kjøres på nytt.

Astro-typesjekken har tidligere vært blokkert: `pnpm exec astro check` fikk `EPERM` ved skriving av `/Users/geir/Library/Preferences/astro/config.json`. Derfor ble ikke Astro startet igjen i denne sesjonen. Astro-typesjekken og produksjonsbygget er fortsatt ikke verifisert. Sandbox-begrensningen er ikke omgått.

Storybook meldte også om `EPERM` ved skriving av `/Users/geir/.storybook/settings.json`. Dette hindret ikke den siste nettleserkjøringen. Ingen manuell skjermleser- eller Min side-test er utført som del av denne endringen.

Egen PR-kjøring, lagring av CI-artefakter og en produksjonsbygget integrasjonstest er fortsatt forbedringspunkter. Ikke forveksle en lokal testfil med en test som faktisk har bestått i CI.

## Kilder

- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C: evaluering av tilgjengelighet](https://www.w3.org/WAI/test-evaluate/)
- [W3C: tekstspacing](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html)
- [W3C: reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
