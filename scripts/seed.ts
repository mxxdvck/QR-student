import { eq } from "drizzle-orm";
import { closeDb, getDb } from "../src/db/client";
import { users } from "../src/db/schema";
import { createDatabaseId } from "../src/lib/database-id";
import { createPasswordHash } from "../src/lib/password";
import { getSeedOwnerCredentials } from "../src/lib/production-env";

const ownerCredentials = getSeedOwnerCredentials(process.env);

async function seed() {
  if (!ownerCredentials.login || !ownerCredentials.password) {
    throw new Error("SEED_OWNER_LOGIN and SEED_OWNER_PASSWORD are required to seed owner access.");
  }

  const db = getDb();
  const existingOwner = await db.query.users.findFirst({
    where: eq(users.login, ownerCredentials.login),
  });

  if (existingOwner) {
    if (existingOwner.role !== "owner") {
      await db
        .update(users)
        .set({ role: "owner", classId: null })
        .where(eq(users.id, existingOwner.id));
      console.log(`Promoted "${ownerCredentials.login}" to owner`);
      return;
    }

    console.log(`Owner "${ownerCredentials.login}" already exists`);
    return;
  }

  await db.insert(users).values({
    id: createDatabaseId(),
    name: "Owner",
    login: ownerCredentials.login,
    passwordHash: createPasswordHash(ownerCredentials.password),
    role: "owner",
  });

  console.log(`Created owner "${ownerCredentials.login}"`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
