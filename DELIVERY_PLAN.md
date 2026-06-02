# Delivery Plan

## Immediate Delivery

1. Initialize the Next.js app.
2. Add startup project documents.
3. Add `.env.example`.
4. Replace the generic starter page with a compact project placeholder.
5. Run lint and build.
6. Status: complete.

## MVP Delivered Locally

1. Owner/admin/student auth exists.
2. Users, classes, lessons, QR scan, timezone-stable lesson windows, and attendance are implemented.
3. Admin class and lesson management exists.
4. Student cabinet exists.
5. Attendance matrix exists.
6. Local QA passed on demo storage.

## Preview Delivery Slice

1. Configure PostgreSQL for Vercel preview through `DATABASE_URL`.
2. Configure required preview env vars: `NEXT_PUBLIC_APP_URL`, `SESSION_SECRET`, database URL, and owner seed credentials.
3. Run preview smoke tests for owner, admin, student, QR check-in, duplicate attendance, and expiry behavior.
4. Complete final security pass for auth, session handling, role checks, QR access, and production-only database behavior.
5. Confirm or add session invalidation.
6. Confirm or add lesson delete/edit behavior.

## Client Demo

The client demo should show:

- Owner can log in.
- Owner can create a class, admin, student, and lesson.
- Admin can manage the class flow.
- Lesson page shows the QR code and expiry.
- Student can log in, scan the QR, and see attendance in the cabinet.
- Admin can review the attendance matrix.

## Completion Rules

- Do not expand scope while the core flow is incomplete.
- Run `npm run lint` and `npm run build` before handoff.
- Record new decisions in `PROJECT_MEMORY.md`.
