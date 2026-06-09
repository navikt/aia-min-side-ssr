import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, Link, LinkCard } from '@navikt/ds-react';
import type { Language } from '@src/language/types.ts';
import prettyPrintDato from '../../utils/pretty-print-dato';
import RegistrertTittel from '../registrert-tittel/registrert-tittel';
import { SokerJobbIkon } from './SokerJobbIkon';

interface Side2Props {
  aggregertPeriode: Snapshot;
  sprak: Language;
  harTilgjengeligBekreftelse: boolean;
  side2Url: string;
}

const TEKSTER = {
  nb: {
    registrert: 'Registrert dato:',
    sistBekreftet: 'sist bekreftet',
    duVarRegistrert: 'Du var registrert fra',
    til: 'til',
    seOgEndre: 'Se og endre opplysninger',
    seTidligere: 'Se tidligere opplysninger',
    bekreft: 'Bekreft at du vil være registrert som arbeidssøker hos Nav',
  },
  nn: {
    registrert: 'Registrert dato:',
    sistBekreftet: 'sist stadfesta',
    duVarRegistrert: 'Du var registrert frå',
    til: 'til',
    seOgEndre: 'Sjå og endre opplysningar',
    seTidligere: 'Sjå tidligare opplysningar',
    bekreft: 'Stadfest at du vil vera registrert som arbeidssøkjar hos Nav',
  },
  en: {
    registrert: 'Registered:',
    sistBekreftet: 'last confirmed',
    duVarRegistrert: 'You were registered from',
    til: 'to',
    seOgEndre: 'View and change answers from registration',
    seTidligere: 'View answers from previous registration',
    bekreft: 'Confirm that you want to be registered as a jobseeker with Nav',
  },
};

const LenkeTilSide2Kort = (props: Side2Props) => {
  const { harTilgjengeligBekreftelse, sprak, aggregertPeriode, side2Url } = props;
  const harAktivArbeidssokerperiode = Boolean(aggregertPeriode?.startet) && !aggregertPeriode?.avsluttet;
  const bekreftelse = aggregertPeriode.bekreftelse;
  const tekst = lagHentTekstForSprak(TEKSTER, sprak);

  const sprakUrlPostfix = sprak === 'nb' ? '' : `/${sprak}`;

  return (
    <div>
      <Link
        data-color={'neutral'}
        className={'w-full aiaLinkCard__wrapper group'}
        href={`${side2Url}${sprakUrlPostfix}`}
        underline={false}
      >
        <LinkCard
          className={`w-full aiaLinkCard ${harTilgjengeligBekreftelse ? 'aiaLinkCard_bekreftelse' : ''}`.trim()}
          arrowPosition={'center'}
        >
          <LinkCard.Icon className={'aiaLinkCard_icon_wrapper'}>
            <div className={'aiaLinkCard_ikon'}>
              <SokerJobbIkon />
            </div>
          </LinkCard.Icon>
          <LinkCard.Title as={'h3'} className={'underline decoration-1 group-hover:decoration-2'}>
            <RegistrertTittel
              harAktivArbeidssokerperiode={harAktivArbeidssokerperiode}
              opplysningerOmArbeidssoker={aggregertPeriode?.opplysning}
              sprak={sprak}
            />
          </LinkCard.Title>
          <LinkCard.Description className={'aiaLinkCard__description'}>
            {harAktivArbeidssokerperiode ? (
              <>
                <BodyShort size={'small'} spacing>
                  {tekst('registrert')} {prettyPrintDato(aggregertPeriode.startet.tidspunkt, sprak)}
                  {bekreftelse &&
                    `, ${tekst('sistBekreftet')}: ${prettyPrintDato(bekreftelse.svar.sendtInnAv.tidspunkt, sprak)}`}
                </BodyShort>
                {tekst('seOgEndre')}
              </>
            ) : (
              <div className={'mt-2'}>
                <BodyShort>
                  {`${tekst('duVarRegistrert')} ${prettyPrintDato(aggregertPeriode.startet.tidspunkt, sprak)} ${tekst('til')} 
                ${prettyPrintDato(aggregertPeriode.avsluttet?.tidspunkt || '', sprak)}`}
                </BodyShort>
                {tekst('seTidligere')}
              </div>
            )}
          </LinkCard.Description>
        </LinkCard>
      </Link>
      {harTilgjengeligBekreftelse && harAktivArbeidssokerperiode && (
        <Link
          data-color='neutral'
          className={'aiaLinkCardBekreftelse'}
          href={`${side2Url}${sprakUrlPostfix}/bekreftelse`}
        >
          <ExclamationmarkTriangleFillIcon
            title='a11y-title'
            fontSize='1.5rem'
            width={48}
            style={{ color: 'var(--ax-bg-warning-strong)' }}
          />
          {tekst('bekreft')}
        </Link>
      )}
    </div>
  );
};

export default LenkeTilSide2Kort;
