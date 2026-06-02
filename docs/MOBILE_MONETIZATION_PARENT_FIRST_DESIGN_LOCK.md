# Mobile Monetization and Parent-First Product Design Lock

## 1. Purpose

- Lock the parent-first mobile monetization direction before implementation.
- Prevent payment/provider decisions from drifting back to a web-only model.
- Clarify that native mobile paid launch requires mobile platform monetization planning.
- This document is a design lock only.
- It does not implement Apple IAP, Google Play Billing, Paddle, PayPal, schema, code, migrations, or deployment.

## 2. Product Position

- Dreemi/Qisas is for parents/guardians.
- Children are story subjects/readers, not buyers.
- Parent account owns subscription, child profiles, story generation, story library, exports, data export, cancellation, and account deletion.
- The app should not expose child-facing purchase flows.
- The core value is safe personalized story creation, export, and family use.

## 3. Mobile Commercial Target

- Primary commercial target is Android and iOS subscriptions.
- Web monetization is secondary.
- Native mobile purchase flows must be designed separately from web checkout.
- Apple IAP and Google Play Billing should be treated as first-class future monetization paths.
- A web provider replacement alone is not enough for native mobile paid launch.

## 4. Parent vs Child Boundaries

- Parent/account area can show pricing, plan state, subscription management, exports, data controls, and account controls.
- Child/story surfaces should not show checkout, external payment prompts, or provider-specific purchase calls.
- Story generation controls may be parent-facing even if the story is for a child.
- Future parental gate is required before mobile paid launch if any child-facing surface can reach adult/account/payment areas.

## 5. Paywall Design Rules

- Paywalls must be adult-facing.
- Paywalls should explain plan value in parent language.
- Paywalls should not pressure children.
- Paid limits should be explained through parent/account surfaces.
- Failed or disabled payments should fail closed.
- Native mobile paywalls must not rely on web checkout as the default purchase path.
- Web checkout may exist later for web/PWA only if policy and entitlement rules allow.

## 6. Mobile Platform Billing Direction

- iOS: future Apple IAP / StoreKit path.
- Android: future Google Play Billing path.
- Backend must validate platform purchase evidence server-side where appropriate.
- Store notifications/webhooks must map into the provider-neutral entitlement model.
- Restore purchase flows are required later.
- Refund, revocation, expiration, cancellation, grace period, and renewal states must be handled through normalized entitlement events.

## 7. Web Provider Role

- Web provider is secondary to the mobile-first goal.
- Paddle, PayPal, Stripe, or regional gateways may be evaluated later for web/PWA or specific commercial contexts.
- Web provider decisions must fit `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`.
- Web provider replacement does not remove the need for Apple/Google mobile billing readiness.
- Lemon remains paused and not approved for production launch.

## 8. Entitlement Dependency

- Mobile monetization depends on provider-neutral entitlement design.
- `User.plan` is currently the effective plan projection.
- Future source-specific purchases should not directly control access.
- Access checks should consume effective entitlement state.
- Provider adapters should map platform/provider events into normalized entitlement events.

## 9. Plans and Product Packaging

- FREE remains the safe default.
- INDIVIDUAL, FAMILY, and SCHOOL remain conceptual paid plans.
- FREE story limit remains 3/month in current implementation.
- Current child limits remain FREE 1, INDIVIDUAL 1, FAMILY 4, SCHOOL Infinity.
- Future mobile packaging may require app-store-specific product IDs.
- Mobile product IDs must map to normalized EntitlementPlan values.
- SCHOOL may need special handling later if app-store subscriptions are not the right sales channel for institutional use.

## 10. Credits and Consumables

- No credits ledger exists today.
- Credits/top-ups are not approved for implementation yet.
- Story credits may be economically useful later, but should not be added before entitlement source model and platform billing rules are designed.
- Consumables/non-consumables/subscriptions need separate Apple/Google review before implementation.
- Future credits ledger should be a separate phase.

## 11. Export/PDF Commercial Role

- Export/PDF is a core parent-controlled value.
- Export supports keepsake, printing, sharing with family, and organic referral.
- Export should be framed as a parent benefit.
- Exported stories may contain child-related personal content, so privacy/safety guidance is required before broad mobile launch.
- Export should not become a child-targeted acquisition loop.

## 12. Trust, Privacy, and Account Controls

- Account deletion exists and remains important for store readiness.
- Data export exists and remains important for parent trust.
- Subscription cancellation/management should remain easy and parent-facing.
- Future mobile release requires a privacy/data safety inventory.
- Any analytics, AI providers, payment providers, and storage providers must be reflected in privacy/store disclosures later.

## 13. AI Safety and Reporting Dependency

- AI story generation requires safety controls.
- Future mobile launch should include an unsafe generated story reporting path.
- Future reporting should be parent-facing and easy to access.
- Public story/community features should remain out of mobile v1 unless moderation/reporting is designed.
- Private parent-owned story libraries are the safer v1 model.

## 14. Mobile Paid Launch P0 Blockers

- Provider-neutral entitlement model implementation plan accepted.
- Apple IAP readiness plan accepted.
- Google Play Billing readiness plan accepted.
- Restore purchase flow designed.
- Parent-facing paywall design accepted.
- Parental gate requirements defined.
- Unsafe story reporting path designed.
- Privacy/data safety inventory completed.
- Mobile product/package IDs defined.
- Platform-specific cancellation/subscription management behavior designed.
- Approved payment path per platform.
- Paid checkout remains fail-closed until verified.

## 15. Implementation Non-Goals

- No Apple IAP implementation in this phase.
- No Google Play Billing implementation in this phase.
- No Paddle/PayPal/Stripe implementation in this phase.
- No Lemon removal in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No runtime code changes in this phase.
- No deploy in this phase.

## 16. Recommended Follow-On Phases

- Phase 4-D1E - Apple IAP readiness plan
- Phase 4-D1F - Google Play Billing readiness plan
- Phase 4-D1G - unsafe story reporting and AI safety mobile readiness plan
- Phase 4-D1H - privacy and data safety inventory
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D3 - mobile billing implementation phases

## 17. Current Status

- This document is documentation-only.
- Mobile monetization implementation has not started.
- Entitlement implementation has not started.
- Lemon remains paused and not approved for production launch.
- Web provider replacement remains secondary to mobile entitlement readiness.
- Paid checkout remains disabled by default unless explicitly enabled and provider-approved.
