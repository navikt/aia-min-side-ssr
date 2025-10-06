import { DinSituasjon, mapSituasjonTilBeskrivelse, PermittertSvar } from "@navikt/arbeidssokerregisteret-utils";
import { harPermittertSituasjon } from "./har-permittert-situasjon";

describe("har-permittert-situasjon", () => {
  test("returnerer false for tom input", () => {
    expect(harPermittertSituasjon([])).toBe(false);
  });

  test("returnerer true for registrert permittert", () => {
    expect(
      harPermittertSituasjon([
        {
          jobbsituasjon: [
            {
              beskrivelse: "ER_PERMITTERT",
            },
          ],
        } as any,
      ]),
    ).toBe(true);
  });

  test("returnerer true for permittert besvarelse i nyeste opplysninger", () => {
    expect(
      harPermittertSituasjon([
        {
          sendtInnAv: {
            tidspunkt: "2024-02-14T13:15:48.969Z",
          },
          jobbsituasjon: [
            {
              beskrivelse: "HAR_SAGT_OPP",
            },
          ],
        } as any,
        {
          sendtInnAv: {
            tidspunkt: "2024-03-14T13:15:48.969Z",
          },
          jobbsituasjon: [{ beskrivelse: "ER_PERMITTERT" }],
        },
      ]),
    ).toBe(true);
  });

  test("returnerer true for alle permittert besvarelser", () => {
    [
      PermittertSvar.ENDRET_PERMITTERINGSPROSENT,
      PermittertSvar.TILBAKE_TIL_JOBB,
      PermittertSvar.NY_JOBB,
      PermittertSvar.MIDLERTIDIG_JOBB,
      PermittertSvar.KONKURS,
    ].forEach((svar) => {
      expect(
        harPermittertSituasjon([
          {
            jobbsituasjon: [
              {
                beskrivelse: mapSituasjonTilBeskrivelse(svar),
              },
            ],
          },
        ] as any),
      ).toBe(true);
    });
  });

  test('returnerer true for PermittertSvar.ANNET (=> "ANNET" med detaljer)', () => {
    expect(
      harPermittertSituasjon([
        {
          jobbsituasjon: [
            {
              beskrivelse: mapSituasjonTilBeskrivelse(PermittertSvar.ANNET),
              detaljer: {
                gjelder_fra_dato_iso8601: "2024-06-24T08:19:25.502Z",
              },
            },
          ],
        },
      ] as any),
    ).toBe(true);
  });

  test('returnerer true for PermittertSvar.SAGT_OPP (=> "HAR_SAGT_OPP" med detaljer)', () => {
    expect(
      harPermittertSituasjon([
        {
          jobbsituasjon: [
            {
              beskrivelse: mapSituasjonTilBeskrivelse(PermittertSvar.OPPSIGELSE),
              detaljer: {
                gjelder_fra_dato_iso8601: "2024-06-24T08:19:25.502Z",
              },
            },
          ],
        },
      ] as any),
    ).toBe(true);
  });

  test('returnerer true for PermittertSvar.OPPSIGELSE (=> "HAR_BLITT_SAGT_OPP" med detaljer)', () => {
    expect(
      harPermittertSituasjon([
        {
          jobbsituasjon: [
            {
              beskrivelse: mapSituasjonTilBeskrivelse(PermittertSvar.OPPSIGELSE),
              detaljer: {
                gjelder_fra_dato_iso8601: "2024-06-24T08:19:25.502Z",
              },
            },
          ],
        },
      ] as any),
    ).toBe(true);
  });

  test('returnerer false for "HAR_BLITT_SAGT_OPP" uten detaljer', () => {
    expect(
      harPermittertSituasjon([
        {
          jobbsituasjon: [
            {
              beskrivelse: mapSituasjonTilBeskrivelse(PermittertSvar.OPPSIGELSE),
            },
          ],
        },
      ] as any),
    ).toBe(false);
  });

  test("returnerer false hvis siste opplysninger er ikke permittert", () => {
    expect(
      harPermittertSituasjon([
        {
          sendtInnAv: {
            tidspunkt: "2024-03-14T13:15:48.969Z",
          },
          jobbsituasjon: [
            {
              beskrivelse: DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
            },
          ],
        } as any,
        {
          sendtInnAv: {
            tidspunkt: "2024-02-14T13:15:48.969Z",
          },
          jobbsituasjon: [{ beskrivelse: "ER_PERMITTERT" }],
        },
      ]),
    ).toBe(false);
  });

  test("returnerer false for ikke-permittert besvarelse", () => {
    expect(
      harPermittertSituasjon([
        {
          jobbsituasjon: [
            {
              beskrivelse: DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
            },
          ],
        } as any,
      ]),
    ).toBe(false);
  });
});
