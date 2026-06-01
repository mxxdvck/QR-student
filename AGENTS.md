# QR Student Agent Notes

This repository is a compact Next.js system for student attendance by QR code.

## Product Boundaries

- Build the MVP only: admin login, student login, classes, students, lessons, QR check-in, time limit, attendance table, student cabinet.
- Do not add Excel export, geolocation, Wi-Fi/IP checks, device binding, complex roles, imports, separate backend services, or multi-admin flows unless explicitly requested.
- Keep the interface practical and compact for phone and desktop use.

## Technical Direction

- Use Next.js App Router, TypeScript, Tailwind, PostgreSQL, and Vercel-compatible patterns.
- PostgreSQL may be provided by Supabase or Neon through `DATABASE_URL`.
- Do not initialize database clients at module scope. Use lazy getters so `next build` can run without live production secrets.
- Keep auth and attendance checks server-side. Do not rely on route middleware as the only authorization layer.

## Working Rules

- Prefer small, reviewable changes over broad rewrites.
- Add tests when implementing business rules, especially QR expiry and duplicate attendance behavior.
- Run `npm run lint` and `npm run build` before reporting implementation work as complete.
- Keep generated copy out of user-facing documents; write concise project-specific notes.
