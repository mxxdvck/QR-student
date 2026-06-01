import { describe, expect, it } from "vitest";
import { createPasswordHash, verifyPassword } from "./password";

describe("password hashing", () => {
  it("creates a verifiable scrypt password hash", () => {
    const hash = createPasswordHash("admin123");

    expect(hash).toMatch(/^scrypt\$\d+\$[a-f0-9]+\$[a-f0-9]+$/);
    expect(verifyPassword("admin123", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });
});
