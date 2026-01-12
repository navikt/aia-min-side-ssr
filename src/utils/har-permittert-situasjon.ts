import type { JobbsituasjonBeskrivelse } from '@navikt/arbeidssokerregisteret-utils';
import type { OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

const PERMITTERT_BESKRIVELSER: JobbsituasjonBeskrivelse[] = ['ER_PERMITTERT', 'MIDLERTIDIG_JOBB', 'NY_JOBB', 'KONKURS'];

export function harPermittertSituasjon(opplysning: OpplysningerHendelse | undefined): boolean {
  if (!opplysning || !opplysning.jobbsituasjon) {
    return false;
  }

  return opplysning.jobbsituasjon.beskrivelser.some((situasjon) => {
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
