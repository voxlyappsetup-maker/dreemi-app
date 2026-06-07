# D3M FastSpring Preflight Contact Pack

## Status

This is a docs-only FastSpring preflight contact pack.
No FastSpring account was created.
No FastSpring application was submitted.
No provider dashboard was accessed.
No payment checkout was executed.
No payment purchase was executed.
No live webhook was executed.
No provider API call was made.
No env/secrets were read, printed, verified, or modified.
**No message was sent to FastSpring in this phase.**
Production billing remains **NO-GO**.

## Purpose

- Convert eligibility preflight into a **concise send-ready** message for FastSpring sales/support.
- Ask exact eligibility questions **before** full application.
- Include Dreemi product summary, risk-safe positioning, and user-provided details.
- Keep unresolved legal/policy values as placeholders.
- Provide before-send checklist and post-response decision logic.

## Current Baseline

- Latest stable commit: `c76197b Add FastSpring eligibility preflight`
- Primary candidate: **FastSpring** (eligibility **UNCONFIRMED**)
- Backup candidate: **Creem**
- Lemon Squeezy: **REJECTED / NOT ACTIVE**

## Source Availability

| Source | Status |
| --- | --- |
| `docs/D3M_FASTSPRING_ELIGIBILITY_PREFLIGHT.md` | Available |
| `docs/D3M_FASTSPRING_PREFLIGHT_CONTACT_DRAFT.md` | Available (updated to match this pack) |
| `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md` | Available |
| `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md` | Available |
| `docs/D3M_FASTSPRING_SEND_CHECKLIST.md` | Available |
| FastSpring response | **Not received** |

## Explicit Non-Goals

- No FastSpring account, application, dashboard access, or contact send in this phase.
- No checkout, purchase, webhook, or API calls.
- No bank/PayPal details, tax IDs, or identity document numbers in the message.
- No eligibility approval claims.

## Known Product / Business Details

| Item | Value |
| --- | --- |
| Product | Dreemi / Qisas |
| Website | https://www.dreemi.app/ |
| Support email | contact@dreemi.app |
| Demo video | https://drive.google.com/file/d/1uNimZx4qD17pWrtSnYUMHSLqiRHFB2y-/view?usp=drive_link |
| Product category | AI-assisted children’s storytelling SaaS |
| Languages | Arabic / English / French |
| Adult buyers | Parents, guardians, families, educators/schools |
| No marketplace | Confirmed |
| No creator payouts | Confirmed |
| No physical goods | Confirmed |
| No adult content | Confirmed |
| No gambling | Confirmed |
| No controlled goods | Confirmed |
| Application intent | Individual / natural person |
| Country path | Saudi Arabia |
| Payout candidates | Saudi bank account or PayPal |
| Currency | USD |
| Individual plan | USD 4.99 monthly / USD 47.90 yearly |
| Family plan | USD 9.99 monthly / USD 95.90 yearly |
| School plan | Deferred / not launch-critical |
| Refund period | 7 days |
| Support/disputes | Founder/user via contact@dreemi.app |

**Optional identity/social links (user-provided; not substitute for `[Founder legal name]`):**

- LinkedIn: https://www.linkedin.com/in/hayssam-dennaoui/
- X / Twitter: @hadenawi2 — https://x.com/hadenawi2
- Instagram: @hadenawi — https://www.instagram.com/hadenawi

## Remaining Placeholders

Do **not** send until filled or explicitly kept as TBD with user approval:

| Placeholder | Status |
| --- | --- |
| `[Founder legal name]` | **USER_TO_CONFIRM** — do not infer from LinkedIn |
| `[Exact Privacy URL]` | **USER_TO_CONFIRM** |
| `[Exact Terms URL]` | **USER_TO_CONFIRM** |
| `[Final refund policy wording]` | **USER_TO_CONFIRM** |
| `[Generated-content licensing wording]` | **USER_TO_CONFIRM** / **LEGAL_CONFIRMATION_REQUIRED** |
| `[Tax/VAT posture]` | **LEGAL/TAX_CONFIRMATION_REQUIRED** |
| `[Identity/KYC document list]` | **PROVIDER_CONFIRMATION_REQUIRED** + **USER_TO_CONFIRM** |

## Contact Goal

The goal is **not to apply yet**. The goal is to ask FastSpring whether the intended **individual / Saudi Arabia / payout** path is eligible **before** submitting a full application.

## Why Preflight Contact Is Required

Public FastSpring sources confirm broad fit (AI, SaaS, subscriptions, MoR, tax/VAT, APIs/webhooks, USD) but do **not** clearly confirm:

- Individual/natural-person seller from Saudi Arabia
- Saudi Arabia seller path without registered company
- Saudi bank payout for this profile
- PayPal payout for this profile
- Whether a registered legal entity is required or recommended

See `docs/D3M_FASTSPRING_ELIGIBILITY_PREFLIGHT.md`.

## FastSpring Questions To Ask

1. Do you accept individual/natural-person sellers from Saudi Arabia?
2. Can a Saudi Arabia resident apply without a registered company?
3. Do you support payouts to Saudi bank accounts for individual sellers?
4. Do you support PayPal payouts for this seller profile?
5. If neither payout path works, what legal/entity/payout setup is required?
6. Is an AI-assisted children’s storytelling SaaS acceptable if buyers are adults and the app has child-safety/content-safety guardrails?
7. Are there additional requirements for child/family/education-oriented AI products?
8. Which KYC/KYB documents are required before onboarding?
9. Is USD pricing acceptable for the planned subscription plans?
10. Should we apply directly or first schedule a sales/preflight review call?

## Product Risk Positioning

Position Dreemi as:

- AI-assisted **children’s storytelling SaaS**
- **Adult buyers only** (parents, guardians, families, educators)
- Family/education use case; children do not purchase directly
- **No marketplace**; **no creator payouts**
- **No adult or unsafe content**; **no gambling**; **no controlled goods**; **no physical goods**
- Content-safety and child-safety guardrails documented in repo
- **7-day refund period** (final wording pending)
- Support via **contact@dreemi.app**

## Send-Ready Message

Copy, fill placeholders, verify checklist, then send **manually** (not from this repo).

### Subject

Preflight eligibility question for AI-assisted children’s storytelling SaaS

### Message Draft

Hello FastSpring team,

I am preparing a payment/provider application for **Dreemi**, an AI-assisted children’s storytelling SaaS for adult buyers such as parents, guardians, families, and educators.

Before submitting a full application, I would like to confirm whether our intended seller and payout setup is eligible for FastSpring.

**Product summary**

Dreemi helps adult users create child-friendly personalized stories in Arabic, English, and French. The product is a digital SaaS subscription service. It is not a marketplace, does not involve creator payouts, does not sell physical goods, and is not related to adult content, gambling, controlled goods, or financial services.

**Website:** https://www.dreemi.app/

**Demo video:** https://drive.google.com/file/d/1uNimZx4qD17pWrtSnYUMHSLqiRHFB2y-/view?usp=drive_link

**Support:** contact@dreemi.app

**Policies (verify before send):** Privacy `[Exact Privacy URL]` | Terms `[Exact Terms URL]`

**Planned pricing (USD)**

- Individual: USD 4.99 monthly / USD 47.90 yearly
- Family: USD 9.99 monthly / USD 95.90 yearly
- School: deferred / not launch-critical at this stage

**Refund period:** 7 days (`[Final refund policy wording]` to confirm)

**Intended seller setup**

- Seller type: individual / natural person
- Country path: Saudi Arabia
- Payout candidates: Saudi bank account or PayPal

**My questions**

1. Do you accept individual/natural-person sellers from Saudi Arabia?
2. Can a Saudi Arabia resident apply without a registered company?
3. Do you support payouts to Saudi bank accounts for individual sellers?
4. Do you support PayPal payouts for this seller profile?
5. If neither payout path works, what legal/entity/payout setup would you require?
6. Is an AI-assisted children’s storytelling SaaS acceptable if buyers are adults and the app has child-safety/content-safety guardrails?
7. Are there additional requirements for child/family/education-oriented AI products?
8. Which KYC/KYB documents are required before onboarding?
9. Is USD pricing acceptable for the planned subscription plans?
10. Should I apply directly or schedule a sales/preflight review call first?

I can provide additional product, compliance, or support information if needed.

Best regards,

[Founder legal name]
Dreemi
https://www.dreemi.app/
contact@dreemi.app

## Attachments / Links To Include

| Link | Status |
| --- | --- |
| Website | https://www.dreemi.app/ |
| Demo video | User-provided Google Drive link (verify sharing before send) |
| Privacy URL | `[Exact Privacy URL]` — fill before send |
| Terms URL | `[Exact Terms URL]` — fill before send |
| Product summary | In message body |
| Pricing summary | In message body |
| Support email | contact@dreemi.app |
| Social profiles (optional) | LinkedIn / X / Instagram — only if useful for identity preflight |

## What Not To Send

- API keys, webhook secrets, database URLs, `.env` values
- Identity document numbers in first message
- Bank account details or PayPal private account details in first message
- Tokens, cookies, request headers
- Private user or child data, raw logs
- Provider dashboard screenshots
- Unverified legal/tax compliance claims

## Before Sending Checklist

See `docs/D3M_FASTSPRING_SEND_CHECKLIST.md` for operational checklist.

- [ ] `[Founder legal name]` filled
- [ ] Google Drive demo video sharing permissions verified
- [ ] `[Exact Privacy URL]` filled
- [ ] `[Exact Terms URL]` filled
- [ ] Refund wording checked
- [ ] Generated-content licensing wording checked (if referenced)
- [ ] No secrets included
- [ ] No bank/private PayPal details included
- [ ] User manually sends message

## Possible FastSpring Outcomes

| Outcome | Description |
| --- | --- |
| **A** | FastSpring confirms individual/SA/payout eligibility |
| **B** | FastSpring requires legal entity |
| **C** | FastSpring rejects or flags AI/child product risk |
| **D** | FastSpring asks for more documentation |
| **E** | FastSpring recommends sales/onboarding call |

## Decision Logic After Response

| Response | Next phase |
| --- | --- |
| Eligibility confirmed | **`D3M-Payments-Provider-Application-Pack`** |
| Legal entity required | Pause → **Entity/Legal Path Review** |
| Rejected or unclear on product | **Creem Backup Preflight** |
| More info requested | Update **`docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md`** |

Record responses in post-send tracking (see send checklist).

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| FastSpring eligibility | **Not confirmed** until response received |
| FastSpring application | **Not submitted** |
| Provider approval | **Pending** |
| Checkout verification | **Not executed** |
| Webhook verification | **Not executed** |
| Production billing | **NO-GO** |

## Recommended Next Phase

**Primary:** **`D3M-Payments-FastSpring-Preflight-Send-Manual`** — user fills final placeholders and sends message manually.

**Alternative:** **`D3M-Payments-FastSpring-Preflight-Fill`** — fill founder/privacy/terms/licensing placeholders before sending.

## Notes For Next Chat

- Do not send until placeholders filled and demo link sharing verified.
- Do not create FastSpring account until eligibility confirmed or FastSpring instructs to apply.
- Production billing remains **NO-GO** until provider approval + controlled verification.

## Related Artifacts

- Send checklist: `docs/D3M_FASTSPRING_SEND_CHECKLIST.md`
- Contact draft (mirror): `docs/D3M_FASTSPRING_PREFLIGHT_CONTACT_DRAFT.md`
- Eligibility preflight: `docs/D3M_FASTSPRING_ELIGIBILITY_PREFLIGHT.md`
