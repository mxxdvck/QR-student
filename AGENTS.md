# Agent Instructions

These rules apply to AI coding agents working in this repository.

- Keep changes small, focused, and reviewable.
- For docs-only tasks, do not change runtime code, UI, routes, build config, env config, package dependencies, `package.json`, or lockfiles.
- Do not touch security-sensitive logic without tests or a clear verification path.
- Treat auth, roles, QR tokens, duplicate scans, attendance records, direct API calls, and server-side permission checks as security-sensitive.
- Run available safe checks before reporting completion: lint, tests, and build when relevant.
- Do not commit, push, merge, open PRs, or deploy without a separate explicit command.
- In reports, state exactly what changed, what was checked, and any known failures or gaps.
