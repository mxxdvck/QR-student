import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const keyLength = 64;
const scryptCost = 16384;

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, keyLength, { N: scryptCost }).toString("hex");

  return `scrypt$${scryptCost}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [algorithm, cost, salt, hash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !cost || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length, {
    N: Number(cost),
  });

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
