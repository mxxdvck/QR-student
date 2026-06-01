import "server-only";

import { asc, eq } from "drizzle-orm";
import { getDb, isDemoDatabase } from "@/db/client";
import { attendance, classes, lessons, users } from "@/db/schema";
import { getDemoStudentAttendanceOverview } from "@/lib/demo-store";
import {
  getAttendanceCellStatus,
  summarizeAttendanceStatuses,
  type AttendanceCellStatus,
} from "@/lib/lessons";

export async function getStudentAttendanceOverview(studentId: string) {
  if (isDemoDatabase()) {
    return getDemoStudentAttendanceOverview(studentId);
  }

  const db = getDb();
  const studentRows = await db
    .select({
      id: users.id,
      name: users.name,
      classId: users.classId,
      className: classes.name,
    })
    .from(users)
    .leftJoin(classes, eq(users.classId, classes.id))
    .where(eq(users.id, studentId))
    .limit(1);
  const student = studentRows[0] ?? null;

  if (!student || !student.classId) {
    return {
      student: student
        ? { id: student.id, name: student.name, className: student.className }
        : null,
      lessons: [],
      summary: { present: 0, absent: 0 },
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

  return {
    student: {
      id: student.id,
      name: student.name,
      className: student.className,
    },
    lessons: lessonCards,
    summary: summarizeAttendanceStatuses(
      lessonCards.map((lesson) => lesson.status as AttendanceCellStatus),
    ),
  };
}
