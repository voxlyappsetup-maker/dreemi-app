# D3M FastSpring Website Pricing Alignment

## Status

**COMPLETE** — public pricing copy aligned with FastSpring test/trial catalog (Individual/Family monthly/yearly). School deferred. Payments remain fail-closed.

**Inspection result:** `ALIGNED_WITH_RUNTIME_COPY_CHANGE`

This phase aligns public pricing copy with the FastSpring catalog.
No checkout was implemented.
No FastSpring API call was made.
No webhook was configured.
No provider credentials were added.
No env/secrets were read, printed, verified, or modified.
No Live activation was requested.
Production billing remains **NO-GO**.

## Purpose

Align public website pricing copy with the confirmed FastSpring catalog before activation, while keeping checkout unavailable and preserving fail-closed payment behavior.

## Current Baseline

- Latest pushed commit before this phase: `827ef64` — Confirm FastSpring catalog dashboard setup
- FastSpring catalog dashboard setup: **COMPLETE** (Individual/Family monthly/yearly in test/trial mode)
- School plan: **deferred** — not created in FastSpring

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| FastSpring catalog (test/trial) | Yes | Four subscriptions confirmed in dashboard |
| Public pricing page | Yes | `apps/web/src/app/[locale]/pricing/page.tsx` |
| Landing pricing section | Yes | `apps/web/src/components/LandingPricing.tsx` |
| Localization (en/ar/fr) | Yes | `apps/web/messages/{en,ar,fr}.json` |
| Payment status API | Yes | Fail-closed; no checkout enabled |
| Refund policy on site | Partial | 7-day refund documented in project docs; not finalized on public pricing page |
| Terms / Privacy routes | Yes | Localized `/terms` and `/privacy` links on pricing footer |

## Explicit Non-Goals

- Checkout implementation
- FastSpring API calls
- Webhook configuration
- Provider credentials or env changes
- Live activation
- School FastSpring product creation
- Backend billing catalog changes
- Entitlement runtime integration

## FastSpring Catalog Source Of Truth

| Offering | FastSpring Path | Public Plan | Price | Currency | Billing Interval | Internal Plan | Website Alignment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dreemi Individual Monthly | `dreemi-individual-monthly` | Individual | 4.99 | USD | Monthly | INDIVIDUAL | **ALIGNED** |
| Dreemi Individual Yearly | `dreemi-individual-yearly` | Individual | 47.90 | USD | Yearly | INDIVIDUAL | **ALIGNED** |
| Dreemi Family Monthly | `dreemi-family-monthly` | Family | 9.99 | USD | Monthly | FAMILY | **ALIGNED** |
| Dreemi Family Yearly | `dreemi-family-yearly` | Family | 95.90 | USD | Yearly | FAMILY | **ALIGNED** |

**Deferred:** `dreemi-school` — School plan not in FastSpring launch catalog.

## Website Pricing Inspection

### Files reviewed

- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/components/LandingPricing.tsx`
- `apps/web/src/lib/pricing-catalog.ts` (new shared constants)
- `apps/web/messages/en.json`, `ar.json`, `fr.json` (pricing namespace)
- Payment unavailable UX via `getPaymentsStatus()` / `paymentsTemporarilyUnavailable`

### Pre-change findings

- Individual/Family prices already matched FastSpring ($4.99 / $47.90 / $9.99 / $95.90)
- Legacy Lemon Squeezy `variantMonthly` / `variantYearly` IDs still present on paid plans
- School showed placeholder prices ($29.99 / $287.90) with Lemon variant IDs — **not aligned** with deferred School status
- Payment unavailable banner and disabled paid buttons already active via fail-closed logic
- Terms/Privacy links present on pricing page footer (localized routes)

## Alignment Result

**`ALIGNED_WITH_RUNTIME_COPY_CHANGE`**

| Area | Before | After |
| --- | --- | --- |
| Individual monthly/yearly | Prices aligned; Lemon variant IDs present | Prices unchanged; Lemon IDs removed from UI layer |
| Family monthly/yearly | Prices aligned; Lemon variant IDs present | Prices unchanged; Lemon IDs removed from UI layer |
| School | Priced at $29.99 / $287.90 with Lemon IDs | Deferred — contact-only copy, no price, no checkout |
| Free | $0 | Unchanged — separate from FastSpring paid catalog |
| Payment unavailable | Active | Preserved |

## Runtime Changes Made

1. **`apps/web/src/lib/pricing-catalog.ts`** — shared FastSpring-aligned price constants and `SCHOOL_PLAN_DEFERRED` flag
2. **`apps/web/src/app/[locale]/pricing/page.tsx`** — use catalog constants; School contact-only; remove Lemon variant IDs from plan defs; preserve fail-closed buttons
3. **`apps/web/src/components/LandingPricing.tsx`** — same alignment as pricing page
4. **`apps/web/messages/{en,ar,fr}.json`** — added `planSchoolDeferred` in pricing namespace

## Localization Review

| Key | en | ar | fr |
| --- | --- | --- | --- |
| `planIndividual` | Individual | فردي | Individuel |
| `planFamily` | Family | عائلي | Famille |
| `planSchool` | School | مدرسي | École |
| `planFree` | Free | مجاني | Gratuit |
| `planSchoolDeferred` | Contact us — coming later | تواصل معنا — قريباً | Contactez-nous — bientôt disponible |
| `paymentsTemporarilyUnavailable` | Present | Present | Present |

All three locales updated consistently for School deferred messaging.

## Payment Unavailable / Fail-Closed Review

- `getPaymentsStatus()` still gates `canStartCheckout`
- Amber banner: `paymentsTemporarilyUnavailable` remains visible when checkout unavailable
- Paid plan buttons disabled when `!paymentsAvailable` or checkout config incomplete
- Individual/Family without variant IDs now surface `priceNotConfigured` if checkout were attempted — acceptable fail-closed behavior until FastSpring runtime integration
- School uses contact mailto — no checkout path
- **Payment status route not changed to offerable**

## School Plan Review

- School remains **deferred** — not mapped to FastSpring
- Public UX: contact-only with localized deferred copy
- No School price displayed on website
- Acceptable per launch plan: "Contact us — coming later"

## Refund / Terms / Privacy Review

| Item | Status |
| --- | --- |
| Terms URL (expected public) | `https://www.dreemi.app/en/terms` — app uses localized `/terms` routes |
| Privacy URL (expected public) | `https://www.dreemi.app/en/privacy` — app uses localized `/privacy` routes |
| Refund policy on pricing page | **Not visible** — 7-day refund documented in `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`; final public policy review pending |
| Pricing footer links | Terms + Privacy + contact email present |

**Note:** Refund wording remains pending final public policy review if not visible on the site.

## What Was Not Done

- FastSpring checkout integration
- Webhook setup
- API credentials / env changes
- Test order execution
- Live mode activation
- Backend `billing.ts` / Lemon service changes
- School FastSpring product creation
- Public 7-day refund policy page copy (pending legal review)

## Blocker Register

| Blocker | Severity | Status |
| --- | --- | --- |
| Checkout not implemented | Critical | OPEN |
| Webhook integration pending | Critical | OPEN |
| Entitlement mapping pending | Critical | OPEN |
| Live approval pending | Critical | OPEN |
| Payout readiness pending | Critical | OPEN |
| Final refund policy on site | Medium | OPEN |
| FastSpring written eligibility response | Medium | OPEN |

## Payment Readiness Impact

Website pricing alignment improves FastSpring activation readiness but does not enable production billing.

Production billing remains **NO-GO** until test checkout, webhook integration, entitlement mapping, Live approval, payout readiness, and final legal/tax review are complete.

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Website pricing gate | **PASS** |
| Checkout gate | **BLOCKED** |
| Webhook gate | **BLOCKED** |
| Entitlement runtime gate | **BLOCKED** |
| Payout gate | **BLOCKED** |
| Live billing gate | **BLOCKED** |
| Production billing | **NO-GO** |

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-Refund-Policy-Alignment` — address activation gap before test order or activation request.

**Alternative:** `D3M-Payments-FastSpring-SaaS-Fulfillment-Decision`

## Follow-Up

Website pricing alignment is **complete** but FastSpring activation minimum requirements remain **PARTIAL** — see `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md`. Test-order plan: `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`.

## Notes For Next Chat

- Website public prices now match FastSpring catalog for Individual/Family monthly/yearly
- School is contact-only; no FastSpring mapping
- Lemon variant IDs removed from frontend pricing surfaces; backend still Lemon-centric until integration phase
- Do not enable checkout without explicit approved integration phase
- Confirm 7-day refund copy on Terms or dedicated refund section before Live launch
