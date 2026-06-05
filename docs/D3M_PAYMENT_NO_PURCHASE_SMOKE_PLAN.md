# D3M Payment No-Purchase Smoke Plan

## 1. Purpose and boundary

- This is a documentation-only smoke plan.
- It defines safe payment-readiness checks without checkout, purchase, provider secrets, or provider API calls.
- No code, runtime, test, env, or provider changes are made in this phase.
- No secrets are added or requested.
- No D3K rollback is recommended.
- No third entitlement runtime wiring surface is introduced.

## 2. Source context

- Source docs:
  - `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md`
  - `docs/D3M_PAYMENT_DISABLED_UX_PROPOSAL.md`
  - `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`
- Current checkout blocker:
  - `CHECKOUT_CREATE_FAILED`
  - `LEMONSQUEEZY_STORE_ID` is not set
- Clarification:
  - Checkout remains blocked locally unless provider config exists.
  - This plan avoids checkout and real purchase.

## 3. Smoke objectives

- Confirm pricing page loads.
- Confirm public payments/status route behavior can be observed safely.
- Confirm authenticated subscription route behavior can be observed safely.
- Confirm no real checkout is required.
- Confirm no secret values are needed.
- Confirm findings can inform whether B1 implementation is necessary.

## 4. Required environment assumptions

- Local app/API can run.
- Safe test account is available.
- No Lemon secrets are required for this smoke.
- If provider env is absent, checkout is expected to remain unavailable.
- Do not paste or log secret values.

## 5. Routes/surfaces to observe

- Pricing page:
  - `/en/pricing`
  - `/ar/pricing`
  - `/fr/pricing`
- Public payment status endpoint:
  - `/api/payments/status`
- Authenticated subscription endpoint:
  - `/api/payments/subscription`
- Do not call:
  - `/api/payments/checkout`
  - `/api/payments/webhook`
  - provider URLs

## 6. Proposed manual smoke checklist

| ID | Check | Expected safe result | PASS/FAIL | Notes |
| --- | --- | --- | --- | --- |
| 1 | Pricing page loads in EN | Page loads and plan UI renders |  |  |
| 2 | Pricing page loads in AR | Page loads and plan UI renders |  |  |
| 3 | Pricing page loads in FR | Page loads and plan UI renders |  |  |
| 4 | Pricing page does not require checkout click to inspect plan UI | UI can be reviewed without initiating checkout |  |  |
| 5 | Public payments/status endpoint responds without auth | Response returns HTTP success with payment status payload |  |  |
| 6 | Public payments/status response does not include secrets | No secret values/keys exposed |  |  |
| 7 | Public payments/status indicates whether checkout can start | `canStartCheckout` and/or readiness signal is visible |  |  |
| 8 | Authenticated subscription endpoint requires login/token | Unauthenticated access is blocked as expected |  |  |
| 9 | Authenticated subscription endpoint with safe local account returns stable no-subscription/current-subscription state | Response is stable and parseable |  |  |
| 10 | Subscription response does not require provider checkout | Route can be observed without running checkout |  |  |
| 11 | No real checkout was initiated | No checkout request executed |  |  |
| 12 | No provider secrets were added or exposed | No secrets entered, printed, or stored |  |  |
| 13 | No `User.plan` mutation occurred during smoke | No plan mutation side effects observed |  |  |
| 14 | Story generation entitlement behavior remains unaffected | No observed impact on D3G/D3K entitlement behavior |  |  |

## 7. Data capture template

D3M-Triage-B2 Smoke Results  
Commit:  
...  
Environment:  
Local  
Browser:  
Chrome / Windows  
API status route:  
PASS / FAIL  
Response summary:  
...  
Subscription route:  
PASS / FAIL / BLOCKED  
Response summary:  
...  
Pricing EN:  
PASS / FAIL  
Pricing AR:  
PASS / FAIL  
Pricing FR:  
PASS / FAIL  
Checkout invoked:  
NO / YES  
Secrets exposed:  
NO / YES  
User.plan changed:  
NO / YES / NOT CHECKED  
Notes:  
...

## 8. Interpretation guide

- If payments/status says checkout cannot start, B1 UX implementation likely has a clear signal to use.
- If pricing page still shows active buttons while status says checkout cannot start, that supports B1 UX work.
- If subscription route returns stable no-subscription state, it is not blocked by checkout.
- If subscription route fails due to auth only, classify as smoke setup issue, not payment logic failure.
- If any route exposes secrets, stop and triage security immediately.
- Do not treat missing provider env as production readiness.

## 9. Guardrails

- Do not paste secrets in chat.
- Do not commit `.env` or `.env.local`.
- Do not call real checkout.
- Do not call webhook manually unless a separate explicit webhook test phase is approved.
- Do not bypass auth.
- Do not mutate `User.plan` manually.
- Do not alter D3G/D3K runtime wiring.
- Do not add a third entitlement surface.
- Do not use real card/payment data.
- Do not infer route failure from checkout blocker alone.

## 10. Recommended next phase after smoke

- Recommended:
  - `D3M-Triage-B2-Run` - user-executed no-purchase smoke run + evidence capture.
- After that:
  - `D3M-Triage-B1-Implement` if status/subscription evidence supports UX fix.
- Alternative:
  - `D3M-Triage-C` image generation triage.
