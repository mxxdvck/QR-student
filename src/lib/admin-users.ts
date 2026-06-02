import type { UserRole } from "@/lib/session";

export function canDeleteAdminUser(actorRole: UserRole, targetRole: UserRole): boolean {
  return actorRole === "owner" && targetRole === "admin";
}
