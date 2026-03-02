// ============================================
// Google OAuth - Redirect to Google
// ============================================

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect }) => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const portalUrl = import.meta.env.PUBLIC_PORTAL_URL || 'http://localhost:4000';
  const redirectUri = `${portalUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};
