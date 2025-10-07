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
