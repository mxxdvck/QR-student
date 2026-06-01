import { describe, expect, it } from "vitest";
import {
  buildScanUrl,
  createQrToken,
  getAttendanceCellStatus,
  getLessonCheckInStatus,
  normalizeLessonInput,
  summarizeAttendanceStatuses,
} from "./lessons";

describe("lesson helpers", () => {
  it("normalizes lesson fields and uses a 15 minute default window", () => {
    expect(
      normalizeLessonInput({
        title: "  Math   practice ",
        date: "2026-06-02",
        startTime: "09:30",
        checkInMinutes: "",
      }),
    ).toEqual({
      title: "Math practice",
      date: "2026-06-02",
      startTime: "09:30",
      checkInMinutes: 15,
    });
  });

  it("rejects invalid lesson date and start time", () => {
    expect(() =>
      normalizeLessonInput({
        title: "Math",
        date: "02.06.2026",
        startTime: "9:30",
        checkInMinutes: "15",
      }),
    ).toThrow("Lesson date must use YYYY-MM-DD format");
  });

  it("requires a positive whole number check-in window", () => {
    expect(() =>
      normalizeLessonInput({
        title: "Math",
        date: "2026-06-02",
        startTime: "09:30",
        checkInMinutes: "0",
      }),
    ).toThrow("Check-in window must be a positive whole number");
  });

  it("creates url-safe qr tokens", () => {
    const token = createQrToken();

    expect(token).toMatch(/^[A-Za-z0-9_-]{32}$/);
  });

  it("builds a public scan url from an app origin and token", () => {
    expect(buildScanUrl("https://school.example", "abc_123")).toBe(
      "https://school.example/scan/abc_123",
    );
  });

  it("marks a lesson check-in open only inside the configured window", () => {
    const lesson = {
      date: "2026-06-02",
      startTime: "09:30",
      checkInMinutes: 15,
    };

    expect(getLessonCheckInStatus(lesson, new Date(2026, 5, 2, 9, 29))).toBe("closed");
    expect(getLessonCheckInStatus(lesson, new Date(2026, 5, 2, 9, 30))).toBe("open");
    expect(getLessonCheckInStatus(lesson, new Date(2026, 5, 2, 9, 45))).toBe("open");
    expect(getLessonCheckInStatus(lesson, new Date(2026, 5, 2, 9, 46))).toBe("closed");
  });

  it("maps attendance cells to present, absent, or pending", () => {
    const lesson = {
      date: "2026-06-02",
      startTime: "09:30",
      checkInMinutes: 15,
    };

    expect(getAttendanceCellStatus(lesson, true, new Date(2026, 5, 2, 9, 35))).toBe(
      "present",
    );
    expect(getAttendanceCellStatus(lesson, false, new Date(2026, 5, 2, 9, 45))).toBe(
      "pending",
    );
    expect(getAttendanceCellStatus(lesson, false, new Date(2026, 5, 2, 9, 46))).toBe(
      "absent",
    );
  });

  it("summarizes only present and absent attendance statuses", () => {
    expect(
      summarizeAttendanceStatuses(["present", "pending", "absent", "present"]),
    ).toEqual({
      present: 2,
      absent: 1,
    });
  });
});
