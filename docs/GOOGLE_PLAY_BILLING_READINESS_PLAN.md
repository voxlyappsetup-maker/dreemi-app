# Google Play Billing Readiness Plan

## 1. Purpose

- Define the future Android monetization readiness plan before implementation.
- Ensure Google Play Billing maps into the provider-neutral entitlement model.
- Keep the product parent-first and avoid child-facing checkout.
- This document is planning only.
- It does not implement Google Play Billing Library, Google Play Developer API, Real-time Developer Notifications, schema, migrations, code, packages, or deployment.

## 2. Current Project Position

- Dreemi/Qisas is parent-first and mobile-first.
- Parent account owns subscription, children, stories, exports, account deletion, data export, and cancellation.
- Children are story subjects/readers, not buyers.
- Lemon remains paused and not approved for production launch.
- Paid checkout is disabled by default unless explicitly enabled and provider-approved.
- Entitlement design lock exists and must guide Google Play Billing work.
- Apple IAP readiness plan exists for iOS as a separate platform track.

## 3. Android Monetization Direction

- Future Android paid launch should use Google Play Billing for native in-app digital subscriptions.
- Web checkout should not be the default Android native purchase path.
- Google Play Billing should be treated as an `EntitlementSource`, not as the canonical entitlement model.
- Backend access checks should continue to consume effective entitlement state.
- Any alternative billing or external payment option must be evaluated separately against current Google Play policy before implementation.

## 4. Proposed Google Play Product Model

Conceptual only:

- Use subscriptions as the initial Android monetization model.
- Do not add consumable story credits in the first Google Play Billing readiness plan.
- Do not add one-time in-app products in the first readiness plan.
- Map Google Play product IDs/base plans to normalized `EntitlementPlan` values:
  - `INDIVIDUAL`
  - `FAMILY`
  - `SCHOOL` only if later approved as suitable for Google Play distribution
- `FREE` remains the default state and is not a paid Google Play product.

Sample placeholder naming only, not final IDs:

- `dreemi_subscription_individual`
- `dreemi_subscription_family`
- `dreemi_subscription_school_if_approved`

Sample base plan placeholders:

- `monthly`
- `yearly`

Clarifications:

- These are placeholders only.
- Final Android application ID, Play Console product IDs, base plans, and offers must be decided in a later Android identity/Play Console phase.

## 5. Entitlement Mapping

- Google Play product IDs and base plans must map to `EntitlementPlan`.
- Google subscription state must map to normalized `EntitlementStatus`.
- Google subscription lifecycle events must map to normalized `EntitlementEvent`.
- `User.plan` may remain an effective plan projection.
- Google-specific state should not be scattered across application access checks.

Suggested mapping concepts:

- active subscription -> active entitlement
- free trial or introductory offer -> trialing entitlement if offered later
- grace period -> `grace_period` entitlement
- account hold or billing issue -> `past_due` or equivalent normalized state after final policy/API review
- user cancellation at period end -> entitlement remains active until expiry unless Google state indicates otherwise
- expiration -> `FREE` unless another active entitlement exists
- refund/revocation -> remove paid entitlement unless another active entitlement exists

## 6. Google Play Provider Adapter Responsibilities

Future Google Play adapter should handle:

- Purchase token evidence received from Android client.
- Server-side purchase token validation where appropriate.
- Google Play Developer API integration planning.
- Real-time Developer Notifications planning.
- Idempotency.
- Mapping Google events into normalized entitlement events.
- Expiration, renewal, cancellation, refund, revocation, grace period, account hold, and billing retry states.
- Recompute effective entitlement safely.
- Avoid logging secrets, signed payloads, tokens, or sensitive user data.

## 7. Restore and Recover Purchases

- Android must support restore/recover purchase behavior before paid launch.
- Restore should not blindly grant entitlement from client state alone.
- Restore should verify Google Play purchase token state through the backend where appropriate.
- Restored purchases should map to the same entitlement model.
- Restore result should be parent/account-facing.
- Users should not need a separate account per platform.

## 8. Parent-First Android Paywall Rules

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

- Account deletion exists and must remain available in Android.
- Data export exists and should remain parent-facing.
- Subscription management/cancellation behavior must be designed for Google Play subscriptions.
- App should provide clear account/subscription status without implying external web checkout is the Android purchase path.
- Future implementation should link to Google Play subscription management only if policy and UX review allow.

## 10. Export/PDF and Android

- Export/PDF remains a parent-controlled value.
- Export should not be child-targeted acquisition.
- Exported stories can include child-related details, so privacy/safety guidance is needed before broad Android launch.
- Export may support family sharing/referral, but must be parent-controlled.

## 11. Privacy, Child-Safety, and Google Play Readiness Dependencies

- Google Play Data Safety details must be prepared before Play submission.
- Data collected by app, backend, AI providers, storage, analytics, and payment providers must be inventoried later.
- If the app is positioned for kids or family use, age-appropriate design and parental boundaries must be reviewed.
- Future Android release needs unsafe generated story reporting and AI safety readiness.
- Public/community story features should stay out of mobile v1 unless moderation/reporting is designed.

## 12. Google Play Billing Testing Readiness

Future testing needs:

- Play Console app setup.
- License testers/test accounts.
- Internal testing track.
- Product ID/base plan/offer setup.
- Backend entitlement test cases.
- Restore/recover purchase test cases.
- Renewal/cancellation/expiration/refund/revocation simulation where possible.
- Real-time Developer Notifications test plan.
- Regression tests ensuring Google adapter cannot grant paid access without verified evidence.

## 13. P0 Blockers Before Android Paid Launch

- Google Play Billing product decision accepted.
- Android application ID and Play Console setup plan accepted.
- Google product ID/base plan to `EntitlementPlan` mapping accepted.
- Google server-side purchase validation plan accepted.
- Real-time Developer Notifications plan accepted.
- Restore/recover purchase flow designed.
- Parent-facing paywall design accepted.
- No child-facing checkout confirmed.
- Entitlement audit/history plan accepted.
- Privacy/Data Safety inventory completed.
- Unsafe generated story reporting path designed.
- Subscription management/cancellation UX designed.
- Paid access remains fail-closed until verified.

## 14. Implementation Non-Goals

- No Google Play Billing Library implementation in this phase.
- No Google Play Developer API implementation in this phase.
- No Real-time Developer Notifications implementation in this phase.
- No Google product IDs finalized in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No package changes in this phase.
- No runtime code changes in this phase.
- No deploy in this phase.

## 15. Recommended Follow-On Phases

- Phase 4-D1G - unsafe story reporting and AI safety mobile readiness plan
- Phase 4-D1H - privacy and data safety inventory
- Phase 4-D1J - Android Play Console product and subscription mapping design
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D3 - mobile billing implementation phases

## 16. Current Status

- This plan is documentation-only.
- Google Play Billing implementation has not started.
- Entitlement implementation has not started.
- Lemon remains paused and not approved for production launch.
- Web provider replacement remains secondary to mobile entitlement readiness.
