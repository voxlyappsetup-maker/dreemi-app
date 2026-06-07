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
- Keep refund/licensing as **draft / pending final review** where not finalized.
- Provide before-send checklist and post-response decision logic.

## Current Baseline

- Latest stable commit: `e50bdb7 Point entity payout doc to FastSpring send manual phase`
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
| Refund period | 7 days (final public wording **pending**) |
| Support/disputes | Founder/user via contact@dreemi.app |
| Founder legal name | Hayssam Adel Dennaoui |
| Privacy URL | https://www.dreemi.app/en/privacy |
| Terms URL | https://www.dreemi.app/en/terms |

**Optional identity/social links (user-provided):**

- LinkedIn: https://www.linkedin.com/in/hayssam-dennaoui/
- X / Twitter: @hadenawi2 — https://x.com/hadenawi2
- Instagram: @hadenawi — https://www.instagram.com/hadenawi

## Remaining Items Before Manual Send

| Item | Status |
| --- | --- |
| Founder legal name | **Filled** — Hayssam Adel Dennaoui |
| Privacy URL | **Filled** — https://www.dreemi.app/en/privacy |
| Terms URL | **Filled** — https://www.dreemi.app/en/terms |
| Final refund policy wording | **Draft / pending** — 7-day period confirmed; public wording not final |
| Generated-content licensing wording | **Draft / pending final Terms/legal confirmation** |
| Google Drive demo sharing | **USER_TO_VERIFY** before send |
| Tax/VAT posture | **LEGAL/TAX_CONFIRMATION_REQUIRED** |
| Identity/KYC document list | **PROVIDER_CONFIRMATION_REQUIRED** + application onboarding |
| FastSpring eligibility response | **PROVIDER_CONFIRMATION_REQUIRED** |

### Draft refund wording (internal docs only — not final legal text)

Refund period: **7 days**. Final public refund policy wording is still pending. Before sending or application submission, refund wording should be finalized and aligned with FastSpring/provider requirements.

> Draft: Customers may request a refund within 7 days of purchase or renewal by contacting contact@dreemi.app. Refunds should be reviewed according to the final Terms, provider rules, and abuse-prevention policy. **Requires final review before publication or provider submission.**

### Draft generated-content licensing position (internal docs only — not legal advice)

Generated-content licensing wording is not final and requires legal/Terms confirmation before provider application.

> Draft: Dreemi provides users with access to AI-assisted story generation for personal, family, and educational use. Users should not use the service to generate or commercialize content based on third-party copyrighted characters, brands, or protected works. Generated output remains subject to Dreemi’s final Terms and acceptable-use rules. **Requires final legal/Terms review before provider submission.**

**Before manual sending, verify that the Google Drive demo video is accessible to anyone with the link.**

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

**Policies:** Privacy https://www.dreemi.app/en/privacy | Terms https://www.dreemi.app/en/terms

**Planned pricing (USD)**

- Individual: USD 4.99 monthly / USD 47.90 yearly
- Family: USD 9.99 monthly / USD 95.90 yearly
- School: deferred / not launch-critical at this stage

**Refund period:** 7 days. Final refund wording is being aligned with the public policy and provider requirements.

**Content use (summary):** Generated stories are intended for personal, family, and educational use under Dreemi’s Terms. Dreemi does not position the service as a marketplace or a tool for selling third-party copyrighted characters or branded content. Final Terms wording is maintained at https://www.dreemi.app/en/terms.

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

Hayssam Adel Dennaoui
Dreemi
https://www.dreemi.app/
contact@dreemi.app

## Attachments / Links To Include

| Link | Status |
| --- | --- |
| Website | https://www.dreemi.app/ |
| Privacy URL | https://www.dreemi.app/en/privacy |
| Terms URL | https://www.dreemi.app/en/terms |
| Demo video | Verify **anyone with link** before send |
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

- [x] Founder legal name filled — Hayssam Adel Dennaoui
- [ ] Google Drive demo video sharing permissions verified (**USER_TO_VERIFY**)
- [x] Privacy URL — https://www.dreemi.app/en/privacy
- [x] Terms URL — https://www.dreemi.app/en/terms
- [ ] Refund draft wording reviewed (not final legal text)
- [ ] Generated-content licensing draft reviewed (not final legal text)
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

**Primary:** **`D3M-Payments-FastSpring-Preflight-Send-Manual`** — verify demo sharing and send message manually after final human review.

**Reference:** `docs/D3M_FASTSPRING_PREFLIGHT_FINAL_REVIEW.md`

## Notes For Next Chat

- Do not send until **Google Drive demo sharing** verified and draft refund/licensing reviewed.
- Do not create FastSpring account until eligibility confirmed or FastSpring instructs to apply.
- Production billing remains **NO-GO** until provider approval + controlled verification.

## Related Artifacts

- Send checklist: `docs/D3M_FASTSPRING_SEND_CHECKLIST.md`
- Final review: `docs/D3M_FASTSPRING_PREFLIGHT_FINAL_REVIEW.md`
- Eligibility preflight: `docs/D3M_FASTSPRING_ELIGIBILITY_PREFLIGHT.md`
