# D3M Database Uptime Decision

## Status

**Decision pending.** Docs-only summary derived from `docs/D3M_SUPABASE_INACTIVITY_WARNING.md`.

No Supabase Pro upgrade was purchased. No provider migration was executed. Production launch remains **NO-GO**.

## Purpose

- Provide a concise decision frame for production database uptime before launch.
- Separate immediate dev/beta usability from production readiness.

## Current Database Provider

- Provider: **Supabase (PostgreSQL)**
- Project: **qisas-app** (`xnylndcqalfjjkpezptb`)
- Organization: **Stories**
- Current plan posture: **Free tier with auto-pause risk** (per Supabase warning)
- Manual check (2026-06-11): project active/reachable via read-only `select now();`

## Current Risk

Supabase Free may auto-pause after inactivity, interrupting auth, persistence, entitlements, and API routes that depend on the database.

Manual activity temporarily reduces pause risk but does **not** close the production blocker.

## Production Requirements

Before production launch, Dreemi needs a database posture that:

- avoids unplanned auto-pause in production,
- has an explicit owner/decision on plan/provider,
- supports backup/restore and incident response expectations,
- aligns with deployment/env verification without exposing secrets in docs.

## Options

| Option | Summary | Launch-ready? |
| --- | --- | --- |
| Supabase Pro for production | Upgrade current project or use paid Supabase plan for production | Yes, after billing decision + ops evidence |
| Supabase Free for dev/beta only | Keep current project for non-production work | No for production launch |
| Alternative paid Postgres | Move production DB to another provider | Yes, after migration plan + ops evidence |
| Defer launch | Wait until DB uptime decision closes | Conservative default |

## Recommended Decision

**Interim:** treat current Supabase project as **dev/beta usable**, not production-ready.

**Before launch:** choose **Supabase Pro** or **alternative paid Postgres**; do not launch on Free auto-pause risk.

## Required Evidence Before Launch

- Documented DB uptime decision (this file updated with chosen option).
- Production-appropriate plan/provider confirmation (no secrets in docs).
- Backup/restore path documented.
- Monitoring/incident posture for DB availability.
- Presence-only env verification for `DATABASE_URL` / `DIRECT_URL` in target environment (no values printed).

## Notes

- Coordinate DB uptime decision timing with payment provider approval if production billing depends on the same launch window.
- Do not run migrations or env changes in the decision phase unless explicitly approved in a later infra phase.
