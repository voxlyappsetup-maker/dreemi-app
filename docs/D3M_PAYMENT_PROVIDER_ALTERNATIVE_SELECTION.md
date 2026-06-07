# D3M Payment Provider Alternative Selection

## Status

This is a docs-only provider selection phase.
No provider account was created.
No provider dashboard was accessed.
No payment checkout was executed.
No payment purchase was executed.
No live webhook was executed.
No provider API call was made.
No env/secrets were read, printed, verified, or modified.
Production billing remains **NO-GO**.

## Purpose

- Research realistic alternative MoR/payment paths after Lemon Squeezy final rejection.
- Compare providers using **official sources only** (research date: **2026-06-07**).
- Produce ranked shortlist, primary/backup recommendation, and next steps without integration.

## Current Baseline

- Latest stable commit: `7049ced Reconcile Lemon rejection payment path`
- Lemon Squeezy: **REJECTED / NOT ACTIVE**
- Dreemi: https://www.dreemi.app/ | support: contact@dreemi.app
- Production billing: **NO-GO**

## Source Availability

| Source | Status |
| --- | --- |
| Lemon rejection reconciliation | Available |
| Reusable KYB package | Available |
| Founder legal entity / country | **Not documented in repo** — required user input |

## Explicit Non-Goals

- No provider onboarding, applications, dashboard access, checkout, webhook, or API calls.
- No provider selection implementation or runtime code changes.
- No unofficial comparison sites used for final recommendation.

## Research Method

| Item | Detail |
| --- | --- |
| Research date | **2026-06-07** |
| Sources | Official provider websites, help centers, legal/restricted-business pages, pricing pages, developer docs |
| Unavailable | Polar Acceptable Use Policy URL returned 404 at fetch time; Polar Master Services Terms used instead |
| UNVERIFIED claims | Founder seller-country eligibility for specific MoR until `[Country]` confirmed; exact approval outcome for AI children’s SaaS until application |
| Policy drift | All provider policies may change — **recheck immediately before application** |

Official sources used (sample):

- Paddle AUP: https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle
- Paddle countries/pricing: https://paddle.com/support/countries-supported/ , https://www.paddle.com/pricing
- FastSpring MoR/tax: https://fastspring.com/merchant-of-record/ , https://fastspring.com/tax-management/
- PayPro Global MoR: https://payproglobal.com/products/merchant-of-record/
- Creem docs/pricing: https://docs.creem.io/getting-started/introduction , https://www.creem.io/pricing
- Polar MoR docs/terms: https://polar.sh/docs/merchant-of-record/introduction , https://polar.sh/legal/master-services-terms
- Gumroad prohibited: https://gumroad.com/prohibited , https://gumroad.com/terms
- Stripe restricted businesses: https://stripe.com/legal/restricted-businesses

## Product / Risk Profile

Dreemi evaluation profile for providers:

- AI-assisted **children’s storytelling SaaS** (Arabic / English / French)
- **Adult buyers**: parents, guardians, educators — not child purchasers
- **Subscriptions** (FREE / INDIVIDUAL / FAMILY / SCHOOL planned)
- No marketplace, creator payouts, physical goods, adult content, gambling, financial services, controlled goods
- Child-safety and content-safety guardrails documented in repo
- Payment currently **unavailable / fail-closed**
- Lemon rejection cited **disputes, supportability, processor (Stripe/PayPal) constraints** — future providers need strong support/refund/dispute posture

## Required User Inputs

Before final provider lock-in:

- `[Founder legal name]`, `[Company/legal entity, if applicable]`, `[Country]`
- Tax/VAT registration posture
- `[Individual plan price + billing interval]`, `[Family plan price + billing interval]`, `[School plan availability / planned-only]`
- `[Refund policy URL or wording]`, `[Privacy policy URL]`, `[Terms URL]`
- Preferred payout country/bank
- MoR vs direct processor priority
- Risk tolerance for applications after Lemon rejection

## Provider Evaluation Criteria

See comparison matrix below. Confidence: **HIGH** = directly supported by official current source; **MEDIUM** = fit plausible but approval/entity uncertain; **LOW** = poor fit or elevated policy risk; **UNVERIFIED** = not confirmed from official source.

## Provider Comparison Matrix

| Provider / Path | Type | MoR? | Subscriptions? | SaaS fit | AI/children risk clarity | Seller country/entity | Tax/VAT | Webhook/API | Approval risk | Complexity | Overall fit | Confidence | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **FastSpring** | MoR | Yes | Yes | Strong | AI listed officially; children not explicit | Global MoR; US sanctions apply | MoR handles | Mature | Medium | **Strong** | MEDIUM | **Primary candidate** |
| **Creem** | MoR | Yes | Yes | Strong | AI tools official; children UNVERIFIED | UNVERIFIED until apply | MoR 190+ countries claimed | API/CLI/webhooks | Medium | Low–Med | **Strong** | MEDIUM | **Backup candidate** |
| **PayPro Global** | MoR | Yes | Yes | Strong | SaaS official; AI/children not explicit on product page | MoR 200+ regions claimed | MoR handles | Mature | Medium | Med | Good | MEDIUM | Shortlist / alt apply |
| **Paddle** | MoR | Yes | Yes | Strong | Content-generation **restricted**; some AI gen prohibited subsets | Unsupported seller countries list | MoR handles | Mature | **Higher** for AI stories | Med | Good w/ review | MEDIUM | Apply with caution |
| **Polar** | MoR | Yes | Yes | Strong | Software/digital; children UNVERIFIED | Polar Software Inc (US) reseller model | MoR global claim | Modern API | Medium | Low–Med | Good | MEDIUM | Shortlist |
| **Gumroad** | MoR-like | Partial | Yes | Weak for SaaS | Terms restrict targeting **children under 13** | US-centric | Limited vs MoR | Simpler | **High** for child product | Low | Poor | HIGH (negative) | **Not recommended** |
| **Stripe Direct** | Processor | **No** | Yes | Strong tech | Content platforms restricted; not MoR | Country-specific onboarding | **Merchant** responsible | Excellent | Medium–High | High | Processor-only | MEDIUM | Not primary for global MoR needs |
| **Stripe Atlas** | Entity formation | No | N/A | N/A | Legal path only | US Delaware C-Corp typical | N/A | N/A | N/A | High | Entity bridge | MEDIUM | Legal review first |
| **Manual invoice** | Bridge | No | Manual | N/A | Low payment risk | Any | Manual | None | Low | Low | School bridge only | HIGH | Fallback |
| **Free beta / waitlist** | Business | No | N/A | N/A | None | Any | N/A | N/A | None | None | Valid temp | HIGH | **Bridge now** |
| **Lemon Squeezy** | MoR | Was | Yes | Was fit | **Rejected** | N/A | N/A | Integrated in code | **Closed** | N/A | **Closed** | HIGH | **Not active** |

## Provider Notes

### Option 1 — Paddle

- **Official:** Built for software/SaaS; MoR; subscriptions supported; AUP last updated 13 Apr 2026 ([AUP](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle)).
- **Risk:** “Content generation” includes **restricted/prohibited** subsets (face swaps, deepfakes, voice impersonation, etc.). Dreemi text stories may still trigger **enhanced due diligence** as content-generation SaaS.
- **Pricing:** 5% + $0.50 checkout ([pricing](https://www.paddle.com/pricing)).
- **Fit:** Good MoR if approved; not primary due to Lemon-like processor-risk sensitivity and AI content-generation policy friction.

### Option 2 — FastSpring

- **Official:** MoR for “SaaS, software, video games, mobile apps, **AI**, eLearning, and other digital goods”; subscriptions; global tax ([tax-management](https://fastspring.com/tax-management/)).
- **Uncertainty:** Children/family product acceptance not explicit; application review required.
- **Fit:** **Best official alignment** for AI + SaaS + subscriptions + MoR tax handling.

### Option 3 — PayPro Global

- **Official:** MoR for SaaS/software; subscriptions; 200+ regions; tax compliance ([MoR product](https://payproglobal.com/products/merchant-of-record/)).
- **Uncertainty:** AI/children not highlighted on primary product page (blog content less authoritative).
- **Fit:** Solid enterprise MoR alternative if FastSpring/Creem unavailable.

### Option 4 — Creem

- **Official:** MoR for “SaaS, digital products, and **AI tools**”; subscriptions; 3.9% + $0.40; Lemon migration command documented ([docs](https://docs.creem.io/getting-started/introduction)).
- **Uncertainty:** Newer platform; seller-country onboarding rules require application verification.
- **Fit:** Strong **backup** — developer-friendly, explicit AI positioning, lower fees.

### Option 5 — Polar

- **Official:** MoR reseller model; subscriptions; global tax; built on Stripe ([MoR intro](https://polar.sh/docs/merchant-of-record/introduction)).
- **Uncertainty:** Acceptable Use Policy URL 404 at research time; children/education not explicit.
- **Fit:** Viable for software subscriptions; less proven for Dreemi’s risk profile vs FastSpring/Creem.

### Option 6 — Gumroad

- **Official:** Prohibited list + Terms prohibit promoting/distributing to **children under 13** ([prohibited](https://gumroad.com/prohibited), [terms](https://gumroad.com/terms)).
- **Fit:** **Not recommended** for a children’s storytelling product even with adult buyers.

### Option 7 — Stripe Direct

- **Official:** Payment processor, **not MoR**; merchant handles tax/compliance ([Stripe restricted businesses](https://stripe.com/legal/restricted-businesses)).
- **Content creation platforms** restricted when hosting third-party creator marketplaces — Dreemi is **not** a marketplace; direct SaaS may be eligible with review.
- **Fit:** Strong technically but does **not** replace MoR global tax/dispute burden; poor primary match given Lemon processor-risk context unless paired with entity + tax stack.

### Option 8 — Stripe Atlas / Legal Entity Path

- **Official:** US company formation path; restricted business categories apply ([Atlas FAQ](https://support.stripe.com/questions/stripe-atlas-restricted-business-categories)).
- **Fit:** **Legal/entity decision**, not immediate payment activation. Requires qualified legal/tax advice before commitment.

### Option 9 — Manual Invoice / Bank Transfer Bridge

- **Limitations:** Low automation, weak consumer conversion, manual ops, poor subscription scale.
- **Fit:** Optional **school/institution** bridge only with legal review — not primary consumer path.

### Option 10 — Free Beta / Waitlist While Payments Blocked

- **Fit:** **Valid now** — aligns with fail-closed checkout; no provider required.
- **Confidence:** HIGH as business strategy; does not solve billing alone.

## Shortlist

| Category | Choice |
| --- | --- |
| **Primary candidate** | **FastSpring** (pending entity confirmation + application) |
| **Backup candidate** | **Creem** |
| **Bridge/fallback path** | **Free beta/waitlist** + optional **manual school invoice** |

## Recommended Primary Path

**FastSpring** as the **first application target**, pending:

1. `[Country]` / legal entity confirmation (`D3M-Payments-Entity-And-Payout-Decision` if unresolved).
2. Reusable KYB pack from `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md`.
3. Official re-check of policies on application date.

Rationale (official-source based): explicit MoR coverage for **SaaS + AI + subscriptions** and global tax handling — closest match to Dreemi’s needs after Lemon MoR rejection.

## Recommended Backup Path

**Creem** — apply if FastSpring declines or entity/payout constraints block onboarding. Official AI-tools positioning and documented Lemon migration path reduce switching friction.

## Not Recommended For Now

| Provider / path | Status / reason |
| --- | --- |
| **Lemon Squeezy** | **REJECTED / NOT ACTIVE** |
| **Gumroad** | Official terms/policy friction with child-oriented product |
| **Stripe Direct (alone)** | Not MoR; tax/dispute burden remains on merchant |
| **Lemon send / appeal** | Not primary unless user explicitly chooses separate appeal phase |

## Approval Risk Register

| Risk | Provider/Path | Severity | Reason | Mitigation | Next Evidence Needed |
| --- | --- | --- | --- | --- | --- |
| AI-generated children’s content | All MoR candidates | High | Lemon cited supportability/processor risk | Strong safety docs, demo, refund/support policy | Application + provider written feedback |
| Child/family product supportability | FastSpring, Creem, Paddle | High | Not universally explicit in policies | KYB pack + safety/compliance summary | Provider pre-sales or application outcome |
| Dispute/refund burden | MoR providers | High | Lemon rejection theme | Clear refund policy, support email, SLA | Ops readiness doc |
| Legal entity/country eligibility | All | Critical | `[Country]` unknown in repo | Entity decision phase | User/legal input |
| Tax/VAT responsibility | Stripe direct | High | Not MoR | Prefer MoR path | N/A if MoR chosen |
| Content-generation AUP | Paddle | Medium | Restricted category | Pre-application disclosure | Paddle review response |
| Gumroad child targeting rule | Gumroad | High | Terms prohibit U13 targeting | Do not apply | N/A |
| Webhook/integration rework | Any new provider | Medium | Code today is Lemon-oriented | Future integration phase | Technical design after selection |

## Technical Integration Impact

No implementation in this phase. Future work (post-selection):

- Replace/adapt Lemon checkout + webhook handlers
- Map subscription lifecycle → entitlement service
- Keep fail-closed billing gate until verified
- Pricing page state machine (unavailable → offerable)
- Webhook signature verification + idempotency tests
- Security regression tests for payments routes
- Production kill switch remains default

## Operational Requirements

- Monitored **contact@dreemi.app** support inbox
- Published refund/cancellation policy
- Dispute/chargeback response owner
- Customer support macros for billing vs product issues (MoR handles tier-1 billing for many MoR models)
- Demo video + safety documentation for applications

## Refund / Support Requirements

- `[Refund policy URL or wording]` must be finalized before application
- Align Terms/Privacy with generated-content licensing: `[Generated-content licensing wording to confirm]`
- Document support hours and response targets for provider KYB

## Legal / Tax Requirements

- Confirm `[Country]` tax registration obligations
- MoR vs merchant-of-record tax liability split understood
- Stripe Atlas / foreign entity only with qualified legal advice
- School/manual invoice path requires separate contract review

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Provider selected | **Candidate only** (FastSpring primary, Creem backup) |
| Provider approval | **Pending** |
| Checkout verification | **Not executed** |
| Webhook verification | **Not executed** |
| Production billing | **NO-GO** |

## Decision

**Decision: Shortlist with recommended primary candidate — FastSpring — pending user legal/entity inputs and official application approval.**

No provider is approved or integrated from this docs-only phase.

## Next Steps

1. ~~If `[Country]` / entity unresolved → **`D3M-Payments-Entity-And-Payout-Decision`**~~ **Complete** — see `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`
2. **`D3M-Payments-Entity-And-Payout-Fill`** — user confirms entity/payout/pricing/policy inputs
3. **`D3M-Payments-Provider-Application-Pack`** (FastSpring first, Creem backup)
4. Continue **free beta/waitlist** with checkout fail-closed
4. Optional: **`D3M-Payments-Lemon-Appeal-Draft`** only if user explicitly requests (non-primary)

## Notes For Next Chat

- Recheck all official provider policies immediately before any application.
- Do not re-open Lemon send path by default.
- Reuse demo/KYB materials; adapt provider name in cover email.
- Production billing remains **NO-GO** until approval + controlled verification phases pass.

## Related Artifacts

- Shortlist: `docs/D3M_PAYMENT_PROVIDER_SHORTLIST.md`
- Entity/payout decision: `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`
- Lemon reconciliation: `docs/D3M_LEMON_REJECTION_RECONCILIATION.md`
- Alternatives framing: `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVES_NEXT_STEP.md`
