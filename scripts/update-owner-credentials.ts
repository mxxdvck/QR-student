import { and, eq } from "drizzle-orm";
import { closeDb, getDb } from "../src/db/client";
import { users } from "../src/db/schema";
import { createPasswordHash } from "../src/lib/password";

async function main() {
  try {
    const currentLogin = process.env.OWNER_CURRENT_LOGIN?.trim();
    const nextLogin = process.env.SEED_OWNER_LOGIN?.trim();
    const nextPassword = process.env.SEED_OWNER_PASSWORD;

    if (!nextLogin) {
      throw new Error("SEED_OWNER_LOGIN is required.");
    }

    if (!nextPassword || nextPassword.length < 12) {
      throw new Error("SEED_OWNER_PASSWORD is required and must be at least 12 characters.");
    }

    const db = getDb();
    const owner = currentLogin
      ? await findOwnerByLogin(currentLogin)
      : await findSingleOwner();

    if (!owner) {
      throw new Error("Owner user was not found. This script updates an existing owner only.");
    }

    await db
      .update(users)
      .set({
        login: nextLogin,
        passwordHash: createPasswordHash(nextPassword),
      })
      .where(and(eq(users.id, owner.id), eq(users.role, "owner")));

    console.log("Owner credentials updated.");
  } finally {
    await closeDb();
  }
}

async function findOwnerByLogin(login: string) {
  const db = getDb();
  const [owner] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.role, "owner"), eq(users.login, login)))
    .limit(1);

  if (!owner) {
    throw new Error("Owner user with OWNER_CURRENT_LOGIN was not found.");
  }

  return owner;
}

async function findSingleOwner() {
  const db = getDb();
  const owners = await db.select({ id: users.id }).from(users).where(eq(users.role, "owner"));

  if (owners.length === 0) {
    throw new Error("Owner user was not found. Run the seed first.");
  }

  if (owners.length > 1) {
    throw new Error("Multiple owners found. Set OWNER_CURRENT_LOGIN to choose which owner to update.");
  }

  return owners[0];
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
