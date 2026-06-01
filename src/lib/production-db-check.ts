export const requiredProductionTables = [
  "users",
  "classes",
  "lessons",
  "attendance",
] as const;

type ProductionDbSnapshot = {
  tables: Partial<Record<(typeof requiredProductionTables)[number], boolean>>;
  hasOwner: boolean;
};

export function validateProductionDbSnapshot(snapshot: ProductionDbSnapshot): string[] {
  const errors: string[] = [];

  for (const table of requiredProductionTables) {
    if (!snapshot.tables[table]) {
      errors.push(`Missing PostgreSQL table: ${table}.`);
    }
  }

  if (!snapshot.hasOwner) {
    errors.push(
      "Seed owner was not found. Run npm run db:seed with SEED_OWNER_LOGIN and SEED_OWNER_PASSWORD.",
    );
  }

  return errors;
}
