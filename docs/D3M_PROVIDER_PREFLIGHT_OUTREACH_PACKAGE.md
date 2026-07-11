# D3M Provider Preflight Outreach Package

## Status

This is a docs-only payment-provider preflight outreach package.

No provider application was submitted.

No provider dashboard was opened or configured.

No provider account was created.

No checkout was created.

No test order was attempted.

No provider API call was made.

No webhook was configured.

No provider credentials were added.

No env/secrets were read, printed, verified, or modified.

No tax/KYC/payout action was performed.

No runtime checkout or entitlement behavior was changed.

Production billing remains **NO-GO**.

## Purpose

Prepare provider-specific preflight outreach for PayPro Global, Paddle, and Creem after FastSpring final decline — written category acceptance required before any onboarding, dashboard setup, catalog setup, checkout setup, webhook planning, or runtime implementation.

## Current Baseline

Latest stable commit: `ceee2cc` Record FastSpring category clarification sent

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| `docs/D3M_FASTSPRING_FINAL_DECLINE_RECONCILIATION.md` | Yes | FastSpring DECLINED |
| `docs/D3M_FASTSPRING_CATEGORY_CLARIFICATION_SENT_RECORD.md` | Yes | Clarification SENT; response PENDING |
| `docs/D3M_PAYMENT_PROVIDER_REROUTE_PLAN.md` | Yes | Reroute strategy |
| `docs/D3M_PAID_LAUNCH_RISK_REDUCTION_DECISION.md` | Yes | Story-first packaging |
| `docs/D3M_PAYMENT_PROVIDER_PREFLIGHT_PACKAGE.md` | Yes | Prior generic preflight |
| Provider-specific drafts | Yes | This phase |

## Explicit Non-Goals

- No provider contact in this phase
- No application, dashboard, catalog, checkout, API keys, or webhooks
- No automatic email send
- No recording of sensitive onboarding data

## Current Payment Provider State

FastSpring: declined / closed / blocked due to gateway-level product-category restriction.

Lemon Squeezy: rejected / unavailable for this product category.

Primary payment provider: none active.

Provider reroute: required.

Runtime checkout: fail-closed.

Production billing: **NO-GO**.

## Why Preflight Is Required

FastSpring and Lemon Squeezy both consumed significant time before the product-category issue became final. Future providers must be screened through written category preflight before any long onboarding, dashboard setup, catalog setup, checkout setup, webhook planning, or runtime implementation.

## Candidate Providers

| Provider | Role | Current Status | Preflight Required | Notes |
| --- | --- | --- | --- | --- |
| PayPro Global | backup MoR/subscription candidate | **SENT 2026-07-11** | yes | Talk to Sales / contact form — response **PENDING** |
| Paddle | cautious backup MoR/subscription candidate | not sent | yes | category and founder-profile fit must be confirmed |
| Creem | backup candidate | not sent | yes | category and founder-profile fit must be confirmed |

## Product Positioning For Preflight

Dreemi is an AI-assisted children's storytelling SaaS for adult account owners such as parents, guardians, families, and educators. The paid launch should be presented as story-first, with parent/guardian-managed accounts, no child account login, no public sharing, no marketplace, no creator payouts, and no standalone open-ended image generator. Story illustrations may be disabled, deferred, or described only as tightly controlled story illustrations depending on provider acceptance.

## Risk-Sensitive Facts To Disclose

- AI-assisted story generation.
- Children-focused use case.
- Parent/guardian-managed child profiles.
- Optional / controlled story illustrations, not a standalone image-generation marketplace.
- No child account login in the recommended paid launch packaging.
- No public story sharing.
- No marketplace.
- No creator payouts.
- No adult content, gambling, financial services, controlled goods, or physical goods.
- Individual founder based in Saudi Arabia unless a provider requires a registered company.

## Mandatory Questions

1. Can you support onboarding an AI-assisted children's storytelling SaaS?
2. Can you support parent/guardian-managed child profile use cases?
3. Does controlled story illustration / image generation create a prohibited or restricted category issue?
4. Would a story-first paid launch without standalone image generation be acceptable?
5. Can you support a Saudi Arabia-based individual founder / natural-person seller, or is a registered company required?
6. Can you support subscription SaaS / MoR billing for this product type?
7. What is required before activation?

## Provider-Specific Drafts

| Provider | Draft document |
| --- | --- |
| PayPro Global | `docs/D3M_PAYPRO_GLOBAL_PREFLIGHT_EMAIL_DRAFT.md` |
| Paddle | `docs/D3M_PADDLE_PREFLIGHT_EMAIL_DRAFT.md` |
| Creem | `docs/D3M_CREEM_PREFLIGHT_EMAIL_DRAFT.md` |

Send checklist: `docs/D3M_PROVIDER_PREFLIGHT_SEND_CHECKLIST.md`

Tracking log: `docs/D3M_PROVIDER_PREFLIGHT_TRACKING_LOG.md`

Decision rules: `docs/D3M_PROVIDER_PREFLIGHT_DECISION_RULES.md`

## Send Rules

- Send manually only.
- Use official provider contact/support/preflight channel only.
- Do not submit full onboarding until category fit is confirmed.
- Do not provide tax IDs, identity documents, bank details, payout details, screenshots, API keys, webhook secrets, private account IDs, or dashboard URLs in the preflight email.
- If a provider asks for sensitive onboarding information, provide it only through that provider's official secure workflow after category fit is confirmed.
- Record sent date/channel/provider in repo only after manual sending.

## Response Classification

| Classification | Meaning |
| --- | --- |
| **ACCEPTABLE** | Provider confirms category can be considered and founder profile is potentially supported |
| **CONDITIONAL** | Provider may support only if image generation is disabled/deferred, company is registered, or additional compliance controls exist |
| **BLOCKED** | Provider says product category, children/AI use case, founder country/profile, or subscription model cannot be supported |
| **UNCLEAR** | Provider asks for more detail or gives a non-committal response |
| **NO RESPONSE** | No reply after waiting window |

## Disqualification Rules

- Disqualify if provider cannot support AI-assisted children's storytelling.
- Disqualify if provider cannot support the founder profile / supported country path and no viable entity path exists.
- Disqualify if provider refuses children-related SaaS categorically.
- If provider refuses AI image generation but may accept story-first without images, classify as **CONDITIONAL**, not automatically blocked.
- If provider requires a registered company before review, record requirement and evaluate separately.

## Sensitive Data Exclusion

No tax IDs, identity document numbers, bank details, payout details, private account identifiers, order references, checkout URLs, screenshots, API keys, webhook secrets, or private email metadata were recorded.

## What Was Not Done

No provider was contacted in this phase.

No application was submitted.

No dashboard was opened.

No checkout was configured.

No catalog was configured.

No API keys or webhooks were created.

No tax/KYC/payout action was performed.

No runtime payment behavior changed.

No product runtime feature was changed.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| No active production payment provider | Payment | Critical | **BLOCKED** | Provider acceptance | Preflight sent record |
| Provider category acceptance not confirmed | Provider | High | **OPEN** | Written provider reply | Preflight sent record |
| Founder profile / individual seller support not confirmed | Business | High | **OPEN** | Written provider reply | Preflight sent record |
| AI + children + image/story illustration category risk unresolved | Product/risk | High | **OPEN** | Provider or FastSpring clarification | Response record |
| FastSpring final decline | Provider | Critical | **CLOSED** | Decline reconciliation | — |
| Lemon Squeezy rejection | Provider | Critical | **BLOCKED** | Prior record | — |
| Runtime checkout fail-closed | Runtime | Critical | **BLOCKED** (expected) | Provider + implementation | Post-acceptance |
| Webhook implementation not implemented | Integration | Critical | **BLOCKED** | Provider acceptance | Post-acceptance |
| Entitlement runtime mapping not implemented | Integration | Critical | **BLOCKED** | Provider + design | Post-acceptance |
| Live mode not enabled | Activation | High | **BLOCKED** | Provider approval | Post-acceptance |
| Payout not activated | Payout | High | **BLOCKED** | Provider approval | Post-acceptance |
| Production DB uptime decision pending | Infrastructure | High | **OPEN** | Owner/ops decision | Deployment track |
| Production billing NO-GO | Launch | Critical | **BLOCKED** | All gates resolved | Multi-phase |

## Payment Readiness Impact

This package prepares faster, safer provider screening, but does not enable production billing. Production billing remains **NO-GO** until a provider confirms category fit, onboarding path, legal/KYC/tax/payout feasibility, and later runtime integration gates.

## Launch Gate Impact

Provider preflight package gate: **PASS**.

Provider outreach sent gate: **PASS** (PayPro Global **2026-07-11**).

PayPro Global response gate: **PENDING**.

Provider category acceptance gate: **REQUIRED / BLOCKED**.

Provider onboarding gate: **BLOCKED**.

Runtime checkout gate: **BLOCKED**.

Webhook implementation gate: **BLOCKED**.

Entitlement runtime gate: **BLOCKED**.

Live billing gate: **BLOCKED**.

Payout gate: **BLOCKED**.

Production billing: **NO-GO**.

## Recommended Next Phase

**Primary:** `D3M-Payments-PayPro-Preflight-Response-Record` — record and classify PayPro Global's response when received

**Alternative:** `D3M-Payments-Provider-Preflight-Sent-Record-2` — record manual sending to Paddle and/or Creem if sent

## Notes For Next Chat

- PayPro Global preflight **SENT 2026-07-11** via Talk to Sales / contact form — demo-booking confirmation only, **not** category acceptance
- PayPro response **PENDING**; Paddle and Creem **NOT SENT**
- FastSpring: **DECLINED**; Lemon: **rejected**; no active provider
- Production billing: **NO-GO**
- Next: wait for PayPro reply; use `docs/D3M_PAYPRO_GLOBAL_FIRST_REPLY_HANDLING_DRAFT.md` if call pushed before category answer
