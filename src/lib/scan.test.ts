import { describe, expect, it } from "vitest";
import { resolveScanResult } from "./scan";

const lesson = {
  classId: "class-1",
  date: "2026-06-02",
  startTime: "09:30",
  checkInMinutes: 15,
};

describe("scan result resolver", () => {
  it("uses project timezone when resolving a scan window", () => {
    const originalTimezone = process.env.TZ;
    process.env.TZ = "UTC";

    try {
      const moscowLesson = {
        ...lesson,
        startTime: "15:00",
      };

      expect(
        resolveScanResult({
          lesson: moscowLesson,
          studentClassId: "class-1",
          hasAttendance: false,
          now: new Date("2026-06-02T07:59:59.999Z"),
        }),
      ).toBe("not-started");
      expect(
        resolveScanResult({
          lesson: moscowLesson,
          studentClassId: "class-1",
          hasAttendance: false,
          now: new Date("2026-06-02T08:00:00.000Z"),
        }),
      ).toBe("ready");
      expect(
        resolveScanResult({
          lesson: moscowLesson,
          studentClassId: "class-1",
          hasAttendance: false,
          now: new Date("2026-06-02T08:15:00.001Z"),
        }),
      ).toBe("closed");
    } finally {
      if (originalTimezone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimezone;
      }
    }
  });

  it("rejects scans before the check-in window starts", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date("2026-06-02T02:29:00.000Z"),
      }),
    ).toBe("not-started");
  });

  it("accepts a student from the lesson class at the start of the open window", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date("2026-06-02T02:30:00.000Z"),
      }),
    ).toBe("ready");
  });

  it("accepts a student from the lesson class inside the open window", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date("2026-06-02T02:35:00.000Z"),
      }),
    ).toBe("ready");
  });

  it("rejects students from another class", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-2",
        hasAttendance: false,
        now: new Date("2026-06-02T02:35:00.000Z"),
      }),
    ).toBe("wrong-class");
  });

  it("accepts scans at the exact check-in close time", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date("2026-06-02T02:45:00.000Z"),
      }),
    ).toBe("ready");
  });

  it("rejects scans after the check-in window closes", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date("2026-06-02T02:46:00.000Z"),
      }),
    ).toBe("closed");
  });

  it("reports an existing attendance record before creating another one", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: true,
        now: new Date("2026-06-02T02:35:00.000Z"),
      }),
    ).toBe("already-marked");
  });
});
