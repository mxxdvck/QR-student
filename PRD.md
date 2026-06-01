# PRD: QR Student Attendance

## Goal

Create a compact web system where an admin manages classes, students, and lessons, shows a lesson QR code, and a student marks attendance from a phone.

## Users

- Admin: creates classes, students, lessons, and reviews attendance.
- Student: logs in, scans or opens a QR link, and sees own attendance.

## MVP Scope

- Admin login.
- Student login.
- Classes.
- Students with login and password.
- Lessons.
- QR code for a lesson.
- Attendance mark through QR.
- Time-limited QR validity.
- Attendance table.
- Student cabinet.
- Responsive layout for phone and desktop.
- Vercel deployment later.

## Non-Goals

- Excel export.
- Geolocation checks.
- Wi-Fi or IP checks.
- Device binding.
- Complex roles.
- Multiple admins.
- Student import.
- Separate backend server.
- Complex visual design.

## Core Flow

1. Admin logs in.
2. Admin creates a class and students.
3. Admin creates a lesson.
4. System generates a QR link for the lesson.
5. Student logs in on a phone.
6. Student opens the QR link during the allowed time window.
7. System records attendance once for that student and lesson.
8. Admin reviews the attendance table.

## Success Criteria

- A student cannot mark attendance after the QR time window closes.
- A student cannot create duplicate attendance for the same lesson.
- Admin can see who attended and who did not.
- Student can see personal attendance history.
- The app builds successfully and can later be deployed to Vercel.

## Data Model Draft

- `admins`: id, login, password_hash, created_at.
- `classes`: id, name, created_at.
- `students`: id, class_id, name, login, password_hash, created_at.
- `lessons`: id, class_id, title, starts_at, qr_expires_at, created_at.
- `attendance`: id, lesson_id, student_id, marked_at.

## Open Decisions

- Choose Supabase or Neon before database implementation.
- Decide whether admin and student auth share one session mechanism or use separate login routes.
- Decide QR token format before implementation.
