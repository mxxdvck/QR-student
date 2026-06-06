# QR Student

QR Student is an early active OSS project for QR-based attendance.

The project is a reusable OSS template for small education workflows where teachers or administrators create classes, students, and lessons, then students mark attendance by scanning a lesson QR code.

## Who It Is For

- Maintainers building a small QR attendance system.
- Education projects that need a practical starting point for class and lesson attendance.
- Contributors interested in improving auth, roles, QR token handling, tests, and documentation.

## Problem

Manual attendance tracking is slow and easy to lose or duplicate. QR Student provides a focused web app shape for creating lessons and recording student attendance through QR scans, while keeping the important checks on the server side.

## Features

- Owner/admin workflows for classes, students, lessons, and users.
- Student login and attendance view.
- Lesson QR codes with token-based scan routes.
- Duplicate attendance protection.
- PostgreSQL-backed data model through Drizzle.
- Tests around auth, sessions, students, lessons, scans, and production checks.

## Project Status

This is an early active OSS project. It is usable as a template and learning base, but it should be reviewed, configured, and tested before being used in a real attendance environment.

## Security Model

Security-sensitive behavior should stay small, explicit, and server-verified.

- Roles: owner, admin, and student access should be checked before privileged actions.
- QR tokens: QR scan links should identify the lesson through a server-validated token.
- Duplicate scans: a student should not be able to create repeated attendance records for the same lesson.
- Attendance records: writes should be validated against the authenticated student and lesson state.
- Direct API calls: the app must not trust direct client requests just because the UI hides an action.
- Server-side checks: permission, role, lesson, QR token, and duplicate-scan checks belong on the server.

## Quick Start

```sh
npm install
npm run demo:db
npm run dev
```

Then open `http://localhost:3000`.

For deployment setup, copy `.env.example`, configure the required environment variables, and review `DEPLOYMENT.md` before running production checks or database commands.

## Available Scripts

- `npm run dev` - start the local Next.js dev server.
- `npm run build` - create a production build.
- `npm run start` - start the built app.
- `npm run lint` - run ESLint.
- `npm test` - run Vitest tests.
- `npm run smoke:mvp` - run the local MVP smoke script.
- `npm run production:check` - validate production environment configuration.
- `npm run db:generate` - generate Drizzle migrations.
- `npm run db:push` - push database schema changes.
- `npm run db:seed` - seed database data.
- `npm run owner:update-credentials` - update owner credentials.
- `npm run production:db-check` - verify production database access.
- `npm run demo:db` - set up local demo data.

## Roadmap Summary

The near-term roadmap focuses on documentation baseline, auth and role hardening, QR token security, attendance table UX, tests, release workflow, maintainer workflow, and optional Codex-assisted review workflow. See `ROADMAP.md`.

## Contributing

Contributions are welcome when they are focused, reviewable, and honest about scope. Please read `CONTRIBUTING.md` before opening issues or pull requests.

## Security

Do not publish suspected vulnerabilities publicly before the maintainer has had a chance to respond. See `SECURITY.md` for the reporting and review policy.

## Documentation

- `USER_GUIDE.md` - user guide.
- `DEPLOYMENT.md` - deployment and configuration notes.
- `HANDOVER.md` - project handover notes.
- `ROADMAP.md` - short OSS roadmap.
- `docs/MAINTAINER_WORKFLOW.md` - maintainer workflow.
- `docs/CODEX_OSS_APPLICATION_NOTES.md` - notes for a Codex for OSS application.
