import { describe, expect, it } from "vitest";
import { buildStudentAttendanceCalendar } from "./student-attendance";

describe("student attendance calendar", () => {
  it("builds month days from lessons and summarizes statuses by day", () => {
    const calendar = buildStudentAttendanceCalendar([
      {
        id: "lesson-1",
        title: "Математика",
        date: "2026-06-02",
        startTime: "09:00",
        checkInMinutes: 15,
        status: "absent",
      },
      {
        id: "lesson-2",
        title: "Практика",
        date: "2026-06-02",
        startTime: "11:00",
        checkInMinutes: 15,
        status: "present",
      },
      {
        id: "lesson-3",
        title: "История",
        date: "2026-06-05",
        startTime: "10:00",
        checkInMinutes: 15,
        status: "pending",
      },
    ]);

    expect(calendar).toHaveLength(1);
    expect(calendar[0].monthKey).toBe("2026-06");
    expect(calendar[0].days).toHaveLength(30);

    const presentDay = calendar[0].days.find((day) => day.date === "2026-06-02");
    expect(presentDay?.summary).toBe("present");
    expect(presentDay?.lessons.map((lesson) => lesson.title)).toEqual([
      "Математика",
      "Практика",
    ]);

    const pendingDay = calendar[0].days.find((day) => day.date === "2026-06-05");
    expect(pendingDay?.summary).toBe("pending");

    const emptyDay = calendar[0].days.find((day) => day.date === "2026-06-01");
    expect(emptyDay?.summary).toBe("empty");
  });

  it("sorts lessons inside each calendar day by start time", () => {
    const calendar = buildStudentAttendanceCalendar([
      {
        id: "lesson-2",
        title: "Второе занятие",
        date: "2026-07-10",
        startTime: "12:00",
        checkInMinutes: 15,
        status: "present",
      },
      {
        id: "lesson-1",
        title: "Первое занятие",
        date: "2026-07-10",
        startTime: "09:00",
        checkInMinutes: 15,
        status: "present",
      },
    ]);

    const day = calendar[0].days.find((item) => item.date === "2026-07-10");
    expect(day?.lessons.map((lesson) => lesson.title)).toEqual([
      "Первое занятие",
      "Второе занятие",
    ]);
  });
});
