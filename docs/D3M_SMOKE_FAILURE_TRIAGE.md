# D3M Smoke Failure Triage

## 1. Purpose and boundary

- Phase: `4-D3M-Triage`.
- This is a documentation-first triage phase for D3M-Run findings.
- Scope is classification, likely surface mapping, and safe next investigation steps only.
- No runtime changes.
- No test changes.
- No config/env changes.
- No provider changes.
- No third entitlement runtime wiring surface by default.
- No rollback is recommended from current evidence.

## 2. Triage source

- Primary evidence source: `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`.
- Recorded smoke evidence commit: `b497ab0` (`Document D3M manual smoke run results`).
- D3M-Run status: `PARTIAL PASS / NON-D3K BLOCKERS FOUND`.

## 3. Summary triage table

| Finding | Classification | Likely surface | D3K-related? | User impact | Recommended next action |
| --- | --- | --- | --- | --- | --- |
| A. English UI shows Arabic limit message | WARN / Localization issue | UI error rendering on generate flow; i18n message catalogs; backend emits stable code plus Arabic text | Not proven; low likelihood | Medium (confusing language mismatch) | Prepare localization proposal/test plan that maps `STORY_LIMIT_REACHED` to locale-specific UI text |
| B. Checkout returns `CHECKOUT_CREATE_FAILED` because `LEMONSQUEEZY_STORE_ID` is not set | FAIL / CONFIG BLOCKER | Payments checkout path and Lemon env prerequisites | No | Medium-High for payment smoke completeness | Clarify local payment readiness expectations and config-missing handling policy (docs-first) |
| C. Payment status/subscription checks blocked by checkout provider config | BLOCKED / CONFIG | Verification workflow dependency on checkout path | No current proof | Medium (coverage gap, not proven route failure) | Define separate verification approach for status/subscription independent of checkout |
| D. Image generation no longer works | FAIL / IMAGE GENERATION TRIAGE NEEDED | Story image async path (`stories` route + image service/provider + UI display/fallback) | Not proven | Medium-High (visible feature regression) | Open dedicated image-generation triage phase before any fix |

## 4. Finding A - limit message localization

- Observed behavior:
  - Limit block appears functionally correct, but user-facing message language is Arabic while English UI is active.
- Likely class:
  - localization/display handling mismatch.
- Likely surfaces to inspect in a future fix phase:
  - `services/api/src/middleware/plans.middleware.ts` (read-only confirmation of stable error code/shape),
  - frontend generate-page error handling,
  - i18n message catalogs in `apps/web/messages/*.json`.
- Preferred future fix direction:
  - UI should rely on stable backend error code `STORY_LIMIT_REACHED` and render locale-specific copy.
  - Avoid using backend human-readable text directly for localized UI display.
  - Detailed proposal/test plan for this finding: `docs/D3M_LOCALIZATION_FIX_PROPOSAL.md`.
- D3K rollback assessment:
  - Not a rollback trigger.
  - D3K should not be reverted for message localization alone.

## 5. Finding B - checkout local config blocker

- Observed request:
  - `POST /api/payments/checkout`
  - status `500`
  - response `CHECKOUT_CREATE_FAILED`
  - payload `{ variantId: 1712590 }`
- API log cause:
  - `LEMONSQUEEZY_STORE_ID` is not set.
- Likely class:
  - local provider configuration blocker.
- Relevant docs:
  - `docs/PRODUCTION_READINESS_CHECKLIST.md`
  - `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`
  - `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md`
- Preferred future action:
  - Do not add secrets to repo.
  - Do not paste secrets in chat.
  - Decide whether local checkout should be disabled gracefully when provider env is incomplete.
  - Decide whether current `CHECKOUT_CREATE_FAILED` is acceptable for local smoke, or whether UI should show a clearer provider-disabled/config-missing message.
- D3K rollback assessment:
  - Not related to D3K.
  - No rollback.

## 6. Finding C - payment status/subscription blocked

- Observed behavior:
  - Payment status/subscription were not independently verified because checkout failed first in normal flow.
- Likely class:
  - verification blocked by provider config, not proven API failure.
- Future investigation:
  - Separately test public payments status route and authenticated subscription route with a safe local account.
  - Do not infer they are broken solely from checkout blocker.
  - Use `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md` as the payment blocker/readiness reference.
- D3K rollback assessment:
  - No rollback from current evidence.

## 7. Finding D - image generation not working

- Observed behavior:
  - Image generation no longer works for generated stories/articles.
- Likely class:
  - image provider availability, image verification path, API fallback behavior, or frontend rendering/fallback handling.
- Likely surfaces to inspect in a future triage/fix phase:
  - story generation route image async branch,
  - image generation service path,
  - frontend story/generate image display fallback,
  - API logs from a controlled generation attempt.
- Important boundary:
  - Not proven related to D3K.
  - Do not mix with payment or entitlement runtime fixes.
- Preferred future action:
  - Create a dedicated image-generation triage phase before any fix.

## 8. Recommended phase ordering

1. `D3M-Triage` commit/acceptance.
2. `D3M-Triage-A` Localization fix proposal/test plan.
3. `D3M-Triage-B` Payment config/readiness clarification.
4. `D3M-Triage-C` Image generation triage.
5. Only after those, consider code fixes as separate explicitly approved phases.

Guardrails:
- No third entitlement runtime wiring surface by default.
- No provider configuration changes by default.
- No image generation code changes before a dedicated triage phase.

## 9. Open questions for user

- Should local checkout remain blocked unless Lemon config is present, or should UI show a clearer disabled-provider message?
- Is Lemon Squeezy still intended for local/dev testing after provider approval issues, or should payment work pause until provider strategy is settled?
- For image generation, does the API create the story without an image, or does story generation fully fail?
- For localization, should all backend error messages be replaced in UI using stable error codes?
