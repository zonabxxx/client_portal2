// ============================================
// Proxy API - Forwards requests from portal to business-flow-ai
// Adds JWT token from cookie
// ============================================

import type { APIRoute } from 'astro';
import { getSession } from '@/lib/auth';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const ALL: APIRoute = async ({ request, params }) => {
  const path = params.path || '';
  const session = await getSession(request.headers.get('cookie'));

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Include query parameters from original request
  const url = new URL(request.url);
  const queryString = url.search; // e.g. ?type=product
  const targetUrl = `${API_BASE}/api/portal/${path}${queryString}`;

  try {
    // Forward the request
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.token}`,
    };

    // Forward content-type if present
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    // Forward body for POST/PUT/PATCH
    // Use arrayBuffer() to support both JSON and multipart/form-data (binary)
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      fetchOptions.body = new Uint8Array(await request.arrayBuffer());
    }

    const res = await fetch(targetUrl, fetchOptions);

    // Return the response as-is
    const responseHeaders = new Headers();
    const resContentType = res.headers.get('Content-Type') || 'application/json';
    responseHeaders.set('Content-Type', resContentType);

    // Forward Content-Disposition header for file downloads
    const contentDisposition = res.headers.get('Content-Disposition');
    if (contentDisposition) {
      responseHeaders.set('Content-Disposition', contentDisposition);
    }

    // Use arrayBuffer for binary content (PDF, images), text for JSON
    const isBinary = resContentType.includes('pdf') || resContentType.includes('octet-stream') || resContentType.includes('image');
    const body = isBinary ? await res.arrayBuffer() : await res.text();

    return new Response(body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(`[PROXY] Error forwarding to ${targetUrl}:`, err);
    return new Response(JSON.stringify({ error: 'Proxy error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
