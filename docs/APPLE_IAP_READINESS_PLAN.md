# Apple IAP Readiness Plan

## 1. Purpose

- Define the future iOS monetization readiness plan before implementation.
- Ensure Apple IAP maps into the provider-neutral entitlement model.
- Keep the product parent-first and avoid child-facing checkout.
- Cross-reference mobile AI safety/reporting readiness:
  - `docs/AI_SAFETY_MOBILE_READINESS_PLAN.md`
- Cross-reference privacy/data safety inventory:
  - `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`
- This document is planning only.
- It does not implement StoreKit, Apple server APIs, notifications, schema, migrations, code, packages, or deployment.

## 2. Current Project Position

- Dreemi/Qisas is parent-first and mobile-first.
- Parent account owns subscription, children, stories, exports, account deletion, data export, and cancellation.
- Children are story subjects/readers, not buyers.
- Lemon remains paused and not approved for production launch.
- Paid checkout is disabled by default unless explicitly enabled and provider-approved.
- Entitlement design lock exists and must guide Apple IAP work.

## 3. iOS Monetization Direction

- Future iOS paid launch should use Apple IAP / StoreKit for native in-app digital subscriptions.
- Web checkout should not be the default iOS native purchase path.
- Apple IAP should be treated as an `EntitlementSource`, not as the canonical entitlement model.
- Backend access checks should continue to consume effective entitlement state.
- iOS paid launch readiness includes safety/reporting readiness, not only StoreKit planning.

## 4. Proposed Apple Product Model

Conceptual only:

- Use auto-renewable subscriptions as the initial iOS monetization model.
- Do not add consumable story credits in the first Apple IAP readiness plan.
- Do not add non-consumable products in the first Apple IAP readiness plan.
- Map App Store product IDs to normalized `EntitlementPlan` values:
  - `INDIVIDUAL`
  - `FAMILY`
  - `SCHOOL` only if later approved as suitable for App Store distribution
- `FREE` remains the default state and is not an Apple product.

Sample placeholder naming only, not final IDs:

- `com.dreemi.app.subscription.individual.monthly`
- `com.dreemi.app.subscription.individual.yearly`
- `com.dreemi.app.subscription.family.monthly`
- `com.dreemi.app.subscription.family.yearly`

Clarifications:

- These are placeholders only.
- Final bundle ID and App Store product IDs must be decided in a later mobile identity/App Store Connect phase.

## 5. Entitlement Mapping

- Apple product IDs must map to `EntitlementPlan`.
- Apple subscription state must map to normalized `EntitlementStatus`.
- Apple subscription lifecycle events must map to normalized `EntitlementEvent`.
- `User.plan` may remain an effective plan projection.
- Apple-specific state should not be scattered across application access checks.

Suggested mapping concepts:

- active subscription -> active entitlement
- trial offer -> trialing entitlement if offered later
- grace/billing retry -> `grace_period` or `past_due` depending on final Apple event semantics
- cancellation at period end -> entitlement remains active until expiry unless Apple state indicates otherwise
- expiration -> `FREE` unless another active entitlement exists
- refund/revocation -> remove paid entitlement unless another active entitlement exists

## 6. Apple Provider Adapter Responsibilities

Future Apple adapter should handle:

- StoreKit transaction evidence received from iOS client.
- Server-side validation where appropriate.
- App Store Server API integration planning.
- App Store Server Notifications planning.
- Idempotency.
- Mapping Apple events into normalized entitlement events.
- Expiration, renewal, cancellation, refund, revocation, grace period, and billing retry states.
- Recompute effective entitlement safely.
- Avoid logging secrets, signed payloads, or sensitive user data.

## 7. Restore Purchases

- iOS must support restore purchases before paid launch.
- Restore should not blindly grant entitlement from client state alone.
- Restore should verify Apple purchase state through the backend where appropriate.
- Restored purchases should map to the same entitlement model.
- Restore result should be parent/account-facing.

## 8. Parent-First iOS Paywall Rules

- Paywall must be adult-facing.
- No child-facing checkout.
- Pricing and subscription management should live in parent/account area.
- Story/child reading surfaces should not show purchase prompts.
- If any child-facing surface can reach account/payment controls, future parental gate requirements must be defined.
- Paywall copy should describe parent value:
  - safe personalized stories
  - family profiles
  - exports/PDF
  - story library
  - trusted account controls

## 9. Account, Cancellation, and Data Controls

- Account deletion exists and must remain available in iOS.
- Data export exists and should remain parent-facing.
- Subscription management/cancellation behavior must be designed for Apple subscriptions.
- App should provide clear account/subscription status without implying external web checkout is the iOS purchase path.
- Future implementation should link to Apple subscription management only if policy and UX review allow.

## 10. Export/PDF and iOS

- Export/PDF remains a parent-controlled value.
- Export should not be child-targeted acquisition.
- Exported stories can include child-related details, so privacy/safety guidance is needed before broad iOS launch.
- Export may support family sharing/referral, but must be parent-controlled.

## 11. Privacy, Child-Safety, and Store Readiness Dependencies

- App Privacy details must be prepared before App Store submission.
- Data collected by app, backend, AI providers, storage, analytics, and payment providers must be inventoried later.
- If the app is positioned for kids or family use, age-appropriate design and parental boundaries must be reviewed.
- Future iOS release needs unsafe generated story reporting and AI safety readiness.
- Future iOS release also requires App Privacy inventory readiness, not only StoreKit planning.
- Public/community story features should stay out of mobile v1 unless moderation/reporting is designed.

## 12. Apple IAP Testing Readiness

Future testing needs:

- App Store Connect product setup.
- Sandbox users/test accounts.
- StoreKit local testing plan if adopted later.
- Backend entitlement test cases.
- Restore purchase test cases.
- Renewal/cancellation/expiration/refund/revocation simulation where possible.
- Regression tests ensuring Apple adapter cannot grant paid access without verified evidence.

## 13. P0 Blockers Before iOS Paid Launch

- Apple IAP product decision accepted.
- Bundle ID and App Store Connect setup plan accepted.
- Apple product ID to `EntitlementPlan` mapping accepted.
- Apple server-side validation plan accepted.
- App Store Server Notifications plan accepted.
- Restore purchase flow designed.
- Parent-facing paywall design accepted.
- No child-facing checkout confirmed.
- Entitlement audit/history plan accepted.
- Privacy/App Privacy inventory completed.
- Unsafe generated story reporting path designed.
- Subscription management/cancellation UX designed.
- Paid access remains fail-closed until verified.

## 14. Implementation Non-Goals

- No StoreKit implementation in this phase.
- No App Store Server API implementation in this phase.
- No App Store Server Notifications implementation in this phase.
- No Apple product IDs finalized in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No package changes in this phase.
- No runtime code changes in this phase.
- No deploy in this phase.

## 15. Recommended Follow-On Phases

- Phase 4-D1F - Google Play Billing readiness plan
- Phase 4-D1G - unsafe story reporting and AI safety mobile readiness plan
- Phase 4-D1H - privacy and data safety inventory
- Phase 4-D1I - iOS App Store product and subscription mapping design
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D3 - Apple IAP implementation phases

## 16. Current Status

- This plan is documentation-only.
- Apple IAP implementation has not started.
- Entitlement implementation has not started.
- Lemon remains paused and not approved for production launch.
- Web provider replacement remains secondary to mobile entitlement readiness.
