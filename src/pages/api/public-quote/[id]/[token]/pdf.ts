import type { APIRoute } from 'astro';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const GET: APIRoute = async ({ params }) => {
  const { id, token } = params;
  try {
    const res = await fetch(`${API_BASE}/api/public/quote/${id}/${token}/pdf`);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'PDF generation failed' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const pdfBuffer = await res.arrayBuffer();
    const disposition = res.headers.get('Content-Disposition') || 'attachment; filename="cenova-ponuka.pdf"';
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': disposition,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
