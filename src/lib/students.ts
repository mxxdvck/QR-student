import type { UserRole } from "@/lib/session";

type StudentInput = {
  name: string;
  login: string;
  password: string;
};

type CreateUserInput = StudentInput & {
  role?: string;
  classId?: string;
};

export type CreatableUserRole = "admin" | "student";

export type NormalizedCreateUserInput = StudentInput & {
  role: CreatableUserRole;
  classId: string | null;
};

export function normalizeStudentInput(input: StudentInput): StudentInput {
  const name = input.name.trim().replace(/\s+/g, " ");
  const login = input.login.trim().toLowerCase();
  const password = normalizeStudentPassword(input.password);

  if (!name) {
    throw new Error("Student name is required");
  }

  if (!login) {
    throw new Error("Student login is required");
  }

  if (password.length < 12) {
    throw new Error("Student password must be at least 12 characters");
  }

  return { name, login, password };
}

export function normalizeCreateUserInput(
  input: CreateUserInput,
  creatorRole: UserRole,
): NormalizedCreateUserInput {
  if (creatorRole !== "owner" && creatorRole !== "admin") {
    throw new Error("Only owner and admin can create users");
  }

  const role = input.role || "student";

  if (role !== "student" && role !== "admin") {
    throw new Error("User role is not allowed");
  }

  if (creatorRole === "admin" && role !== "student") {
    throw new Error("Admin can create only students");
  }

  const user = normalizeStudentInput(input);

  if (role === "student") {
    const classId = input.classId?.trim() ?? "";

    if (!classId) {
      throw new Error("Student class is required");
    }

    return { ...user, role, classId };
  }

  return { ...user, role, classId: null };
}

export function normalizeStudentPassword(password: string): string {
  if (password.length < 12) {
    throw new Error("Student password must be at least 12 characters");
  }

  return password;
}
