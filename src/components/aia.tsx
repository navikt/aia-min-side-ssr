import type { AggregertPeriode, Sprak, TilgjengeligeBekreftelser } from "@navikt/arbeidssokerregisteret-utils";
import LenkeTilSide2Kort from "./lenke-til-side-2/LenkeTilSide2Kort.tsx";

export interface AiaProps {
  aggregertPeriode: AggregertPeriode | null;
  sprak: Sprak;
  tilgjengeligeBekreftelser?: TilgjengeligeBekreftelser[];
}

function AiA(props: AiaProps) {
  const { sprak, aggregertPeriode, tilgjengeligeBekreftelser = [] } = props;

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
      side2Url={"TODO"}
    />
  );
}

export default AiA;
