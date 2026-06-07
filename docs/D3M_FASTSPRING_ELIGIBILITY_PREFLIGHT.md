# D3M FastSpring Eligibility Preflight

## Status

This is a docs-only FastSpring eligibility preflight.
No FastSpring account was created.
No FastSpring application was submitted.
No provider dashboard was accessed.
No payment checkout was executed.
No payment purchase was executed.
No live webhook was executed.
No provider API call was made.
No env/secrets were read, printed, verified, or modified.
Production billing remains **NO-GO**.

## Purpose

- Document what **official FastSpring sources** confirm vs do not confirm for Dreemi’s intended application path.
- Identify eligibility questions to ask FastSpring **before** application submission.
- Decide next phase: preflight contact pack, fill remaining placeholders, or Creem backup preflight.
- Do **not** mark FastSpring as approved or eligible from public sources alone.

## Current Baseline

- Latest stable commit: `e88a39e Fill entity payout and pricing decisions`
- Primary candidate: **FastSpring**
- Backup candidate: **Creem**
- Lemon Squeezy: **REJECTED / NOT ACTIVE**
- FastSpring application: **NOT SUBMITTED**
- Provider eligibility: **UNCONFIRMED**

## Source Availability

| Source | Status |
| --- | --- |
| `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md` | Available |
| `docs/D3M_FASTSPRING_APPLICATION_INPUTS_CHECKLIST.md` | Available |
| `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md` | Available |
| FastSpring official website / legal / developer docs | Reviewed (research date: **2026-06-07**) |
| FastSpring sales/support written confirmation | **Not obtained** — required before application |

## Explicit Non-Goals

- No FastSpring account creation, application submission, or dashboard access.
- No checkout, purchase, webhook, or API calls.
- No contact with FastSpring in this phase (draft only).
- No legal/tax advice or eligibility approval claims.

## Research Method

| Item | Detail |
| --- | --- |
| Research date | **2026-06-07** |
| Sources | FastSpring official website, Terms of Service for Vendors, developer docs (activate store, payouts, products, webhooks) |
| Method | Official pages only; no affiliate reviews, forums, or AI summaries |
| Public confirmation | Broad product fit for SaaS / AI / subscriptions / MoR / tax / API / webhooks |
| Public gap | Individual applicant from **Saudi Arabia**, seller-country path, **Saudi bank payout**, and **PayPal payout for this profile** not clearly confirmed on public pages |
| Status for seller/payout path | **PROVIDER_CONFIRMATION_REQUIRED** |
| Policy drift | Recheck official sources immediately before application or contact |

Official sources reviewed (sample):

- AI solutions: https://fastspring.com/solutions/ai/
- Merchant of Record: https://fastspring.com/merchant-of-record/
- Tax/VAT: https://fastspring.com/tax-management/
- Welcome / MoR partnership: https://developer.fastspring.com/docs/welcome-to-fastspring
- Activate store / KYC: https://developer.fastspring.com/docs/activate-your-store
- Manage products / prohibited sales: https://developer.fastspring.com/docs/manage-your-products
- Payout portal overview: https://developer.fastspring.com/docs/payout-portal-overview
- Set up payout account (PayPal / bank): https://developer.fastspring.com/docs/set-up-your-payout-account
- Receive payouts / USD: https://developer.fastspring.com/docs/receive-payouts
- Terms of Service for Vendors: https://fastspring.com/terms-use/seller-terms-service/
- Legal index: https://fastspring.com/legal/

## Current Intended Application Path

| Input | User-provided value |
| --- | --- |
| Application path | Individual / natural person |
| Country path | Saudi Arabia |
| Payout candidates | Saudi Arabia bank account **or** PayPal |
| Currency | USD |
| Individual plan | USD 4.99 monthly / USD 47.90 yearly |
| Family plan | USD 9.99 monthly / USD 95.90 yearly |
| School plan | Deferred / not launch-critical |
| Refund period | 7 days |
| Support / disputes | Founder/user via contact@dreemi.app |

## Officially Confirmed FastSpring Fit

| Area | Official Finding | Fit For Dreemi | Confidence | Notes |
| --- | --- | --- | --- | --- |
| AI products | FastSpring markets all-in-one payments/subscriptions/compliance for **AI companies** | Strong | **CONFIRMED_BY_OFFICIAL_SOURCE** | https://fastspring.com/solutions/ai/ |
| SaaS | Developer docs include SaaS/subscriptions use case | Strong | **CONFIRMED_BY_OFFICIAL_SOURCE** | https://developer.fastspring.com/docs/welcome-to-fastspring |
| Subscriptions | Subscription plans, recurring billing documented | Strong | **CONFIRMED_BY_OFFICIAL_SOURCE** | Activate store + product types |
| MoR | FastSpring acts as Merchant of Record; resells vendor products | Strong | **CONFIRMED_BY_OFFICIAL_SOURCE** | MoR pages + vendor terms |
| Tax/VAT | MoR collects/remits sales tax and VAT globally | Strong | **CONFIRMED_BY_OFFICIAL_SOURCE** | https://fastspring.com/tax-management/ |
| APIs / webhooks | REST API + webhooks documented for future integration | Strong (technical) | **CONFIRMED_BY_OFFICIAL_SOURCE** | Developer docs; **no integration in this phase** |
| Vendor definition | **Vendor** may be **individual or organization** on Order Form / Sign-up Flow | Compatible with intended path | **CONFIRMED_BY_OFFICIAL_SOURCE** | Vendor Terms §2; does **not** confirm every country |
| Vendor onboarding | Underwriting; may request owners, registration, tax ID, bank info; **may deny onboarding** | Expect review | **CONFIRMED_BY_OFFICIAL_SOURCE** | Vendor Terms §4.1 |
| Prohibited categories | Adult, tobacco, pharma, gambling, hate/violence, third-party processing prohibited | Dreemi must stay outside these | **CONFIRMED_BY_OFFICIAL_SOURCE** | Products doc + Vendor Terms §4.5 |
| USD pricing/payout alignment | USD store + USD payout = no conversion fee | Matches intended USD catalog | **CONFIRMED_BY_OFFICIAL_SOURCE** | Receive payouts doc |
| PayPal as transfer method | Payouts Portal supports **PayPal** transfer method | Candidate only | **NOT_CONFIRMED_PUBLICLY** for SA individual profile | Set up payout doc lists PayPal; country availability varies |
| Payout geography blocklist | Portal cannot support sellers in Cuba, Iran, Iraq, Myanmar, DPRK, Russia, Somalia, Sudan, Syria | **Saudi Arabia not listed** | **CONFIRMED_BY_OFFICIAL_SOURCE** (negative list only) | Does **not** prove SA bank eligibility |

## Not Publicly Confirmed

| Item | Public Official Status | Preflight Status | Required Next Evidence |
| --- | --- | --- | --- |
| Individual applicant from Saudi Arabia | Vendor may be individual; no public country eligibility matrix found | **PROVIDER_CONFIRMATION_REQUIRED** | FastSpring sales/support written answer |
| Saudi Arabia as seller country path | Sign-up/onboarding country rules not published in reviewed pages | **PROVIDER_CONFIRMATION_REQUIRED** | Preflight contact before application |
| Saudi bank payout | Bank transfer methods depend on Country/Region selection; SA not documented in reviewed pages | **PROVIDER_CONFIRMATION_REQUIRED** | Confirm in Payouts Portal rules or support |
| PayPal payout for this profile | PayPal listed as method; profile/country pairing not confirmed | **PROVIDER_CONFIRMATION_REQUIRED** | Confirm PayPal availability for SA individual vendor |
| Required KYC for individual Saudi applicant | KYC required at activation; exact document list not country-specific in public docs | **PROVIDER_CONFIRMATION_REQUIRED** | Support/onboarding checklist |
| Legal entity recommended or required | Terms allow individual vendor; underwriting may still require entity | **PROVIDER_CONFIRMATION_REQUIRED** | Ask if SA individual path is accepted |
| Child/family AI storytelling extra underwriting | No explicit public policy found | **PROVIDER_CONFIRMATION_REQUIRED** | Product description + safety materials in preflight message |
| AI-generated content acceptance risk | AI category supported; generated children’s content not explicitly addressed | **PROVIDER_CONFIRMATION_REQUIRED** | Preflight product positioning + provider response |

## Eligibility Preflight Matrix

| Question | Current Answer | Evidence Status | Risk | Required Action | Decision Impact |
| --- | --- | --- | --- | --- | --- |
| Individual / natural person seller eligibility | User intends individual path; Terms allow individual **Vendor** | **PROVIDER_CONFIRMATION_REQUIRED** for SA | Medium | Ask FastSpring before apply | Blocks application if denied |
| Saudi Arabia seller country eligibility | User path = Saudi Arabia | **PROVIDER_CONFIRMATION_REQUIRED** | High | Preflight contact | May require entity or alternate country |
| Saudi bank payout support | User candidate | **PROVIDER_CONFIRMATION_REQUIRED** | High | Confirm Country/Region in Payouts Portal | Blocks monetization if unsupported |
| PayPal payout support | User candidate | **PROVIDER_CONFIRMATION_REQUIRED** | Medium | Confirm for SA individual profile | Backup payout path only if approved |
| USD pricing support | USD Individual/Family plans confirmed | **CONFIRMED_BY_OFFICIAL_SOURCE** (USD supported) | Low | Match catalog to website | Ready for pack after eligibility |
| MoR fit for AI children’s storytelling SaaS | AI + SaaS + MoR officially supported | **CONFIRMED_BY_OFFICIAL_SOURCE** (category) | Medium | Disclose child/family positioning in preflight | Underwriting review likely |
| AI-generated content risk | Not explicitly addressed publicly | **PROVIDER_CONFIRMATION_REQUIRED** | High | Safety/refund/support narrative | Lemon-like risk theme |
| Child/family product risk | Not explicit in public vendor policy | **PROVIDER_CONFIRMATION_REQUIRED** | High | Emphasize adult buyers + safety gates | Application diligence |
| Required identity/KYC documents | KYC at activation; individual vs business paths documented | **Partial** — **USER_TO_CONFIRM** + provider list | Medium | Prepare docs; do not store in repo | Required at onboarding |
| Required tax/VAT data | W-8/W-9 + taxpayer ID in payout setup | **LEGAL/TAX_CONFIRMATION_REQUIRED** | High | Advisor + national tax ID at portal | Required at activation |
| Required bank/payout documentation | Portal setup; beneficiary name match rules | **PROVIDER_CONFIRMATION_REQUIRED** | Medium | Complete only in secure portal | Post-approval step |
| Legal entity recommended/required? | Not publicly required for all vendors | **PROVIDER_CONFIRMATION_REQUIRED** | Medium | Ask in preflight | May pivot to entity or Creem |
| Contact sales/support before application? | Activation flow references FastSpring representative | **CONFIRMED_BY_OFFICIAL_SOURCE** (process) | Low | **Recommended** preflight contact | Reduces wasted application |

## Individual / Natural Person Seller Eligibility

**Official:** Vendor Terms define **Vendor** as “the **individual or organization** whose name is entered and submitted on the Order Form or online Sign-up Flow” ([Terms of Service for Vendors](https://fastspring.com/terms-use/seller-terms-service/)).

**Official:** Onboarding may require personal owner information, business registration, tax ID, bank info; FastSpring **can deny onboarding** (Vendor Terms §4.1).

**Not confirmed publicly:** Whether an **individual natural person in Saudi Arabia** is accepted under current underwriting rules.

**Preflight status:** **PROVIDER_CONFIRMATION_REQUIRED**

## Saudi Arabia Seller Country Path

**Official:** Payout portal geographic blocklist excludes Cuba, Iran, Iraq, Myanmar, North Korea, Russia, Somalia, Sudan, Syria — **Saudi Arabia is not listed** ([Payout Portal overview](https://developer.fastspring.com/docs/payout-portal-overview)).

**Not confirmed publicly:** Saudi Arabia as seller/residence country in sign-up flow or seller eligibility matrix.

**Preflight status:** **PROVIDER_CONFIRMATION_REQUIRED**

## Saudi Bank Payout Path

**Official:** Payouts Portal supports **Bank Account** (direct deposit / ACH described; wire transfer also listed) with Country/Region selection determining available methods ([Set up your payout account](https://developer.fastspring.com/docs/set-up-your-payout-account)).

**Not confirmed publicly:** Saudi Arabia bank account as supported Country/Region for an individual vendor profile.

**Preflight status:** **PROVIDER_CONFIRMATION_REQUIRED** — do **not** treat Saudi bank payout as approved.

## PayPal Payout Path

**Official:** Payouts Portal supports **PayPal** as a transfer method ([Set up your payout account](https://developer.fastspring.com/docs/set-up-your-payout-account)).

**Not confirmed publicly:** PayPal availability for **Saudi Arabia individual** seller profile.

**Preflight status:** **PROVIDER_CONFIRMATION_REQUIRED** — do **not** treat PayPal payout as approved for this path.

## USD Pricing / Currency Position

**User-provided:** USD catalog — Individual/Family monthly/yearly prices confirmed in `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`.

**Official:** FastSpring supports USD store and USD payout with **no conversion fee** when matched ([Receive payouts](https://developer.fastspring.com/docs/receive-payouts)).

**Preflight status:** **CONFIRMED_BY_OFFICIAL_SOURCE** for USD support; application catalog alignment still required at onboarding.

## AI-Assisted Children’s Storytelling Fit

**Official product category fit:** FastSpring explicitly supports **AI**, **SaaS**, **subscriptions**, and **MoR tax** ([AI solutions](https://fastspring.com/solutions/ai/), [tax-management](https://fastspring.com/tax-management/)).

**Not confirmed publicly:** Acceptance of **AI-generated children’s storytelling** where buyers are adults and children are supervised end users.

**Preflight status:** Category fit **CONFIRMED_BY_OFFICIAL_SOURCE**; product-specific underwriting **PROVIDER_CONFIRMATION_REQUIRED**.

## Product Risk Positioning

Position Dreemi for FastSpring preflight (consistent with KYB pack):

- AI-assisted **children’s storytelling SaaS**
- **Adult buyers:** parents, guardians, families, educators/schools
- **No marketplace**; **no creator payouts**
- **No physical goods**
- **No adult content**, **no gambling**, **no pharma**, **no hate/violence**
- **No third-party payment processing**
- **No unlawful goods/services**
- Child-safety and content-safety guardrails documented in repo
- **Refund period:** 7 days (wording still **USER_TO_CONFIRM**)
- **Support:** contact@dreemi.app (founder/user)

Dreemi must remain outside FastSpring prohibited categories ([Manage your products](https://developer.fastspring.com/docs/manage-your-products), Vendor Terms §4.5).

## Required FastSpring Questions

Ask FastSpring sales/support **before** full application:

1. Do you accept **individual/natural-person vendors** from **Saudi Arabia**?
2. Can a **Saudi Arabia resident** apply **without a registered company**?
3. Do you support **payouts to Saudi bank accounts** for individual vendors?
4. Do you support **PayPal payouts** for vendors in this profile?
5. If not, what **entity/country/payout setup** is required?
6. Is an **AI-assisted children’s storytelling SaaS** acceptable if buyers are adults and the app has content-safety guardrails?
7. Are there additional requirements for **child/family/education-oriented AI products**?
8. Which **KYC/KYB documents** are required before onboarding?
9. Is **USD pricing** acceptable for the planned subscription plans (Individual/Family only at launch)?
10. Should we **apply directly** or schedule a **sales/preflight call** first?

## Required User Inputs Before Contacting FastSpring

| Input | Status |
| --- | --- |
| Founder legal name | **USER_TO_CONFIRM** |
| Exact Privacy URL | **USER_TO_CONFIRM** (verify on dreemi.app before send) |
| Exact Terms URL | **USER_TO_CONFIRM** (verify on dreemi.app before send) |
| Refund policy wording (beyond 7-day period) | **USER_TO_CONFIRM** |
| Generated-content licensing wording | **USER_TO_CONFIRM** / **LEGAL_CONFIRMATION_REQUIRED** |
| Disclose Saudi individual path exactly as intended | User decision — recommended **yes** in preflight |
| PayPal vs Saudi bank preference order | User decision — document both as candidates pending provider answer |
| Keep School plan deferred in first application | **Recommended yes** (already user decision) |
| Demo video | **USER_TO_CONFIRM** |
| Tax/VAT posture | **LEGAL/TAX_CONFIRMATION_REQUIRED** |

## Provider Confirmation Email / Message Draft

See `docs/D3M_FASTSPRING_PREFLIGHT_CONTACT_DRAFT.md` for send-ready draft with placeholders.

## Decision Position

**Decision: Do not submit a FastSpring application yet.**

FastSpring remains **primary candidate**, but **individual / Saudi Arabia / payout eligibility must be confirmed first** via sales/support preflight.

| Outcome | Next phase |
| --- | --- |
| FastSpring confirms eligibility | **`D3M-Payments-Provider-Application-Pack`** |
| FastSpring requires company/entity or different country | **Entity/Legal Path Review** or **Creem Backup Preflight** |
| Missing user placeholders block contact | **`D3M-Payments-FastSpring-Preflight-Fill`** |

Production billing remains **NO-GO**.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Individual/SA eligibility unconfirmed | Provider | Critical | Open | FastSpring written answer | Preflight contact pack |
| Saudi bank payout unconfirmed | Payout | Critical | Open | Provider confirmation | Preflight contact |
| PayPal payout unconfirmed | Payout | High | Open | Provider confirmation | Preflight contact |
| Founder legal name missing | KYC | High | Open | User input | Preflight fill |
| Privacy/Terms exact URLs missing | Legal | High | Partial | Verify URLs on dreemi.app | Preflight fill |
| Refund wording needs final text | Ops | Medium | Partial | User/legal text | Preflight fill |
| Generated-content licensing pending | Legal | High | Open | User/legal text | Preflight fill |
| Tax/VAT posture unresolved | Tax | High | Open | **LEGAL/TAX_CONFIRMATION_REQUIRED** | Legal review |
| FastSpring application not submitted | Provider | Critical | Blocked | Eligibility preflight | Application pack (later) |
| FastSpring approval missing | Provider | Critical | Blocked | Provider review | Post-application |

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Payment provider selected | **Candidate only** (FastSpring) |
| FastSpring eligibility | **Unconfirmed** |
| FastSpring application | **Not submitted** |
| Provider approval | **Pending** |
| Checkout verification | **Not executed** |
| Webhook verification | **Not executed** |
| Production billing | **NO-GO** |

Payment gates remain **BLOCKED**. Do not mark payment gates PASS.

## Recommended Next Phase

**Primary:** **`D3M-Payments-FastSpring-Preflight-Contact-Pack`** — finalize message for FastSpring sales/support (after any missing placeholders filled).

**Alternative if placeholders block contact:** **`D3M-Payments-FastSpring-Preflight-Fill`** — founder legal name, exact Privacy/Terms URLs, refund/licensing wording.

**If FastSpring declines path:** **`D3M-Payments-Creem-Backup-Preflight`** (future phase).

## Notes For Next Chat

- Do not create FastSpring account or submit application until preflight answers received.
- Saudi Arabia absent from payout **blocklist** is not the same as confirmed eligibility.
- PayPal and bank payout are both **candidates only** until FastSpring confirms.
- Reuse KYB/safety materials from `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md`.
- Production billing remains **NO-GO**.

## Related Artifacts

- Contact draft: `docs/D3M_FASTSPRING_PREFLIGHT_CONTACT_DRAFT.md`
- Application inputs: `docs/D3M_FASTSPRING_APPLICATION_INPUTS_CHECKLIST.md`
- Entity/payout answers: `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`
