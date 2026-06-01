export function normalizeClassName(value: string): string {
  const name = value.trim().replace(/\s+/g, " ");

  if (!name) {
    throw new Error("Class name is required");
  }

  return name;
}
