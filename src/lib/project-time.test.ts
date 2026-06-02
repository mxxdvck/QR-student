import { describe, expect, it } from "vitest";
import { parseProjectDateTime, projectTimeZone } from "./project-time";

describe("project time helpers", () => {
  it("fixes the project timezone to Europe/Moscow", () => {
    expect(projectTimeZone).toBe("Europe/Moscow");
  });

  it("parses local lesson time as project timezone time", () => {
    const originalTimezone = process.env.TZ;
    process.env.TZ = "UTC";

    try {
      expect(parseProjectDateTime("2026-06-02", "15:00").toISOString()).toBe(
        "2026-06-02T12:00:00.000Z",
      );
    } finally {
      if (originalTimezone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimezone;
      }
    }
  });
});
