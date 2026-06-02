import "server-only";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, isDemoDatabase } from "@/db/client";
import { users } from "@/db/schema";
import { findDemoUserById } from "@/lib/demo-store";
import {
  canAccessRole,
  getAuthoritativeSession,
  getRoleHomePath,
  readSessionToken,
  sessionCookieName,
  type SessionPayload,
  type SessionUserSnapshot,
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

  const authoritativeSession = getAuthoritativeSession(
    session,
    await findSessionUser(session.userId),
  );

  if (!authoritativeSession) {
    await deleteSessionCookie();
    redirect("/login");
  }

  if (!canAccessRole(role, authoritativeSession.role)) {
    redirect(getRoleHomePath(authoritativeSession.role));
  }

  return authoritativeSession;
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required for authentication");
  }

  return secret;
}

async function findSessionUser(userId: string): Promise<SessionUserSnapshot | null> {
  if (isDemoDatabase()) {
    return findDemoUserById(userId);
  }

  const user = await getDb().query.users.findFirst({
    columns: {
      id: true,
      name: true,
      role: true,
    },
    where: eq(users.id, userId),
  });

  return user ?? null;
}

async function deleteSessionCookie(): Promise<void> {
  try {
    (await cookies()).delete(sessionCookieName);
  } catch {
    // Server Components may be read-only for cookies; the redirect still blocks access.
  }
}
