// ============================================
// Client Portal V2 - Server-side API Client
// Calls business-flow-ai /api/portal/* endpoints
// ============================================

import type { ApiResponse } from './types';

const API_BASE = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

/** Generic fetch to portal API (server-side, with JWT token) */
async function portalFetch<T>(
  endpoint: string,
  token: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}/api/portal/${endpoint}`;

  console.log(`[API] → ${options?.method || 'GET'} ${url} (token: ${token ? token.substring(0, 20) + '...' : 'NONE'})`);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers || {}),
      },
    });

    const text = await res.text();
    console.log(`[API] ← ${endpoint} HTTP ${res.status} body: ${text.substring(0, 300)}`);

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return { success: false, error: `Invalid JSON: ${text.substring(0, 200)}` };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}`,
        details: data.details,
      };
    }

    return { success: true, data: data as T };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.error(`[API] ${endpoint} FAILED:`, msg);
    return { success: false, error: msg };
  }
}

// --- Dashboard ---
export const dashboardApi = {
  getStats: (token: string) => portalFetch<any>('dashboard', token),
};

// --- Orders ---
export const ordersApi = {
  getAll: (token: string) => portalFetch<any[]>('orders', token),
  getById: (id: string, token: string) => portalFetch<any>(`orders/${id}`, token),
};

// --- Quotes ---
export const quotesApi = {
  getAll: (token: string) => portalFetch<{ projects: any[]; totalProjects: number; totalCalculations: number }>('quotes', token),
  getById: (id: string, token: string) => portalFetch<any>(`quotes/${id}`, token),
  respond: (id: string, action: string, comment: string, token: string) =>
    portalFetch<any>(`quotes/${id}/respond`, token, {
      method: 'POST',
      body: JSON.stringify({ action, comment }),
    }),
};

// --- Invoices ---
export const invoicesApi = {
  getAll: (token: string) => portalFetch<any[]>('invoices', token),
  getById: (id: string, token: string) => portalFetch<any>(`invoices/${id}`, token),
  getPdfUrl: (id: string) => `${API_BASE}/api/portal/invoices/${id}/pdf`,
};

// --- Files / NAS ---
export const filesApi = {
  browse: (path: string, token: string) =>
    portalFetch<any>('files/browse', token, {
      method: 'POST',
      body: JSON.stringify({ path }),
    }),
  getDownloadUrl: (path: string) =>
    `${API_BASE}/api/portal/files/download?path=${encodeURIComponent(path)}`,
};

// --- Products ---
export const productsApi = {
  getCategories: (token: string) =>
    portalFetch<{ categories: any[]; clientProducts: any[] }>('products/categories', token),
  getCategoryDetail: (id: string, token: string) =>
    portalFetch<{ category: any; breadcrumb: any[]; children: any[]; templates: any[] }>(`products/categories/${id}`, token),
  getById: (id: string, token: string, type?: string) =>
    portalFetch<any>(`products/${id}${type ? `?type=${type}` : ''}`, token),
  submitOrder: (data: any, token: string) =>
    portalFetch<any>('products/order', token, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// --- AI ---
export const aiApi = {
  searchOrders: (query: string, token: string) =>
    portalFetch<any>('ai/search', token, {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  duplicateOrder: (orderId: string, modifications: any, token: string) =>
    portalFetch<any>('ai/duplicate', token, {
      method: 'POST',
      body: JSON.stringify({ orderId, modifications }),
    }),
};

// --- Notifications ---
export const notificationsApi = {
  getAll: (token: string) => portalFetch<any[]>('notifications', token),
  markRead: (id: string, token: string) =>
    portalFetch<any>(`notifications/${id}/read`, token, { method: 'POST' }),
};
