# Roadmap

QR Student is an early active OSS project. The roadmap is intentionally short and practical.

## 1. Documentation Baseline

- Keep README, contributing, security, roadmap, and maintainer workflow docs current.
- Add clear setup and verification notes for contributors.

## 2. Auth And Roles Hardening

- Review owner, admin, and student boundaries.
- Keep server-side permission checks covered by tests.
- Document expected role behavior.

## 3. QR Token Security

- Review QR token generation, lookup, and validation.
- Keep scan behavior resistant to duplicate or direct-call abuse.
- Add tests for edge cases around expired, invalid, or repeated scans when supported.

## 4. Attendance Table UX

- Improve how maintainers review class, lesson, and student attendance records.
- Keep UI changes small and tied to real workflows.

## 5. Tests

- Preserve existing tests.
- Add focused tests for auth, roles, QR tokens, attendance writes, and production checks.

## 6. Release Workflow

- Define a simple versioning and release-note process.
- Avoid publishing releases without passing checks.

## 7. Maintainer Workflow

- Triage issues by scope and security impact.
- Keep PR review focused on correctness, tests, and maintainability.

## 8. Optional Codex-Assisted Review Workflow

- Use Codex for PR review, issue triage, test generation, release notes, and documentation updates.
- Codex should assist review, not blindly merge changes.
