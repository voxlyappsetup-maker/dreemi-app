# D3M Supabase Inactivity Warning

## Status

This is a docs-only infrastructure readiness record.

Supabase project was **active/reachable** at manual check time.

No database migration was executed.
No schema migration was executed.
No write query was executed.
No Supabase secrets or env values were read, printed, verified, or modified.
No Supabase billing change was made.

Production launch remains **NO-GO** until database uptime posture is resolved.

## Purpose

- Document the Supabase inactivity warning received for the Dreemi / qisas-app project.
- Record successful manual read-only activity evidence (`select now();`).
- Mark the project as active at check time without overstating production readiness.
- Register free-tier auto-pause as a production launch blocker.
- Define production DB uptime decision options for a later phase.

## Current Baseline

- Latest stable commit: `072aeff Record FastSpring preflight form submission`
- Primary database provider in project docs: **Supabase (PostgreSQL)**
- Production launch posture: **NO-GO**

## Source Availability

| Source | Status |
| --- | --- |
| User-reported Supabase inactivity email | Available (summary recorded below) |
| Manual SQL Editor check by user | Available |
| `.env` / connection strings | **Not inspected** (forbidden) |
| Supabase billing/dashboard settings | **Not accessed from this phase** |

## Explicit Non-Goals

- No database migration or schema change.
- No insert/update/delete SQL.
- No Supabase pause/unpause action.
- No Supabase Pro upgrade or billing change.
- No env/secrets read or modification.
- No production deploy.
- No claim that auto-pause risk is permanently resolved.

## Warning Summary

Supabase sent an inactivity warning for **qisas-app**, project ID **xnylndcqalfjjkpezptb**, organization **Stories**.

The warning said the project was **not currently paused** but may be paused automatically if insufficient activity continues.

The warning said paused projects can be unpaused within **90 days**, and that upgrading to **Pro** prevents future automatic pausing.

| Field | Value |
| --- | --- |
| Project name | qisas-app |
| Project ID | xnylndcqalfjjkpezptb |
| Organization | Stories |
| Email status at warning time | Not currently paused; scheduled pause risk if inactivity continues |
| Pro upgrade note | Prevents future automatic pausing per Supabase warning |

## Manual Read-Only Activity Evidence

| Field | Value |
| --- | --- |
| Check performed by | User manually |
| Method | Supabase SQL Editor |
| Query | `select now();` |
| Observed timestamp | `2026-06-11 14:51:50.211664+00` |
| Result | **PASS** — project active/reachable at check time |
| Query type | Read-only |
| Write/migration action | None |

## Current Interpretation

The immediate pause state is **not active** at check time.

The inactivity warning **remains relevant**.

The successful read-only query does **not** permanently solve production uptime risk.

Free-tier auto-pause remains a **production readiness blocker**.

## Production Readiness Impact

For development/beta readiness, manual activity can keep the project usable temporarily.

For production launch readiness, a database that may auto-pause is **not acceptable** unless explicitly treated as non-production.

Production launch remains **NO-GO** until a DB uptime decision is made.

## Database Uptime Risk

**Risk:** Supabase Free auto-pause could interrupt authentication, database persistence, story storage, child profiles, entitlement reads, and API routes depending on database access.

**Severity:** High for production launch.

**Current status:** Open blocker.

## What Was Not Done

- No insert/update/delete query.
- No test user created.
- No schema change.
- No migration.
- No billing change.
- No Pro upgrade.
- No environment variable inspection.
- No secrets read.

## Immediate Decision

**Immediate state:** safe read-only activity completed.

**Production decision:** unresolved.

## Production Uptime Options

| Option | Description | Pros | Risks / Limitations | Decision Status |
| --- | --- | --- | --- | --- |
| **Option 1 — Upgrade Supabase project to Pro before production** | Move production DB to a paid Supabase plan that avoids free-tier auto-pause | Simplest path if staying on Supabase; keeps current Prisma/Postgres stack | Recurring cost; billing/ops decision required; not purchased yet | **PENDING USER DECISION** |
| **Option 2 — Keep Supabase Free for development/beta only** | Continue using current project for dev/beta with manual activity as needed | Low cost; current stack unchanged | Auto-pause risk remains; not production-ready | **PENDING USER DECISION** |
| **Option 3 — Move production DB to another paid Postgres provider** | Use a non-Supabase paid Postgres host for production | May improve uptime posture depending on provider/plan | Migration/ops complexity; connection/env changes later | **PENDING USER DECISION** |
| **Option 4 — Pause monetization/production launch until DB uptime is resolved** | Do not launch production until DB uptime strategy is chosen and evidenced | Conservative; avoids false launch readiness | Delays launch until infra decision closes | **CURRENT DEFAULT POSTURE** |

## Recommended Position

Recommended position: Keep current Supabase project usable for development/beta, but **do not treat it as production-ready** while auto-pause risk remains. Before production launch, either upgrade Supabase to a paid production-appropriate plan or choose another production DB uptime strategy.

See also: `docs/D3M_DATABASE_UPTIME_DECISION.md`

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence / Decision | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Supabase Free auto-pause risk | Database uptime | Critical | **OPEN** | Paid plan or alternative production DB strategy | `D3M-Infra-Database-Uptime-Decision` |
| Production DB uptime decision missing | Infrastructure | Critical | **OPEN** | User decision on Pro vs dev-only vs alternative DB | `D3M-Infra-Database-Uptime-Decision` |
| No Pro/paid DB decision | Infrastructure | Critical | **OPEN** | Billing/plan confirmation if Option 1 or 3 chosen | `D3M-Infra-Database-Uptime-Decision` |
| No production DB monitoring/incident posture | Ops | High | **OPEN** | Monitoring/alerts/runbook for DB availability | Ops-readiness phase |
| No backup/restore evidence for production readiness | Ops / DR | High | **OPEN** | Backup/restore procedure and evidence before launch | Deployment/ops readiness phase |

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Database uptime gate | **BLOCKED / PARTIAL_LOCAL_EVIDENCE only** |
| Production environment gate | **Pending** |
| Monitoring/incident gate | **Pending** |
| Full production launch | **NO-GO** |

## Required User Decision

- Use Supabase Pro for production?
- Keep Supabase Free for development/beta only?
- Choose alternative production Postgres?
- When should upgrade/DB decision happen relative to payment provider approval?

## Recommended Next Phase

**Primary:** **`D3M-Infra-Database-Uptime-Decision`** — decide Supabase Pro vs dev-only vs alternative DB.

**Alternative:** **`D3M-Payments-FastSpring-Response-Record`** — record FastSpring response when received.

## Notes For Next Chat

- Supabase inactivity warning recorded; manual `select now();` succeeded on **2026-06-11**.
- Do not claim Pro was purchased or auto-pause risk is permanently resolved.
- Do not mark production DB readiness complete.
- Production launch remains No-Go until DB uptime posture is decided.

## Related Artifacts

- Database uptime decision draft: `docs/D3M_DATABASE_UPTIME_DECISION.md`
- Deployment env plan: `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`
- Launch gate checklist: `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`
