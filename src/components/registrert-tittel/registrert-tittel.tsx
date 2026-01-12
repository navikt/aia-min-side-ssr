import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type { Language } from '@src/language/types.ts';
import { harPermittertSituasjon } from '../../utils/har-permittert-situasjon';

const TEKSTER = {
  nb: {
    registrert: 'Du er registrert som arbeidssøker',
    registrertPermittert: 'Du er registrert som permittert arbeidssøker',
    ikkeRegistrert: 'Du er ikke registrert som arbeidssøker',
  },
  nn: {
    registrert: 'Du er registrert som arbeidssøkjar',
    registrertPermittert: 'Du er registrert som permittert arbeidssøkjar',
    ikkeRegistrert: 'Du er ikkje registrert som arbeidssøkjar',
  },
  en: {
    registrert: 'You are registered as job seeker',
    registrertPermittert: 'You are registered as a temporarily layed off job seeker',
    ikkeRegistrert: 'You are not registered as job seeker',
  },
};

function hentTekstNokkel(harAktivArbeidssokerperiode: boolean, erPermittert: boolean) {
  if (!harAktivArbeidssokerperiode) {
    return 'ikkeRegistrert';
  }

  if (erPermittert) {
    return 'registrertPermittert';
  }

  return 'registrert';
}

type Props = {
  sprak: Language;
  harAktivArbeidssokerperiode: boolean;
  opplysningerOmArbeidssoker: OpplysningerHendelse | undefined;
};

const RegistrertTittel: React.FC<Props> = (props: Props) => {
  const { harAktivArbeidssokerperiode, opplysningerOmArbeidssoker, sprak } = props;

  const tekst = lagHentTekstForSprak(TEKSTER, sprak);
  const erPermittert = harPermittertSituasjon(opplysningerOmArbeidssoker);

  return tekst(hentTekstNokkel(harAktivArbeidssokerperiode, erPermittert));
};

export default RegistrertTittel;
