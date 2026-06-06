# Security Policy

QR Student handles attendance data, roles, and QR scan flows. Security reports should be handled carefully and privately.

## Reporting Security Issues

Please do not publish suspected vulnerabilities in a public issue before the maintainer has had a chance to respond.

Use a private maintainer contact channel or GitHub Security Advisories if they are enabled for this repository. If no private channel is available, open a minimal public issue that says a private security report is needed, without exploit details.

## Areas Of Special Attention

- Auth and session handling.
- Owner, admin, and student roles.
- QR token creation, storage, and validation.
- Attendance records and student identity checks.
- Duplicate scan prevention.
- Direct API calls that bypass normal UI paths.
- Server-side permission checks for every sensitive action.

## Responsible Disclosure

Please include:

- A short summary of the issue.
- Reproduction steps or a proof of concept.
- The affected route, action, or module.
- Expected impact.
- Suggested fix, if known.

The maintainer should acknowledge the report, assess severity, prepare a focused fix, and publish notes after the issue is resolved.

## Known Security Priorities

- Keep role checks explicit and server-side.
- Add or preserve tests for QR scan and duplicate attendance behavior.
- Review direct API/server action calls, not only visible UI flows.
- Keep security-sensitive PRs small enough to audit.
- Avoid merging Codex-assisted changes without maintainer review.
