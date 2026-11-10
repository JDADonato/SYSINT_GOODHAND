import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.STORE_SESSION_SECRET || 'store_default_super_secret_session_key_minimum_64_characters_long_for_security'
);

// FSM shared secret for service-to-service communication
const FSM_SERVICE_SECRET = new TextEncoder().encode(
  process.env.FSM_SESSION_SECRET || 'fsm_default_super_secret_session_key_minimum_64_characters_long_for_security'
);

export interface UserSession {
  userId: string;
  email: string;
  role: 'customer' | 'store_admin';
  fullName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function getSessionUser(req: NextRequest): Promise<UserSession | null> {
  const cookie = req.cookies.get('store_session');
  if (!cookie?.value) return null;
  return verifySessionToken(cookie.value);
}

// Generate service token signed for FSM verification
export async function createStoreToFsmServiceToken(scopes: string[]): Promise<string> {
  return new SignJWT({ scope: scopes.join(' ') })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('store-service')
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(FSM_SERVICE_SECRET);
}
