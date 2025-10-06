import type { AggregertePerioder, JaEllerNei, ProfilertTil } from "@navikt/arbeidssokerregisteret-utils";

export const aggregertePerioderMock: AggregertePerioder = [
  {
    periodeId: "d70c0256-e3bc-470e-b3fe-f5999691fef8",
    startet: {
      tidspunkt: "2024-11-19T08:43:22.237Z",
      utfoertAv: {
        type: "SLUTTBRUKER",
        id: "10908697745",
      },
      kilde:
        "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.15.143-1",
      aarsak: "Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven",
      tidspunktFraKilde: {
        tidspunkt: "2024-10-19T08:43:22.237Z",
        avviksType: "FORSINKELSE",
      },
    },
    avsluttet: null,
    opplysningerOmArbeidssoeker: [
      {
        opplysningerOmArbeidssoekerId: "c36257ca-5cb2-4ed6-8820-8c22e55f5618",
        periodeId: "d70c0256-e3bc-470e-b3fe-f5999691fef8",
        sendtInnAv: {
          tidspunkt: "2024-11-19T08:44:01.611Z",
          utfoertAv: {
            type: "SLUTTBRUKER",
            id: "10908697745",
          },
          kilde:
            "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.15.143-1",
          aarsak: "opplysning om arbeidssøker sendt inn",
          // "tidspunktFraKilde": null
        },
        jobbsituasjon: [
          {
            beskrivelse: "HAR_BLITT_SAGT_OPP",
            detaljer: {
              stilling_styrk08: "8183",
              stilling: "Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter",
            },
          },
        ],
        utdanning: {
          nus: "4",
          bestaatt: "NEI" as JaEllerNei,
          godkjent: "VET_IKKE" as JaEllerNei,
        },
        helse: {
          helsetilstandHindrerArbeid: "NEI" as JaEllerNei,
        },
        annet: {
          andreForholdHindrerArbeid: "NEI" as JaEllerNei,
        },
        profilering: {
          profileringId: "657d1408-280c-4a99-9d1e-b57d5ea707a7",
          periodeId: "d70c0256-e3bc-470e-b3fe-f5999691fef8",
          opplysningerOmArbeidssoekerId: "c36257ca-5cb2-4ed6-8820-8c22e55f5618",
          sendtInnAv: {
            tidspunkt: "2024-11-19T08:44:01.886Z",
            utfoertAv: {
              type: "SYSTEM",
              // "id": "paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1" as any
            },
            kilde: "paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1",
            aarsak: "opplysninger-mottatt",
            // "tidspunktFraKilde": {
            //   "tidspunkt": "2024-11-19T08:44:01.611Z",
            //   "avviksType": "FORSINKELSE"
            // }
          },
          profilertTil: "ANTATT_GODE_MULIGHETER" as ProfilertTil,
          jobbetSammenhengendeSeksAvTolvSisteManeder: true,
          alder: 38,
          egenvurderinger: [
            {
              egenvurderingId: "42",
              egenvurdering: "ANTATT_BEHOV_FOR_VEILEDNING" as ProfilertTil,
            },
          ] as any,
        },
      },
      {
        opplysningerOmArbeidssoekerId: "e92f2bb8-225e-4319-bf79-fc1db422b662",
        periodeId: "d70c0256-e3bc-470e-b3fe-f5999691fef8",
        sendtInnAv: {
          tidspunkt: "2024-11-19T08:43:22.779Z",
          utfoertAv: {
            type: "SLUTTBRUKER",
            id: "10908697745",
          },
          kilde:
            "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.15.143-1",
          aarsak: "opplysning om arbeidssøker sendt inn",
          // "tidspunktFraKilde": null
        },
        jobbsituasjon: [
          {
            beskrivelse: "HAR_BLITT_SAGT_OPP",
            detaljer: {
              stilling_styrk08: "8183",
              stilling: "Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter",
            },
          },
        ],
        utdanning: {
          nus: "0",
          bestaatt: null,
          godkjent: null,
        },
        helse: {
          helsetilstandHindrerArbeid: "JA",
        },
        annet: {
          andreForholdHindrerArbeid: "JA",
        },
        profilering: {
          profileringId: "ad3fbd45-617c-4eb1-b874-0d09951f8f1f",
          periodeId: "d70c0256-e3bc-470e-b3fe-f5999691fef8",
          opplysningerOmArbeidssoekerId: "e92f2bb8-225e-4319-bf79-fc1db422b662",
          sendtInnAv: {
            tidspunkt: "2024-11-19T08:43:23.488Z",
            utfoertAv: {
              type: "SYSTEM",
              id: "paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1",
            },
            kilde: "paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1",
            aarsak: "opplysninger-mottatt",
            tidspunktFraKilde: {
              tidspunkt: "2024-11-19T08:43:22.779Z",
              avviksType: "FORSINKELSE",
            },
          },
          profilertTil: "OPPGITT_HINDRINGER",
          jobbetSammenhengendeSeksAvTolvSisteManeder: true,
          alder: 38,
        },
      },
    ],
    bekreftelser: [],
  } as any,
  {
    periodeId: "e3a33f8c-586e-45c6-b1e8-2e4573983608",
    startet: {
      tidspunkt: "2024-11-15T12:48:25.398Z",
      utfoertAv: {
        type: "SLUTTBRUKER",
        id: "10908697745",
      },
      kilde:
        "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.14.141-1",
      aarsak: "Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven",
      tidspunktFraKilde: null,
    },
    avsluttet: {
      tidspunkt: "2024-11-15T13:07:53.185Z",
      utfoertAv: {
        type: "SYSTEM",
        id: "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:24.11.14.52-1",
      },
      kilde: "paw.arbeidssoekerregisteret.bekreftelse-utgang",
      aarsak: "Graceperiode utløpt",
      tidspunktFraKilde: null,
    },
    opplysningerOmArbeidssoeker: [
      {
        opplysningerOmArbeidssoekerId: "e2c405b4-5572-4b08-91bc-4a882b587a96",
        periodeId: "e3a33f8c-586e-45c6-b1e8-2e4573983608",
        sendtInnAv: {
          tidspunkt: "2024-11-15T12:48:25.578Z",
          utfoertAv: {
            type: "SLUTTBRUKER",
            id: "10908697745",
          },
          kilde:
            "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.14.141-1",
          aarsak: "opplysning om arbeidssøker sendt inn",
          tidspunktFraKilde: null,
        },
        jobbsituasjon: [
          {
            beskrivelse: "HAR_SAGT_OPP",
            detaljer: {
              stilling_styrk08: "8183",
              stilling: "Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter",
            },
          },
        ],
        utdanning: {
          nus: "3",
          bestaatt: "JA",
          godkjent: "JA",
        },
        helse: {
          helsetilstandHindrerArbeid: "NEI",
        },
        annet: {
          andreForholdHindrerArbeid: "NEI",
        },
        profilering: {
          profileringId: "2e07b7c5-2222-43c2-9fef-d096b5050b0d",
          periodeId: "e3a33f8c-586e-45c6-b1e8-2e4573983608",
          opplysningerOmArbeidssoekerId: "e2c405b4-5572-4b08-91bc-4a882b587a96",
          sendtInnAv: {
            tidspunkt: "2024-11-15T12:48:26.258Z",
            utfoertAv: {
              type: "SYSTEM",
              id: "paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1",
            },
            kilde: "paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1",
            aarsak: "opplysninger-mottatt",
            tidspunktFraKilde: {
              tidspunkt: "2024-11-15T12:48:25.578Z",
              avviksType: "FORSINKELSE",
            },
          },
          profilertTil: "ANTATT_GODE_MULIGHETER",
          jobbetSammenhengendeSeksAvTolvSisteManeder: true,
          alder: 38,
        },
      },
    ],
    bekreftelser: [
      {
        periodeId: "e3a33f8c-586e-45c6-b1e8-2e4573983608",
        bekreftelsesloesning: "ARBEIDSSOEKERREGISTERET",
        svar: {
          sendtInnAv: {
            tidspunkt: "2024-11-15T13:00:20.993Z",
            utfoertAv: {
              type: "SLUTTBRUKER",
              id: "10908697745",
            },
            kilde:
              "europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.14.142-1",
            aarsak: "Bekreftelse levert",
            tidspunktFraKilde: null,
          },
          gjelderFra: "2024-11-15T12:48:25.398Z",
          gjelderTil: "2024-11-15T12:53:25.398Z",
          harJobbetIDennePerioden: true,
          vilFortsetteSomArbeidssoeker: true,
        },
      },
    ],
  },
];
