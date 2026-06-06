# Contributing

QR Student is an early active OSS project. Please keep changes small, clear, and easy to review.

## Proposing Changes

- Open an issue first for larger behavior, security, data model, or workflow changes.
- Use a focused pull request for one concern at a time.
- Avoid fake usage claims, adoption claims, stars, downloads, or metrics.
- Prefer existing project patterns over new abstractions.

## Issues

When opening an issue, include:

- What happened or what problem you want to solve.
- Steps to reproduce, if it is a bug.
- Expected and actual behavior.
- Environment details when relevant.
- Any security impact, especially around auth, roles, QR tokens, attendance records, duplicate scans, direct API calls, or server-side permission checks.

## Pull Requests

Before opening a PR:

```sh
npm run lint
npm test
npm run build
```

If a check cannot run in your environment, say so in the PR.

Every PR should describe:

- What changed.
- Why it changed.
- How it was tested.
- Security impact, if any.
- Screenshots for UI changes.
- Documentation updates, if needed.

## Changes That Need Discussion First

Please open an issue before changing:

- Auth, roles, sessions, or permissions.
- QR token generation, validation, or scan behavior.
- Attendance write logic or duplicate-scan handling.
- Database schema or migration strategy.
- Build, deployment, environment, or dependency configuration.
- Public product positioning or project scope.

## Security-Sensitive Changes

Security-sensitive changes should be small and testable. Include tests or a clear manual verification path for role checks, QR token checks, duplicate attendance protection, and direct API call behavior.
