import { getToken, validateTokenxToken } from '@navikt/oasis';
import { logger } from '@src/utils/logger.ts';
import { defineMiddleware } from 'astro/middleware';
import { isInternal, isLocal, isStorybook } from '../utils/environment';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = getToken(context.request.headers);

  if (isLocal) {
    return next();
  }

  if (isInternal(context) || isStorybook(context)) {
    return next();
  }

  if (!token) {
    return new Response(null, { status: 401 });
  }

  const validateStart = performance.now();
  const validation = await validateTokenxToken(token);
  const validateMs = Math.round(performance.now() - validateStart);
  if (validateMs > 20) {
    logger.info({ validateMs }, 'Slow JWT validation (likely JWKS cache miss)');
  }

  if (!validation.ok) {
    const error = new Error(`Invalid JWT token found (cause: ${validation.errorType} ${validation.error}.`);
    logger.error(error);
    return new Response(null, { status: 401 });
  }

  context.locals.token = token;

  return next();
});
