import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzlePostgres<typeof schema>>;

let client: postgres.Sql | null = null;
let db: Db | null = null;

export function isDemoDatabase(): boolean {
  return process.env.DEMO_DATABASE === "1" && process.env.NODE_ENV !== "production";
}

export function getDb(): Db {
  if (isDemoDatabase()) {
    throw new Error("DEMO_DATABASE uses the local demo store, not the PostgreSQL client.");
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to use PostgreSQL. Local demo storage is available only outside production with DEMO_DATABASE=1.",
    );
  }

  if (!client) {
    client = postgres(databaseUrl, { max: 1 });
    db = drizzlePostgres(client, { schema });
  }

  return db!;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.end();
    client = null;
    db = null;
  }
}
