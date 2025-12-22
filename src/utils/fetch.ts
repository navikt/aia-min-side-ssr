import { parseIdportenToken } from '@navikt/oasis';
import { logger } from './logger';

export const fetchData = async (url: string, oboToken: string) => {
  logger.info(`Fetching data from ${url}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${oboToken}`,
    },
  });

  if (!response.ok) {
    logger.error(`Error fetching data from ${url} ${response.status} ${response.statusText}`);
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};

export const postTilOppslagV3API = async (url: string, oboToken: string) => {
  logger.info(`Fetching (POST) data from ${url}`);
  const parsed = parseIdportenToken(oboToken);
  const identitetsnummer = parsed.ok ? parsed.pid : '';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${oboToken}`,
    },
    body: JSON.stringify({
      type: 'IDENIDENTITETSNUMMER',
      identitetsnummer,
    }),
  });

  if (!response.ok) {
    logger.error(`Error fetching (POST) data from ${url} ${response.status} ${response.statusText}`);
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};
