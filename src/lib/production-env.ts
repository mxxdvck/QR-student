type ProductionEnv = Partial<Record<string, string>>;

const unsafeSessionSecrets = new Set([
  "replace-with-a-long-random-secret",
  "local-demo-session-secret-change-before-production",
]);

const unsafeAdminPasswords = new Set([
  "admin123",
  "password",
  "replace-with-initial-admin-password",
  "replace-with-initial-owner-password",
]);

export function validateProductionEnv(env: ProductionEnv): string[] {
  const errors: string[] = [];
  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "";
  const sessionSecret = env.SESSION_SECRET ?? "";
  const databaseUrl = env.DATABASE_URL ?? "";
  const ownerCredentials = getSeedOwnerCredentials(env);

  if (!isHttpsUrl(appUrl)) {
    errors.push("NEXT_PUBLIC_APP_URL must be an https URL for the deployed Vercel app.");
  }

  if (sessionSecret.length < 32 || unsafeSessionSecrets.has(sessionSecret)) {
    errors.push("SESSION_SECRET must be a unique production secret, at least 32 characters.");
  }

  if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
    errors.push("DATABASE_URL is required and must start with postgres:// or postgresql://.");
  }

  if (!ownerCredentials.login) {
    errors.push("SEED_OWNER_LOGIN is required for the initial owner.");
  }

  if (
    ownerCredentials.password.length < 8 ||
    unsafeAdminPasswords.has(ownerCredentials.password)
  ) {
    errors.push("SEED_OWNER_PASSWORD must be a non-default password with at least 8 characters.");
  }

  if (env.DEMO_DATABASE) {
    errors.push("DEMO_DATABASE must not be set for production.");
  }

  return errors;
}

export function getSeedOwnerCredentials(env: ProductionEnv) {
  return {
    login: env.SEED_OWNER_LOGIN ?? env.SEED_ADMIN_LOGIN ?? "",
    password: env.SEED_OWNER_PASSWORD ?? env.SEED_ADMIN_PASSWORD ?? "",
  };
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
