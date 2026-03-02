// ============================================
// Google OAuth Callback
// Exchange code → get email → call business-flow-ai → set JWT cookie
// ============================================

import type { APIRoute } from 'astro';
import { createJwt, setSessionCookie } from '@/lib/auth';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/?error=no_code');
  }

  try {
    // 1. Exchange code for Google tokens
    const portalUrl = process.env.PUBLIC_PORTAL_URL || import.meta.env.PUBLIC_PORTAL_URL || 'http://localhost:4000';
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET || import.meta.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${portalUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      console.error('[AUTH] Google token exchange failed:', await tokenRes.text());
      return redirect('/?error=auth_failed');
    }

    const tokenData = await tokenRes.json();

    // 2. Get user info from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      console.error('[AUTH] Google userinfo failed');
      return redirect('/?error=auth_failed');
    }

    const googleUser = await userInfoRes.json();
    const email = googleUser.email as string;

    // 3. Ask business-flow-ai to verify this email is a registered client
    const verifyRes = await fetch(`${API_BASE}/api/portal/auth/verify-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error('[AUTH] Client verification failed:', errData);
      return redirect('/?error=not_found');
    }

    const clientData = await verifyRes.json();

    // 4. Create JWT token (includes allClientIds for multi-company access)
    const token = await createJwt({
      clientId: clientData.clientId,
      clientEntityId: clientData.clientEntityId,
      clientName: clientData.clientName || googleUser.name || email,
      email,
      organizationId: clientData.organizationId,
      storagePath: clientData.storagePath,
      allClientIds: clientData.allClientIds || [],
    });

    // 5. Set cookie and redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': setSessionCookie(token),
      },
    });
  } catch (err) {
    console.error('[AUTH] OAuth callback error:', err);
    return redirect('/?error=auth_failed');
  }
};
