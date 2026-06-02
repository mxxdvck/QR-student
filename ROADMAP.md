# Roadmap

## Phase 0: Project Start

- Create Next.js project.
- Add project documents.
- Add env example.
- Verify lint and production build.
- Status: complete.

## Phase 1: Data and Auth Foundation

- Use PostgreSQL through `DATABASE_URL` on Supabase, Neon, or another Vercel-compatible provider.
- Add database client with lazy initialization.
- Add migrations or schema setup.
- Implement owner/admin login.
- Implement student login.
- Status: complete locally with demo storage and PostgreSQL-ready code.

## Phase 2: Admin MVP

- Classes list and create form.
- User management for admins and students.
- Lessons list and create form.
- Lesson detail page with QR code and expiry time.
- Status: complete for MVP.

## Phase 3: Student Check-In

- Student cabinet.
- QR landing/check-in route.
- Time-window validation.
- Duplicate attendance protection.
- Clear success, expired, and already-marked states.
- Status: complete for MVP.

## Phase 4: Attendance View

- Admin attendance table by lesson.
- Attendance matrix by class and lesson.
- Student personal attendance history.
- Mobile and desktop polish.
- Status: complete for MVP.

## Phase 5: Preview and Client Demo

- Configure PostgreSQL and Vercel preview env vars.
- Seed the production/preview owner from env credentials.
- Smoke-test owner/admin/student flows on preview.
- Run security pass for session handling, authorization, QR access, and production env behavior.
- Add/confirm session invalidation.
- Add/confirm lesson edit/delete behavior.
- Prepare client demo using the completed MVP flow.
