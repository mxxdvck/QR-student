# QR Student Attendance

QR Student Attendance is a compact web system for student attendance by QR code.
Owners and admins manage classes, students, and lessons. Students open a lesson
QR link from a phone and mark attendance during the allowed time window.

## Local Run

```sh
npm install
npm run demo:db
npm run dev
```

Open `http://localhost:3000`.

## Production Setup

Production uses PostgreSQL through `DATABASE_URL`.

```sh
npm install
npm run production:check
npm run db:push
npm run db:seed
npm run production:db-check
npm run build
```

To update an existing owner account, set the required env values and run:

```sh
npm run owner:update-credentials
```

## Checks

```sh
npm test
npm run lint
npm run build
```

## Documentation

- `USER_GUIDE.md`: full user guide in Russian.
- `DEPLOYMENT.md`: Vercel and PostgreSQL deployment steps.
- `HANDOVER.md`: client handover guide and operating notes.
- `.env.example`: environment variable example.
