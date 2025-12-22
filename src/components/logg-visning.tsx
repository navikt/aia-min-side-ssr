// import { useInView, defaultFallbackInView } from 'react-intersection-observer';
// import { loggVisning, VisningsData } from '../lib/tracking';

import type { TilgjengeligeBekreftelser } from '@navikt/arbeidssokerregisteret-utils';
import { logUmamiEvent } from '@src/utils/analytics.ts';
import { useEffect } from 'react';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type Props = {
  aggregertPeriode: Snapshot | null;
  tilgjengeligeBekreftelser?: TilgjengeligeBekreftelser[];
};

const LoggVisning = (props: Props) => {
  const { tilgjengeligeBekreftelser, aggregertPeriode } = props;

  useEffect(() => {
    const harIngenPerioder = !aggregertPeriode?.startet;

    if (harIngenPerioder) {
      return;
    }

    const harAktivArbeidssokerperiode = Boolean(aggregertPeriode?.startet) && !aggregertPeriode?.avsluttet;
    const harTilgjengeligBekreftelse = tilgjengeligeBekreftelser ? tilgjengeligeBekreftelser.length > 0 : false;

    function hentLoggVisningData() {
      if (!harAktivArbeidssokerperiode) {
        return { viser: 'Mikrofrontend for ikke aktiv arbeidssøker' };
      }
      if (harTilgjengeligBekreftelse) {
        return { viser: 'Mikrofrontend for aktiv arbeidssøker - med bekreftelse' };
      }
      return { viser: 'Mikrofrontend for aktiv arbeidssøker' };
    }

    logUmamiEvent('arbeidssoekerregisteret-for-personbruker.visning', hentLoggVisningData());
  }, [aggregertPeriode, tilgjengeligeBekreftelser]);

  return null;
};

export default LoggVisning;
