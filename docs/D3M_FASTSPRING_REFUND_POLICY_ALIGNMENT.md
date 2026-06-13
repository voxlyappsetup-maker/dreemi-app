# D3M FastSpring Refund Policy Alignment

## Status

This phase adds or aligns public Refund Policy visibility for FastSpring activation readiness.

No checkout was implemented.

No test order was executed.

No FastSpring API call was made.

No webhook was configured.

No provider credentials were added.

No env/secrets were read, printed, verified, or modified.

No tax/KYC/payout action was performed.

No Live activation was requested.

Production billing remains **NO-GO**.

## Purpose

Make Refund Policy publicly visible alongside Terms and Privacy so FastSpring activation review can find a clear, conservative 7-day refund position without enabling payment runtime.

## Current Baseline

Latest stable commit: `9a44ca7` Audit FastSpring activation requirements

Prior activation gap audit verdict: **PARTIAL / NOT READY FOR ACTIVATION REQUEST YET** — Refund Policy public visibility was an open item.

## Source Availability

- `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md` — 7-day refund period decision
- `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md` — Refund Policy visibility gap
- Existing public Terms (`/terms`) and Privacy (`/privacy`) pages and footer patterns
- `apps/web/messages/en.json`, `ar.json`, `fr.json` — localization pattern

## Explicit Non-Goals

- No checkout enablement
- No FastSpring test order
- No webhook or entitlement integration
- No provider API or dashboard changes
- No tax/KYC/payout/User Agreement actions
- No production billing activation
- No legal overreach or claims that production billing or FastSpring refunds are live

## FastSpring Activation Gap Addressed

The previous activation gap audit identified Refund Policy public visibility as an open item before activation review.

This phase addresses that gap by making Refund Policy visible alongside Terms and Privacy on public routes and footers.

## Public Refund Policy Surface

Public localized routes:

- `/en/refund`
- `/ar/refund`
- `/fr/refund`

## Runtime Changes Made

- `apps/web/src/app/[locale]/refund/page.tsx` — new localized Refund Policy page (Terms/Privacy style)
- `apps/web/src/app/[locale]/pricing/page.tsx` — Refund Policy footer link; policy agreement line
- `apps/web/src/app/[locale]/page.tsx` — landing footer Refund Policy link
- `apps/web/src/app/[locale]/privacy/page.tsx` — footer Refund Policy link
- `apps/web/src/app/[locale]/terms/page.tsx` — footer Refund Policy link
- `apps/web/src/app/[locale]/settings/page.tsx` — footer Refund Policy link
- `apps/web/messages/en.json` — `common.refund`, `pricing.policyAgreement`, `refund` namespace
- `apps/web/messages/ar.json` — `common.refund`, `pricing.policyAgreement`, `refund` namespace
- `apps/web/messages/fr.json` — `common.refund`, `pricing.policyAgreement`, `refund` namespace

## Localization Review

English, Arabic, and French refund labels/copy reviewed or updated.

- Labels: Refund Policy / سياسة الاسترداد / Politique de remboursement
- Policy copy: 7-day window, `contact@dreemi.app`, case-by-case review, cancellation access until period end, payment-provider rules, pre-launch update note
- Pricing agreement line localized in all three languages

## Terms / Privacy / Refund Link Review

Refund Policy link added wherever Terms and Privacy appear in public footers:

- Pricing page footer (Terms, Privacy, Refund Policy, contact)
- Landing page footer
- Privacy page footer
- Terms page footer
- Settings page footer
- Refund page footer (Privacy, Terms, Refund, contact)

Existing Terms and Privacy links preserved.

## Refund Position

- Refund period: **7 days**
- Support contact: **contact@dreemi.app**
- Paid subscriptions are still not publicly live
- Refund requests are reviewed case by case
- Misuse, abuse, repeated requests, or Terms violations may be declined
- Canceled subscriptions may retain access until end of paid billing period unless provider or law requires otherwise

## Payment Unavailable / Fail-Closed Review

Payment unavailable/fail-closed behavior was preserved.

No checkout was enabled.

No payment provider runtime integration was added.

Pricing page checkout remains blocked when payments are unavailable.

## What Was Not Done

- No checkout opened
- No test order executed
- No API/webhook configured
- No entitlement mapping implemented
- No tax/KYC submitted
- No User Agreement signed
- No payout activated
- No Live activation requested
- No FastSpring dashboard changes
- No env/secrets read or modified

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
|---------|------|----------|----------------|-------------------|-------------------|
| SaaS fulfillment decision missing | Activation / fulfillment | High | **OPEN** | Documented fulfillment handling for SaaS | `D3M-Payments-FastSpring-SaaS-Fulfillment-Decision` |
| Actual test order not executed | Activation / checkout | High | **OPEN** | Safe test-mode Individual Monthly order evidence | `D3M-Payments-FastSpring-Test-Order-Manual-Execution` |
| User Agreement not documented as signed | Business / legal | High | **OPEN** | Signed User Agreement record | Activation checklist follow-up |
| Tax profile not documented as completed | Business / tax | High | **OPEN** | Tax profile completion evidence | Activation checklist follow-up |
| KYC readiness not documented | Business / KYC | High | **OPEN** | KYC readiness evidence | Activation checklist follow-up |
| Activation request not sent | Activation | High | **OPEN** | Activation request to FastSpring representative | Post-gap-closure activation request |
| Webhook integration not implemented | Runtime / payments | Critical | **OPEN** | Webhook route + handler | Future webhook phase |
| Entitlement mapping not implemented | Runtime / billing | Critical | **OPEN** | Provider-neutral entitlement wiring | Future entitlement phase |
| Payout not activated | Payout | High | **OPEN** | Payout activation after Live approval | Post-approval phase |
| Production DB uptime decision pending | Infrastructure | Medium | **OPEN** | DB uptime decision doc | `D3M-Infra-Database-Uptime-Decision` |
| Production billing NO-GO | Launch | Critical | **BLOCKED** | All payment/activation gates resolved | Multi-phase |

## Payment Readiness Impact

Refund Policy visibility improves FastSpring activation readiness but does not enable production billing. Production billing remains **NO-GO** until SaaS fulfillment handling, safe test checkout, webhook/entitlement integration, provider Live approval, payout readiness, business/tax/KYC readiness, and infrastructure blockers are resolved.

## Launch Gate Impact

- Refund Policy visibility gate: **PASS** — public routes/links are visible
- FastSpring minimum requirements: still **PARTIAL**
- Actual test checkout gate: **BLOCKED / NOT_EXECUTED**
- Business/tax/KYC readiness gate: **BLOCKED / UNVERIFIED**
- Webhook gate: **BLOCKED**
- Entitlement runtime gate: **BLOCKED**
- Live billing gate: **BLOCKED**
- Payout gate: **BLOCKED**
- Production billing: **NO-GO**

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-SaaS-Fulfillment-Decision` — decide and document SaaS fulfillment handling for FastSpring activation review

**Alternative:** `D3M-Payments-FastSpring-Test-Order-Manual-Execution` — execute one safe FastSpring test-mode checkout for Individual Monthly only (after fulfillment decision or in parallel if approved)

## Notes For Next Chat

- Refund Policy is public at `/en/refund`, `/ar/refund`, `/fr/refund` with footer links on pricing, landing, Terms, Privacy, and settings
- Do not claim production billing is live or FastSpring has approved the store
- Next activation gaps: SaaS fulfillment, test order, business/tax/KYC/User Agreement, activation request, webhook/entitlement, Live approval, payout
- See `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md` for remaining items
