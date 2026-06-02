# Deployment Notes

## Production Target

Deploy the app to Vercel with an external PostgreSQL database from Supabase or
Neon through `DATABASE_URL`.

Production must not use the local demo store. `DEMO_DATABASE=1` is ignored when
`NODE_ENV=production`, and it should not be added to Vercel.

## Vercel Environment Variables

Add these variables in Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_APP_URL`: the Vercel app URL, for example `https://qr-attendance-system.vercel.app`.
- `SESSION_SECRET`: long random secret for signed auth cookies.
- `DATABASE_URL`: PostgreSQL connection string from Supabase or Neon, usually with `sslmode=require`.
- `SEED_OWNER_LOGIN`: initial owner login.
- `SEED_OWNER_PASSWORD`: initial owner password.

Do not add `DEMO_DATABASE` to Vercel.

Environment variable changes in Vercel require a new deployment before the
running Preview uses the updated values. After adding or changing Preview env
vars, redeploy the Preview deployment.

## Database Setup

Run these commands locally from the project folder with production env values
available in the shell:

```sh
npm install
npm run production:check
npm run db:push
npm run db:seed
npm run production:db-check
```

`npm run db:push` applies the Drizzle schema to the PostgreSQL database.
`npm run db:seed` creates one owner user if the login does not exist yet.
`npm run production:db-check` verifies that the required tables exist and the
seed owner is present.

The seed script requires `SEED_OWNER_LOGIN` and `SEED_OWNER_PASSWORD`; it does
not hardcode a production password.

Preview must be checked against PostgreSQL through `DATABASE_URL`, not the local
demo store. Keep `DEMO_DATABASE` unset in Vercel Preview and Production.

## Deploy Check

Before creating a test deploy:

```sh
npm run production:check
npm run lint
npm run test
npm run build
```

Then deploy the Vercel project. Suggested project name:
`qr-attendance-system`.

Do not show the Preview to the client until manual QA has passed on the Vercel
Preview URL with PostgreSQL data. At minimum, check owner login, admin creation,
class/student/lesson creation, QR check-in, duplicate prevention, attendance
table, student cabinet, lesson edit/delete, and logout/login behavior.

## Local Demo Mode

For local review only, `.env.local` may contain:

```sh
DEMO_DATABASE=1
SESSION_SECRET=local-demo-session-secret-change-before-production
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
SEED_OWNER_LOGIN=admin
SEED_OWNER_PASSWORD=admin123
```

Then run:

```sh
npm run demo:db
npm run dev
npm run smoke:mvp
```
