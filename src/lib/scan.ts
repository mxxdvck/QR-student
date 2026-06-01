import { getLessonCheckInStatus } from "./lessons";

type ScanLesson = {
  classId: string;
  date: string;
  startTime: string;
  checkInMinutes: number;
};

type ScanResult = "ready" | "wrong-class" | "closed" | "already-marked";

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

  if (getLessonCheckInStatus(lesson, now) === "closed") {
    return "closed";
  }

  if (hasAttendance) {
    return "already-marked";
  }

  return "ready";
}
