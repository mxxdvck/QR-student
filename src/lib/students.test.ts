import { describe, expect, it } from "vitest";
import {
  normalizeCreateUserInput,
  normalizeStudentInput,
  normalizeStudentPassword,
} from "./students";

describe("student helpers", () => {
  it("normalizes student fields before saving", () => {
    expect(
      normalizeStudentInput({
        name: "  Alice   Johnson ",
        login: " Alice.Login ",
        password: " secret123 ",
      }),
    ).toEqual({
      name: "Alice Johnson",
      login: "alice.login",
      password: " secret123 ",
    });
  });

  it("rejects missing required fields", () => {
    expect(() =>
      normalizeStudentInput({
        name: "",
        login: "student",
        password: "secret123",
      }),
    ).toThrow("Student name is required");
  });

  it("requires a password with at least six characters", () => {
    expect(() =>
      normalizeStudentInput({
        name: "Alice",
        login: "alice",
        password: "12345",
      }),
    ).toThrow("Student password must be at least 6 characters");
  });

  it("normalizes a new student password before changing it", () => {
    expect(normalizeStudentPassword(" new-secret ")).toBe(" new-secret ");
  });

  it("rejects a short new student password", () => {
    expect(() => normalizeStudentPassword("12345")).toThrow(
      "Student password must be at least 6 characters",
    );
  });

  it("normalizes student creation with a required class", () => {
    expect(
      normalizeCreateUserInput(
        {
          name: "  Alice   Johnson ",
          login: " Alice.Login ",
          password: " secret123 ",
          role: "student",
          classId: "class-1",
        },
        "admin",
      ),
    ).toEqual({
      name: "Alice Johnson",
      login: "alice.login",
      password: " secret123 ",
      role: "student",
      classId: "class-1",
    });
  });

  it("requires classId for student creation", () => {
    expect(() =>
      normalizeCreateUserInput(
        {
          name: "Alice",
          login: "alice",
          password: "secret123",
          role: "student",
          classId: "",
        },
        "owner",
      ),
    ).toThrow("Student class is required");
  });

  it("lets owners create admins without a class", () => {
    expect(
      normalizeCreateUserInput(
        {
          name: "  Admin User ",
          login: " Admin.Login ",
          password: " secret123 ",
          role: "admin",
          classId: "class-1",
        },
        "owner",
      ),
    ).toEqual({
      name: "Admin User",
      login: "admin.login",
      password: " secret123 ",
      role: "admin",
      classId: null,
    });
  });

  it("blocks admins from creating admins or owners", () => {
    expect(() =>
      normalizeCreateUserInput(
        {
          name: "Admin User",
          login: "admin.user",
          password: "secret123",
          role: "admin",
          classId: "",
        },
        "admin",
      ),
    ).toThrow("Admin can create only students");

    expect(() =>
      normalizeCreateUserInput(
        {
          name: "Owner User",
          login: "owner.user",
          password: "secret123",
          role: "owner",
          classId: "",
        },
        "admin",
      ),
    ).toThrow("User role is not allowed");
  });

  it("blocks students from creating users", () => {
    expect(() =>
      normalizeCreateUserInput(
        {
          name: "Alice",
          login: "alice",
          password: "secret123",
          role: "student",
          classId: "class-1",
        },
        "student",
      ),
    ).toThrow("Only owner and admin can create users");
  });
});
