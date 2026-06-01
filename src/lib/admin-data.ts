import "server-only";

import { and, asc, count, desc, eq } from "drizzle-orm";
import { getDb, isDemoDatabase } from "@/db/client";
import { attendance, classes, lessons, users } from "@/db/schema";
import {
  getDemoClassAttendanceMatrix,
  getDemoClassById,
  getDemoClasses,
  getDemoClassLessons,
  getDemoClassStats,
  getDemoClassStudents,
  getDemoAdminStudentDetail,
  getDemoDashboardStats,
  getDemoLessonById,
} from "@/lib/demo-store";
import {
  getAttendanceCellStatus,
  summarizeAttendanceStatuses,
  type AttendanceCellStatus,
} from "@/lib/lessons";

export async function getAdminDashboardStats() {
  if (isDemoDatabase()) {
    return getDemoDashboardStats();
  }

  const db = getDb();
  const [classCount] = await db.select({ value: count() }).from(classes);
  const [studentCount] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "student"));
  const [lessonCount] = await db.select({ value: count() }).from(lessons);

  return {
    classes: classCount.value,
    students: studentCount.value,
    lessons: lessonCount.value,
  };
}

export async function getClasses() {
  if (isDemoDatabase()) {
    return getDemoClasses();
  }

  const db = getDb();

  return db
    .select({
      id: classes.id,
      name: classes.name,
      createdAt: classes.createdAt,
    })
    .from(classes)
    .orderBy(desc(classes.createdAt));
}

export async function getClassesWithStats() {
  const classRows = await getClasses();

  return Promise.all(
    classRows.map(async (classItem) => ({
      ...classItem,
      stats: await getClassStats(classItem.id),
    })),
  );
}

export async function getClassById(id: string) {
  if (isDemoDatabase()) {
    return getDemoClassById(id);
  }

  const db = getDb();
  const classRows = await db
    .select({
      id: classes.id,
      name: classes.name,
      createdAt: classes.createdAt,
    })
    .from(classes)
    .where(eq(classes.id, id))
    .limit(1);

  return classRows[0] ?? null;
}

export async function getClassStats(classId: string) {
  if (isDemoDatabase()) {
    return getDemoClassStats(classId);
  }

  const db = getDb();
  const [studentCount] = await db
    .select({ value: count() })
    .from(users)
    .where(and(eq(users.role, "student"), eq(users.classId, classId)));
  const [lessonCount] = await db
    .select({ value: count() })
    .from(lessons)
    .where(eq(lessons.classId, classId));

  return {
    students: studentCount.value,
    lessons: lessonCount.value,
  };
}

export async function getClassStudents(classId: string) {
  if (isDemoDatabase()) {
    return getDemoClassStudents(classId);
  }

  const db = getDb();

  return db
    .select({
      id: users.id,
      name: users.name,
      login: users.login,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.role, "student"), eq(users.classId, classId)))
    .orderBy(desc(users.createdAt));
}

export async function getClassLessons(classId: string) {
  if (isDemoDatabase()) {
    return getDemoClassLessons(classId);
  }

  const db = getDb();

  return db
    .select({
      id: lessons.id,
      title: lessons.title,
      date: lessons.date,
      startTime: lessons.startTime,
      checkInMinutes: lessons.checkInMinutes,
      createdAt: lessons.createdAt,
    })
    .from(lessons)
    .where(eq(lessons.classId, classId))
    .orderBy(desc(lessons.date), desc(lessons.startTime));
}

export async function getLessonById(id: string) {
  if (isDemoDatabase()) {
    return getDemoLessonById(id);
  }

  const db = getDb();
  const lessonRows = await db
    .select({
      id: lessons.id,
      classId: lessons.classId,
      className: classes.name,
      title: lessons.title,
      date: lessons.date,
      startTime: lessons.startTime,
      checkInMinutes: lessons.checkInMinutes,
      qrToken: lessons.qrToken,
      createdAt: lessons.createdAt,
    })
    .from(lessons)
    .innerJoin(classes, eq(lessons.classId, classes.id))
    .where(eq(lessons.id, id))
    .limit(1);

  return lessonRows[0] ?? null;
}

export async function getClassAttendanceMatrix(classId: string) {
  if (isDemoDatabase()) {
    return getDemoClassAttendanceMatrix(classId);
  }

  const db = getDb();
  const [students, classLessons, attendanceRows] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        login: users.login,
      })
      .from(users)
      .where(and(eq(users.role, "student"), eq(users.classId, classId)))
      .orderBy(asc(users.name), asc(users.login)),
    db
      .select({
        id: lessons.id,
        title: lessons.title,
        date: lessons.date,
        startTime: lessons.startTime,
        checkInMinutes: lessons.checkInMinutes,
      })
      .from(lessons)
      .where(eq(lessons.classId, classId))
      .orderBy(asc(lessons.date), asc(lessons.startTime)),
    db
      .select({
        lessonId: attendance.lessonId,
        studentId: attendance.studentId,
      })
      .from(attendance)
      .innerJoin(lessons, eq(attendance.lessonId, lessons.id))
      .where(eq(lessons.classId, classId)),
  ]);
  const attendanceKeys = new Set(
    attendanceRows.map((row) => `${row.studentId}:${row.lessonId}`),
  );

  return {
    students: students.map((student) => ({
      ...student,
      cells: classLessons.map((lesson) => ({
        lessonId: lesson.id,
        status: getAttendanceCellStatus(
          lesson,
          attendanceKeys.has(`${student.id}:${lesson.id}`),
        ),
      })),
    })),
    lessons: classLessons,
  } satisfies {
    students: Array<{
      id: string;
      name: string;
      login: string;
      cells: Array<{
        lessonId: string;
        status: AttendanceCellStatus;
      }>;
    }>;
    lessons: typeof classLessons;
  };
}

export async function getAdminStudentDetail(studentId: string) {
  if (isDemoDatabase()) {
    return getDemoAdminStudentDetail(studentId);
  }

  const db = getDb();
  const studentRows = await db
    .select({
      id: users.id,
      name: users.name,
      login: users.login,
      classId: users.classId,
      className: classes.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(classes, eq(users.classId, classes.id))
    .where(and(eq(users.id, studentId), eq(users.role, "student")))
    .limit(1);
  const student = studentRows[0] ?? null;

  if (!student) {
    return null;
  }

  if (!student.classId) {
    return {
      student,
      lessons: [],
      summary: { present: 0, absent: 0, pending: 0 },
    };
  }

  const [classLessons, attendanceRows] = await Promise.all([
    db
      .select({
        id: lessons.id,
        title: lessons.title,
        date: lessons.date,
        startTime: lessons.startTime,
        checkInMinutes: lessons.checkInMinutes,
        createdAt: lessons.createdAt,
      })
      .from(lessons)
      .where(eq(lessons.classId, student.classId))
      .orderBy(asc(lessons.date), asc(lessons.startTime)),
    db
      .select({
        lessonId: attendance.lessonId,
      })
      .from(attendance)
      .where(eq(attendance.studentId, student.id)),
  ]);
  const attendedLessonIds = new Set(attendanceRows.map((row) => row.lessonId));
  const lessonCards = classLessons.map((lesson) => ({
    ...lesson,
    status: getAttendanceCellStatus(lesson, attendedLessonIds.has(lesson.id)),
  }));
  const summary = summarizeAttendanceStatuses(lessonCards.map((lesson) => lesson.status));

  return {
    student,
    lessons: lessonCards,
    summary: {
      ...summary,
      pending: lessonCards.filter((lesson) => lesson.status === "pending").length,
    },
  };
}
