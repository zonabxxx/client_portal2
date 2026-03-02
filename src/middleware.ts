// ============================================
// Astro Middleware — handles API routes directly
// Workaround: Astro Node adapter on Alpine Linux
// has a bug where POST endpoint handlers return 404
// even though route files exist in the manifest.
// Solution: intercept API POST requests in middleware.
// ============================================

import { defineMiddleware } from 'astro:middleware';

// Runtime: use process.env (set by Railway), fallback to build-time import.meta.env
function getApiBase() {
  return process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
}
function getPortalUrl() {
  return process.env.PUBLIC_PORTAL_URL || import.meta.env.PUBLIC_PORTAL_URL || 'http://localhost:4000';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  // ── POST /api/auth/magic-link/request ──
  if (url.pathname === '/api/auth/magic-link/request' && request.method === 'POST') {
    try {
      const { email } = await request.json();
      if (!email || !email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Zadajte platný e-mail.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const apiBase = getApiBase();
      const portalUrl = getPortalUrl();
      console.log(`[MIDDLEWARE] Calling ${apiBase}/api/portal/auth/magic-link portalUrl=${portalUrl}`);
      const res = await fetch(`${apiBase}/api/portal/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, portalUrl }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[MIDDLEWARE] magic-link error:', err);
      return new Response(JSON.stringify({ error: 'Nastala chyba. Skúste to znova.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});
