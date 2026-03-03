// ============================================
// Client Portal V2 - JWT Auth (server-side)
// ============================================

import * as jose from 'jose';
import type { ClientSession } from './types';

const COOKIE_NAME = 'portal_session';

function getSecret(): Uint8Array {
  const secret = process.env.PORTAL_JWT_SECRET || import.meta.env.PORTAL_JWT_SECRET || '';
  if (!secret) throw new Error('PORTAL_JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

/** Create JWT token for authenticated client */
export async function createJwt(data: Omit<ClientSession, 'token' | 'expiresAt'> & { allClientIds?: string[] }): Promise<string> {
  return new jose.SignJWT({
    clientId: data.clientId,
    clientEntityId: data.clientEntityId,
    clientName: data.clientName,
    contactName: data.contactName || null,
    email: data.email,
    organizationId: data.organizationId,
    storagePath: data.storagePath,
    allClientIds: data.allClientIds || [],
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

/** Verify JWT token and return session data */
export async function verifyJwt(token: string): Promise<ClientSession | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecret());
    return {
      clientId: payload.clientId as string,
      clientEntityId: payload.clientEntityId as string,
      clientName: (payload.clientName as string) || 'Klient',
      contactName: (payload.contactName as string) || undefined,
      email: (payload.email as string) || '',
      organizationId: payload.organizationId as string,
      storagePath: payload.storagePath as string | undefined,
      expiresAt: (payload.exp || 0) * 1000,
      token,
    };
  } catch {
    return null;
  }
}

/** Get session from request cookie header */
export async function getSession(cookieHeader: string | null): Promise<ClientSession | null> {
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  return verifyJwt(token);
}

/** Set session cookie header value */
export function setSessionCookie(token: string, maxAgeSec = 7 * 24 * 60 * 60): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

/** Clear session cookie header value */
export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
