import {
  lagHentTekstForSprak,
  type OpplysningerOmArbeidssokerResponse,
  type Sprak,
} from "@navikt/arbeidssokerregisteret-utils";
import { harPermittertSituasjon } from "../../utils/har-permittert-situasjon";

export const TEKSTER = {
  nb: {
    registrert: "Du er registrert som arbeidssøker",
    registrertPermittert: "Du er registrert som permittert arbeidssøker",
    ikkeRegistrert: "Du er ikke registrert som arbeidssøker",
  },
  nn: {
    registrert: "Du er registrert som arbeidssøkjar",
    registrertPermittert: "Du er registrert som permittert arbeidssøkjar",
    ikkeRegistrert: "Du er ikkje registrert som arbeidssøkjar",
  },
  en: {
    registrert: "You are registered as job seeker",
    registrertPermittert: "You are registered as a temporarily layed off job seeker",
    ikkeRegistrert: "You are not registered as job seeker",
  },
};

function hentTekstNokkel(harAktivArbeidssokerperiode: boolean, erPermittert: boolean) {
  if (!harAktivArbeidssokerperiode) {
    return "ikkeRegistrert";
  }

  if (erPermittert) {
    return "registrertPermittert";
  }

  return "registrert";
}

interface Props extends React.HTMLProps<any> {
  sprak: Sprak;
  harAktivArbeidssokerperiode: boolean;
  opplysningerOmArbeidssoker: OpplysningerOmArbeidssokerResponse;
}

const RegistrertTittel = (props: Props) => {
  const { harAktivArbeidssokerperiode, opplysningerOmArbeidssoker, sprak } = props;

  const tekst = lagHentTekstForSprak(TEKSTER, sprak);
  const erPermittert = harPermittertSituasjon(opplysningerOmArbeidssoker);

  return tekst(hentTekstNokkel(harAktivArbeidssokerperiode, erPermittert));
};

export default RegistrertTittel;
