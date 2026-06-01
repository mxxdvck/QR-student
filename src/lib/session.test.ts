import { describe, expect, it } from "vitest";
import {
  canAccessRole,
  createSessionToken,
  getRoleHomePath,
  getSafeRedirectPath,
  readSessionToken,
  type SessionPayload,
} from "./session";

const secret = "test-secret-that-is-long-enough";
const payload: SessionPayload = {
  userId: "user-1",
  name: "Test User",
  role: "admin",
};

describe("session tokens", () => {
  it("round-trips a signed session payload", () => {
    const token = createSessionToken(payload, secret);

    expect(readSessionToken(token, secret)).toEqual(payload);
  });

  it("rejects a token signed with another secret", () => {
    const token = createSessionToken(payload, secret);

    expect(readSessionToken(token, "different-secret")).toBeNull();
  });

  it("maps roles to protected home paths", () => {
    expect(getRoleHomePath("owner")).toBe("/admin");
    expect(getRoleHomePath("admin")).toBe("/admin");
    expect(getRoleHomePath("student")).toBe("/student");
  });

  it("allows owner and admin into the admin area only", () => {
    expect(canAccessRole("admin", "owner")).toBe(true);
    expect(canAccessRole("admin", "admin")).toBe(true);
    expect(canAccessRole("admin", "student")).toBe(false);
    expect(canAccessRole("student", "student")).toBe(true);
    expect(canAccessRole("student", "owner")).toBe(false);
    expect(canAccessRole("student", "admin")).toBe(false);
  });

  it("round-trips an owner session payload", () => {
    const ownerPayload: SessionPayload = {
      userId: "owner-1",
      name: "Owner User",
      role: "owner",
    };
    const token = createSessionToken(ownerPayload, secret);

    expect(readSessionToken(token, secret)).toEqual(ownerPayload);
  });

  it("keeps only local redirect paths", () => {
    expect(getSafeRedirectPath("/scan/token", "/student")).toBe("/scan/token");
    expect(getSafeRedirectPath("https://evil.example", "/student")).toBe("/student");
    expect(getSafeRedirectPath("//evil.example", "/student")).toBe("/student");
    expect(getSafeRedirectPath("/admin", "/student")).toBe("/admin");
  });
});
