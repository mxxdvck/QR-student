import { createHmac, timingSafeEqual } from "node:crypto";

export const sessionCookieName = "qr_student_session";

export type UserRole = "owner" | "admin" | "student";

export type SessionPayload = {
  userId: string;
  name: string;
  role: UserRole;
};

export type SessionUserSnapshot = {
  id: string;
  name: string;
  role: UserRole;
};

export const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export function getRoleHomePath(role: UserRole): "/admin" | "/student" {
  return role === "student" ? "/student" : "/admin";
}

export function canAccessRole(requiredRole: UserRole, actualRole: UserRole): boolean {
  if (requiredRole === "admin") {
    return actualRole === "owner" || actualRole === "admin";
  }

  return actualRole === requiredRole;
}

export function getAuthoritativeSession(
  session: SessionPayload,
  user: SessionUserSnapshot | null,
): SessionPayload | null {
  if (!user || user.id !== session.userId || user.role !== session.role) {
    return null;
  }

  return {
    userId: user.id,
    name: user.name,
    role: user.role,
  };
}

export function getSafeRedirectPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function createSessionToken(payload: SessionPayload, secret: string): string {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(body, secret);

  return `${body}.${signature}`;
}

export function readSessionToken(token: string, secret: string): SessionPayload | null {
  const [body, signature] = token.split(".");

  if (!body || !signature || !isValidSignature(body, signature, secret)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(body)) as Partial<SessionPayload>;

    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.name !== "string" ||
      (parsed.role !== "owner" && parsed.role !== "admin" && parsed.role !== "student")
    ) {
      return null;
    }

    return {
      userId: parsed.userId,
      name: parsed.name,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function isValidSignature(body: string, signature: string, secret: string): boolean {
  const expected = Buffer.from(sign(body, secret));
  const actual = Buffer.from(signature);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}
