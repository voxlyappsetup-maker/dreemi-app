# D3M FastSpring Application Inputs Checklist

## Status

Operational checklist derived from `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md` and fill/preflight phases.
**Not ready for submission.** Application pack **blocked** until preflight response confirms eligibility or defines required legal/entity setup.
Contact pack: `docs/D3M_FASTSPRING_PREFLIGHT_CONTACT_PACK.md` — preflight **submitted**; trial store observed — `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md`.
No FastSpring account created. No application submitted. Production billing **NO-GO**.

## Required Before Application

- [x] Founder legal name — **Hayssam Adel Dennaoui**
- [x] Country/jurisdiction — **Saudi Arabia**
- [ ] Payout path **provider support** confirmed (**PROVIDER_CONFIRMATION_REQUIRED**)
- [ ] Tax/VAT posture reviewed (**LEGAL/TAX_CONFIRMATION_REQUIRED**)
- [x] Launch plan prices confirmed — Individual/Family USD (**School deferred**)
- [ ] Refund policy finalized — 7-day period; **draft wording pending finalization**
- [x] Terms + Privacy URLs — https://www.dreemi.app/en/terms | /en/privacy
- [ ] Generated-content licensing — **draft / LEGAL/TERMS_CONFIRMATION_REQUIRED**
- [x] Demo video link provided (sharing **USER_TO_VERIFY**)
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
| Demo video | **Answered** | https://drive.google.com/file/d/1uNimZx4qD17pWrtSnYUMHSLqiRHFB2y-/view?usp=drive_link (verify sharing before send) |

## Legal / Entity Details

| Input | Status | Value / Placeholder |
| --- | --- | --- |
| Application type | **Answered** | Individual / natural person |
| Legal name | **Answered** | Hayssam Adel Dennaoui |
| Country / jurisdiction | **Answered** | Saudi Arabia |
| Company name (if applicable) | N/A | Individual path |
| Authorized representative | **Answered** | Hayssam Adel Dennaoui |

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
| Terms URL | **Answered** | https://www.dreemi.app/en/terms |
| Privacy URL | **Answered** | https://www.dreemi.app/en/privacy |
| Refund policy | **Partial** | 7 days — **draft wording pending finalization** |
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
| Demo video | **Answered** | Google Drive link (verify sharing) |
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
| Primary blockers | Preflight response pending; refund/licensing finalization; tax/VAT; payout confirmation |
| Contact pack / store | Preflight submitted; trial store exists (**not Live**) — **`D3M-Payments-FastSpring-Activation-Checklist`** |
| Then | **`D3M-Payments-Provider-Application-Pack`** |
