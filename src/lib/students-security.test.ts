import { describe, expect, it } from "vitest";
import { normalizeCreateUserInput, normalizeStudentPassword } from "./students";

describe("student security validation", () => {
  it("requires passwords to be at least 8 characters", () => {
    expect(() => normalizeStudentPassword("1234567")).toThrow(/8 characters/);
    expect(normalizeStudentPassword("12345678")).toBe("12345678");
  });

  it("prevents admins from creating admin users", () => {
    expect(() =>
      normalizeCreateUserInput(
        {
          role: "admin",
          name: "Helper Admin",
          login: "helper.admin",
          password: "password8",
        },
        "admin",
      ),
    ).toThrow(/Admin can create only students/);
  });

  it("allows owners to create admin users", () => {
    expect(
      normalizeCreateUserInput(
        {
          role: "admin",
          name: "Helper Admin",
          login: "helper.admin",
          password: "password8",
        },
        "owner",
      ),
    ).toMatchObject({
      role: "admin",
      classId: null,
    });
  });
});
