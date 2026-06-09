import { describe, expect, it } from "vitest";
import { parseProjectDateTime, projectTimeZone } from "./project-time";

describe("project time helpers", () => {
  it("uses Asia/Krasnoyarsk as the default project timezone", () => {
    expect(projectTimeZone).toBe("Asia/Krasnoyarsk");
  });

  it("parses local lesson time as project timezone time", () => {
    const originalTimezone = process.env.TZ;
    process.env.TZ = "UTC";

    try {
      expect(parseProjectDateTime("2026-06-02", "15:00").toISOString()).toBe(
        "2026-06-02T08:00:00.000Z",
      );
    } finally {
      if (originalTimezone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimezone;
      }
    }
  });

  it("allows PROJECT_TIME_ZONE to override the default timezone", () => {
    const originalProjectTimezone = process.env.PROJECT_TIME_ZONE;
    process.env.PROJECT_TIME_ZONE = "Europe/Moscow";

    try {
      expect(parseProjectDateTime("2026-06-02", "15:00").toISOString()).toBe(
        "2026-06-02T12:00:00.000Z",
      );
    } finally {
      if (originalProjectTimezone === undefined) {
        delete process.env.PROJECT_TIME_ZONE;
      } else {
        process.env.PROJECT_TIME_ZONE = originalProjectTimezone;
      }
    }
  });
});
