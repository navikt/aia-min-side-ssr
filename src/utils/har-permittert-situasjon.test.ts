import { DinSituasjon, mapSituasjonTilBeskrivelse, PermittertSvar } from '@navikt/arbeidssokerregisteret-utils';
import type { Beskrivelse, JobbDetaljer, OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { describe, expect, test } from 'vitest';
import { harPermittertSituasjon } from './har-permittert-situasjon';

function tilOpplysningerHendelse(situasjon: Beskrivelse, detaljer?: JobbDetaljer): OpplysningerHendelse {
  return {
    type: 'OPPLYSNINGER_V4',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    tidspunkt: '2025-12-22T07:24:04.989Z',
    sendtInnAv: {
      tidspunkt: '2025-12-22T07:24:04.989Z',
      utfoertAv: {
        type: 'SLUTTBRUKER',
        id: 'string',
        sikkerhetsnivaa: 'string',
      },
      kilde: 'string',
      aarsak: 'string',
    },
    jobbsituasjon: {
      beskrivelser: [{ beskrivelse: situasjon, detaljer }],
    },
  };
}

describe('har-permittert-situasjon', () => {
  test('returnerer false for tom input', () => {
    expect(harPermittertSituasjon(undefined)).toBe(false);
  });

  test('returnerer true for registrert permittert', () => {
    expect(harPermittertSituasjon(tilOpplysningerHendelse('ER_PERMITTERT'))).toBe(true);
  });

  test('returnerer true for alle permittert besvarelser', () => {
    [
      PermittertSvar.ENDRET_PERMITTERINGSPROSENT,
      PermittertSvar.TILBAKE_TIL_JOBB,
      PermittertSvar.NY_JOBB,
      PermittertSvar.MIDLERTIDIG_JOBB,
      PermittertSvar.KONKURS,
    ].forEach((svar) => {
      expect(harPermittertSituasjon(tilOpplysningerHendelse(mapSituasjonTilBeskrivelse(svar)))).toBe(true);
    });
  });

  test('returnerer true for PermittertSvar.ANNET (=> "ANNET" med detaljer)', () => {
    expect(
      harPermittertSituasjon(
        tilOpplysningerHendelse(mapSituasjonTilBeskrivelse(PermittertSvar.ANNET), {
          gjelder_fra_dato_iso8601: '2024-06-24T08:19:25.502Z',
        }),
      ),
    ).toBe(true);
  });

  test('returnerer true for PermittertSvar.SAGT_OPP (=> "HAR_SAGT_OPP" med detaljer)', () => {
    expect(
      harPermittertSituasjon(
        tilOpplysningerHendelse(mapSituasjonTilBeskrivelse(PermittertSvar.SAGT_OPP), {
          gjelder_fra_dato_iso8601: '2024-06-24T08:19:25.502Z',
        }),
      ),
    ).toBe(true);
  });

  test('returnerer true for PermittertSvar.OPPSIGELSE (=> "HAR_BLITT_SAGT_OPP" med detaljer)', () => {
    expect(
      harPermittertSituasjon(
        tilOpplysningerHendelse(mapSituasjonTilBeskrivelse(PermittertSvar.SAGT_OPP), {
          gjelder_fra_dato_iso8601: '2024-06-24T08:19:25.502Z',
        }),
      ),
    ).toBe(true);
  });

  test('returnerer false for "HAR_BLITT_SAGT_OPP" uten detaljer', () => {
    expect(harPermittertSituasjon(tilOpplysningerHendelse(mapSituasjonTilBeskrivelse(PermittertSvar.OPPSIGELSE)))).toBe(
      false,
    );
  });

  test('returnerer false for ikke-permittert besvarelse', () => {
    expect(harPermittertSituasjon(tilOpplysningerHendelse(DinSituasjon.AKKURAT_FULLFORT_UTDANNING))).toBe(false);
  });
});
