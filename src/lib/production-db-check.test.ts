import { describe, expect, it } from "vitest";
import { requiredProductionTables, validateProductionDbSnapshot } from "./production-db-check";

describe("production database validation", () => {
  it("accepts a database with all required tables and seeded owner", () => {
    const tables = Object.fromEntries(
      requiredProductionTables.map((table) => [table, true]),
    );

    expect(validateProductionDbSnapshot({ tables, hasOwner: true })).toEqual([]);
  });

  it("reports missing tables and missing owner seed", () => {
    expect(
      validateProductionDbSnapshot({
        tables: {
          users: true,
          classes: false,
          lessons: true,
          attendance: false,
        },
        hasOwner: false,
      }),
    ).toEqual([
      "Missing PostgreSQL table: classes.",
      "Missing PostgreSQL table: attendance.",
      "Seed owner was not found. Run npm run db:seed with SEED_OWNER_LOGIN and SEED_OWNER_PASSWORD.",
    ]);
  });
});
