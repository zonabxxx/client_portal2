// ============================================
// POST /api/auth/magic-link/request
// Portal proxy → business-flow-ai magic-link API
// ============================================

import type { APIRoute } from 'astro';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Zadajte platný e-mail.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const portalUrl = import.meta.env.PUBLIC_PORTAL_URL || 'http://localhost:4000';

    const res = await fetch(`${API_BASE}/api/portal/auth/magic-link`, {
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
    console.error('[PORTAL] magic-link request error:', err);
    return new Response(
      JSON.stringify({ error: 'Nastala chyba. Skúste to znova.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
