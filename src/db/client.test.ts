import { afterEach, describe, expect, it } from "vitest";
import { isDemoDatabase } from "./client";

const originalDemoDatabase = process.env.DEMO_DATABASE;
const originalNodeEnv = process.env.NODE_ENV;

describe("database mode", () => {
  afterEach(() => {
    process.env.DEMO_DATABASE = originalDemoDatabase;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("allows demo storage only outside production", () => {
    process.env.DEMO_DATABASE = "1";
    process.env.NODE_ENV = "development";

    expect(isDemoDatabase()).toBe(true);

    process.env.NODE_ENV = "production";

    expect(isDemoDatabase()).toBe(false);
  });
});
