# Deployment Guide

This guide describes deployment setup for QR Student. It is public project documentation and intentionally avoids real credentials, private URLs, tokens, and secrets.

QR Student is an early active OSS project. Review and configure it before real-world use, especially around auth, roles, QR tokens, duplicate scans, attendance records, direct API calls, and server-side checks.

## Deployment Environment

The app can be deployed on Vercel with an external PostgreSQL database. The database may come from Supabase, Neon, or another provider that gives a PostgreSQL connection string through `DATABASE_URL`.

Do not use the local demo database mode for deployment. Do not set `DEMO_DATABASE` in a deployed environment.

## Environment Variables

Configure these values in the deployment environment:

- `NEXT_PUBLIC_APP_URL` - public app URL for the deployed instance.
- `PROJECT_TIME_ZONE` - project lesson timezone. For the current MSK+4 client, use `Asia/Krasnoyarsk`.
- `SESSION_SECRET` - long random secret for user sessions.
- `DATABASE_URL` - PostgreSQL connection string, usually with TLS enabled.
- `SEED_OWNER_LOGIN` - initial owner login used during seeding.
- `SEED_OWNER_PASSWORD` - initial owner password used during seeding.

After changing environment variables, start a new deployment so the app receives the updated values.

Do not commit real environment values, passwords, tokens, database URLs, or deployment URLs to public docs.

## Database Setup

Run these commands locally from the project folder after deployment environment variables are available in the terminal:

```sh
npm install
npm run production:check
npm run db:push
npm run db:seed
npm run production:db-check
```

What the commands do:

- `npm run production:check` verifies that deployment settings are present.
- `npm run db:push` applies the table structure to PostgreSQL.
- `npm run db:seed` creates the owner if the owner does not already exist.
- `npm run production:db-check` checks the database tables and owner record.

Owner creation requires `SEED_OWNER_LOGIN` and `SEED_OWNER_PASSWORD`. Real logins and passwords must stay out of commits and public documents.

## Lesson Timezone

The project lesson timezone is `Asia/Krasnoyarsk`. Set this in deployment:

```sh
PROJECT_TIME_ZONE=Asia/Krasnoyarsk
```

Existing lessons that were entered as Moscow time must be shifted once by +4 hours:

```sh
npm run lessons:shift-msk4
```

The command is a dry run by default. To apply the shift to PostgreSQL, set `APPLY_LESSON_TIME_SHIFT=1` for one run.

## Replace Owner Access

If the owner already exists and the login or password must be changed, set new `SEED_OWNER_LOGIN` and `SEED_OWNER_PASSWORD` values in the environment, then run:

```sh
npm run owner:update-credentials
```

If the database has more than one owner, also set `OWNER_CURRENT_LOGIN` so the command updates the correct account.

The command updates access only. It does not create a new owner and does not print the password.

## Checks Before Deployment

Before deploying or reviewing deployment readiness, run:

```sh
npm run production:check
npm run lint
npm test
npm run build
```

After deployment, manually verify the main workflow on the deployed app:

1. Owner sign-in.
2. Admin creation.
3. Class creation.
4. Student creation.
5. Lesson creation.
6. QR code display.
7. Student check-in.
8. Duplicate check-in protection.
9. Attendance table.
10. Student dashboard.
11. Lesson edit and delete.
12. Sign-out and sign-in.

## Local Verification

For local verification, use `.env.local` with local-only placeholder values. Do not copy real deployment secrets into examples or public docs.

Required local values:

- `DEMO_DATABASE`
- `SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `PROJECT_TIME_ZONE`
- `SEED_OWNER_LOGIN`
- `SEED_OWNER_PASSWORD`

Then run:

```sh
npm run demo:db
npm run dev
npm run smoke:mvp
```
