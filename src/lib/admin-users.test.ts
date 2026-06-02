import { describe, expect, it } from "vitest";
import { canDeleteAdminUser } from "./admin-users";

describe("admin user helpers", () => {
  it("allows only owners to delete admins", () => {
    expect(canDeleteAdminUser("owner", "admin")).toBe(true);
    expect(canDeleteAdminUser("admin", "admin")).toBe(false);
  });

  it("prevents owner deletion", () => {
    expect(canDeleteAdminUser("owner", "owner")).toBe(false);
    expect(canDeleteAdminUser("admin", "owner")).toBe(false);
  });
});
