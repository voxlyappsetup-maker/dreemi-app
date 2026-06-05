# D3M Payment Config Readiness Clarification

## 1. Purpose and boundary

- This is a documentation-only clarification phase.
- It records current payment/config readiness after D3M smoke findings.
- No code, runtime, test, env, or provider changes are made in this phase.
- No secrets are added or requested.
- No checkout behavior is changed.
- No D3K rollback is recommended.
- No third entitlement runtime wiring surface is introduced.

## 2. Source finding

- Source docs:
  - `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`
  - `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- D3M finding:
  - checkout returned `CHECKOUT_CREATE_FAILED`
  - API log showed `LEMONSQUEEZY_STORE_ID` is not set
- Payment status/subscription verification was blocked by checkout failure in the normal flow.

## 3. Observed behavior

- User selected a package in local environment.
- Frontend attempted `POST /api/payments/checkout`.
- API returned `500` with `CHECKOUT_CREATE_FAILED`.
- API log identified missing `LEMONSQUEEZY_STORE_ID`.
- No evidence this is related to D3K or story-generation entitlement wiring.
- No evidence this is a schema/RLS issue.
- No evidence payment status/subscription route logic itself is broken; they were not independently verified in that run.

## 4. Classification

- `FAIL / LOCAL PAYMENT PROVIDER CONFIG BLOCKER`
- Not D3K-related.
- Not a localization issue.
- Not an entitlement runtime rollback trigger.
- Provider readiness/config dependency.

## 5. Current payment readiness interpretation

- Local checkout cannot complete unless required Lemon Squeezy provider env/config is present and valid.
- Production checkout should remain gated by provider approval/readiness docs.
- Given known Lemon/provider approval constraints, checkout failure in local smoke is expected if provider env is intentionally absent.
- Current UX may still be confusing because user sees `CHECKOUT_CREATE_FAILED` rather than a clearer provider-disabled/config-missing message.
- This phase does not decide or implement that UX change.

## 6. Relevant surfaces for future investigation

Future investigation surfaces only (not current edits):
- `services/api/src/routes/payments.ts`
- `services/api/src/services/lemonsqueezy.service.ts`
- `services/api/src/config/billing.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/lib/api.ts`
- `apps/web/messages/en.json`
- `apps/web/messages/ar.json`
- `apps/web/messages/fr.json`
- Provider strategy docs:
  - `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`
- Production readiness docs:
  - `docs/PRODUCTION_READINESS_CHECKLIST.md`

## 7. Decision options for next phase

Option A - Keep strict provider config blocking:
- Local checkout remains unavailable unless Lemon env is configured.
- Use docs/manual smoke classification only.
- No code change.

Option B - Improve local/dev UX:
- Add frontend or API handling so missing/unavailable provider state shows a clearer message.
- Must not expose secret names/details to users where inappropriate.
- Requires separate proposal/test plan before any implementation.

Option C - Pause Lemon checkout work:
- Defer checkout flows until provider strategy is settled.
- Keep pricing visible but checkout disabled or clearly labelled if provider is not ready.
- Requires product/payment decision.

Option D - Safe provider-readiness smoke:
- Define a safe verification path for payments/status and subscription routes independent of full checkout.
- Do not require real purchase.
- Do not use live secrets in chat/docs.

## 8. Recommended path

1. Do not add secrets or configure Lemon in repo.
2. Treat current local checkout failure as expected config blocker unless local provider testing is explicitly desired.
3. Next phase should be a payment UX/readiness proposal, not direct provider wiring:
   - `D3M-Triage-B1` Payment disabled/config-missing UX proposal/test plan.
4. Alternative:
   - proceed to `D3M-Triage-C` image generation triage if payment work is intentionally paused.

## 9. Guardrails for future payment work

- Do not paste secrets in chat.
- Do not commit `.env` or `.env.local`.
- Do not add real provider IDs/secrets to docs.
- Do not bypass checkout auth.
- Do not weaken webhook signature verification.
- Do not change billing catalog without explicit approval.
- Do not change `User.plan` / entitlement policy while clarifying provider readiness.
- Do not modify D3G/D3K runtime wiring.
- Do not introduce a third entitlement runtime surface.
- Do not treat local missing env as production approval.

## 10. Open questions for user

- Should checkout remain blocked locally unless Lemon env values are explicitly configured?
- Should the app show a clearer "payments are not available in this environment" message instead of `CHECKOUT_CREATE_FAILED`?
- Is Lemon Squeezy still the intended provider for near-term production, or should payment work pause until provider approval/strategy is settled?
- Should pricing show active checkout buttons while provider readiness is blocked?
- Do we need a separate no-purchase subscription/status smoke path?

## 11. Recommended next phase

- Recommended: `D3M-Triage-B1` - Payment disabled/config-missing UX proposal/test plan.
- Alternative: `D3M-Triage-C` - Image generation triage.

Follow-up:
- D3M-Triage-B1 proposal/test plan is documented at `docs/D3M_PAYMENT_DISABLED_UX_PROPOSAL.md`.
