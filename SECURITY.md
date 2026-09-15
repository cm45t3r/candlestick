# Security Policy

## Supported Versions

**Only the current major version receives security fixes.** This is a
single-maintainer project; backporting across release lines is not something it
can sustain, and saying otherwise would promise more than it delivers.

| Version | Supported          | Notes                                      |
| ------- | ------------------ | ------------------------------------------ |
| `3.x`   | :white_check_mark: | Current                                    |
| `2.x`   | :x:                | Superseded by 3.0.0; targets Node 20 (EOL) |
| `1.x`   | :x:                | Superseded                                 |
| `0.x`   | :x:                | Superseded                                 |

A fix ships as a new release on the current line rather than as a patch to an
older one, so upgrading is the remedy.

There is a second reason not to stay on an older line. Every version before
3.0.0 permits a Node.js release that is itself end-of-life:

| Package | `engines` | Oldest Node allowed | That version's EOL |
| ------- | --------- | ------------------- | ------------------ |
| `3.x`   | `>=22`    | 22                  | 2027-04-30         |
| `2.x`   | `>=20`    | 20                  | **2026-04-30**     |
| `1.x`   | `>=18`    | 18                  | **2025-04-30**     |

An unsupported runtime stops receiving security fixes from upstream, which no
patch to this package could compensate for.

The upgrade path is documented in the README under "Upgrading to v3.0". The
library API did not change in 3.0.0 — the breaking changes are the Node
requirement and two CLI behaviours.

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**. Instead, report it responsibly by emailing:

**v3rlq9xye (at) mozmail (dot) com**

Alternatively, you may use [GitHub Security Advisories](https://github.com/cm45t3r/candlestick/security/advisories) for confidential reporting.

- We will acknowledge your report within 3 business days.
- We will investigate and keep you informed of progress.
- Once resolved, we will credit you (if desired) in the release notes.

## Disclosure Policy

- We follow a responsible disclosure process.
- Please allow us time to address the issue before public disclosure.
- We will coordinate a public announcement and release a fix as soon as possible.

## Community Standards

All security reports and discussions are subject to our [Code of Conduct](./CODE_OF_CONDUCT.md).

Thank you for helping keep Candlestick and its users safe!
