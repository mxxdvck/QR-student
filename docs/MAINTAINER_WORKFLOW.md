# Maintainer Workflow

This workflow keeps QR Student maintainable as an early active OSS project.

## Issues

- Triage issues by type: bug, feature, security hardening, documentation, or question.
- Ask for reproduction steps when a bug report is incomplete.
- Mark security-sensitive reports for private follow-up when details should not be public.
- Keep accepted scope small enough to review.

## Pull Requests

- Check that the PR has a clear summary, reason, testing notes, and security impact.
- Prefer focused PRs over broad rewrites.
- Require tests or a clear verification path for behavior changes.
- Watch for unrequested changes to runtime code, UI, routes, build config, env config, package dependencies, or lockfiles.

## Security-Sensitive Review

Review these areas carefully:

- Auth and sessions.
- Owner, admin, and student roles.
- QR token generation and validation.
- Attendance records and duplicate scans.
- Direct API calls and server actions.
- Server-side permission checks.

Security-sensitive changes should be small, auditable, and covered by tests where practical.

## Releases

- Run available checks before release: lint, tests, and build.
- Review documentation for setup or behavior changes.
- Keep release notes short and factual.
- Call out security-relevant fixes without publishing exploit details too early.

## Changelog Or Release Notes

- Summarize user-visible changes.
- Mention docs, tests, and security hardening.
- Avoid unsupported adoption or usage claims.
- Link issues or PRs when available.

## Using Codex

Codex can help with:

- PR review.
- Issue triage.
- Test generation.
- Release notes.
- Documentation updates.
- Security checklist review.

Codex should assist maintainers, not blindly merge changes. The final decision always stays with the maintainer.
