# PRD: QR Student Attendance

## Goal

Create a compact web system where owners and admins manage classes, users, and lessons, show a lesson QR code, and students mark attendance from a phone.

## Users

- Owner: manages classes, admins, students, lessons, and reviews attendance.
- Admin: manages assigned class students, lessons, and attendance.
- Student: logs in, scans or opens a QR link, and sees own attendance.

## MVP Scope

- Owner, admin, and student login.
- User management for admins and students.
- Classes.
- Students with login and password.
- Lessons with project-local timezone handling.
- QR code for a lesson.
- Attendance mark through QR.
- Time-limited QR validity.
- Duplicate attendance protection.
- Attendance table/matrix.
- Student cabinet.
- Responsive layout for phone and desktop.
- PostgreSQL-backed Vercel preview preparation.

## Non-Goals

- Excel export.
- Geolocation checks.
- Wi-Fi or IP checks.
- Device binding.
- Student import.
- Separate backend server.
- Complex visual design.

## Core Flow

1. Owner or admin logs in.
2. Owner or admin creates a class and students.
3. Admin creates a lesson.
4. System generates a QR link for the lesson.
5. Student logs in on a phone.
6. Student opens the QR link during the allowed time window.
7. System records attendance once for that student and lesson.
8. Owner or admin reviews the attendance table.

## Success Criteria

- A student cannot mark attendance after the QR time window closes.
- A student cannot create duplicate attendance for the same lesson.
- Owner/admin can see who attended and who did not.
- Student can see personal attendance history.
- Lesson timing is stable between local development and Vercel by using the project timezone.
- The app builds successfully and is ready for PostgreSQL/Vercel preview validation.

## Implemented Data Model

- `users`: owners, admins, and students with login, role, password hash, and class binding when needed.
- `classes`: class records.
- `lessons`: class lessons with QR token, start time, and expiry time.
- `attendance`: unique student/lesson attendance marks.

## Next Stage

- Validate PostgreSQL behavior on a Vercel preview deployment.
- Run a final security pass before client demo.
- Confirm session invalidation behavior and lesson edit/delete handling.
- Prepare a compact client demo of the implemented MVP flow.
