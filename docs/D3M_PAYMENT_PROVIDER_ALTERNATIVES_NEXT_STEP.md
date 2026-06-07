# D3M Payment Provider Alternatives Next Step

## Status

Next-step research **completed** 2026-06-07. Selection document: `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md`. Shortlist: `docs/D3M_PAYMENT_PROVIDER_SHORTLIST.md`.
**No provider is selected in this document.**
No provider research, dashboard access, or API calls were performed in this phase.
Production billing remains **NO-GO**.

## Purpose

- Outline how to choose a realistic alternative to Lemon Squeezy after final rejection.
- Define evaluation categories and criteria without making final policy claims.
- List required user inputs and expected decision output for a future selection phase.

## Why Alternatives Are Required

Lemon Squeezy **rejected the store** after a risk/supportability review involving Stripe/PayPal processor constraints. Lemon is **not active** and must not be the primary activation path. Dreemi still needs an approved Merchant-of-Record or compliant payment path before production billing can be considered.

## Provider Categories To Evaluate

Requires **up-to-date review** in the selection phase—policies change:

| Category | Examples (non-exhaustive) | Notes |
| --- | --- | --- |
| Merchant of Record | Paddle, FastSpring, PayPro Global, Creem, Polar | MoR handles tax/chargebacks; KYB heavy |
| Marketplace/light MoR | Gumroad | May not fit SaaS/subscription scale |
| Direct processor | Stripe (if eligible) | Entity/country/KYC dependent; not MoR by default |
| Manual bridge | Invoice, bank transfer | Legal/accounting review required |
| Regional/local | Local acquirer + entity | Entity formation may be required |
| Deferred monetization | Waitlist / free tier only | Safe while payment blocked |

**Do not treat this list as recommendations.** Verify current acceptance of AI-assisted children/family SaaS.

## Evaluation Criteria

Score each candidate in the selection phase:

| Criterion | Question |
| --- | --- |
| Country / legal entity eligibility | Can the founder/entity onboard? |
| MoR coverage | Is the provider MoR or processor-only? |
| Subscription support | Monthly/yearly plans for INDIVIDUAL/FAMILY/SCHOOL? |
| AI / content policy | Acceptance of AI-assisted children’s content? |
| Child / family product supportability | Explicit restrictions? |
| Disputes / refunds / support | Required policies and SLAs? |
| Webhook / API maturity | Subscription lifecycle, idempotency? |
| Payout path | Bank/Wise/Payoneer; country support? |
| Fees | Platform + payment fees |
| Tax / VAT | Who collects/remits? |
| Implementation complexity | Fit with existing fail-closed billing gate |

## Required User Inputs

- `[Country]` and legal entity status
- `[Founder legal name]` / `[Company/legal entity, if applicable]`
- Payout destination preferences
- Target markets (e.g., MENA, EU, US)
- Willingness to form a foreign entity if required
- Budget for MoR fees vs engineering cost
- Risk appetite for appeal vs new provider only

## Research Requirements

The selection phase **must**:

- Use **current** provider policy pages and application forms (not stale repo notes).
- Confirm AI/children’s product acceptance in writing or official docs where possible.
- Document disqualifiers before any integration work.
- Reuse `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md` assets for KYB submissions to the chosen provider.

The selection phase **must not**:

- Enable checkout or configure secrets without explicit approval phase.
- Mark payment gates PASS from research alone.

## Decision Output Expected

A single recorded outcome:

```text
Selected provider category: [TBD]
Selected provider name: [TBD] or NO-PAYMENT / WAITLIST
Rationale: [TBD]
Disqualifiers for others: [TBD]
Next implementation phase: [TBD]
```

Research completed in **`D3M-Payments-Alternative-Provider-Selection`** — see `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md` and `docs/D3M_PAYMENT_PROVIDER_SHORTLIST.md`.

## Recommended Next Phase

**`D3M-Payments-Entity-And-Payout-Decision`** — if `[Country]` / legal entity unresolved — then **`D3M-Payments-Provider-Application-Pack`** (FastSpring primary, Creem backup).

Alternative (non-primary): **`D3M-Payments-Lemon-Appeal-Draft`** — only if user explicitly chooses appeal.
