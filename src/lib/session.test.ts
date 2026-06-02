import { describe, expect, it } from "vitest";
import { getAuthoritativeSession, type SessionPayload } from "./session";

const cookieSession: SessionPayload = {
  userId: "user-1",
  name: "Old Name",
  role: "admin",
};

describe("getAuthoritativeSession", () => {
  it("returns current database user details when the session still matches", () => {
    expect(
      getAuthoritativeSession(cookieSession, {
        id: "user-1",
        name: "Current Name",
        role: "admin",
      }),
    ).toEqual({
      userId: "user-1",
      name: "Current Name",
      role: "admin",
    });
  });

  it("invalidates the session when the user no longer exists", () => {
    expect(getAuthoritativeSession(cookieSession, null)).toBeNull();
  });

  it("invalidates the session when the stored role changed", () => {
    expect(
      getAuthoritativeSession(cookieSession, {
        id: "user-1",
        name: "Current Name",
        role: "student",
      }),
    ).toBeNull();
  });
});
