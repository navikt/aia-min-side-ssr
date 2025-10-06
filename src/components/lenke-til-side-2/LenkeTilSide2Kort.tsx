import { ExclamationmarkTriangleFillIcon } from "@navikt/aksel-icons";
import { type AggregertPeriode, lagHentTekstForSprak, type Sprak } from "@navikt/arbeidssokerregisteret-utils";
import { BodyShort, Link, LinkCard } from "@navikt/ds-react";
import prettyPrintDato from "../../utils/pretty-print-dato";
import LoggInViewport from "../logg-in-viewport";
import RegistrertTittel from "../registrert-tittel/registrert-tittel";
import { SokerJobbIkon } from "./SokerJobbIkon";
import styles from "./styles.module.css";

// import { AktivitetData, loggAktivitet, VisningsData } from '../../lib/tracking';

interface Side2Props {
  aggregertPeriode: AggregertPeriode;
  sprak: Sprak;
  harTilgjengeligBekreftelse: boolean;
  side2Url: string;
}
const TEKSTER = {
  nb: {
    registrert: "Registrert dato:",
    sistBekreftet: "sist bekreftet",
    duVarRegistrert: "Du var registrert fra",
    til: "til",
    seOgEndre: "Se og endre opplysninger",
    seTidligere: "Se tidligere opplysninger",
    bekreft: "Bekreft at du vil være registrert som arbeidssøker hos Nav",
  },
  nn: {
    registrert: "Registrert dato:",
    sistBekreftet: "sist stadfesta",
    duVarRegistrert: "Du var registrert frå",
    til: "til",
    seOgEndre: "Sjå og endre opplysningar",
    seTidligere: "Sjå tidligare opplysningar",
    bekreft: "Stadfest at du vil vera registrert som arbeidssøkjar hos Nav",
  },
  en: {
    registrert: "Registered:",
    sistBekreftet: "last confirmed",
    duVarRegistrert: "You were registered from",
    til: "to",
    seOgEndre: "View and change answers from registration",
    seTidligere: "View answers from previous registration",
    bekreft: "Confirm that you want to be registered as a jobseeker with Nav",
  },
};

const LenkeTilSide2Kort = (props: Side2Props) => {
  const { harTilgjengeligBekreftelse, sprak, aggregertPeriode, side2Url } = props;
  const harAktivArbeidssokerperiode = Boolean(aggregertPeriode?.startet) && !aggregertPeriode?.avsluttet;
  const bekreftelse = aggregertPeriode.bekreftelser[0];
  const tekst = lagHentTekstForSprak(TEKSTER, sprak);

  function hentLoggVisningData() {
    if (!harAktivArbeidssokerperiode) {
      return { viser: "Mikrofrontend for ikke aktiv arbeidssøker" };
    }
    if (harTilgjengeligBekreftelse) {
      return { viser: "Mikrofrontend for aktiv arbeidssøker - med bekreftelse" };
    }
    return { viser: "Mikrofrontend for aktiv arbeidssøker" };
  }

  function _hentAktivitetData() {
    if (!harAktivArbeidssokerperiode) {
      return { aktivitet: "Trykker på mikrofrontend for ikke aktiv arbeidssøker" };
    }
    if (harTilgjengeligBekreftelse) {
      return { aktivitet: "Trykker på mikrofrontend for aktiv arbeidssøker - med bekreftelse" };
    }
    return { aktivitet: "Trykker på mikrofrontend for aktiv arbeidssøker" };
  }

  const onClick = async () => {
    // await loggAktivitet(hentAktivitetData());
  };

  const onClickBekreftelse = async () => {
    // await loggAktivitet({ aktivitet: 'Trykker på bekreftelse lenke fra mikrofrontend' });
  };

  const sprakUrlPostfix = sprak === "nb" ? "" : `/${sprak}`;

  return (
    <div>
      <LinkCard
        className={`${styles.aiaLinkCard} ${harTilgjengeligBekreftelse ? styles.aiaLinkCard_bekreftelse : ""}`.trim()}
        arrowPosition={"center"}
        onClick={onClick}
      >
        <LoggInViewport data={hentLoggVisningData()} />
        <LinkCard.Icon className={styles.aiaLinkCard_icon_wrapper}>
          <div className={styles.aiaLinkCard_ikon}>
            <SokerJobbIkon />
          </div>
        </LinkCard.Icon>
        <LinkCard.Title as={"h3"}>
          <LinkCard.Anchor href={`${side2Url}${sprakUrlPostfix}`}>
            <RegistrertTittel
              harAktivArbeidssokerperiode={harAktivArbeidssokerperiode}
              opplysningerOmArbeidssoker={aggregertPeriode?.opplysningerOmArbeidssoeker ?? []}
              sprak={sprak}
            />
          </LinkCard.Anchor>
        </LinkCard.Title>
        <LinkCard.Description>
          {harAktivArbeidssokerperiode ? (
            <>
              <BodyShort size={"small"} spacing>
                {tekst("registrert")} {prettyPrintDato(aggregertPeriode.startet.tidspunkt, sprak)}
                {bekreftelse &&
                  `, ${tekst("sistBekreftet")}: ${prettyPrintDato(bekreftelse.svar.sendtInnAv.tidspunkt, sprak)}`}
              </BodyShort>
              {tekst("seOgEndre")}
            </>
          ) : (
            <div className={"mt-2"}>
              <BodyShort>
                {`${tekst("duVarRegistrert")} ${prettyPrintDato(aggregertPeriode.startet.tidspunkt, sprak)} ${tekst("til")} ${prettyPrintDato(aggregertPeriode.avsluttet?.tidspunkt, sprak)}`}
              </BodyShort>
              {tekst("seTidligere")}
            </div>
          )}
        </LinkCard.Description>
      </LinkCard>
      {harTilgjengeligBekreftelse && harAktivArbeidssokerperiode && (
        <Link
          className={styles.aiaLinkCardBekreftelse}
          href={`${side2Url}${sprakUrlPostfix}/bekreftelse`}
          onClick={onClickBekreftelse}
          variant={"neutral"}
        >
          <ExclamationmarkTriangleFillIcon
            title="a11y-title"
            fontSize="1.5rem"
            width={48}
            style={{ color: "var(--a-icon-warning)" }}
          />
          {tekst("bekreft")}
        </Link>
      )}
    </div>
  );
};

export default LenkeTilSide2Kort;
