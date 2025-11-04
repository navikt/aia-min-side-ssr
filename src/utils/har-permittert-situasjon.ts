import { hentSisteOpplysningerOmArbeidssoker } from '@navikt/arbeidssokerregisteret-utils';
import type {
  JobbsituasjonBeskrivelse,
  OpplysningerOmArbeidssokerResponse,
} from '@navikt/arbeidssokerregisteret-utils/dist/models/opplysninger-om-arbeidssoker';

const PERMITTERT_BESKRIVELSER: JobbsituasjonBeskrivelse[] = ['ER_PERMITTERT', 'MIDLERTIDIG_JOBB', 'NY_JOBB', 'KONKURS'];

export function harPermittertSituasjon(opplysninger: OpplysningerOmArbeidssokerResponse): boolean {
  if (opplysninger.length === 0) {
    return false;
  }

  const opplysning = hentSisteOpplysningerOmArbeidssoker(opplysninger);

  return opplysning.jobbsituasjon.some((situasjon) => {
    if (PERMITTERT_BESKRIVELSER.includes(situasjon.beskrivelse)) {
      return true;
    }

    if (situasjon.beskrivelse === 'ANNET') {
      return Boolean(situasjon.detaljer?.gjelder_fra_dato_iso8601);
    }

    if (situasjon.beskrivelse === 'HAR_SAGT_OPP') {
      return (
        Boolean(situasjon.detaljer?.gjelder_fra_dato_iso8601) ||
        Boolean(situasjon.detaljer?.siste_arbeidsdag_iso8601) ||
        Boolean(situasjon.detaljer?.gjelder_til_dato_iso8601)
      );
    }

    return (
      situasjon.beskrivelse === 'HAR_BLITT_SAGT_OPP' &&
      (Boolean(situasjon.detaljer?.gjelder_fra_dato_iso8601) ||
        Boolean(situasjon.detaljer?.siste_dag_med_loenn_iso8601))
    );
  });
}
