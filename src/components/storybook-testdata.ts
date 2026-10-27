import type { TilgjengeligeBekreftelser } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { snapshotMock } from '../../mock/data/snapshot-mock';

export const aktivPeriode: Snapshot = snapshotMock;

export const avsluttetPeriode: Snapshot = {
  ...snapshotMock,
  avsluttet: {
    type: 'PERIODE_AVSLUTTET_V1',
    tidspunkt: '2026-01-15T12:00:00.000Z',
    sendtInnAv: snapshotMock.startet.sendtInnAv,
  },
};

export const permittertPeriode: Snapshot = {
  ...snapshotMock,
  opplysning: {
    type: 'OPPLYSNINGER_V4',
    id: 'opplysning-permittert',
    tidspunkt: snapshotMock.startet.tidspunkt,
    sendtInnAv: snapshotMock.startet.sendtInnAv,
    jobbsituasjon: { beskrivelser: [{ beskrivelse: 'ER_PERMITTERT' }] },
  },
};

export const tilgjengeligeBekreftelser: TilgjengeligeBekreftelser = [
  {
    periodeId: snapshotMock.id,
    bekreftelseId: 'bekreftelse-test',
    gjelderFra: '2026-01-01T12:00:00.000Z',
    gjelderTil: '2026-01-14T12:00:00.000Z',
  },
];

export const side2Url = 'https://www.nav.no/arbeidssoekerregisteret';
