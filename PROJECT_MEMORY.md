# Project Memory

## Current State

- Project initialized as a Next.js App Router application.
- Stack target: Next.js, TypeScript, Tailwind, PostgreSQL, Vercel.
- Database provider is not fixed yet. Supabase or Neon are both acceptable if they expose PostgreSQL through `DATABASE_URL`.
- ORM choice: Drizzle with the `postgres` driver. The schema lives in `src/db/schema.ts`, and the app database client is initialized lazily in `src/db/client.ts`.
- Auth uses a single `users` table for owners, admins, and students. Login is by `login` + password hash, and session state is stored in an httpOnly signed cookie.
- Base UI layer exists under `src/components/ui`, and protected admin/student routes share `src/components/layout/app-shell.tsx`.
- Admin classes section exists at `/admin/classes`, with class creation and detail pages at `/admin/classes/[id]`.
- Class detail pages include basic user creation: owners can add admins or students, admins can add students, and students are stored with hashed passwords plus class binding.
- Class detail pages include basic lesson management: list, create lesson with a 15-minute default check-in window, and open `/admin/lessons/[id]`.
- Student QR scan route exists at `/scan/[qrToken]`; it redirects unauthenticated users to login, returns students to the scan after login, validates class/window/duplicates, and writes `Attendance`.
- Class detail pages include an attendance matrix: students as rows, lessons as columns, with present/absent/pending statuses.
- Student cabinet at `/student` shows only the signed-in student's name, class, lesson cards, per-lesson status, and present/absence totals.
- UX polish pass tightened empty states, login/scan error feedback, back actions, table readability, mobile spacing, and the QR display.
- Local QA passed on demo storage (`DEMO_DATABASE=1`).

## Product Decisions

- MVP stays intentionally small and operational.
- QR check-in is time-limited.
- Lesson `date` and `startTime` are interpreted as local project time in `Europe/Moscow`, not as the server's default timezone. This keeps QR check-in windows stable between local development and Vercel.
- Lesson creation generates and stores a URL-safe `qrToken`. The lesson detail page renders a large QR code that points to `/scan/[qrToken]`.
- Attendance must be unique per student and lesson.
- Absences are not stored as rows. They are derived from lessons without a matching attendance record.
- Attendance table cells show `pending` until the lesson check-in window has ended; only then a missing attendance row becomes `absent`.
- Student login/password are part of the MVP.
- Users are created only from the admin area. Owners can create admins and students; admins can create students only. There is no self-registration, import, or password recovery in the MVP.
- Login redirects by role: owners and admins to `/admin`, students to `/student`.
- Protected admin/student routes validate role server-side in route layouts.
- UI direction is a light, clean SaaS admin style with compact cards, soft borders, and responsive spacing.
- Admin dashboard now reads live counts for classes, students, and lessons from PostgreSQL.
- Deployment target is Vercel with external PostgreSQL through `DATABASE_URL`.
- Local demo storage is allowed only outside production with `DEMO_DATABASE=1`; production must use PostgreSQL.
- The production owner seed requires `SEED_OWNER_LOGIN` and `SEED_OWNER_PASSWORD` from env and does not hardcode a production password. Legacy `SEED_ADMIN_*` remains a fallback for existing deployments.

## Constraints

- No Excel, imports, geolocation, Wi-Fi/IP checks, device binding, complex roles, or separate backend in the first version.
- UI should be usable on a phone during check-in and on a desktop for admin tables.
- Avoid speculative features until the core attendance loop works.
- Deployment env only needs `NEXT_PUBLIC_APP_URL`, `SESSION_SECRET`, `DATABASE_URL`, and optional seed credentials; QR timing is stored per lesson, not in env.

## Next Risks Before Client Demo

- Before the client demo, verify PostgreSQL behavior on a Vercel Preview deployment.
- Still close session invalidation, delete lesson, edit lesson, and a mini security pass.

## Verification Habit

- For scaffold and docs: run lint and build.
- For future business rules: add focused tests for QR expiry, duplicate prevention, and authorization boundaries.
