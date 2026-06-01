import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  canAccessRole,
  getRoleHomePath,
  readSessionToken,
  sessionCookieName,
  type SessionPayload,
  type UserRole,
} from "./session";

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return readSessionToken(token, getSessionSecret());
}

export async function requireRole(role: UserRole): Promise<SessionPayload> {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (!canAccessRole(role, session.role)) {
    redirect(getRoleHomePath(session.role));
  }

  return session;
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required for authentication");
  }

  return secret;
}
