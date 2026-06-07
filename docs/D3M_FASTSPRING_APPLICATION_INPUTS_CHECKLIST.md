# D3M FastSpring Application Inputs Checklist

## Status

Operational checklist derived from `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md` and fill phase **D3M-Payments-Entity-And-Payout-Fill**.
**Not ready for submission.** Provider eligibility (**PROVIDER_CONFIRMATION_REQUIRED**) and remaining legal/KYC inputs must be resolved before application.
No FastSpring account created. No application submitted. Production billing **NO-GO**.

## Required Before Application

- [x] Entity path selected — **Individual / natural person**
- [ ] Founder legal name confirmed (**USER_TO_CONFIRM**)
- [x] Country/jurisdiction — **Saudi Arabia** (application path)
- [ ] Payout path **provider support** confirmed (**PROVIDER_CONFIRMATION_REQUIRED** — SA bank or PayPal)
- [ ] Tax/VAT posture reviewed (**LEGAL/TAX_CONFIRMATION_REQUIRED**)
- [x] Launch plan prices confirmed — Individual/Family USD (**School deferred**)
- [ ] Refund policy finalized — 7-day period set; full wording **USER_TO_CONFIRM**
- [ ] Terms + Privacy — user says ready; exact URLs **USER_TO_CONFIRM**
- [ ] Generated-content licensing wording (**USER_TO_CONFIRM** / **LEGAL_CONFIRMATION_REQUIRED**)
- [ ] Demo video recorded (**USER_TO_CONFIRM**)
- [ ] FastSpring individual/SA/payout eligibility confirmed (**PROVIDER_CONFIRMATION_REQUIRED**)
- [ ] FastSpring policies re-checked on application date

## Product Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Product name | Confirmed | Dreemi |
| Website | Confirmed | https://www.dreemi.app/ |
| Product category | Confirmed | AI-assisted children’s storytelling SaaS |
| Languages | Confirmed | Arabic, English, French |
| Buyer profile | Confirmed | Parents, guardians, families, educators (adults) |
| Subscription model | Confirmed | FREE + INDIVIDUAL + FAMILY at launch; SCHOOL deferred |
| Product description | Partial | `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md` |
| Demo video | **USER_TO_CONFIRM** | `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md` |

## Legal / Entity Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Application type | **Answered** | Individual / natural person |
| Legal name | **USER_TO_CONFIRM** | `[Founder legal name]` |
| Company name (if applicable) | N/A | Individual path |
| Country / jurisdiction | **Answered** | Saudi Arabia |
| Registration number (if company) | N/A | Individual path |
| Authorized representative | **Partial** | Founder/user — legal name pending |

## Payout Details

| Input | Status | Notes |
| --- | --- | --- |
| Payout path candidates | **Answered** | Saudi Arabia bank account **or** PayPal |
| Payout provider support | **PROVIDER_CONFIRMATION_REQUIRED** | Do not treat either path as approved |
| Bank account owner | **Answered** | Individual (natural person) |
| Account type | **USER_TO_CONFIRM** | At application; not stored in repo |
| Payout/pricing currency | **Answered** | USD (catalog); payout rules per FastSpring |
| KYC documents | **USER_TO_CONFIRM** | Submit only in provider secure portal |

## Tax / VAT Details

| Input | Status | Notes |
| --- | --- | --- |
| Tax ID / VAT number | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Saudi individual seller — advisor review |
| MoR tax handling understood | Partial | FastSpring MoR handles sales tax/VAT at checkout (recheck official docs) |
| Local tax obligations | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Independent of MoR |

## Pricing Details

| Plan | Price | Application Status |
| --- | --- | --- |
| FREE | USD 0 | Confirmed tier; no checkout |
| INDIVIDUAL monthly | USD 4.99 | **Answered** |
| INDIVIDUAL yearly | USD 47.90 | **Answered** |
| FAMILY monthly | USD 9.99 | **Answered** |
| FAMILY yearly | USD 95.90 | **Answered** |
| SCHOOL | — | **Deferred** — not launch-critical |
| Currency | USD | **Answered** |

See `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`.

## Policy Links

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Terms URL | **USER_TO_CONFIRM** | User says ready on dreemi.app — verify exact URL before submission |
| Privacy URL | **USER_TO_CONFIRM** | Same — verify exact URL before submission |
| Refund policy | **Partial** | **7 days** — full wording **USER_TO_CONFIRM** |
| Cancellation policy | **USER_TO_CONFIRM** | — |

## Support / Refund Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Support email | Confirmed | contact@dreemi.app |
| Support owner | **Answered** | Founder/user |
| Refund period | **Answered** | 7 days |
| Dispute response process | **Partial** | Founder/user via contact@dreemi.app |

## Demo / Safety Evidence

| Input | Status | Source |
| --- | --- | --- |
| Demo video | **USER_TO_CONFIRM** | Record from demo script |
| AI safety explanation | Partial | KYB pack + safety docs |
| Child-safety positioning | Partial | Adult buyers; supervised child use |
| Content moderation summary | Partial | KYB pack |
| No marketplace / no UGC resale | Confirmed | KYB pack |

## Do Not Include

- Bank account numbers, routing/SWIFT, IBAN, or PayPal account details in repo/docs/chat
- Government ID numbers or document images in repo
- API keys, webhook secrets, or `.env` values
- Unconfirmed legal claims ("fully tax compliant", etc.)
- Assumption that FastSpring accepts individual/SA/payout path without provider confirmation
- Lemon Squeezy as active provider

## Application Readiness Decision

| Check | Result |
| --- | --- |
| Ready to submit FastSpring application? | **NO** |
| Primary blockers | **PROVIDER_CONFIRMATION_REQUIRED** (individual/SA/payout); founder legal name; tax/VAT; exact policy URLs |
| Next phase | **`D3M-Payments-FastSpring-Eligibility-Preflight`** |
| Then | **`D3M-Payments-Provider-Application-Pack`** |
