// ============================================
// GET /api/auth/magic-link/callback?token=xxx
// Verify magic link token → create JWT → redirect to dashboard
// ============================================

import type { APIRoute } from 'astro';
import { createJwt, setSessionCookie } from '@/lib/auth';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return redirect('/?error=no_token');
  }

  try {
    // Verify token with business-flow-ai
    const verifyRes = await fetch(`${API_BASE}/api/portal/auth/magic-link?token=${encodeURIComponent(token)}`);

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error('[AUTH] Magic link verification failed:', errData);

      if (verifyRes.status === 401) {
        return redirect('/?error=link_expired');
      }
      return redirect('/?error=auth_failed');
    }

    const clientData = await verifyRes.json();

    // Create JWT token (includes allClientIds for multi-company access)
    const jwt = await createJwt({
      clientId: clientData.clientId,
      clientEntityId: clientData.clientEntityId,
      clientName: clientData.clientName || 'Klient',
      contactName: clientData.contactName || undefined,
      email: clientData.email,
      organizationId: clientData.organizationId,
      storagePath: clientData.storagePath,
      allClientIds: clientData.allClientIds || [],
    });

    // Set cookie and redirect to dashboard
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': setSessionCookie(jwt),
      },
    });
  } catch (err) {
    console.error('[AUTH] Magic link callback error:', err);
    return redirect('/?error=auth_failed');
  }
};
