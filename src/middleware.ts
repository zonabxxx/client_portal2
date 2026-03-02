import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  
  // Log all API requests
  if (url.pathname.startsWith('/api/')) {
    console.log(`[MIDDLEWARE] ${request.method} ${url.pathname}`);
  }

  return next();
});
