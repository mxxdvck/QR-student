# Delivery Plan

## Immediate Delivery

1. Initialize the Next.js app.
2. Add startup project documents.
3. Add `.env.example`.
4. Replace the generic starter page with a compact project placeholder.
5. Run lint and build.

## Next Implementation Slice

1. Choose database provider: Supabase or Neon.
2. Add schema for admins, classes, students, lessons, and attendance.
3. Add password hashing and session handling.
4. Build admin login and a protected admin shell.
5. Add classes and students CRUD.

## First Useful Demo

The first demo should show:

- Admin can log in.
- Admin can create a class.
- Admin can create a student.
- Admin can create a lesson.
- Lesson page shows where the QR code will appear.

## Completion Rules

- Do not expand scope while the core flow is incomplete.
- Run `npm run lint` and `npm run build` before handoff.
- Record new decisions in `PROJECT_MEMORY.md`.
