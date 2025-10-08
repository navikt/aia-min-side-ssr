import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';
import { isLocal } from '@src/utils/environment.ts';

export async function logUmamiEvent(eventName: string, data: any) {
  try {
    const tracker = getAnalyticsInstance('aia-min-side-ssr');
    if (!isLocal) {
      await tracker(eventName, data);
    } else {
      console.log(`Logger til umami: ${eventName}`, data);
    }
  } catch (error) {
    console.warn('Feil med umami-logging', error);
  }
}
