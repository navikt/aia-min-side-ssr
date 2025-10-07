import type { AggregertPeriode, TilgjengeligeBekreftelser } from '@navikt/arbeidssokerregisteret-utils';
import type { Language } from '@src/language/types.ts';
import LenkeTilSide2Kort from './lenke-til-side-2/LenkeTilSide2Kort.tsx';

export interface AiaProps {
  aggregertPeriode: AggregertPeriode | null;
  sprak: Language;
  tilgjengeligeBekreftelser?: TilgjengeligeBekreftelser[];
  side2Url: string;
}

function AiA(props: AiaProps) {
  const { sprak, aggregertPeriode, tilgjengeligeBekreftelser = [], side2Url } = props;
  console.log('side2Url fro AiA', side2Url);
  const harIngenPerioder = !aggregertPeriode?.startet;

  if (harIngenPerioder) {
    return null;
  }

  const harTilgjengeligeBekreftelser = tilgjengeligeBekreftelser?.length > 0;

  return (
    <LenkeTilSide2Kort
      aggregertPeriode={aggregertPeriode!}
      sprak={sprak}
      harTilgjengeligBekreftelse={harTilgjengeligeBekreftelser}
      side2Url={side2Url}
    />
  );
}

export default AiA;
