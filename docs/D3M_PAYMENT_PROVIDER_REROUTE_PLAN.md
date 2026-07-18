# D3M Payment Provider Reroute Plan

## Status

Docs-only reroute plan. No provider application, dashboard setup, checkout, webhook, or runtime changes were made in this phase.

Production billing remains **NO-GO**.

## Purpose

Define the post-FastSpring-decline payment provider reroute strategy, candidate shortlist, preflight requirements, and safe sequencing before any new provider onboarding effort.

## Current Payment Provider State

| Provider | Status |
| --- | --- |
| FastSpring | **DECLINED** — gateway product-category restriction, **clarified as generative AI**; runtime **FROZEN** |
| Lemon Squeezy | **Rejected / unavailable** for this product category |
| PayPro Global | Backup candidate — **SENT 2026-07-11**; **NO RESPONSE** as of **2026-07-18**; preflight required |
| Paddle | Cautious backup candidate — **not started**; preflight required |
| Creem | Backup candidate — **not started**; preflight required |
| Manual invoice / bank transfer | Possible later B2B/school bridge only — not consumer checkout |

No active production payment provider is currently approved.

## Why Reroute Is Required

FastSpring is blocked due to gateway product-category restriction, **clarified as generative AI** (subscription model **not** the issue). Lemon Squeezy is unavailable/rejected. Prior FastSpring onboarding progress and risk-cleared signals are superseded by the final decline. Dreemi cannot proceed to production billing on either prior primary path.

## Reroute Principles

- Preflight before onboarding.
- Ask category acceptance first.
- Ask individual/natural-person support first.
- Ask Saudi-resident founder support first.
- Ask whether AI-assisted children's storytelling is supported.
- Ask whether story illustration/image generation changes risk category.
- Ask whether parent/guardian-managed child profiles are acceptable.
- Ask whether MoR/subscription SaaS is supported for this product.
- Do not create catalog, checkout, or webhooks until provider confirms fit.

## Candidate Provider Shortlist

1. **PayPro Global** — backup candidate; requires preflight category acceptance.
2. **Paddle** — cautious backup candidate; requires preflight category acceptance.
3. **Creem** — backup candidate; requires preflight category acceptance.

## Mandatory Preflight Questions

- Can you support onboarding an AI-assisted children's storytelling SaaS?
- Can you support parent/guardian-managed child profile use cases?
- Does the provider support **generative AI SaaS** (not just SaaS subscriptions)?
- Does controlled story illustration / image generation create a prohibited category issue?
- Can you support a Saudi Arabia-based individual founder / natural-person seller, or is a registered company required?
- Can you support subscription billing / MoR handling for this product type?
- What would be required before activation?

## Disqualification Rules

- If a provider cannot support AI-assisted children's storytelling, **disqualify**.
- If a provider cannot support the founder profile / supported country path, **disqualify**.
- If a provider refuses children-related SaaS, **disqualify**.
- If a provider refuses AI image generation categorically, consider whether story-only packaging can be accepted before disqualifying.
- If a provider requires a registered company before review, record requirement and evaluate separately.

## Product Packaging Recommendation

See `docs/D3M_PAID_LAUNCH_RISK_REDUCTION_DECISION.md`. Paid Launch v1 should be **story-first** and lower risk to improve category acceptance odds with new providers.

## Entity / Individual Founder Considerations

Dreemi is not currently operated through a registered company entity. Prior FastSpring thread explored individual/natural-person onboarding; final FastSpring decline was **not** stated as a company-registration issue. New provider preflight must confirm individual founder / Saudi Arabia support before long onboarding.

## Technical Integration Policy

- No runtime checkout, webhook, entitlement, or database work until one provider gives written category acceptance and onboarding path clarity.
- FastSpring runtime plans are **FROZEN** — historical only.
- Runtime integration only after provider acceptance, legal/onboarding clarity, and official docs verification.

## Decision Matrix

| Criterion | Weight | Notes |
| --- | --- | --- |
| Written category acceptance | **Required** | Gate before any setup |
| Children/AI storytelling support | **Required** | Core product fit |
| Individual founder / Saudi support | **High** | Entity path clarity |
| MoR + subscription SaaS | **High** | Billing model fit |
| Image/story illustration policy | **High** | May affect packaging |
| Implementation complexity | Medium | After acceptance only |
| Historical FastSpring fit | N/A | **Closed** |

## Recommended Sequence

1. Finalize product-risk packaging decision.
2. Send short preflight category email to PayPro Global, Paddle, and Creem.
3. Wait for written category acceptance before dashboard setup.
4. Pick one provider only after acceptance.
5. Then run provider-specific setup phase.
6. Runtime integration only after provider acceptance, legal/onboarding clarity, and official docs verification.

## What Not To Do

- Do not continue FastSpring Live, payout, tax/KYC, webhook, or runtime work.
- Do not apply to multiple providers with full onboarding in parallel.
- Do not create catalog/checkout/webhooks before category preflight PASS.
- Do not claim production billing readiness without provider acceptance and runtime gates.

## Next

**Primary:** `D3M-Payments-PayPro-Preflight-Response-Record` — if PayPro Global replies

**No-response record:** `docs/D3M_PAYPRO_PREFLIGHT_NO_RESPONSE_RECORD.md` — **NO RESPONSE** as of **2026-07-18**

**Alternative (portfolio decision):** `D3M-Portfolio-Dreemi-Reactivation-Or-Exception-Decision` — before additional outreach
