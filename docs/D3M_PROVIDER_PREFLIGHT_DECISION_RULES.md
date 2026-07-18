# D3M Provider Preflight Decision Rules

## Status

Docs-only decision rules for classifying provider preflight responses.

Production billing remains **NO-GO**.

## Purpose

Standardize accept / conditional / blocked / unclear / no-response decisions before any provider onboarding.

## Classification Definitions

### ACCEPTABLE

Provider confirms **generative AI SaaS** and the product category can be considered for onboarding and the founder profile (individual or company path stated) is potentially supported. Subscription SaaS / MoR appears feasible. Proceed to **single-provider** setup planning only — not parallel onboarding.

### CONDITIONAL

Provider may support Dreemi only if one or more conditions apply:

- Story illustrations / image generation must be disabled or deferred
- Paid launch must be story-first without standalone image generator
- Registered company required before onboarding
- Additional compliance controls, policies, or review steps required

Record conditions explicitly. Evaluate against `docs/D3M_PAID_LAUNCH_RISK_REDUCTION_DECISION.md` and entity timing before proceeding.

### BLOCKED

Provider declines category fit. Examples:

- Provider refuses **generative AI** / AI-generated content categorically
- AI-assisted children's storytelling not supported
- Children-related SaaS categorically refused
- Saudi Arabia / individual founder path not supported with no viable alternative
- Subscription model not supported for this product type

Do not start dashboard setup, catalog, checkout, webhook, or runtime work.

### UNCLEAR

Provider asks for more detail, redirects to generic sales, or gives non-committal language. One polite follow-up with clarifying questions is allowed. Do not submit full onboarding until classification improves.

### NO RESPONSE

No reply within agreed waiting window (suggest 7–14 business days). One follow-up allowed. If still no response, mark provider as inactive for this cycle and evaluate remaining candidates.

## Disqualification Rules

- Disqualify if provider cannot support **generative AI SaaS** / AI-assisted children's storytelling.
- Disqualify if provider cannot support founder profile / country path and no viable entity path exists.
- Disqualify if provider refuses children-related SaaS categorically.
- Image generation refusal alone → **CONDITIONAL** if story-first without images may be acceptable.
- Registered company requirement → record and evaluate separately; not automatic disqualification if entity path is feasible.

## Single-Provider Rule

After one provider receives **ACCEPTABLE** or workable **CONDITIONAL**, pause outreach to other providers until that path is confirmed or explicitly abandoned in a docs-only decision record.

## Next

PayPro Global **NO RESPONSE** as of **2026-07-18** — see `docs/D3M_PAYPRO_PREFLIGHT_NO_RESPONSE_RECORD.md`. If reply received, classify on generative-AI SaaS acceptance. Additional outreach requires portfolio exception (Dreemi **frozen**).
