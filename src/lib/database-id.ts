import { randomUUID } from "node:crypto";

export function createDatabaseId(): string {
  return randomUUID();
}
