// ============================================
// Google OAuth Callback
// Exchange code → get email → login OR link account
// ============================================

import type { APIRoute } from 'astro';
import { createJwt, setSessionCookie, getSession } from '@/lib/auth';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || 'login';

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
      const errorRedirect = state === 'link' ? '/settings?google=error' : '/?error=auth_failed';
      return redirect(errorRedirect);
    }

    const tokenData = await tokenRes.json();

    // 2. Get user info from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      console.error('[AUTH] Google userinfo failed');
      const errorRedirect = state === 'link' ? '/settings?google=error' : '/?error=auth_failed';
      return redirect(errorRedirect);
    }

    const googleUser = await userInfoRes.json();
    const googleEmail = (googleUser.email as string).toLowerCase().trim();

    // ── LINK MODE: save Google email to existing account ──
    if (state === 'link') {
      const session = await getSession(request.headers.get('cookie'));
      if (!session) {
        return redirect('/?error=auth_failed');
      }

      const linkRes = await fetch(`${API_BASE}/api/portal/auth/link-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: session.clientId,
          googleEmail,
        }),
      });

      if (!linkRes.ok) {
        console.error('[AUTH] Link Google failed:', await linkRes.text());
        return redirect('/settings?google=error');
      }

      return redirect(`/settings?google=linked&email=${encodeURIComponent(googleEmail)}`);
    }

    // ── LOGIN MODE: verify client and create session ──
    const verifyRes = await fetch(`${API_BASE}/api/portal/auth/verify-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: googleEmail }),
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error('[AUTH] Client verification failed:', errData);
      return redirect('/?error=not_found');
    }

    const clientData = await verifyRes.json();

    const token = await createJwt({
      clientId: clientData.clientId,
      clientEntityId: clientData.clientEntityId,
      clientName: clientData.clientName || googleUser.name || googleEmail,
      contactName: clientData.contactName || googleUser.name || undefined,
      email: googleEmail,
      organizationId: clientData.organizationId,
      storagePath: clientData.storagePath,
      allClientIds: clientData.allClientIds || [],
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': setSessionCookie(token),
      },
    });
  } catch (err) {
    console.error('[AUTH] OAuth callback error:', err);
    const errorRedirect = state === 'link' ? '/settings?google=error' : '/?error=auth_failed';
    return redirect(errorRedirect);
  }
};
