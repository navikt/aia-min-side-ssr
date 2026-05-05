import pino from 'pino';

export const logger = pino({
  timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
});
