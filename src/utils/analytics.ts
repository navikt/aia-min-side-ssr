import type { AmplitudeEvent } from "@navikt/nav-dekoratoren-moduler";
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";

type ExtendedAmpltitudeEvent = AmplitudeEvent<"navigere", { lenketekst: string }>;

const analyticsLogger = getAnalyticsInstance<ExtendedAmpltitudeEvent>("tms-microfrontend-template-ssr");

export const logEvent = async (lenketekst: string) => {
  await analyticsLogger("navigere", { lenketekst: lenketekst });
};
