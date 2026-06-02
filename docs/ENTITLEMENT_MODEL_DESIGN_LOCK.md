# Entitlement Model Design Lock

## 1. Purpose

- Define a provider-neutral entitlement model before adding Apple IAP, Google Play Billing, Paddle, PayPal, or any other provider.
- Prevent Lemon Squeezy or any web provider from becoming the canonical entitlement model.
- Preserve the parent-first mobile-first commercial strategy.
- Cross-reference parent-first monetization product lock:
  - `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`
- Cross-reference Apple IAP readiness plan:
  - `docs/APPLE_IAP_READINESS_PLAN.md`
- Cross-reference iOS App Store product and subscription mapping design:
  - `docs/IOS_APP_STORE_PRODUCT_MAPPING_DESIGN.md`
- Cross-reference Google Play Billing readiness plan:
  - `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`
- Cross-reference Android Play Console product and subscription mapping design:
  - `docs/ANDROID_PLAY_CONSOLE_PRODUCT_MAPPING_DESIGN.md`
- Cross-reference entitlement implementation planning:
  - `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`
- This document is a design lock only.
- It does not implement schema, code, migrations, providers, or deployment.
- The implementation plan defines safe staged execution and User.plan compatibility without starting implementation.

## 2. Strategic Product Position

- Dreemi/Qisas is parent-first, not child-purchase-first.
- Parent account owns subscription, children, generated stories, exports, data export, and account deletion.
- Children are story subjects/readers, not buyers.
- Paid mobile launch must be designed around platform-compliant monetization:
  - Apple IAP for iOS.
  - Google Play Billing for Android.
  - Web provider only for web/PWA or later web purchases.
- Export/PDF remains a parent-controlled commercial value and growth loop.

## 3. Current Architecture Snapshot

- `User.plan` is the current effective entitlement field.
- Plans are `FREE`, `INDIVIDUAL`, `FAMILY`, `SCHOOL`.
- FREE story limit is 3/month.
- Paid plans are currently treated as unlimited for story generation.
- Child limits are FREE 1, INDIVIDUAL 1, FAMILY 4, SCHOOL Infinity.
- No credits ledger exists.
- Existing Lemon integration is not approved for production launch.
- Paid checkout is disabled by default unless explicitly enabled and provider-approved.
- Current model is plan-ready but not provider-neutral.

## 4. Canonical Entitlement Principle

The application must decide access from effective entitlement state, not from a specific payment provider.

- This entitlement model exists to support parent-first mobile monetization across Apple, Google, web, and internal/admin sources.
- Apple, Google, Web, and manual/admin grants are possible sources.
- Apple IAP is a future `EntitlementSource` adapter that must map Apple lifecycle inputs into normalized entitlement events.
- Apple product IDs must map into normalized `EntitlementPlan` values and must not be used directly in access checks.
- Google Play Billing is a future `EntitlementSource` adapter that must map Google lifecycle inputs into normalized entitlement events.
- Google product IDs/base plans must map into normalized `EntitlementPlan` values and must not be used directly in access checks.
- Backend access checks should consume normalized entitlement state.
- Provider-specific events should be adapters into normalized entitlement events.
- `User.plan` may remain a simple effective plan projection, but should not be the full entitlement history/audit source forever.

## 5. Proposed Entitlement Concepts

These are design terms only. They do not imply schema changes in this phase.

- `EntitlementSource`
  - `APPLE_IAP`
  - `GOOGLE_PLAY`
  - `WEB_PROVIDER`
  - `MANUAL_ADMIN`
  - `INTERNAL_TEST`
- `EntitlementPlan`
  - `FREE`
  - `INDIVIDUAL`
  - `FAMILY`
  - `SCHOOL`
- `EntitlementStatus`
  - `active`
  - `trialing`
  - `grace_period`
  - `past_due`
  - `canceled`
  - `expired`
  - `refunded`
  - `revoked`
- `EntitlementEvent`
  - `activate`
  - `renew`
  - `enter_grace`
  - `enter_past_due`
  - `cancel`
  - `expire`
  - `refund`
  - `revoke`
  - `restore`
  - `manual_grant`
  - `manual_revoke`

## 6. Provider Adapter Responsibilities

Each future provider adapter should handle:

- Provider verification.
- Webhook/server notification validation.
- Purchase token or receipt validation.
- Idempotency.
- Mapping provider events to normalized entitlement events.
- Handling cancellation, expiration, refund, revocation, and grace periods.
- Recording enough evidence for audit without storing secrets in logs.
- Recomputing effective entitlement safely.

Provider notes:

- Apple IAP adapter: future StoreKit/App Store Server workflow.
- Google Play adapter: future Play Billing purchase token and notification workflow.
- Web provider adapter: future Paddle/PayPal/etc., not Lemon by default.
- Manual/admin adapter: future internal controlled grants only.

## 7. Effective Entitlement Rules

- FREE is the default safe entitlement.
- Paid entitlement must only be active after verified provider evidence or approved manual/internal source.
- Refund/revocation should remove paid entitlement unless a separate valid entitlement remains.
- Expiration should return user to FREE unless another active entitlement exists.
- If multiple sources exist, effective entitlement should be computed deterministically.
- Fail-closed behavior is required for uncertain payment state.
- Provider outage must not grant new paid access by default.

## 8. Restore and Cross-Platform Rules

- Mobile must support restore purchase flows later.
- Apple restore should verify App Store purchase state server-side.
- Google restore should verify Play purchase token state server-side.
- Web purchases should sync through backend entitlement state.
- Users should not need separate accounts per platform.
- If a user buys on iOS, Android/web should read the resulting backend entitlement if policy permits.
- If a user buys on web, mobile consumption must be designed carefully and platform-policy review is required before exposing it in native apps.

## 9. Credits and Consumables Position

- No credits ledger exists today.
- Current model is monthly FREE limit plus unlimited paid plans.
- Credits/consumables should not be added until entitlement source model is designed.
- Future credits ledger may be needed for:
  - story credits
  - top-ups
  - school quotas
  - promotional grants
  - refund/reversal tracking
- Credits ledger is a separate future phase, not part of this design lock.

## 10. Parent-First Mobile Guardrails

- Paywalls must be adult-facing.
- No child-facing checkout path.
- Any pricing/subscription management should be parent/account area only.
- Child story surfaces should not show external payment prompts.
- Account deletion and data export remain parent-controlled.
- Story export remains parent-controlled.
- Future parental gate design is required before mobile paid launch.

## 11. Export/PDF Commercial Role

- Export/PDF is not just utility; it is a core parent value.
- It supports keepsake, printing, sharing with family, and organic referral.
- Future product copy should frame export as parent-controlled.
- Exported stories may contain child-linked content, so safety/privacy guidance is needed before broad mobile launch.

## 12. Mobile Launch Blockers

P0 blockers before mobile paid launch:

- Provider-neutral entitlement design accepted.
- Apple IAP plan defined.
- Google Play Billing plan defined.
- Restore purchase flow defined.
- Entitlement audit/history defined.
- Parent-facing paywall constraint defined.
- Unsafe story reporting path defined.
- Privacy/data safety inventory completed.
- Approved payment provider path for each platform.

## 13. Implementation Non-Goals

- No schema changes in this phase.
- No migrations in this phase.
- No provider implementation in this phase.
- No Apple/Google/Paddle integration in this phase.
- No Lemon removal in this phase.
- No deploy in this phase.

## 14. Recommended Follow-On Phases

- Phase 4-D1D - mobile monetization and parent-first product design lock
- Phase 4-D1E - Apple IAP readiness plan
- Phase 4-D1F - Google Play Billing readiness plan
- Phase 4-D1G - unsafe story reporting and AI safety mobile readiness plan
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D3 - selected provider implementation phases

## 15. Current Status

- This design lock is documentation-only.
- Entitlement implementation has not started.
- Lemon remains paused and not approved for production launch.
- Paid checkout remains disabled by default unless explicitly enabled and provider-approved.
