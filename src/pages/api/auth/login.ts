import type { APIRoute } from 'astro';
import { createJwt, setSessionCookie } from '@/lib/auth';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email a heslo sú povinné.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(`${API_BASE}/api/portal/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Prihlásenie zlyhalo.', code: data.code }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const jwt = await createJwt({
      clientId: data.clientId,
      clientEntityId: data.clientEntityId,
      clientName: data.clientName || 'Klient',
      contactName: data.contactName || undefined,
      email: data.email,
      organizationId: data.organizationId,
      storagePath: data.storagePath,
      allClientIds: data.allClientIds || [],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setSessionCookie(jwt),
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Login error:', err);
    const msg = err?.message || 'Unknown error';
    const hint = msg.includes('JWT') || msg.includes('secret') || msg.includes('PORTAL_JWT_SECRET')
      ? 'PORTAL_JWT_SECRET nie je nastavený v environment variables.'
      : msg.includes('fetch') || msg.includes('ECONNREFUSED')
      ? `Nepodarilo sa pripojiť na API (${API_BASE}).`
      : 'Prihlásenie zlyhalo.';
    return new Response(JSON.stringify({ error: hint, detail: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
