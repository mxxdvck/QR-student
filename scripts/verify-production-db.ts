import postgres from "postgres";
import {
  requiredProductionTables,
  validateProductionDbSnapshot,
} from "../src/lib/production-db-check";
import { getSeedOwnerCredentials, validateProductionEnv } from "../src/lib/production-env";

async function verifyProductionDb() {
  const envErrors = validateProductionEnv(process.env);

  if (envErrors.length > 0) {
    return fail("Production env is not ready:", envErrors);
  }

  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

  try {
    const tables: Record<string, boolean> = {};

    for (const table of requiredProductionTables) {
      const [row] = await sql<{ exists: boolean }[]>`
        select to_regclass(${`public.${table}`}) is not null as "exists"
      `;
      tables[table] = Boolean(row?.exists);
    }

    let hasOwner = false;

    if (requiredProductionTables.every((table) => tables[table])) {
      const ownerCredentials = getSeedOwnerCredentials(process.env);
      const [row] = await sql<{ count: string }[]>`
        select count(*)::text as count
        from users
        where login = ${ownerCredentials.login}
          and role = 'owner'
      `;
      hasOwner = Number(row?.count ?? 0) > 0;
    }

    const dbErrors = validateProductionDbSnapshot({ tables, hasOwner });

    if (dbErrors.length > 0) {
      return fail("Production database is not ready:", dbErrors);
    }

    console.log("Production database looks ready.");
  } finally {
    await sql.end();
  }
}

function fail(title: string, errors: string[]) {
  console.error(title);

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
}

verifyProductionDb().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
