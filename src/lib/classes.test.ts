import { describe, expect, it } from "vitest";
import { normalizeClassName } from "./classes";

describe("class helpers", () => {
  it("normalizes a class name before saving", () => {
    expect(normalizeClassName("  Group   A-101  ")).toBe("Group A-101");
  });

  it("rejects an empty class name", () => {
    expect(() => normalizeClassName("   ")).toThrow("Class name is required");
  });
});
