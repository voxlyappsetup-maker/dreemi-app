# D3M Payments Provider Response Package

## Status

This is a docs-only provider response package (refined in **D3M-Payments-Provider-Response-Fill**).
No provider dashboard was accessed.
No payment checkout was executed.
No payment purchase was executed.
No live webhook was executed.
No provider API call was made.
No env/secrets were read, printed, verified, or modified.
No `.env` or `.env.example` file was read or modified.
The email is **not actually sent** from this repository phase.
Production billing remains **NO-GO** until provider approval and runtime verification evidence exist.

## Purpose

- Prepare a send-ready KYB/KYC response package for Lemon Squeezy (or similar Merchant-of-Record review).
- Consolidate product explanation, safety/compliance summary, demo plan, draft email, evidence checklists, and launch-gate alignment.
- Keep payment production blocked until external approval and controlled verification phases complete.

## Current Baseline

- Latest stable commit: `5561b7d Add payment provider response package` (fill phase refines same docs)
- Starting state: `## main...origin/main` (clean)
- Full production launch and production billing remain **NO-GO**

## Source Availability

| Source | Status |
| --- | --- |
| `docs/PROJECT_HANDOFF.md` | Available |
| `docs/CURRENT_PROJECT_STATE.md` | Available |
| `docs/D3M_PAYMENT_PROVIDER_EXTERNAL_VERIFICATION_CHECKLIST.md` | Available |
| `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md` | Available |
| `docs/D3M_LOCAL_NO_DEPLOY_MANUAL_SMOKE_RESULTS.md` | Available |
| `docs/D3M_PAYMENT_READINESS_UNAVAILABLE_RUNTIME_SMOKE_RESULTS.md` | Available (if present) |
| Billing/plan catalog (`services/api/src/config/billing.ts`) | Read-only reference |
| Pricing UI/messages | Read-only reference |

**Reconciliation note:** Prior docs recorded Lemon Squeezy rejection/unavailable posture. This package prepares materials if the user is responding to an active Lemon review thread, re-applying, or adapting the same answers for another MoR provider. Confirm intent before sending.

## Explicit Non-Goals

- No checkout, purchase, webhook, provider API, or dashboard access.
- No env reads, deploy, production verification, or payment runtime activation.
- No claim that billing is live or production-ready.

## Provider Request Summary

Lemon Squeezy requested:

1. **Demo video** demonstrating product functionality and features.
2. **Personal social media account URLs** for KYB/KYC identity checks.
3. **Specific product explanation:**
   - what products are sold,
   - how they are made/licensed,
   - who they are for,
   - whether products are single purchases or subscriptions.

## Product Summary

**Dreemi** (Qisas monorepo) is a multilingual children’s storytelling web application:

- Supports **Arabic, English, and French**.
- Helps **parents, guardians, families, and educators** create personalized bedtime stories for children.
- Uses **AI-assisted story generation** with **automated safety gates** on input and output.
- Offers **PDF export** of generated stories.
- **Image generation is optional/secondary**; stories remain usable without images (fallback UI).
- **Payments are fail-closed** today (`CHECKOUT_PROVIDER_CONFIG_INCOMPLETE` / unavailable pricing UX) until provider approval and configuration completion.
- **Production launch remains NO-GO**; this package supports provider review only.

## Product Type / What Is Sold

| Category | Dreemi position |
| --- | --- |
| Product type | Digital SaaS / subscription access |
| FREE | Limited evaluation tier |
| INDIVIDUAL | Expanded generation/access for one account |
| FAMILY | Family access with multiple child profiles |
| SCHOOL | Education/group access (if offered—**to confirm before sending**) |
| Physical goods | None |
| Marketplace / UGC resale | None |
| Adult content | None |
| Gambling / financial services | None |
| Controlled/high-risk goods | None |

Customers buy **software access and generated digital story output**, not third-party merchandise.

## How The Product Is Made

- Application developed and maintained by the project owner/team (`[Company/legal entity details if applicable]`).
- Stories created through a **controlled in-app workflow** (prompt → safety check → AI generation → output safety check → storage/display).
- **PDF** generated client-side/in-app from story content.
- Users do **not** purchase downloadable third-party asset packs.
- Optional illustrations are **app-generated** and not sold as standalone licensed stock.
- Avoid disclosing internal provider names (Mistral, Pollinations, etc.) in the provider email unless explicitly required.

## Licensing / Ownership Position

Conservative positioning for provider review:

- Dreemi provides access to a **software service** and **generated story content** for personal, family, or educational use.
- Generated content is **not** positioned as resale of copyrighted third-party material.
- Users should **not** be encouraged to request branded/third-party characters.
- Final customer-facing license/terms must be confirmed: **`[Confirm final Terms wording before sending]`**

## Target Customers

| Role | Description |
| --- | --- |
| Buyer / customer | Adult parent, guardian, or school/educator |
| End user | Child (supervised consumption) |
| Use cases | Bedtime stories, family reading, classroom/education (School plan) |
| Languages | Arabic, English, French |

Children do **not** purchase subscriptions directly.

## Purchase Model

- **Subscriptions** (recurring digital access)—primary model.
- Billing intervals: **monthly and/or yearly** (catalog supports both—confirm exact offer before sending): `[Billing interval]`.
- **No** physical shipping.
- **No** creator/marketplace payouts.
- **No** one-time physical product sales.
- **No** high-risk merchant categories.

Single one-time story purchases are **not** the planned model (to confirm before sending if Lemon requires explicit one-time vs subscription answer).

## Pricing / Subscription Position

Documented plan names in codebase:

```text
FREE
INDIVIDUAL
FAMILY
SCHOOL
```

Billing cycles in catalog: **monthly** and **yearly** per paid plan.

**Do not invent prices.** Use placeholders until confirmed:

| Plan | Price placeholder | Interval placeholder |
| --- | --- | --- |
| INDIVIDUAL | `[Plan price]` | `[Billing interval]` |
| FAMILY | `[Plan price]` | `[Billing interval]` |
| SCHOOL | `[Plan price]` | `[Billing interval]` |

Pricing page shows plan cards; checkout action remains unavailable until approved.

## Content Safety And Child Safety Summary

- **Input safety checks** before generation.
- **Output safety checks** on generated story content.
- Unsafe prompts blocked with user-safe messaging.
- Safety regression coverage includes categories such as: graphic violence, adult content, hate, self-harm, weapons, drugs (per `safety.service` / security regression tests).
- **Prompt-injection guardrails** in generation flow.
- **Public sharing intentionally disabled** pending safe share-token design (if applicable).
- Child-safe positioning: bedtime stories for children under adult supervision.

## AI Usage Disclosure

- Product uses **AI-assisted story generation** (not human-authored custom books unless human review is added later).
- AI output is **safety-checked** before presentation.
- Users provide story preferences (child name, theme, language)—use **fictional names in demos**.
- Provider communication should clearly state **AI-assisted content**, not imply fully human-written publishing.

## User Data / Privacy Summary

- **No live payment** today; fail-closed billing gate.
- Demo must use **fictional test data only**—no real child PII.
- Child data should be **minimized** to what is needed for story personalization.
- Privacy and terms pages exist at `/en/privacy`, `/en/terms` (and localized variants)—final legal review may still be pending: `[Privacy policy URL]`, `[Terms URL]`.
- **Never send** secrets, env values, database URLs, or raw logs in provider correspondence.

## Demo Video Plan

Safe 2–4 minute screen recording. Detailed script: `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md`.

**Show:**

- Home and localized pages (`/en`, `/ar`, `/fr`)
- Pricing page with **Unavailable** labels and top unavailable message
- Generate page UI (form only unless safe pre-approved fixture)
- Pre-existing **safe demo story** / PDF if available
- Privacy/terms pages
- Safety posture (blocked unsafe prompt copy if safe fixture exists)

**Do not show:**

- Checkout, provider dashboards, secrets, env, API keys, real child data

**Upload link placeholder:** `[Demo video link]`

## Demo Video Script

See `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md` for shot list and voiceover.

## Suggested Demo Video Evidence

- [ ] 2–4 min MP4 or hosted link at `[Demo video link]`
- [ ] Shows multilingual UI
- [ ] Shows pricing unavailable state honestly
- [ ] Uses fictional data only
- [ ] No secrets on screen
- [ ] Optional: static screenshots for email attachment (no PII)

## Founder / KYB-KYC Information Checklist

| Item | Placeholder / status |
| --- | --- |
| Legal name | `[Founder legal name]` |
| Company/legal entity | `[Company/legal entity details if applicable]` |
| Country / residency | `[Country]` |
| Website / app URL | `[Website/app URL]` |
| Support email | `[Support email]` |
| Personal social URL 1 | `[Founder social profile URL 1]` |
| Personal social URL 2 | `[Founder social profile URL 2]` |
| LinkedIn / GitHub / X | `[Professional profile URL — optional]` |
| Demo video URL | `[Demo video link]` |
| Product summary | This package + email draft |
| Pricing summary | Plan names + `[Plan price]` placeholders |
| Refund policy | `[Refund policy URL or wording — to confirm]` |
| Privacy policy URL | `[Privacy policy URL]` |
| Terms URL | `[Terms URL]` |

## Social Media / Identity Links Placeholder

```text
[Founder social profile URL 1]
[Founder social profile URL 2]
[LinkedIn or professional profile URL — optional]
```

Do **not** invent URLs. User must supply verified profiles.

## Website / App Links Placeholder

```text
[Website/app URL]
[Support email]
/en/pricing
/en/privacy
/en/terms
```

## Draft Provider Response Email

Full send-ready draft: `docs/D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md`

Summary tone: professional, transparent, concise—includes demo link placeholder, social placeholders, product/subscription explanation, AI disclosure, safety notes, and explicit statement that payments are not live.

## Attachments / Links Checklist

| Attachment / link | Status | Notes |
| --- | --- | --- |
| Demo video | `[Demo video link]` | Required by Lemon |
| Website / app | `[Website/app URL]` | Public or staging demo |
| Privacy policy | `[Privacy policy URL]` | Must be reachable |
| Terms | `[Terms URL]` | Must be reachable |
| Pricing page | `[Website/app URL]/en/pricing` | Shows unavailable state OK |
| Founder social links | Placeholders | KYB/KYC |
| Support email | `[Support email]` | Active inbox |
| Product screenshots | Optional | No secrets/PII |
| Company/legal docs | `[Company/legal entity details if applicable]` | If entity onboarding |

## What Must Not Be Sent

- API keys, webhook secrets, provider tokens
- Database URLs, JWT secrets, env values
- Dashboard screenshots showing secrets or customer data
- Raw logs, provider payloads, request headers, cookies
- Real child names, photos, or customer PII
- Claims that production checkout is live
- Internal-only architecture diagrams with secret endpoints

## Send-Ready Status

| Item | Status |
| --- | --- |
| Response package | **Prepared** |
| Email draft | **Send-ready after placeholders filled** |
| Demo script | **Prepared** |
| Send checklist | **Prepared** (`docs/D3M_PAYMENT_PROVIDER_SEND_CHECKLIST.md`) |
| Email actually sent | **No** — user sends manually |
| Provider approval | **Pending** |
| Production billing | **NO-GO** |

## Required User Inputs Before Sending

All values below remain **placeholders** until the user supplies them. Do not invent.

- `[Demo video link]`
- `[Founder social profile URL 1]` / `[Founder social profile URL 2]`
- `[Founder legal name]`, `[Company/legal entity, if applicable]`, `[Country]`
- `[Support email]`, `[Website/app URL]`
- `[Individual plan price + billing interval]`, `[Family plan price + billing interval]`
- `[School plan availability / planned-only]`
- `[Privacy policy URL]`, `[Terms URL]`, `[Refund policy URL or wording]`
- `[Generated-content licensing wording to confirm]`

Use `docs/D3M_PAYMENT_PROVIDER_SEND_CHECKLIST.md` as the pre-send gate.

## Final Email Draft Location

`docs/D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md` — polished draft addressed to Ankith with required placeholder checklist and subject line.

## Final Demo Script Location

`docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md` — 2–4 minute shot list and voiceover script.

## Provider Submission Checklist

1. Record demo video (fictional data only; no checkout/secrets).
2. Replace all placeholders in email draft.
3. Complete `docs/D3M_PAYMENT_PROVIDER_SEND_CHECKLIST.md`.
4. Manual second review (no secrets, no live-payment claims).
5. Send email via Lemon support thread manually.
6. Track reply outside repo (no secrets in docs).

## Payment Readiness Position

- Package prepared; **provider approval pending**.
- Checkout/webhook/live payment verification **pending** post-approval phases.
- Production billing **NO-GO**.

## What Remains Blocked After Sending

Sending the KYB email does **not** unblock:

- Production checkout or live billing
- Webhook live verification
- Env presence / deploy smoke gates
- Full production launch (Gate 18)
- Payment gate PASS without controlled verification evidence

## Open Questions For User

1. Are you responding to an **active Lemon Squeezy thread** or preparing materials for **another MoR provider**?
2. What is `[Demo video link]` after recording?
3. Provide `[Founder social profile URL 1]` and `[Founder social profile URL 2]` (and optional professional profile).
4. Confirm `[Founder legal name]` and `[Company/legal entity details if applicable]`.
5. Confirm `[Country]` and payout eligibility details.
6. Confirm `[Support email]` and `[Website/app URL]` for the review.
7. Confirm `[Individual plan price + billing interval]`, `[Family plan price + billing interval]`, and `[School plan availability / planned-only]`.
8. Confirm `[Privacy policy URL]`, `[Terms URL]`, and `[Refund policy URL or wording]`.
9. Confirm `[Generated-content licensing wording to confirm]` matches Terms.

## Payment Launch Gate Mapping

| Gate / area | Current status | This package contributes |
| --- | --- | --- |
| Provider approval / KYB | BLOCKED | Email draft, demo plan, product summary |
| Env presence (Gate 3) | PENDING | None—separate env phase |
| Checkout verification (Gate 9) | BLOCKED | None until post-approval |
| Webhook verification (Gate 10) | BLOCKED | None until post-approval |
| Pricing unavailable UX (Gate 9) | LOCAL_PASS (D6) | Demo can show honest unavailable state |
| Privacy/legal (Gate 14) | PARTIAL | Links placeholders—user must confirm |
| Production Go/No-Go (Gate 18) | NO-GO | No change from this docs phase |

**No gate marked PASS** from this package alone.

## Provider Approval Blockers

| Blocker | Severity | Notes |
| --- | --- | --- |
| Lemon/provider approval pending | Critical | Prior docs note rejection—confirm re-application status |
| Demo video not uploaded | High | `[Demo video link]` required |
| Social URLs not provided | High | User must supply real profiles |
| Pricing/details not confirmed | Medium | Placeholders in draft |
| Checkout not production-verified | Critical | Post-approval phase only |
| Webhook not live-verified | Critical | Post-approval phase only |
| Privacy/legal final review | Medium | URLs/wording to confirm |
| Payment production | Critical | Remains **NO-GO** |

## Follow-Up Tracker

| Item | Owner | Status | Due / Timing | Evidence Needed | Notes |
| --- | --- | --- | --- | --- | --- |
| Record demo video | User | PENDING | Before send | `[Demo video link]` | Use demo script doc |
| Fill social URLs | User | PENDING | Before send | Profile URLs | No invented links |
| Confirm legal entity / name | User | PENDING | Before send | KYB docs | Individual vs company |
| Confirm plan prices | User | PENDING | Before send | Pricing table | Match Lemon variants if using Lemon |
| Finalize email draft | User | PENDING | Before send | Edited draft | From `D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md` |
| Send provider response | User | PENDING | After checklist | Sent email receipt | No secrets attached |
| Track Lemon reply | User | PENDING | After send | Ticket/thread ID | No dashboard secrets in docs |
| Post-approval checkout smoke | Team | BLOCKED | After approval | Controlled smoke results | Separate phase |
| Post-approval webhook smoke | Team | BLOCKED | After approval | Signature verify evidence | Separate phase |
| Production billing Go/No-Go | Team | BLOCKED | After all gates | Launch gate review | Remains NO-GO |

## Recommended Next Phase

- Primary: **`D3M-Payments-Provider-Send`** — user fills placeholders and sends Lemon response manually
- Alternative: **`D3M-Triage-D6-PDF`** — safe local PDF smoke fixture plan (unblocks PDF demo evidence)

## Notes For Next Chat

- Replace all placeholders before sending any provider email.
- Keep payments fail-closed; do not enable checkout in response to KYB questions.
- If Lemon remains rejected, adapt this package for alternative MoR provider from `docs/D3M_ALTERNATIVE_PAYMENT_PROVIDER_SELECTION_MATRIX.md`.
- Compact Cursor reports required; no secrets in chat or docs.

## Related Artifacts

- Email draft: `docs/D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md`
- Demo script: `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md`
- Send checklist: `docs/D3M_PAYMENT_PROVIDER_SEND_CHECKLIST.md`
- External verification checklist: `docs/D3M_PAYMENT_PROVIDER_EXTERNAL_VERIFICATION_CHECKLIST.md`
- Payment track reconciliation: `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md`
