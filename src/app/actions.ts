"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, isDemoDatabase } from "@/db/client";
import { classes, lessons, users } from "@/db/schema";
import { getSessionSecret, requireRole } from "@/lib/auth";
import { normalizeClassName } from "@/lib/classes";
import { createDatabaseId } from "@/lib/database-id";
import {
  createDemoClass,
  createDemoLesson,
  createDemoStudent,
  deleteDemoStudent,
  findDemoUserByLogin,
  getDemoClassById,
  updateDemoStudentPassword,
} from "@/lib/demo-store";
import { createQrToken, normalizeLessonInput } from "@/lib/lessons";
import { createPasswordHash, verifyPassword } from "@/lib/password";
import {
  createSessionToken,
  getRoleHomePath,
  getSafeRedirectPath,
  sessionCookieName,
  sessionMaxAgeSeconds,
} from "@/lib/session";
import { normalizeCreateUserInput, normalizeStudentPassword } from "@/lib/students";

export async function loginAction(formData: FormData): Promise<void> {
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeRedirectPath(String(formData.get("next") ?? ""), "");

  if (!login || !password) {
    redirect(getLoginErrorPath("missing", nextPath));
  }

  const user = isDemoDatabase()
    ? await findDemoUserByLogin(login)
    : await getDb().query.users.findFirst({
        where: eq(users.login, login),
      });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect(getLoginErrorPath("invalid", nextPath));
  }

  const token = createSessionToken(
    {
      userId: user.id,
      name: user.name,
      role: user.role,
    },
    getSessionSecret(),
  );

  (await cookies()).set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });

  const homePath = getRoleHomePath(user.role);
  const redirectPath =
    user.role === "student" && nextPath.startsWith("/scan/") ? nextPath : homePath;

  redirect(redirectPath);
}

function getLoginErrorPath(error: string, nextPath: string): string {
  const query = new URLSearchParams({ error });

  if (nextPath) {
    query.set("next", nextPath);
  }

  return `/login?${query.toString()}`;
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(sessionCookieName);
  redirect("/login");
}

export async function createClassAction(formData: FormData): Promise<void> {
  await requireRole("admin");

  let name: string;

  try {
    name = normalizeClassName(String(formData.get("name") ?? ""));
  } catch {
    redirect("/admin/classes?error=missing-name");
  }

  const createdClass = isDemoDatabase()
    ? await createDemoClass(name)
    : (
        await getDb()
          .insert(classes)
          .values({ id: createDatabaseId(), name })
          .returning({
            id: classes.id,
          })
      )[0];

  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  redirect(`/admin/classes/${createdClass.id}`);
}

export async function createStudentAction(formData: FormData): Promise<void> {
  const session = await requireRole("admin");

  const classId = String(formData.get("classId") ?? "");
  const redirectPath = classId ? `/admin/classes/${classId}` : "/admin/classes";
  let user: ReturnType<typeof normalizeCreateUserInput>;

  try {
    user = normalizeCreateUserInput(
      {
        role: String(formData.get("role") ?? "student"),
        name: String(formData.get("name") ?? ""),
        login: String(formData.get("login") ?? ""),
        password: String(formData.get("password") ?? ""),
        classId,
      },
      session.role,
    );
  } catch {
    redirect(`${redirectPath}?error=student-fields`);
  }

  if (user.role === "student") {
    const studentClassId = user.classId;

    if (!studentClassId) {
      redirect("/admin/classes");
    }

    const classItem = isDemoDatabase()
      ? await getDemoClassById(studentClassId)
      : await getDb().query.classes.findFirst({
          where: eq(classes.id, studentClassId),
        });

    if (!classItem) {
      redirect("/admin/classes");
    }
  }

  if (isDemoDatabase()) {
    const result = await createDemoStudent(user);

    if (result.status === "duplicate-login") {
      redirect(`${redirectPath}?error=student-login`);
    }

    if (result.status === "missing-class") {
      redirect("/admin/classes");
    }
  } else {
    const existingUser = await getDb().query.users.findFirst({
      where: eq(users.login, user.login),
    });

    if (existingUser) {
      redirect(`${redirectPath}?error=student-login`);
    }

    await getDb().insert(users).values({
      id: createDatabaseId(),
      name: user.name,
      login: user.login,
      passwordHash: createPasswordHash(user.password),
      role: user.role,
      classId: user.classId,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  if (classId) {
    revalidatePath(`/admin/classes/${classId}`);
  }
  redirect(redirectPath);
}

export async function deleteStudentAction(formData: FormData): Promise<void> {
  await requireRole("admin");

  const classId = String(formData.get("classId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");

  if (!classId || !studentId) {
    redirect("/admin/classes");
  }

  if (isDemoDatabase()) {
    await deleteDemoStudent(classId, studentId);
  } else {
    await getDb()
      .delete(users)
      .where(
        and(
          eq(users.id, studentId),
          eq(users.classId, classId),
          eq(users.role, "student"),
        ),
      );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${classId}`);
  redirect(`/admin/classes/${classId}`);
}

export async function updateStudentPasswordAction(formData: FormData): Promise<void> {
  await requireRole("admin");

  const studentId = String(formData.get("studentId") ?? "");
  let password: string;

  if (!studentId) {
    redirect("/admin/classes");
  }

  try {
    password = normalizeStudentPassword(String(formData.get("password") ?? ""));
  } catch {
    redirect(`/admin/students/${studentId}?error=password`);
  }

  const updatedStudent = isDemoDatabase()
    ? await updateDemoStudentPassword(studentId, password)
    : await updateStudentPasswordInDatabase(studentId, password);

  if (!updatedStudent) {
    redirect("/admin/classes");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/students/${studentId}`);

  if (updatedStudent.classId) {
    revalidatePath(`/admin/classes/${updatedStudent.classId}`);
  }

  redirect(`/admin/students/${studentId}?password=updated`);
}

async function updateStudentPasswordInDatabase(studentId: string, password: string) {
  const student = await getDb().query.users.findFirst({
    columns: {
      id: true,
      classId: true,
    },
    where: and(eq(users.id, studentId), eq(users.role, "student")),
  });

  if (!student) {
    return null;
  }

  await getDb()
    .update(users)
    .set({ passwordHash: createPasswordHash(password) })
    .where(and(eq(users.id, studentId), eq(users.role, "student")));

  return student;
}

export async function createLessonAction(formData: FormData): Promise<void> {
  await requireRole("admin");

  const classId = String(formData.get("classId") ?? "");
  let lesson: ReturnType<typeof normalizeLessonInput>;

  const classItem = isDemoDatabase()
    ? await getDemoClassById(classId)
    : await getDb().query.classes.findFirst({
        where: eq(classes.id, classId),
      });

  if (!classItem) {
    redirect("/admin/classes");
  }

  try {
    lesson = normalizeLessonInput({
      title: String(formData.get("title") ?? ""),
      date: String(formData.get("date") ?? ""),
      startTime: String(formData.get("startTime") ?? ""),
      checkInMinutes: String(formData.get("checkInMinutes") ?? ""),
    });
  } catch {
    redirect(`/admin/classes/${classId}?error=lesson-fields`);
  }

  const qrToken = createQrToken();
  const createdLesson = isDemoDatabase()
    ? await createDemoLesson({ classId, ...lesson, qrToken })
    : (
        await getDb()
          .insert(lessons)
          .values({
            id: createDatabaseId(),
            classId,
            title: lesson.title,
            date: lesson.date,
            startTime: lesson.startTime,
            checkInMinutes: lesson.checkInMinutes,
            qrToken,
          })
          .returning({ id: lessons.id })
      )[0];

  if (!createdLesson) {
    redirect("/admin/classes");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/classes/${classId}`);
  redirect(`/admin/lessons/${createdLesson.id}`);
}
