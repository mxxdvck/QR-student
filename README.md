# QR Student Attendance

Compact web system for student attendance by QR code.

The MVP target is simple: an admin creates classes, students, and lessons, shows a lesson QR code, and students mark attendance from their phones during the allowed time window.

## Getting Started

Install dependencies and run the local demo server:

```sh
npm install
npm run demo:db
npm run dev
```

Open `http://localhost:3000`.

Local demo owner:

- Login: `admin`
- Password: `admin123`

## Checks

```sh
npm run lint
npm test
npm run build
npm run smoke:mvp
```

## Database

Production uses Drizzle with external PostgreSQL through `DATABASE_URL`.

```sh
npm run production:check
npm run db:push
npm run db:seed
npm run production:db-check
```

`db:push` applies the schema. `db:seed` creates one owner user. Configure
credentials through `SEED_OWNER_LOGIN` and `SEED_OWNER_PASSWORD`; the seed
script does not hardcode a production password.

Do not commit real logins or passwords. For Vercel env, use a normal owner login
and a long generated password. If an existing owner needs new credentials after
seed, set `SEED_OWNER_LOGIN` and `SEED_OWNER_PASSWORD` and run:

```sh
npm run owner:update-credentials
```

If the database has multiple owners, also set `OWNER_CURRENT_LOGIN`.

`production:db-check` verifies the production tables and seeded owner.

For Vercel production setup, see `DEPLOYMENT.md`.

## Documents

- `PRD.md`: product scope and success criteria.
- `PROJECT_MEMORY.md`: current decisions and constraints.
- `ROADMAP.md`: planned phases.
- `DELIVERY_PLAN.md`: next delivery slices.
- `.env.example`: required environment variables.

## Current Status

The MVP is implemented: auth, classes, students, lessons, QR check-in,
attendance table, student cabinet, and deployment preparation are in place.
