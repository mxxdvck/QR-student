import { readFile } from "node:fs/promises";
import {
  createDemoClass,
  createDemoLesson,
  createDemoStudent,
  ensureDemoStore,
  findDemoUserByLogin,
} from "../src/lib/demo-store";
import { createQrToken } from "../src/lib/lessons";
import {
  canAccessRole,
  createSessionToken,
  sessionCookieName,
  type SessionPayload,
  type UserRole,
} from "../src/lib/session";

type DemoAttendanceRow = {
  lessonId: string;
  studentId: string;
};

type DemoStoreSnapshot = {
  attendance: DemoAttendanceRow[];
};

const baseUrl = normalizeBaseUrl(
  process.env.SMOKE_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000",
);
const runId = Date.now().toString(36);
const adminLogin = process.env.SEED_OWNER_LOGIN ?? process.env.SEED_ADMIN_LOGIN ?? "admin";
const studentLogin = `student.${runId}`;
const wrongStudentLogin = `wrong.${runId}`;

async function main() {
  if (process.env.DEMO_DATABASE !== "1") {
    throw new Error("Smoke MVP uses the local demo store. Set DEMO_DATABASE=1 in .env.local.");
  }

  await assertServerIsRunning();
  await ensureDemoStore();

  const admin = await findDemoUserByLogin(adminLogin);

  if (!admin || !canAccessRole("admin", admin.role)) {
    throw new Error(`Admin-area user "${adminLogin}" was not found in the demo store.`);
  }

  const classItem = await createDemoClass(`Smoke ${runId}`);
  const wrongClass = await createDemoClass(`Smoke wrong ${runId}`);
  const student = await createStudent(classItem.id, studentLogin, `Студент ${runId}`);
  const wrongStudent = await createStudent(
    wrongClass.id,
    wrongStudentLogin,
    `Чужой студент ${runId}`,
  );
  const openLesson = await createDemoLesson({
    classId: classItem.id,
    title: `Открытое занятие ${runId}`,
    date: formatDate(new Date()),
    startTime: formatTime(new Date()),
    checkInMinutes: 60,
    qrToken: createQrToken(),
  });
  const expiredLesson = await createDemoLesson({
    classId: classItem.id,
    title: `Просроченное занятие ${runId}`,
    date: formatDate(addDays(new Date(), -1)),
    startTime: "09:00",
    checkInMinutes: 1,
    qrToken: createQrToken(),
  });

  if (!openLesson || !expiredLesson) {
    throw new Error("Failed to create smoke lessons.");
  }

  const adminCookie = createCookie(admin);
  const studentCookie = createCookie(student);
  const wrongStudentCookie = createCookie(wrongStudent);

  await assertPageText("/admin/classes", adminCookie, ["Классы", "Студенты", "Занятия"]);
  await assertPageText(`/admin/classes/${classItem.id}`, adminCookie, [
    classItem.name,
    student.name,
    openLesson.title,
  ]);
  await assertPageText(`/admin/students/${student.id}`, adminCookie, [
    student.name,
    "Пароль",
    "Календарь посещаемости",
  ]);
  await assertPageText(`/admin/lessons/${openLesson.id}`, adminCookie, [
    openLesson.title,
    "/scan/",
  ]);

  await assertPageText(`/scan/${openLesson.qrToken}`, studentCookie, [
    "Посещение отмечено",
    openLesson.title,
  ]);
  assertAttendanceCount(openLesson.id, student.id, 1, "after first scan");

  await assertPageText(`/scan/${openLesson.qrToken}`, studentCookie, [
    "уже отметились",
    openLesson.title,
  ]);
  assertAttendanceCount(openLesson.id, student.id, 1, "after duplicate scan");

  await assertPageText(`/scan/${openLesson.qrToken}`, wrongStudentCookie, [
    "не для вашего класса",
  ]);
  await assertPageText(`/scan/${expiredLesson.qrToken}`, studentCookie, [
    "Окно отметки закрыто",
  ]);
  await assertPageText(`/admin/classes/${classItem.id}`, adminCookie, [
    "Присутствовал",
    "Пропуск",
  ]);
  await assertPageText("/student", studentCookie, [
    student.name,
    classItem.name,
    "Посещения",
    "Пропуски",
  ]);

  console.log("MVP smoke passed");
}

async function createStudent(classId: string, login: string, name: string) {
  const result = await createDemoStudent({
    classId,
    login,
    name,
    password: "secret123",
  });

  if (result.status !== "created") {
    throw new Error(`Failed to create student "${login}": ${result.status}`);
  }

  const student = await findDemoUserByLogin(login);

  if (!student || student.role !== "student") {
    throw new Error(`Student "${login}" was not found after creation.`);
  }

  return student;
}

async function assertServerIsRunning() {
  try {
    const response = await fetch(new URL("/login", baseUrl));

    if (!response.ok) {
      throw new Error(`GET /login returned ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Cannot reach ${baseUrl}. Start the app first with "npm run dev" or set SMOKE_BASE_URL.`,
      { cause: error },
    );
  }
}

async function assertPageText(path: string, cookie: string, fragments: string[]) {
  const response = await fetch(new URL(path, baseUrl), {
    headers: {
      Cookie: cookie,
    },
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GET ${path} returned ${response.status}.`);
  }

  for (const fragment of fragments) {
    if (!text.includes(fragment)) {
      throw new Error(`GET ${path} did not include expected text: "${fragment}".`);
    }
  }
}

async function assertAttendanceCount(
  lessonId: string,
  studentId: string,
  expected: number,
  context: string,
) {
  const store = JSON.parse(await readFile(".local/demo-store.json", "utf8")) as DemoStoreSnapshot;
  const actual = store.attendance.filter(
    (row) => row.lessonId === lessonId && row.studentId === studentId,
  ).length;

  if (actual !== expected) {
    throw new Error(`Expected ${expected} attendance row(s) ${context}, got ${actual}.`);
  }
}

function createCookie(user: {
  id: string;
  name: string;
  role: UserRole;
}) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required for smoke tests.");
  }

  const payload: SessionPayload = {
    userId: user.id,
    name: user.name,
    role: user.role,
  };
  const token = createSessionToken(payload, secret);

  return `${sessionCookieName}=${token}`;
}

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
