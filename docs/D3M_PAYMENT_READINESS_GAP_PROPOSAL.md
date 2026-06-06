# D3M Payment Readiness Gap Proposal

## 1. Title

Phase `4-D3M-Triage-B3`: Payment readiness/status vs checkout provider config completeness gap proposal and safe test plan.

## 2. Status

- Phase type: documentation-only.
- Runtime/code/config/env/provider behavior: unchanged.
- Checkout/purchase/webhook/provider API calls: not executed in this phase.
- Scope outcome: gap documented with conservative recommendations.

## 3. Evidence Reviewed

Primary evidence sources reviewed for this proposal:

- `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`
- `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md`
- `docs/D3M_PAYMENT_DISABLED_UX_PROPOSAL.md`
- `docs/D3M_PAYMENT_NO_PURCHASE_SMOKE_PLAN.md`
- `docs/D3M_PAYMENT_NO_PURCHASE_SMOKE_RESULTS.md`
- `docs/D3K_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`

Observed data points from prior documented runs:

- Public status on local API port `3001` returned success with:
  - `payments.canStartCheckout=true`
  - `payments.errorCode=null`
  - `payments.activeProvider=LEMONSQUEEZY`
- Prior local checkout attempt failed with:
  - `CHECKOUT_CREATE_FAILED`
  - local cause recorded in logs: missing required provider config for checkout creation (`LEMONSQUEEZY_STORE_ID` not set).

## 4. Current Observed Gap

Current documented behavior shows a readiness signal that can be interpreted as "checkout can start," while actual checkout creation can still fail due to incomplete provider configuration.

This creates a readiness/config completeness gap:

- `payments/status` indicates startability (`canStartCheckout=true`).
- `POST /api/payments/checkout` may still fail for provider-config prerequisites.

Operationally, this is a contract clarity gap between:

- readiness/status signal semantics, and
- real checkout dependency completeness.

## 5. Why This Is Not a D3K Regression

- D3K scope is story-limit entitlement wiring in `plans.middleware.ts`, not payment provider config.
- D3K review (`docs/D3K_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`) keeps payments/checkout/webhook non-wired to EntitlementService.
- The observed checkout failure class is provider-config related, not story-limit runtime behavior.
- Therefore, current evidence does not justify D3K rollback.

## 6. Why This Is Not an Entitlement Issue

- Entitlement wiring tracks access projection logic for limits/access checks.
- Observed blocker is checkout provider setup completeness, before entitlement update lifecycle.
- No evidence in this finding shows entitlement projection logic as the causal failure.
- Classification remains provider-readiness/config semantics, not entitlement model malfunction.

## 7. Why This Does Not Prove Checkout Is Fully Broken

- Available evidence proves a specific local config-dependent failure mode.
- It does not prove all checkout paths are permanently broken in every environment/config state.
- It also does not prove subscription route logic is broken; prior B2 run marked subscription check as auth-safe blocked, not route failure proof.
- Conclusion should remain narrow: current local readiness signal may overstate checkout readiness when provider prerequisites are incomplete.

## 8. Product/UX Risk

If unchanged, users may see confusing behavior:

- pricing and status can imply checkout availability,
- then checkout fails with generic `CHECKOUT_CREATE_FAILED`.

Risks:

- misleading readiness expectations,
- avoidable failed checkout attempts,
- noisy support burden,
- degraded trust in pricing/payment surfaces.

## 9. Recommended Direction

Conservative recommendation:

1. Make `payments/status` readiness semantics stricter and explicitly tied to checkout provider config completeness needed for safe checkout creation.
2. Use stable machine-readable error codes for provider-config-missing/unavailable cases.
3. Prefer safe localized "payments unavailable" UX behavior on pricing surfaces over exposing raw checkout failure internals.
4. Keep Lemon readiness guarded until provider config and production payment path are intentionally verified in an approved phase.

## 10. Proposed Backend Contract Options

Option A (preferred): strict readiness contract

- `payments/status` reports `canStartCheckout=false` when required checkout provider configuration is incomplete.
- `payments.errorCode` returns a stable non-secret code (example naming style):
  - `PAYMENT_PROVIDER_NOT_READY`
  - or `CHECKOUT_PROVIDER_CONFIG_INCOMPLETE`
- Keep details in server logs only; avoid exposing secret-related internals in public response text.

Option B: dual readiness fields

- Keep current `canStartCheckout` semantics if needed for backward compatibility.
- Add explicit completeness signal, such as:
  - `checkoutConfigComplete: boolean`
  - `checkoutAvailabilityCode: <stable code>`
- Frontend gates checkout on both readiness and completeness.

Option C: checkout error normalization only

- Keep status endpoint unchanged.
- On checkout creation precondition failure, return a stable explicit code (non-secret) rather than generic `CHECKOUT_CREATE_FAILED`.
- Lower confidence than Option A because readiness ambiguity remains.

## 11. Proposed Frontend/Pricing UX Options

Option 1 (preferred): disable checkout CTA when unavailable

- If payment status indicates not ready/unavailable, disable checkout action.
- Show safe localized explanation:
  - payments are unavailable in this environment for now.

Option 2: allow click but graceful blocked state

- Keep CTA enabled.
- On stable backend "provider not ready" code, show localized unavailable message.
- Do not surface raw internal failure messages.

Option 3: environment banner + CTA policy

- Add lightweight pricing banner for payment availability status.
- Combine with either disabled CTA or graceful blocked modal/toast.

Guardrails for all options:

- no secret names/values in UI,
- no auth bypass,
- no webhook weakening,
- no implication that provider is production-approved.

## 12. Safe No-Purchase Test Plan

Objective: validate readiness/status, subscription observability, and pricing UX behavior without purchase, checkout, webhook, or secrets.

Planned checks:

1. Pricing pages load for `en/ar/fr`.
2. Public `GET /api/payments/status` returns stable, parseable readiness fields/codes.
3. Status response exposes no secrets.
4. Auth-protected subscription route behavior is assessed with safe auth handling only.
5. No `POST /api/payments/checkout` call.
6. No `/api/payments/webhook` call.
7. No provider API calls.
8. No plan mutation side effects from smoke checks.

Expected outputs:

- explicit PASS/BLOCKED classification,
- clear distinction between auth constraints vs route failure,
- readiness signal vs checkout completeness consistency decision support.

## 13. Explicit Non-Goals

- No runtime/code changes.
- No provider/env configuration changes.
- No checkout/purchase execution.
- No webhook test execution.
- No provider API interaction.
- No schema/migration changes.
- No entitlement runtime changes.
- No deployment changes.

## 14. Open Decisions

1. Should `payments/status` represent strict checkout readiness (including config completeness), or only high-level provider state?
2. Which stable backend code should be standardized for provider-config-incomplete/unavailable checkout?
3. Should pricing UX default to disabled CTA or graceful post-click unavailable state?
4. Should subscription-route safe verification remain a separate authenticated phase when token handling is constrained?
5. Should Lemon-related readiness remain explicitly guarded until approved-provider verification is completed?

## 15. Next Recommended Phase

Recommended next phase:

- `4-D3M-Triage-B3-Implement` (explicit approval required): implement minimal backend/UX contract alignment for readiness completeness + stable error code + safe localized pricing unavailable behavior.

Alternative if implementation is deferred:

- run another strict no-purchase evidence pass focused on status/contract assertions only, then decide implementation scope.
