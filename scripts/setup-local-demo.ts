import { ensureDemoStore } from "../src/lib/demo-store";
import { getSeedOwnerCredentials } from "../src/lib/production-env";

const ownerCredentials = getSeedOwnerCredentials(process.env);
const ownerLogin = ownerCredentials.login || "admin";

ensureDemoStore()
  .then(() => {
    console.log(`Local demo store is ready. Owner login: ${ownerLogin}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
