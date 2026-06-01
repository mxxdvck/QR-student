import { validateProductionEnv } from "../src/lib/production-env";

const errors = validateProductionEnv(process.env);

if (errors.length > 0) {
  console.error("Production env is not ready:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log("Production env looks ready for Vercel and PostgreSQL.");
}
