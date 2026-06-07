# D3M FastSpring Application Inputs Checklist

## Status

Operational checklist derived from `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`.
**Not ready for submission.** All legal/payout/pricing/policy blockers must be resolved in **`D3M-Payments-Entity-And-Payout-Fill`** first.
No FastSpring account created. No application submitted. Production billing **NO-GO**.

## Required Before Application

- [ ] Entity path selected (individual vs existing vs new entity)
- [ ] Founder legal name confirmed (**USER_TO_CONFIRM**)
- [ ] Country/jurisdiction confirmed (**USER_TO_CONFIRM**)
- [ ] Payout country + account type confirmed (**USER_TO_CONFIRM**)
- [ ] Tax/VAT posture reviewed (**LEGAL/TAX_CONFIRMATION_REQUIRED**)
- [ ] Final plan prices confirmed (**USER_TO_CONFIRM**)
- [ ] Refund/support policy finalized (**USER_TO_CONFIRM**)
- [ ] Terms + Privacy final wording approved (**USER_TO_CONFIRM**)
- [ ] Generated-content licensing wording approved (**USER_TO_CONFIRM**)
- [ ] Demo video recorded (**USER_TO_CONFIRM**)
- [ ] FastSpring policies re-checked on application date

## Product Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Product name | Confirmed | Dreemi |
| Website | Confirmed | https://www.dreemi.app/ |
| Product category | Confirmed | AI-assisted children’s storytelling SaaS |
| Languages | Confirmed | Arabic, English, French |
| Buyer profile | Confirmed | Parents, guardians, families, educators (adults) |
| Subscription model | Confirmed | FREE + paid tiers (INDIVIDUAL, FAMILY, SCHOOL) |
| Product description | Partial | `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md` |
| Demo video | **USER_TO_CONFIRM** | `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md` |

## Legal / Entity Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Seller type | **USER_TO_CONFIRM** | Individual / sole prop OR company |
| Legal name | **USER_TO_CONFIRM** | `[Founder legal name]` |
| Company name (if applicable) | **USER_TO_CONFIRM** | `[Company/legal entity, if applicable]` |
| Country / jurisdiction | **USER_TO_CONFIRM** | `[Country]` — reconfirm B7 context if used |
| Registration number (if company) | **USER_TO_CONFIRM** | — |
| Authorized representative | **USER_TO_CONFIRM** | — |

## Payout Details

| Input | Status | Notes |
| --- | --- | --- |
| Payout country | **USER_TO_CONFIRM** | Do not store in repo |
| Bank account owner | **USER_TO_CONFIRM** | Individual vs company |
| Account type | **USER_TO_CONFIRM** | Per bank/provider requirements |
| Payout currency | **USER_TO_CONFIRM** | — |
| KYC documents | **USER_TO_CONFIRM** | Submit only in provider secure portal |

## Tax / VAT Details

| Input | Status | Notes |
| --- | --- | --- |
| Tax ID / VAT number | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Advisor + user confirmation |
| MoR tax handling understood | Partial | FastSpring MoR handles sales tax/VAT at checkout (recheck official docs) |
| Local tax obligations | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Independent of MoR |

## Pricing Details

| Plan | UI Placeholder (unconfirmed) | Application Status |
| --- | --- | --- |
| FREE | $0 | Confirmed tier; no checkout |
| INDIVIDUAL monthly | $4.99 | **USER_TO_CONFIRM** |
| INDIVIDUAL yearly | $47.90 | **USER_TO_CONFIRM** |
| FAMILY monthly | $9.99 | **USER_TO_CONFIRM** |
| FAMILY yearly | $95.90 | **USER_TO_CONFIRM** |
| SCHOOL monthly | $29.99 | **USER_TO_CONFIRM** + launch status |
| SCHOOL yearly | $287.90 | **USER_TO_CONFIRM** + launch status |
| Currency | USD (UI) | **USER_TO_CONFIRM** |

## Policy Links

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Terms URL | Partial | https://www.dreemi.app/en/terms (confirm locale strategy) |
| Privacy URL | Partial | https://www.dreemi.app/en/privacy |
| Refund policy | **USER_TO_CONFIRM** | URL or embedded policy text |
| Cancellation policy | **USER_TO_CONFIRM** | — |

## Support / Refund Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Support email | Confirmed | contact@dreemi.app |
| Support owner | **USER_TO_CONFIRM** | — |
| Refund period | **USER_TO_CONFIRM** | — |
| Dispute response process | **USER_TO_CONFIRM** | Align with Lemon rejection lessons |

## Demo / Safety Evidence

| Input | Status | Source |
| --- | --- | --- |
| Demo video | **USER_TO_CONFIRM** | Record from demo script |
| AI safety explanation | Partial | KYB pack + safety docs |
| Child-safety positioning | Partial | Adult buyers; supervised child use |
| Content moderation summary | Partial | KYB pack |
| No marketplace / no UGC resale | Confirmed | KYB pack |

## Do Not Include

- Bank account numbers, routing/SWIFT, or IBAN in repo/docs/chat
- Government ID numbers or document images in repo
- API keys, webhook secrets, or `.env` values
- Unconfirmed legal claims ("fully tax compliant", etc.)
- Lemon Squeezy as active provider

## Application Readiness Decision

| Check | Result |
| --- | --- |
| Ready to submit FastSpring application? | **NO** |
| Primary blocker | Entity/payout/pricing/policy inputs unresolved |
| Next phase | **`D3M-Payments-Entity-And-Payout-Fill`** |
| Then | **`D3M-Payments-Provider-Application-Pack`** |
