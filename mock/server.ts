import { serve } from '@hono/node-server';
import { logger } from '@src/utils/logger.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { aggregertePerioderMock } from './data/aggregerte-perioder-mock.ts';

const api = new Hono();

// Enable CORS for all routes
api.use(
  '/*',
  cors({
    origin: 'http://localhost:4321',
    credentials: true,
  }),
);

api.get('/arbeidssoekerperioder-aggregert', (c) => {
  const data = aggregertePerioderMock.slice(0, 1);
  logger.info('GET /arbeidssoekerperioder-aggregert');
  return c.json(data);
});

api.get('/tilgjengelige-bekreftelser', (c) => {
  logger.info('GET /tilgjengelige-bekreftelser');
  return c.json([]);
});

serve(api);
