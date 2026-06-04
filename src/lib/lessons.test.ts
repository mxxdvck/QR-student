import { describe, expect, it } from "vitest";
import {
  buildScanUrl,
  createQrToken,
  getAttendanceCellStatus,
  getLessonCheckInStatus,
  normalizeManualAttendanceMode,
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

  it("marks a lesson check-in as not-started, open, or closed by the configured window", () => {
    const lesson = {
      date: "2026-06-02",
      startTime: "09:30",
      checkInMinutes: 15,
    };

    expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T06:29:00.000Z"))).toBe(
      "not-started",
    );
    expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T06:30:00.000Z"))).toBe(
      "open",
    );
    expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T06:35:00.000Z"))).toBe(
      "open",
    );
    expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T06:45:00.000Z"))).toBe(
      "open",
    );
    expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T06:46:00.000Z"))).toBe(
      "closed",
    );
  });

  it("uses Europe/Moscow project time instead of the server default timezone", () => {
    const originalTimezone = process.env.TZ;
    process.env.TZ = "UTC";

    try {
      const lesson = {
        date: "2026-06-02",
        startTime: "15:00",
        checkInMinutes: 15,
      };

      expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T11:59:59.999Z"))).toBe(
        "not-started",
      );
      expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T12:00:00.000Z"))).toBe(
        "open",
      );
      expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T12:10:00.000Z"))).toBe(
        "open",
      );
      expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T12:15:00.000Z"))).toBe(
        "open",
      );
      expect(getLessonCheckInStatus(lesson, new Date("2026-06-02T12:15:00.001Z"))).toBe(
        "closed",
      );
    } finally {
      if (originalTimezone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimezone;
      }
    }
  });

  it("maps attendance cells to present, absent, or pending", () => {
    const lesson = {
      date: "2026-06-02",
      startTime: "09:30",
      checkInMinutes: 15,
    };

    expect(
      getAttendanceCellStatus(lesson, true, new Date("2026-06-02T06:35:00.000Z")),
    ).toBe("present");
    expect(
      getAttendanceCellStatus(lesson, false, new Date("2026-06-02T06:45:00.000Z")),
    ).toBe("pending");
    expect(
      getAttendanceCellStatus(lesson, false, new Date("2026-06-02T06:46:00.000Z")),
    ).toBe("absent");
  });

  it("summarizes only present and absent attendance statuses", () => {
    expect(
      summarizeAttendanceStatuses(["present", "pending", "absent", "present"]),
    ).toEqual({
      present: 2,
      absent: 1,
    });
  });

  it("normalizes manual attendance modes", () => {
    expect(normalizeManualAttendanceMode("present")).toBe("present");
    expect(normalizeManualAttendanceMode("absent")).toBe("absent");
    expect(() => normalizeManualAttendanceMode("late")).toThrow(
      "Manual attendance mode is invalid",
    );
  });
});
