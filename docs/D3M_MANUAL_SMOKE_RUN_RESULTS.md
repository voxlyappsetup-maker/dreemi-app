# D3M Manual Smoke Run Results

## 1. Purpose and boundary

- Phase: `4-D3M-Run`.
- Scope: document user-provided manual smoke execution evidence after D3K/D3M.
- This document records observed outcomes only.
- No runtime, test, schema, provider, frontend, deployment, package, or env changes are included.
- Documentation-first triage follow-up for these findings is documented at:
  - `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- Payment blocker follow-up clarification is documented at:
  - `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md`

## 2. Run metadata

- Commit: `46eabc4`
- Environment: Local
- Browser/device: Chrome / Windows
- Source of evidence: user-executed manual smoke run

## 3. Overall result

- Overall status: `PARTIAL PASS / NON-D3K BLOCKERS FOUND`.

## 4. Passed checks

| ID | Check | Result | Notes |
| --- | --- | --- | --- |
| 1 | Login works | PASS | Auth flow succeeds. |
| 2 | Generate page loads | PASS | No D3K-specific load regression observed. |
| 3 | FREE below monthly limit can generate | PASS | Story generation succeeds under FREE below-limit state. |
| 6 | Existing story detail page loads | PASS | Owner story detail view works. |
| 7 | Children page loads | PASS | Page remains accessible. |
| 8 | Child-limit behavior still works | PASS | D3G child-limit path appears stable. |
| 9 | Pricing page loads | PASS | Pricing view accessible. |
| 13 | Story list/dashboard accessible | PASS | Authenticated owner access works. |
| 14 | Wrong-user story detail blocked | PASS | Access protection remains enforced. |
| 16 | Arabic story flow | PASS | Generation/display path works. |
| 17 | English story flow | PASS | Generation/display path works. |
| 18 | French story flow | PASS | Generation/display path works. |
| 19 | PDF export works | PASS | Existing story export works. |
| 20 | Mobile-width layout on generate/children/story pages | PASS | No visible regression reported. |

## 5. Warnings

| ID | Check | Classification | Observation | Assessment |
| --- | --- | --- | --- | --- |
| 4 | FREE at/over monthly limit gets limit error | WARN / Localization issue | Limit behavior appears to work, but message appears in Arabic while English UI is active. | Not a D3K rollback trigger; likely localization handling around `STORY_LIMIT_REACHED` display. |

## 6. Blocked/not-tested checks

| ID | Check | Status | Blocker/Reason | Assessment |
| --- | --- | --- | --- | --- |
| 5 | Paid-plan user behavior unchanged | NT | Not executed in this run. | No D3K conclusion from this check. |
| 11 | Payment status behavior unchanged | BLOCKED / CONFIG | Could not verify through normal flow because checkout fails first. | Not attributed to D3K; local payment provider configuration incomplete. |
| 12 | Subscription behavior unchanged | BLOCKED / CONFIG | Could not verify through normal flow because checkout fails first. | Not attributed to D3K; local payment provider configuration incomplete. |
| 15 | Public unauthenticated story sharing disabled | NT | Not executed in this run. | No D3K conclusion from this check. |

## 7. Failed/needs-triage checks

| ID | Check | Status | Observation | Assessment |
| --- | --- | --- | --- | --- |
| 10 | Checkout UI not affected | FAIL / CONFIG BLOCKER | `POST /api/payments/checkout` returned `500` with `CHECKOUT_CREATE_FAILED`, payload included `{ variantId: 1712590 }`. API logs indicate `LEMONSQUEEZY_STORE_ID` is not set. | Not attributed to D3K; local Lemon Squeezy checkout environment is incomplete/not configured. |
| N/A | Image generation for generated stories/articles | FAIL / IMAGE GENERATION TRIAGE NEEDED | Image generation no longer works. | Not proven related to D3K; requires separate triage of image generation/provider/fallback path. |

## 8. D3K rollback assessment

- D3K rollback is **not recommended** based on this smoke run.
- Core D3K-adjacent behavior passed: story generation below limit, child-limit behavior, story detail, dashboard access, PDF export, multilingual story flows.
- Remaining blockers are classified as non-D3K until proven otherwise.

## 9. Recommended next phase

- Recommended next phase: `Phase 4-D3M-Triage` (documentation-first smoke failure triage).
- Do not start a third runtime wiring surface by default.
- Do not change payment provider configuration in this phase.
- Do not change image generation code in this phase.

## 10. Raw user observations summary

- Commit/environment/browser:
  - commit `46eabc4`
  - Local
  - Chrome / Windows
- Overall:
  - `PARTIAL PASS / NON-D3K BLOCKERS FOUND`
- Passed:
  - login, generate page load, FREE below-limit generation, story detail load, children page load, child-limit behavior, pricing page load, story list/dashboard access, wrong-user story block, Arabic/English/French flows, PDF export, mobile-width layout
- Warning:
  - at/over-limit behavior appears correct but limit message shows Arabic in English UI (`WARN / Localization issue`)
- Payment/config blockers:
  - checkout flow failed with `POST /api/payments/checkout` -> `500` `CHECKOUT_CREATE_FAILED`
  - payload included `{ variantId: 1712590 }`
  - API log cause: `LEMONSQUEEZY_STORE_ID` not set
  - payment status/subscription checks blocked by checkout failure
- Additional failure:
  - image generation for generated stories/articles no longer works and needs separate triage
