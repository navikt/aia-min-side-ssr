import type { APIContext } from 'astro';

export const isInternal = (context: APIContext) => context.request.url.includes('/internal');
export const isStorybook = (context: APIContext) => context.request.url.includes('/storybook/');

export const isLocal = process.env.NODE_ENV === 'development';
