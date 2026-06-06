# Project Handover Notes

This file is general project documentation for the public OSS repository. It summarizes the first version of QR Student and does not contain real credentials, private contacts, tokens, deployment URLs, or client-specific data.

For end-user instructions, see `USER_GUIDE.md`. For deployment setup, see `DEPLOYMENT.md`.

## Implemented In The First Version

The first version includes:

- owner, admin, and student sign-in;
- class management;
- admin and student creation;
- lesson creation;
- QR code display for lessons;
- attendance check-in during the allowed time window;
- duplicate check-in protection for one student and one lesson;
- admin attendance table;
- student dashboard with attendance and absence status.

## Access Model

- The owner signs in with credentials configured during setup.
- Admins sign in with credentials issued by the owner.
- Students sign in with credentials issued by the owner or an admin.

Real logins and passwords must not be stored in project documents or shared through public channels.

## Class Workflow

1. Sign in as the owner or an admin.
2. Open the admin area.
3. Open the classes section.
4. Create a class with a clear name.
5. Open the class page to add students, create lessons, and review attendance.

## Student Workflow

1. Open the class.
2. Add the student through the class form.
3. Enter the student name, login, and password.
4. Share the login and password through a safe private channel.

The owner can create admins and students. Admins can create students for the education workflow.

## Lesson And QR Workflow

1. Open the class.
2. Create a lesson with a name, date, start time, and check-in window.
3. Open the lesson page.
4. Show the QR code to students.
5. Students sign in and open the QR code from their phones.

## Check-In Window

Each lesson has a limited check-in window. A student can check in only during that window. Late check-ins are not accepted after the window closes.

Only one attendance record is saved for one student and one lesson. If the student does not check in before the window closes, the attendance table shows an absence.

## Owner Access Replacement

If owner login or password must be replaced, set new owner credential environment values and run:

```sh
npm run owner:update-credentials
```

The command updates owner access and does not print the password. Real passwords should not be written into docs.

## Deployment Inputs

Deployment setup needs:

- app URL;
- session secret;
- PostgreSQL connection string;
- initial owner login;
- initial owner password.

Do not commit the real values. The setup steps are documented in `DEPLOYMENT.md`.

## Not Included In The First Version

- Excel export.
- Geolocation checks.
- Wi-Fi or IP address checks.
- Device binding.
- Student import.
- Email-based password recovery.
- Separate backend service.
- Complex roles or expanded management workflows.

Future hardening work is tracked in `ROADMAP.md`.
