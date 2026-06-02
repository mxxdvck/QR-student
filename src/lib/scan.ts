import { getLessonCheckInStatus } from "./lessons";

type ScanLesson = {
  classId: string;
  date: string;
  startTime: string;
  checkInMinutes: number;
};

type ScanResult = "ready" | "wrong-class" | "not-started" | "closed" | "already-marked";

type ResolveScanResultInput = {
  lesson: ScanLesson;
  studentClassId: string | null;
  hasAttendance: boolean;
  now?: Date;
};

export function resolveScanResult({
  hasAttendance,
  lesson,
  now,
  studentClassId,
}: ResolveScanResultInput): ScanResult {
  if (studentClassId !== lesson.classId) {
    return "wrong-class";
  }

  const checkInStatus = getLessonCheckInStatus(lesson, now);

  if (checkInStatus !== "open") {
    return checkInStatus;
  }

  if (hasAttendance) {
    return "already-marked";
  }

  return "ready";
}
