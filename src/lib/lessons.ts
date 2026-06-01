import { randomBytes } from "node:crypto";

type LessonInput = {
  title: string;
  date: string;
  startTime: string;
  checkInMinutes: string;
};

type NormalizedLessonInput = {
  title: string;
  date: string;
  startTime: string;
  checkInMinutes: number;
};

type LessonWindow = {
  date: string;
  startTime: string;
  checkInMinutes: number;
};

type LessonCheckInStatus = "open" | "closed";
export type AttendanceCellStatus = "present" | "absent" | "pending";

export function normalizeLessonInput(input: LessonInput): NormalizedLessonInput {
  const title = input.title.trim().replace(/\s+/g, " ");
  const date = input.date.trim();
  const startTime = input.startTime.trim();
  const checkInMinutes = input.checkInMinutes.trim()
    ? Number(input.checkInMinutes)
    : 15;

  if (!title) {
    throw new Error("Lesson title is required");
  }

  if (!isValidDateInput(date)) {
    throw new Error("Lesson date must use YYYY-MM-DD format");
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
    throw new Error("Lesson start time must use HH:MM format");
  }

  if (!Number.isInteger(checkInMinutes) || checkInMinutes <= 0) {
    throw new Error("Check-in window must be a positive whole number");
  }

  return {
    title,
    date,
    startTime,
    checkInMinutes,
  };
}

export function createQrToken(): string {
  return randomBytes(24).toString("base64url");
}

export function buildScanUrl(origin: string, qrToken: string): string {
  const path = `/scan/${encodeURIComponent(qrToken)}`;
  const normalizedOrigin = origin.trim().replace(/\/+$/, "");

  return normalizedOrigin ? `${normalizedOrigin}${path}` : path;
}

export function getLessonCheckInStatus(
  lesson: LessonWindow,
  now = new Date(),
): LessonCheckInStatus {
  const startsAt = parseLessonStart(lesson.date, lesson.startTime);
  const closesAt = new Date(startsAt.getTime() + lesson.checkInMinutes * 60_000);

  return now >= startsAt && now <= closesAt ? "open" : "closed";
}

export function getAttendanceCellStatus(
  lesson: LessonWindow,
  hasAttendance: boolean,
  now = new Date(),
): AttendanceCellStatus {
  if (hasAttendance) {
    return "present";
  }

  const startsAt = parseLessonStart(lesson.date, lesson.startTime);
  const closesAt = new Date(startsAt.getTime() + lesson.checkInMinutes * 60_000);

  return now > closesAt ? "absent" : "pending";
}

export function summarizeAttendanceStatuses(statuses: AttendanceCellStatus[]) {
  return statuses.reduce(
    (summary, status) => {
      if (status === "present") {
        summary.present += 1;
      }

      if (status === "absent") {
        summary.absent += 1;
      }

      return summary;
    },
    { present: 0, absent: 0 },
  );
}

function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function parseLessonStart(date: string, startTime: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = startTime.slice(0, 5).split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}
