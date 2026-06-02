# Client Handover

Full user instructions are available in `USER_GUIDE.md`.

## What Is Implemented

The first version includes owner/admin/student login, class management, student
management, lesson creation, lesson QR codes, time-limited QR check-in,
duplicate attendance protection, an admin attendance table, and a student
cabinet with personal attendance history.

## How To Sign In

- Owner: use the owner login and password configured during setup.
- Admin: sign in with credentials created by the owner.
- Student: sign in with credentials created by the owner or admin.

Production credentials must be stored only in environment variables or in the
database, not in repository files.

## How To Create A Class

1. Sign in as owner or admin.
2. Open the admin area.
3. Go to the classes section.
4. Create a new class with the required name.
5. Open the class page to manage students, lessons, and attendance.

## How To Add A Student

1. Open the required class page in the admin area.
2. Add a student from the class user management form.
3. Set the student's name, login, and password.
4. Give the login and password to the student.

Owners can create admins and students. Admins can create students for their
assigned class flow.

## How To Create A Lesson And QR

1. Open the required class page.
2. Create a lesson with the lesson title, date, start time, and check-in window.
3. Open the lesson page.
4. Show or share the generated QR code.
5. Students sign in and open the QR link from their phones to mark attendance.

## How The Check-In Window Works

Each lesson has a limited attendance window. A student can mark attendance only
while the QR link is valid for that lesson. After the window closes, late marks
are rejected. A student can be marked present only once for the same lesson.
Missing marks become absences in the attendance view after the lesson window is
over.

## How To Reset Or Change Owner Credentials

Set the new owner credentials in the shell:

```sh
SEED_OWNER_LOGIN=<new-login>
SEED_OWNER_PASSWORD=<new-password>
```

Then run:

```sh
npm run owner:update-credentials
```

If the database has more than one owner, also set:

```sh
OWNER_CURRENT_LOGIN=<current-owner-login>
```

The command updates credentials only. It does not print the password.

## Required Vercel Environment Variables

- `NEXT_PUBLIC_APP_URL`: the deployed app URL.
- `SESSION_SECRET`: long random secret for signed auth cookies.
- `DATABASE_URL`: PostgreSQL connection string, usually with `sslmode=require`.
- `SEED_OWNER_LOGIN`: initial owner login for seeding.
- `SEED_OWNER_PASSWORD`: initial owner password for seeding.

Do not set `DEMO_DATABASE` in Vercel.

## Not Included In The First Version

- Excel export.
- Geolocation checks.
- Wi-Fi or IP checks.
- Device binding.
- Student import.
- Password recovery.
- Separate backend service.
- Complex roles or multi-admin workflows beyond the MVP.
