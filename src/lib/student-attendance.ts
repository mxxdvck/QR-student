import type { AttendanceCellStatus } from "@/lib/lessons";

export type StudentAttendanceCalendarLesson = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  checkInMinutes: number;
  status: AttendanceCellStatus;
};

export type StudentAttendanceCalendarDaySummary = AttendanceCellStatus | "empty";

export type StudentAttendanceCalendarDay = {
  date: string;
  day: number;
  weekday: string;
  lessons: StudentAttendanceCalendarLesson[];
  summary: StudentAttendanceCalendarDaySummary;
};

export type StudentAttendanceCalendarMonth = {
  monthKey: string;
  title: string;
  days: StudentAttendanceCalendarDay[];
};

export function buildStudentAttendanceCalendar(
  lessons: StudentAttendanceCalendarLesson[],
): StudentAttendanceCalendarMonth[] {
  const monthKeys = [
    ...new Set(lessons.map((lesson) => lesson.date.slice(0, 7))),
  ].sort();

  return monthKeys.map((monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const lessonsByDate = groupLessonsByDate(
      lessons.filter((lesson) => lesson.date.startsWith(monthKey)),
    );

    return {
      monthKey,
      title: new Date(year, month - 1, 1).toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric",
      }),
      days: Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        const date = formatDateKey(year, month, day);
        const dayLessons = lessonsByDate.get(date) ?? [];

        return {
          date,
          day,
          weekday: new Date(year, month - 1, day).toLocaleDateString("ru-RU", {
            weekday: "short",
          }),
          lessons: dayLessons,
          summary: getDaySummary(dayLessons),
        };
      }),
    };
  });
}

function groupLessonsByDate(lessons: StudentAttendanceCalendarLesson[]) {
  const grouped = new Map<string, StudentAttendanceCalendarLesson[]>();

  for (const lesson of lessons) {
    const dayLessons = grouped.get(lesson.date) ?? [];
    dayLessons.push(lesson);
    grouped.set(
      lesson.date,
      dayLessons.toSorted((a, b) => a.startTime.localeCompare(b.startTime)),
    );
  }

  return grouped;
}

function getDaySummary(
  lessons: StudentAttendanceCalendarLesson[],
): StudentAttendanceCalendarDaySummary {
  if (lessons.length === 0) {
    return "empty";
  }

  if (lessons.some((lesson) => lesson.status === "present")) {
    return "present";
  }

  if (lessons.some((lesson) => lesson.status === "absent")) {
    return "absent";
  }

  return "pending";
}

function formatDateKey(year: number, month: number, day: number) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}
