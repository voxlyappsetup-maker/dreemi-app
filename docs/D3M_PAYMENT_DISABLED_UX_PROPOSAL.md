# D3M Payment Disabled UX Proposal

## 1. Purpose and boundary

- This is a documentation-only UX proposal/test-plan phase.
- No code, runtime, test, env, or provider changes are made in this phase.
- No secrets are added or requested.
- No checkout behavior is changed.
- No D3K rollback is recommended.
- No third entitlement runtime wiring surface is introduced.

## 2. Source finding

- Source docs:
  - `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md`
  - `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`
  - `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- Finding:
  - checkout returned `CHECKOUT_CREATE_FAILED`
  - API log showed `LEMONSQUEEZY_STORE_ID` is not set
- Current classification:
  - `FAIL / LOCAL PAYMENT PROVIDER CONFIG BLOCKER`

## 3. UX problem

- Current local/dev user experience can be confusing.
- User selects a package and receives `CHECKOUT_CREATE_FAILED`.
- The message does not explain whether payments are unavailable, provider config is missing, checkout is disabled, or provider approval is pending.
- This is a UX/readiness clarity issue, not proof of payment entitlement failure.

## 4. Product decision boundary

- Do not expose secret names or internal provider details in end-user UI unless explicitly intended for dev/admin contexts.
- Public users should see a safe generic message.
- Developers/operators may need clearer logs/docs, not public UI leakage.
- Production checkout should remain gated by provider approval/readiness.
- Local checkout should not silently imply payment is production-ready.

## 5. Proposed future UX direction

Recommended safe user-facing copy (proposal only):

Frontend/user-facing copy:
- EN:
  Payments are not available in this environment yet. Please try again later.
- AR:
  المدفوعات غير متاحة في هذه البيئة حاليًا. يرجى المحاولة لاحقًا.
- FR:
  Les paiements ne sont pas encore disponibles dans cet environnement. Veuillez réessayer plus tard.

Alternative stronger beta wording:
- EN:
  Payments are temporarily unavailable while checkout is being prepared.
- AR:
  المدفوعات غير متاحة مؤقتًا أثناء تجهيز عملية الدفع.
- FR:
  Les paiements sont temporairement indisponibles pendant la préparation du paiement.

Important:
- These are proposed strings only. Do not edit message catalogs in this phase.

## 6. Recommended future implementation shape

Cautious future implementation approach:
- Use a stable backend error code or existing payment status signal so frontend can show a safe localized message.
- Preserve existing checkout auth.
- Preserve webhook signature verification.
- Preserve billing catalog.
- Preserve provider runtime gate behavior.
- Avoid exposing missing env variable names in public UI.
- Keep detailed config cause in server logs only.

Potential approaches to compare:
- A. API returns a stable config-disabled/payment-unavailable code when provider is not configured or not approved.
- B. Frontend consults existing payments/status and disables checkout buttons when `canStartCheckout` is false.
- C. Pricing page displays a beta/payment-unavailable notice when checkout is not available.
- D. Keep behavior unchanged and rely on docs only.

No final implementation is selected in this phase because multiple viable options exist.

## 7. Future affected surfaces

Future edit candidates only (not current edits):
- `services/api/src/routes/payments.ts`
- `services/api/src/services/lemonsqueezy.service.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/lib/api.ts`
- `apps/web/messages/en.json`
- `apps/web/messages/ar.json`
- `apps/web/messages/fr.json`
- relevant docs only

## 8. Test plan for future implementation

Static/source checks:
- Checkout route remains authenticated.
- Webhook route signature verification remains unchanged.
- Billing catalog variant validation remains unchanged.
- No real secrets or provider IDs are added to docs/source.
- No `.env` or `.env.local` edits.
- No Prisma schema/migration changes.
- No D3G/D3K entitlement wiring changes.
- No third entitlement runtime surface.
- Payment unavailable/config-disabled code or status is handled by frontend.
- EN/AR/FR message catalogs contain safe localized copy if UI text is added.

Manual smoke checks:
- Local environment without provider config does not show raw `CHECKOUT_CREATE_FAILED` to user if UX fix is implemented.
- Pricing page either disables checkout clearly or shows safe unavailable message.
- Checkout remains blocked when provider config is absent.
- No secret names or env variable names appear in public UI.
- Authenticated checkout flow remains required.
- Existing pricing page still loads.
- Payment status route behavior remains consistent.
- Story generation and entitlement limits remain unaffected.

Automated validation:
- `git diff --check`
- mojibake scan
- secret scan
- `pnpm.cmd --filter @dreemi/api test`
- `pnpm.cmd test`
- `pnpm.cmd lint`
- `pnpm.cmd build`

## 9. Rollback plan for future implementation

If a future UX/payment-disabled change causes regression:
- Revert only the UX/payment-disabled implementation commit.
- Do not revert D3K.
- Do not touch D3G.
- Do not touch localization fix for `STORY_LIMIT_REACHED` unless directly implicated.
- Do not modify provider secrets/config as rollback.
- Re-run full validation.

## 10. Guardrails

- Do not paste secrets in chat.
- Do not commit `.env` or `.env.local`.
- Do not add real provider IDs/secrets to docs.
- Do not weaken auth on checkout.
- Do not weaken webhook signature verification.
- Do not change billing catalog without explicit approval.
- Do not change `User.plan` / entitlement policy.
- Do not alter D3G/D3K wiring.
- Do not introduce third entitlement runtime surface.
- Do not treat local missing env as production approval.
- Do not make checkout appear available when provider readiness is blocked.

## 11. Open questions for user

- Should local/dev checkout buttons be disabled when payments/status says checkout cannot start?
- Should the user-facing message be generic, or explicitly say payments are unavailable in this environment?
- Should pricing remain visible while checkout is disabled?
- Should Lemon Squeezy remain the near-term provider target, or should payment UX work pause until provider strategy is settled?
- Should we add a no-purchase payment status smoke before implementing UX changes?

## 12. Recommended next phase

- Recommended:
  - `D3M-Triage-B2` safe no-purchase payment status/subscription smoke plan, or
  - `D3M-Triage-B1-Implement` payment disabled/config-missing UX implementation (explicit approval only).
- Alternative:
  - `D3M-Triage-C` image generation triage.

Follow-up:
- D3M-Triage-B2 no-purchase smoke plan is documented at `docs/D3M_PAYMENT_NO_PURCHASE_SMOKE_PLAN.md`.
