import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createDatabaseId } from "@/lib/database-id";
import { getAttendanceCellStatus, summarizeAttendanceStatuses } from "@/lib/lessons";
import { createPasswordHash } from "@/lib/password";
import { getSeedOwnerCredentials } from "@/lib/production-env";

type DemoRole = "owner" | "admin" | "student";
type DemoAttendanceStatus = "present";

type DemoUser = {
  id: string;
  name: string;
  login: string;
  passwordHash: string;
  role: DemoRole;
  classId: string | null;
  createdAt: string;
};

type DemoClass = {
  id: string;
  name: string;
  createdAt: string;
};

type DemoLesson = {
  id: string;
  classId: string;
  title: string;
  date: string;
  startTime: string;
  checkInMinutes: number;
  qrToken: string;
  createdAt: string;
};

type DemoAttendance = {
  id: string;
  lessonId: string;
  studentId: string;
  status: DemoAttendanceStatus;
  scannedAt: string;
  createdAt: string;
};

type DemoStore = {
  users: DemoUser[];
  classes: DemoClass[];
  lessons: DemoLesson[];
  attendance: DemoAttendance[];
};

const storePath = ".local/demo-store.json";

export async function ensureDemoStore() {
  const store = await readStore();
  const ownerCredentials = getSeedOwnerCredentials(process.env);
  const ownerLogin = ownerCredentials.login || "admin";
  const admin = store.users.find(
    (user) => user.login === ownerLogin && (user.role === "owner" || user.role === "admin"),
  );

  if (admin && admin.role !== "owner") {
    admin.role = "owner";
    admin.classId = null;
  }

  if (admin && admin.name === "Admin") {
    admin.name = "Администратор";
  }

  await writeStore(store);
}

export async function findDemoUserByLogin(login: string) {
  const store = await readStore();
  return store.users.find((user) => user.login === login) ?? null;
}

export async function getDemoDashboardStats() {
  const store = await readStore();

  return {
    classes: store.classes.length,
    students: store.users.filter((user) => user.role === "student").length,
    lessons: store.lessons.length,
  };
}

export async function getDemoAdminUsers() {
  const store = await readStore();
  return store.users
    .filter((user) => user.role === "owner" || user.role === "admin")
    .toSorted((a, b) => compareDesc(a.createdAt, b.createdAt))
    .map((user) => ({
      id: user.id,
      name: user.name,
      login: user.login,
      role: user.role,
      createdAt: new Date(user.createdAt),
    }));
}

export async function getDemoClasses() {
  const store = await readStore();
  return store.classes
    .toSorted((a, b) => compareDesc(a.createdAt, b.createdAt))
    .map(toClassView);
}

export async function getDemoClassById(id: string) {
  const store = await readStore();
  const classItem = store.classes.find((item) => item.id === id);
  return classItem ? toClassView(classItem) : null;
}

export async function getDemoClassStats(classId: string) {
  const store = await readStore();

  return {
    students: store.users.filter((user) => user.role === "student" && user.classId === classId)
      .length,
    lessons: store.lessons.filter((lesson) => lesson.classId === classId).length,
  };
}

export async function getDemoClassStudents(classId: string) {
  const store = await readStore();
  return store.users
    .filter((user) => user.role === "student" && user.classId === classId)
    .toSorted((a, b) => compareDesc(a.createdAt, b.createdAt))
    .map((user) => ({
      id: user.id,
      name: user.name,
      login: user.login,
      createdAt: new Date(user.createdAt),
    }));
}

export async function getDemoClassLessons(classId: string) {
  const store = await readStore();
  return store.lessons
    .filter((lesson) => lesson.classId === classId)
    .toSorted((a, b) => compareDesc(`${a.date}T${a.startTime}`, `${b.date}T${b.startTime}`))
    .map(toLessonView);
}

export async function getDemoLessonById(id: string) {
  const store = await readStore();
  const lesson = store.lessons.find((item) => item.id === id);
  const classItem = lesson
    ? store.classes.find((item) => item.id === lesson.classId)
    : null;

  if (!lesson || !classItem) {
    return null;
  }

  return {
    ...toLessonView(lesson),
    classId: lesson.classId,
    className: classItem.name,
    qrToken: lesson.qrToken,
  };
}

export async function getDemoClassAttendanceMatrix(classId: string) {
  const store = await readStore();
  const students = store.users
    .filter((user) => user.role === "student" && user.classId === classId)
    .toSorted((a, b) => a.name.localeCompare(b.name) || a.login.localeCompare(b.login));
  const classLessons = store.lessons
    .filter((lesson) => lesson.classId === classId)
    .toSorted((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));
  const attendanceKeys = new Set(
    store.attendance.map((item) => `${item.studentId}:${item.lessonId}`),
  );

  return {
    students: students.map((student) => ({
      id: student.id,
      name: student.name,
      login: student.login,
      cells: classLessons.map((lesson) => ({
        lessonId: lesson.id,
        status: getAttendanceCellStatus(
          lesson,
          attendanceKeys.has(`${student.id}:${lesson.id}`),
        ),
      })),
    })),
    lessons: classLessons.map(toLessonView),
  };
}

export async function getDemoStudentAttendanceOverview(studentId: string) {
  const store = await readStore();
  const student = store.users.find((user) => user.id === studentId);
  const classItem = student?.classId
    ? store.classes.find((item) => item.id === student.classId)
    : null;

  if (!student || !student.classId) {
    return {
      student: student
        ? { id: student.id, name: student.name, className: classItem?.name ?? null }
        : null,
      lessons: [],
      summary: { present: 0, absent: 0 },
    };
  }

  const attendedLessonIds = new Set(
    store.attendance
      .filter((item) => item.studentId === student.id)
      .map((item) => item.lessonId),
  );
  const lessonCards = store.lessons
    .filter((lesson) => lesson.classId === student.classId)
    .toSorted((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
    .map((lesson) => ({
      ...toLessonView(lesson),
      status: getAttendanceCellStatus(lesson, attendedLessonIds.has(lesson.id)),
    }));

  return {
    student: {
      id: student.id,
      name: student.name,
      className: classItem?.name ?? null,
    },
    lessons: lessonCards,
    summary: summarizeAttendanceStatuses(lessonCards.map((lesson) => lesson.status)),
  };
}

export async function getDemoAdminStudentDetail(studentId: string) {
  const store = await readStore();
  const student = store.users.find(
    (user) => user.id === studentId && user.role === "student",
  );
  const classItem = student?.classId
    ? store.classes.find((item) => item.id === student.classId)
    : null;

  if (!student) {
    return null;
  }

  if (!student.classId) {
    return {
      student: {
        id: student.id,
        name: student.name,
        login: student.login,
        classId: null,
        className: null,
        createdAt: new Date(student.createdAt),
      },
      lessons: [],
      summary: { present: 0, absent: 0, pending: 0 },
    };
  }

  const attendedLessonIds = new Set(
    store.attendance
      .filter((item) => item.studentId === student.id)
      .map((item) => item.lessonId),
  );
  const lessonCards = store.lessons
    .filter((lesson) => lesson.classId === student.classId)
    .toSorted((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
    .map((lesson) => ({
      ...toLessonView(lesson),
      status: getAttendanceCellStatus(lesson, attendedLessonIds.has(lesson.id)),
    }));
  const summary = summarizeAttendanceStatuses(lessonCards.map((lesson) => lesson.status));

  return {
    student: {
      id: student.id,
      name: student.name,
      login: student.login,
      classId: student.classId,
      className: classItem?.name ?? null,
      createdAt: new Date(student.createdAt),
    },
    lessons: lessonCards,
    summary: {
      ...summary,
      pending: lessonCards.filter((lesson) => lesson.status === "pending").length,
    },
  };
}

export async function createDemoClass(name: string) {
  const store = await readStore();
  const classItem: DemoClass = {
    id: createDatabaseId(),
    name,
    createdAt: new Date().toISOString(),
  };

  store.classes.push(classItem);
  await writeStore(store);
  return classItem;
}

export async function deleteDemoClass(classId: string) {
  const store = await readStore();
  const studentIds = new Set(
    store.users
      .filter((user) => user.role === "student" && user.classId === classId)
      .map((user) => user.id),
  );
  const lessonIds = new Set(
    store.lessons.filter((lesson) => lesson.classId === classId).map((lesson) => lesson.id),
  );

  store.users = store.users.filter((user) => !studentIds.has(user.id));
  store.lessons = store.lessons.filter((lesson) => lesson.classId !== classId);
  store.attendance = store.attendance.filter(
    (item) => !studentIds.has(item.studentId) && !lessonIds.has(item.lessonId),
  );
  store.classes = store.classes.filter((classItem) => classItem.id !== classId);

  await writeStore(store);
}

export async function createDemoStudent(input: {
  classId: string | null;
  name: string;
  login: string;
  password: string;
  role?: "admin" | "student";
}) {
  const store = await readStore();
  const role = input.role ?? "student";

  if (
    role === "student" &&
    (!input.classId || !store.classes.some((classItem) => classItem.id === input.classId))
  ) {
    return { status: "missing-class" as const };
  }

  if (store.users.some((user) => user.login === input.login)) {
    return { status: "duplicate-login" as const };
  }

  store.users.push({
    id: createDatabaseId(),
    name: input.name,
    login: input.login,
    passwordHash: createPasswordHash(input.password),
    role,
    classId: role === "student" ? input.classId : null,
    createdAt: new Date().toISOString(),
  });
  await writeStore(store);
  return { status: "created" as const };
}

export async function deleteDemoStudent(classId: string, studentId: string) {
  const store = await readStore();
  store.users = store.users.filter(
    (user) => !(user.id === studentId && user.classId === classId && user.role === "student"),
  );
  store.attendance = store.attendance.filter((item) => item.studentId !== studentId);
  await writeStore(store);
}

export async function deleteDemoAdminUser(userId: string) {
  const store = await readStore();
  store.users = store.users.filter((user) => !(user.id === userId && user.role === "admin"));
  await writeStore(store);
}

export async function updateDemoStudentPassword(studentId: string, password: string) {
  const store = await readStore();
  const student = store.users.find(
    (user) => user.id === studentId && user.role === "student",
  );

  if (!student) {
    return null;
  }

  student.passwordHash = createPasswordHash(password);
  await writeStore(store);
  return { id: student.id, classId: student.classId };
}

export async function createDemoLesson(input: {
  classId: string;
  title: string;
  date: string;
  startTime: string;
  checkInMinutes: number;
  qrToken: string;
}) {
  const store = await readStore();

  if (!store.classes.some((classItem) => classItem.id === input.classId)) {
    return null;
  }

  const lesson: DemoLesson = {
    id: createDatabaseId(),
    classId: input.classId,
    title: input.title,
    date: input.date,
    startTime: input.startTime,
    checkInMinutes: input.checkInMinutes,
    qrToken: input.qrToken,
    createdAt: new Date().toISOString(),
  };

  store.lessons.push(lesson);
  await writeStore(store);
  return lesson;
}

export async function getDemoScanContext(qrToken: string, studentId: string) {
  const store = await readStore();
  const lesson = store.lessons.find((item) => item.qrToken === qrToken);
  const classItem = lesson
    ? store.classes.find((item) => item.id === lesson.classId)
    : null;
  const student = store.users.find((user) => user.id === studentId);

  return {
    lesson: lesson
      ? { ...toLessonView(lesson), classId: lesson.classId, className: classItem?.name ?? "" }
      : null,
    student: student
      ? { id: student.id, classId: student.classId, role: student.role }
      : null,
    hasAttendance: lesson
      ? store.attendance.some(
          (item) => item.lessonId === lesson.id && item.studentId === studentId,
        )
      : false,
  };
}

export async function createDemoAttendanceIfMissing(lessonId: string, studentId: string) {
  const store = await readStore();
  const exists = store.attendance.some(
    (item) => item.lessonId === lessonId && item.studentId === studentId,
  );

  if (exists) {
    return null;
  }

  const attendance: DemoAttendance = {
    id: createDatabaseId(),
    lessonId,
    studentId,
    status: "present",
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  store.attendance.push(attendance);
  await writeStore(store);
  return attendance;
}

async function readStore(): Promise<DemoStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as DemoStore;
  } catch {
    const store = createEmptyStore();
    await writeStore(store);
    return store;
  }
}

async function writeStore(store: DemoStore) {
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`);
}

function createEmptyStore(): DemoStore {
  const ownerCredentials = getSeedOwnerCredentials(process.env);

  return {
    users: [
      {
        id: createDatabaseId(),
        name: "Администратор",
        login: ownerCredentials.login || "admin",
        passwordHash: createPasswordHash(ownerCredentials.password || "admin123"),
        role: "owner",
        classId: null,
        createdAt: new Date().toISOString(),
      },
    ],
    classes: [],
    lessons: [],
    attendance: [],
  };
}

function toClassView(classItem: DemoClass) {
  return {
    ...classItem,
    createdAt: new Date(classItem.createdAt),
  };
}

function toLessonView(lesson: DemoLesson) {
  return {
    id: lesson.id,
    title: lesson.title,
    date: lesson.date,
    startTime: lesson.startTime,
    checkInMinutes: lesson.checkInMinutes,
    createdAt: new Date(lesson.createdAt),
  };
}

function compareDesc(a: string, b: string) {
  return b.localeCompare(a);
}
