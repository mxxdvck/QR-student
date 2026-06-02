import { describe, expect, it } from "vitest";
import { normalizeCreateUserInput, normalizeStudentPassword } from "./students";

describe("student security validation", () => {
  it("requires passwords to be at least 12 characters", () => {
    expect(() => normalizeStudentPassword("12345678901")).toThrow(/12 characters/);
    expect(normalizeStudentPassword("123456789012")).toBe("123456789012");
  });

  it("prevents admins from creating admin users", () => {
    expect(() =>
      normalizeCreateUserInput(
        {
          role: "admin",
          name: "Helper Admin",
          login: "helper.admin",
          password: "password12345",
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
          password: "password12345",
        },
        "owner",
      ),
    ).toMatchObject({
      role: "admin",
      classId: null,
    });
  });
});
