import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';
import { isLocal } from './environment.ts';

export async function logUmamiEvent(eventName: string, data: Record<string, unknown>) {
  try {
    const tracker = getAnalyticsInstance('aia-min-side-ssr');
    if (!isLocal) {
      await tracker.custom(eventName, data);
    } else {
      console.log(`Logger til umami: ${eventName}`, data);
    }
  } catch (error) {
    console.warn('Feil med umami-logging', error);
  }
}
