import { Alert } from "@navikt/ds-react";
// import { useEffect } from 'react';
// import { FallbackProps } from 'react-error-boundary';
// import { loggVisning } from '../../lib/tracking';

export const ErrorBoundaryFeil = () => {
  // const { error } = props;
  //
  // useEffect(() => {
  //     loggVisning({ viser: 'Mikrofrontend - ErrorBoundaryFeil', error: error?.message });
  // }, []);

  return <Alert variant={"error"}>Noe gikk dessverre galt</Alert>;
};
