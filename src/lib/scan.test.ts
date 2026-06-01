import { describe, expect, it } from "vitest";
import { resolveScanResult } from "./scan";

const lesson = {
  classId: "class-1",
  date: "2026-06-02",
  startTime: "09:30",
  checkInMinutes: 15,
};

describe("scan result resolver", () => {
  it("accepts a student from the lesson class during the open window", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date(2026, 5, 2, 9, 35),
      }),
    ).toBe("ready");
  });

  it("rejects students from another class", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-2",
        hasAttendance: false,
        now: new Date(2026, 5, 2, 9, 35),
      }),
    ).toBe("wrong-class");
  });

  it("rejects scans after the check-in window closes", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: false,
        now: new Date(2026, 5, 2, 9, 46),
      }),
    ).toBe("closed");
  });

  it("reports an existing attendance record before creating another one", () => {
    expect(
      resolveScanResult({
        lesson,
        studentClassId: "class-1",
        hasAttendance: true,
        now: new Date(2026, 5, 2, 9, 35),
      }),
    ).toBe("already-marked");
  });
});
