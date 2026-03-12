import type { APIRoute } from 'astro';
import { getSession } from '@/lib/auth';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request.headers.get('cookie'));
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { password, currentPassword } = await request.json();

    const res = await fetch(`${API_BASE}/api/portal/auth/set-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-portal-client-id': session.clientId,
        'x-portal-org-id': session.organizationId,
      },
      body: JSON.stringify({ password, currentPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Nastavenie hesla zlyhalo.' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[AUTH] Set password error:', err);
    return new Response(JSON.stringify({ error: 'Nastavenie hesla zlyhalo.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
