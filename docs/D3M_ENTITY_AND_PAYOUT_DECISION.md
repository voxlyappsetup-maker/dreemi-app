# D3M Entity And Payout Decision

## Status

This is a docs-only legal/entity/payout decision package.
No provider account was created.
No provider dashboard was accessed.
No provider application was submitted.
No payment checkout was executed.
No payment purchase was executed.
No live webhook was executed.
No provider API call was made.
No env/secrets were read, printed, verified, or modified.
Production billing remains **NO-GO**.

## Purpose

- Identify legal/entity/payout information required **before** FastSpring (or any MoR) application.
- Separate **confirmed product facts** from **USER_TO_CONFIRM** and **LEGAL/TAX_CONFIRMATION_REQUIRED** items.
- Define entity/payout decision options and blockers without providing legal or tax advice.
- Prepare inputs for **`D3M-Payments-Provider-Application-Pack`** after user answers are collected.

## Current Baseline

- Latest stable commit: `289a96a Select alternative payment provider path`
- Primary payment candidate: **FastSpring**
- Backup candidate: **Creem**
- Lemon Squeezy: **REJECTED / NOT ACTIVE**
- Production billing: **NO-GO**

## Source Availability

| Source | Status |
| --- | --- |
| `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md` | Available |
| `docs/D3M_PAYMENT_PROVIDER_SHORTLIST.md` | Available |
| `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md` | Available (reusable KYB kit) |
| `docs/D3M_PAYMENT_LEGAL_PAYOUT_PATH_DECISION_PACK.md` | Available (B7 planning context) |
| `docs/D3M_LEMON_REJECTION_RECONCILIATION.md` | Available |
| Founder legal name / entity / bank details | **Not confirmed in repo** — USER_TO_CONFIRM |

## Explicit Non-Goals

- No legal advice.
- No tax advice.
- No provider application.
- No provider account creation.
- No checkout, purchase, or webhook execution.
- No provider dashboard access.
- No env/secrets read or modified.
- No deployment or code/runtime changes.

## Current Payment Path

| Item | Status |
| --- | --- |
| Primary candidate | **FastSpring** |
| Backup candidate | **Creem** |
| Lemon Squeezy | **REJECTED / NOT ACTIVE** |
| Provider selected | **Candidate only** |
| Provider application | **Not submitted** |
| Checkout/webhook verification | **Not executed** |
| Production billing | **NO-GO** |

## Why This Decision Is Required

Provider applications (MoR or processor) require consistent legal identity, payout destination, and policy posture:

1. **Legal identity / entity** — seller name, jurisdiction, and registration details drive KYC/KYB eligibility.
2. **Payout path** — MoR providers pay out to an approved beneficiary bank account; country/currency/account-type rules vary.
3. **Tax/VAT posture** — even when MoR handles sales tax/VAT at checkout, local income-tax and reporting obligations may remain (**LEGAL/TAX_CONFIRMATION_REQUIRED**).
4. **Refund/support/dispute posture** — Lemon rejection cited supportability and dispute concerns; incomplete policies increase approval risk.
5. **Application integrity** — submitting FastSpring/Creem applications with placeholders or inconsistent data wastes review cycles and may trigger rejection.

**Do not submit FastSpring application until entity/payout/pricing/policy inputs below are confirmed.**

## Confirmed Facts

Product/project facts confirmed for provider evaluation (no legal entity assumed):

| Fact | Detail |
| --- | --- |
| Product | Dreemi / Qisas — AI-assisted **children’s storytelling SaaS** |
| Website | https://www.dreemi.app/ |
| Support email | contact@dreemi.app |
| Languages | Arabic, English, French |
| Buyers | Adults: parents, guardians, families, educators/schools |
| End users | Children (supervised; do not purchase directly) |
| Product model | Digital SaaS subscriptions; no marketplace; no creator payouts; no physical goods |
| Plan tiers (catalog) | FREE, INDIVIDUAL, FAMILY, SCHOOL (`services/api/src/config/billing.ts`) |
| Billing cycles (catalog) | Monthly and yearly variants defined for paid tiers |
| Payment behavior | Unavailable / fail-closed until approved provider configured |
| Lemon Squeezy | Rejected / not active |
| Primary MoR candidate | FastSpring |
| Backup MoR candidate | Creem |
| Policy pages (routes exist) | `/{locale}/terms`, `/{locale}/privacy` |
| Reusable KYB materials | `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md` |

## User-To-Confirm Facts

| Item | Current Status | Why Needed | Required Before | Notes |
| --- | --- | --- | --- | --- |
| Founder legal name | **USER_TO_CONFIRM** | KYC/KYB identity | FastSpring application | Placeholder in KYB pack |
| Legal entity name or individual-application decision | **USER_TO_CONFIRM** | Seller of record vs individual seller | Entity option selection | See Entity Options |
| Country / jurisdiction (residence + seller context) | **USER_TO_CONFIRM** | Provider eligibility, payout rules | Application | B7 pack notes Lebanese resident in Saudi Arabia — **reconfirm** |
| Tax/VAT registration status | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Application + local compliance | Application / launch | MoR does not eliminate all local obligations |
| Bank/payout country | **USER_TO_CONFIRM** | Payout eligibility | Application | Do not store bank details in repo |
| Payout currency preference | **USER_TO_CONFIRM** | Payout setup | Application | Often USD/EUR depending on provider |
| Support email | Confirmed project fact | Provider/support review | Application | contact@dreemi.app — reconfirm operational |
| Website URL | Confirmed project fact | Provider review | Application | https://www.dreemi.app/ |
| Individual plan price + billing interval | **USER_TO_CONFIRM** | Product catalog in MoR | Application | UI shows $4.99/mo, $47.90/yr — **not confirmed for application** |
| Family plan price + billing interval | **USER_TO_CONFIRM** | Product catalog in MoR | Application | UI shows $9.99/mo, $95.90/yr — **not confirmed** |
| School plan launch status + price | **USER_TO_CONFIRM** | Scope of sold products | Application | UI shows $29.99/mo, $287.90/yr — launch status unconfirmed |
| Refund policy | **USER_TO_CONFIRM** | Dispute/support review | Application | URL or final wording |
| Terms URL + final wording | **USER_TO_CONFIRM** | Legal review + provider KYB | Application | Pages exist; final text unconfirmed |
| Privacy URL + final wording | **USER_TO_CONFIRM** | Data/privacy review | Application | Pages exist; final text unconfirmed |
| Generated-content licensing wording | **USER_TO_CONFIRM** | IP/licensing clarity for AI stories | Application | See KYB pack conservative position |
| Founder social profile URLs | **USER_TO_CONFIRM** | Identity verification (if requested) | Application | Placeholders in KYB pack |
| Demo video | **USER_TO_CONFIRM** | Provider review | Application | Script at `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md` |

## Legal / Tax Disclaimer

This document is a product/project decision aid, **not legal or tax advice**.
Entity, tax, VAT, invoicing, and payout decisions must be confirmed by the user and, where appropriate, **qualified legal/accounting advisors**.
Prior planning context in `docs/D3M_PAYMENT_LEGAL_PAYOUT_PATH_DECISION_PACK.md` is decision support only and does not replace professional review.

## Entity Options

### Option 1 — Individual / Sole Proprietor Application

| Field | Detail |
| --- | --- |
| Description | Apply to MoR as an individual seller if provider supports founder’s country/residency and payout path. |
| When It Fits | Simplest path when MoR accepts individual sellers in user’s jurisdiction without separate company. |
| Risks / Limitations | Personal identity/tax exposure; payout-country constraints; may not fit all residency combinations. |
| Provider Application Impact | FastSpring/Creem onboarding forms use personal legal name + tax ID + personal/sole-prop bank account. |
| Required Inputs | Legal name, country, tax identifiers, payout bank, ID documents per provider. |
| Decision Status | **BLOCKED_PENDING_USER_INPUT** |

Do **not** recommend this path until provider eligibility for the confirmed country/residency is verified.

### Option 2 — Existing Legal Entity Application

| Field | Detail |
| --- | --- |
| Description | Apply using an already-registered company/LLC/other entity as seller beneficiary. |
| When It Fits | Entity already exists with compliant bank account and registration docs. |
| Risks / Limitations | Entity must match product owner; third-party or informal accounts are **not recommended** (per B7 pack). |
| Provider Application Impact | Stronger clarity for B2B/school sales; company registration + authorized representative docs. |
| Required Inputs | Entity name, jurisdiction, registration number, tax/VAT IDs, company bank account, authorized signatory. |
| Decision Status | **BLOCKED_PENDING_USER_INPUT** (entity existence unconfirmed) |

### Option 3 — New Legal Entity Path

| Field | Detail |
| --- | --- |
| Description | Form a new entity (e.g., US LLC, UAE/GCC entity, or other jurisdiction) then apply to MoR. |
| When It Fits | Individual path blocked; provider requires entity; long-term B2B/tax clarity needed. |
| Risks / Limitations | Time, cost, ongoing compliance; foreign entities add accounting/filing burden (**LEGAL/TAX_CONFIRMATION_REQUIRED**). |
| Provider Application Impact | Delays application until entity + bank exist; may improve payout/tax clarity long term. |
| Required Inputs | Jurisdiction choice, formation, banking, tax registration — all via qualified advisors. |
| Decision Status | **DEFERRED** until user/legal review |

B7 pack evaluated US LLC, UAE/GCC, and Saudi paths as **research needed** — not assumed available.

### Option 4 — Manual Invoice / Bank Transfer Bridge

| Field | Detail |
| --- | --- |
| Description | Bill schools/institutions (or early pilots) via manual invoice and bank transfer while MoR approval pending. |
| When It Fits | B2B/education pilots; provider approval delayed; legal review confirms invoicing path. |
| Risks / Limitations | Low automation, poor consumer conversion, manual entitlement ops, weak subscription scale. |
| Provider Application Impact | Does not replace MoR for self-service consumer subscriptions. |
| Required Inputs | Invoice template, payment instructions, manual entitlement process, refund/support workflow. |
| Decision Status | **BRIDGE_ONLY** |

### Option 5 — Free Beta / Waitlist Until Provider Approval

| Field | Detail |
| --- | --- |
| Description | Keep checkout fail-closed; acquire users via free tier/waitlist while entity + MoR path resolves. |
| When It Fits | Safest interim posture; aligns with current production billing NO-GO. |
| Risks / Limitations | No subscription revenue until MoR approved and integrated. |
| Provider Application Impact | None — reduces launch risk during legal/provider uncertainty. |
| Required Inputs | Product messaging that payments are unavailable; support expectations. |
| Decision Status | **CANDIDATE** (immediate safe path) |

## Payout Requirements To Confirm

Confirm with user and provider (never store bank details in repo):

| Requirement | Status |
| --- | --- |
| Payout country | **USER_TO_CONFIRM** |
| Bank account owner (individual vs company) | **USER_TO_CONFIRM** |
| Bank account type (checking/savings; local vs international) | **USER_TO_CONFIRM** |
| Supported payout currency | **USER_TO_CONFIRM** |
| Whether payouts can go to individual or must go to company account | **USER_TO_CONFIRM** + provider rules |
| KYC/KYB documents required (ID, proof of address, company registration) | **USER_TO_CONFIRM** at application |
| Sanctioned/restricted country checks | Provider-dependent — verify at application |

## Tax / VAT / Invoice Requirements To Confirm

| Requirement | Status | Notes |
| --- | --- | --- |
| Who is Merchant of Record at checkout | FastSpring/Creem if approved as MoR | MoR collects/remits sales tax/VAT per provider model |
| Local income-tax obligations | **LEGAL/TAX_CONFIRMATION_REQUIRED** | MoR does not eliminate founder/entity local tax duties |
| VAT/GST registration need | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Depends on jurisdiction and sales volume |
| Who issues customer invoices | MoR (typical) vs merchant | Confirm in provider agreement |
| Refund/chargeback handling | MoR tier-1 (typical) + merchant support policy | Align with published refund policy |
| School/B2B invoice needs | **USER_TO_CONFIRM** | May require entity + manual invoice bridge |

## Pricing Inputs To Confirm

| Input | Current Status | Notes |
| --- | --- | --- |
| Individual plan price + interval | **USER_TO_CONFIRM** | UI placeholder: $4.99/mo, $47.90/yr — confirm before application |
| Family plan price + interval | **USER_TO_CONFIRM** | UI placeholder: $9.99/mo, $95.90/yr |
| School plan availability + price | **USER_TO_CONFIRM** | UI placeholder: $29.99/mo, $287.90/yr; launch status unconfirmed |
| Currency | **USER_TO_CONFIRM** | UI uses USD display; confirm MoR catalog currency |
| Trial/free plan policy | Partially defined | FREE tier exists; trial on paid tiers unconfirmed |
| Refund period | **USER_TO_CONFIRM** | Required for provider + Terms |

## Refund / Support Policy Inputs To Confirm

| Input | Status |
| --- | --- |
| Support channel | contact@dreemi.app (confirm monitored) |
| Refund period / conditions | **USER_TO_CONFIRM** |
| Cancellation policy (end of period vs immediate) | **USER_TO_CONFIRM** |
| Subscription renewal/cancel customer wording | **USER_TO_CONFIRM** |
| Dispute/chargeback response owner | **USER_TO_CONFIRM** |
| Customer support owner / SLA | **USER_TO_CONFIRM** |

## Terms / Generated Content Licensing Inputs To Confirm

| Input | Status |
| --- | --- |
| AI-assisted content disclosure in Terms | **USER_TO_CONFIRM** |
| User rights to generated stories (personal/family/educational use) | **USER_TO_CONFIRM** — conservative draft in KYB pack |
| Restrictions on third-party copyrighted characters | **USER_TO_CONFIRM** |
| Family/educational use wording | **USER_TO_CONFIRM** |
| No resale/marketplace positioning | Confirmed product fact — reflect in final Terms |
| Final Terms/Privacy wording | **USER_TO_CONFIRM** before application send |

## FastSpring Application Inputs

| Input | Status | Source / Placeholder | Required? | Notes |
| --- | --- | --- | --- | --- |
| Product name | Confirmed | Dreemi | Yes | |
| Website | Confirmed | https://www.dreemi.app/ | Yes | |
| Support email | Confirmed | contact@dreemi.app | Yes | Reconfirm inbox monitored |
| Demo video | **USER_TO_CONFIRM** | Script: `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md` | Yes | Not recorded yet |
| Product description | Partial | `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md` | Yes | Adapt for FastSpring |
| Pricing / plans | **USER_TO_CONFIRM** | UI placeholders only | Yes | Confirm amounts + School launch |
| Legal seller identity | **USER_TO_CONFIRM** | Individual vs entity TBD | Yes | Blocker |
| Tax/VAT details | **LEGAL/TAX_CONFIRMATION_REQUIRED** | — | Yes | Advisor review |
| Bank/payout details | **USER_TO_CONFIRM** | Not in repo | Yes | Provide only in secure provider form |
| Refund/support policy | **USER_TO_CONFIRM** | — | Yes | Publish before/at application |
| Privacy/Terms URLs | Partial | /privacy, /terms routes exist | Yes | Final wording unconfirmed |
| AI/content safety explanation | Partial | KYB pack + safety docs | Yes | Emphasize adult buyers, safety gates |
| Child-safety positioning | Partial | KYB pack | Yes | Adult purchasers; no child checkout |
| Founder social URLs | **USER_TO_CONFIRM** | KYB placeholders | Maybe | If requested for KYC |

See also: `docs/D3M_FASTSPRING_APPLICATION_INPUTS_CHECKLIST.md`

## Creem Backup Inputs

| Input | Status | Required? | Notes |
| --- | --- | --- | --- |
| Product name, website, support email | Confirmed | Yes | Same as FastSpring pack |
| Legal seller identity + payout | **USER_TO_CONFIRM** | Yes | Same blockers |
| Pricing/plans | **USER_TO_CONFIRM** | Yes | Creem product setup |
| Demo + safety narrative | Partial | Yes | Reuse KYB materials |
| Tax/VAT | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Yes | Advisor review |
| Policies (Terms/Privacy/refund) | **USER_TO_CONFIRM** | Yes | Same as primary path |

Apply to Creem only if FastSpring declines or entity constraints block FastSpring.

## Decision Matrix

| Path | Speed | Approval Clarity | Operational Complexity | Tax/Legal Clarity | Provider Fit | Risks | Decision Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Individual MoR application | Fast if eligible | Medium | Low–Med | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Good if supported | Payout/residency limits | **BLOCKED_PENDING_USER_INPUT** |
| Existing entity MoR application | Medium | High | Med | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Good | Entity must exist + match product | **BLOCKED_PENDING_USER_INPUT** |
| New entity then MoR | Slow | High | High | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Good long term | Cost, delay, compliance | **DEFERRED** |
| Manual invoice bridge | Fast for pilots | N/A (non-MoR) | High manual | **LEGAL/TAX_CONFIRMATION_REQUIRED** | School/B2B only | Not scalable for consumer subs | **BRIDGE_ONLY** |
| Free beta / waitlist | Immediate | N/A | Low | Low immediate payment complexity | N/A until MoR | No revenue | **CANDIDATE** |

## Recommended Decision Position

**Decision: Do not submit FastSpring application until legal/entity/payout details are confirmed.**

**Recommended immediate path:**

1. Collect user answers for entity option, payout country/bank, pricing confirmation, refund/support policy, and Terms/licensing wording.
2. Obtain **LEGAL/TAX_CONFIRMATION_REQUIRED** review where jurisdiction/tax registration is unclear.
3. Continue **free beta/waitlist** with checkout fail-closed.
4. **FastSpring** remains primary candidate; **Creem** remains backup.

Do **not** select final entity path without user input. Do **not** treat UI pricing as confirmed application pricing.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence / User Input | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Legal/entity decision unresolved | Legal | Critical | Open | Individual vs existing vs new entity | **D3M-Payments-Entity-And-Payout-Fill** |
| Payout country/bank unresolved | Payout | Critical | Open | Payout destination + account type | **D3M-Payments-Entity-And-Payout-Fill** |
| Tax/VAT posture unresolved | Tax | High | Open | Advisor confirmation | Entity fill + legal review |
| Pricing unresolved for application | Product | High | Open | Confirm plan prices, currency, School launch | **D3M-Payments-Entity-And-Payout-Fill** |
| Refund/support policy unresolved | Ops | High | Open | Published refund/cancel policy | Entity fill |
| Terms/licensing wording unresolved | Legal | High | Open | Final Terms/Privacy + generated-content license | Entity fill |
| Provider application not submitted | Provider | Critical | Blocked | Complete inputs above | **D3M-Payments-Provider-Application-Pack** |
| Provider approval missing | Provider | Critical | Blocked | FastSpring/Creem review outcome | Post-application phases |

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Entity/payout decision | **Documented — user input pending** |
| Provider application | **Not submitted** |
| Provider approval | **Pending** |
| Checkout verification | **Not executed** |
| Webhook verification | **Not executed** |
| Production billing | **NO-GO** |

Payment gates remain **BLOCKED**. Do not mark payment gates PASS.

## Required User Answers

Answer in **`D3M-Payments-Entity-And-Payout-Fill`** (next phase). Practical minimum:

1. **Entity path:** Individual/sole proprietor, existing company, or new entity (which jurisdiction)?
2. **Founder legal name** (as it should appear on provider KYC).
3. **Country/jurisdiction** for seller identity and tax residency (confirm or update B7 planning context).
4. **Payout country** and whether account will be personal or company.
5. **Payout currency** preference (if known).
6. **Tax/VAT:** Any existing registration numbers? Advisor engaged? (**LEGAL/TAX_CONFIRMATION_REQUIRED**)
7. **Confirm final prices:** Individual, Family, School — monthly/yearly USD amounts and whether School plan is launching now or later.
8. **Refund policy:** Period, conditions, and cancellation behavior.
9. **Terms/Privacy:** Confirm URLs and whether final legal wording is approved for provider review.
10. **Generated-content licensing:** Approve conservative KYB wording or provide final Terms text.
11. **Support:** Confirm contact@dreemi.app is monitored and name support/dispute owner.
12. **Demo video:** Record per script or defer application until available?
13. **Social profile URLs** for KYC (if comfortable providing).
14. **Bridge preference:** Free beta/waitlist only, or also pursue manual school invoicing?

## Recommended Next Phase

1. **`D3M-Payments-Entity-And-Payout-Fill`** — user answers entity/payout/pricing/policy questions in structured form.
2. **`D3M-Payments-Provider-Application-Pack`** — prepare FastSpring application packet (Creem backup) after fill phase complete.

## Notes For Next Chat

- Do not submit FastSpring/Creem applications until fill phase completes.
- Do not store bank account numbers, tax IDs, or identity document contents in repo/docs/chat.
- Reuse `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md`; replace Lemon-specific references with FastSpring.
- B7 founder context (Lebanese resident in Saudi Arabia) is planning-only — **user must reconfirm** before application.
- Production billing remains **NO-GO** until provider approval + controlled verification phases pass.

## Related Artifacts

- FastSpring checklist: `docs/D3M_FASTSPRING_APPLICATION_INPUTS_CHECKLIST.md`
- Provider selection: `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md`
- B7 legal/payout planning: `docs/D3M_PAYMENT_LEGAL_PAYOUT_PATH_DECISION_PACK.md`
- KYB reusable pack: `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md`
