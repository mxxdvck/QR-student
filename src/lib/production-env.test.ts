import { describe, expect, it } from "vitest";
import { validateProductionEnv } from "./production-env";

describe("production environment validation", () => {
  it("accepts a complete Vercel PostgreSQL environment", () => {
    expect(
      validateProductionEnv({
        NEXT_PUBLIC_APP_URL: "https://qr-attendance-system.vercel.app",
        SESSION_SECRET: "1234567890abcdef1234567890abcdef",
        DATABASE_URL: "postgresql://user:password@host:5432/database?sslmode=require",
        SEED_OWNER_LOGIN: "owner",
        SEED_OWNER_PASSWORD: "secure-owner-password",
      }),
    ).toEqual([]);
  });

  it("rejects demo mode and unsafe placeholders for production", () => {
    expect(
      validateProductionEnv({
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        SESSION_SECRET: "local-demo-session-secret-change-before-production",
        DATABASE_URL: "",
        SEED_OWNER_LOGIN: "",
        SEED_OWNER_PASSWORD: "admin123",
        DEMO_DATABASE: "1",
      }),
    ).toEqual([
      "NEXT_PUBLIC_APP_URL must be an https URL for the deployed Vercel app.",
      "SESSION_SECRET must be a unique production secret, at least 32 characters.",
      "DATABASE_URL is required and must start with postgres:// or postgresql://.",
      "SEED_OWNER_LOGIN is required for the initial owner.",
      "SEED_OWNER_PASSWORD must be a non-default password with at least 8 characters.",
      "DEMO_DATABASE must not be set for production.",
    ]);
  });

  it("keeps legacy admin seed env valid for existing deployments", () => {
    expect(
      validateProductionEnv({
        NEXT_PUBLIC_APP_URL: "https://qr-attendance-system.vercel.app",
        SESSION_SECRET: "1234567890abcdef1234567890abcdef",
        DATABASE_URL: "postgresql://user:password@host:5432/database?sslmode=require",
        SEED_ADMIN_LOGIN: "admin",
        SEED_ADMIN_PASSWORD: "secure-admin-password",
      }),
    ).toEqual([]);
  });
});
