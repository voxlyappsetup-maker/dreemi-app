# Android Play Console Product and Subscription Mapping Design

## 1. Purpose

- Define the future Android Play Console product/subscription mapping before implementation.
- Translate the Google Play Billing readiness plan into a concrete product mapping design.
- Ensure Google Play product IDs and base plans map into the provider-neutral entitlement model.
- Keep all monetization parent-facing.
- This document is planning only.
- It does not implement Google Play Billing Library, Google Play Developer API, Real-time Developer Notifications, schema, migrations, runtime code, package changes, env changes, Android project changes, or deployment.

## 2. Current Project Position

- Dreemi/Qisas is parent-first and mobile-first.
- Android paid launch planning starts with Google Play Billing.
- Google Play Billing integration has not started.
- Android application ID and Play Console product IDs are not finalized in this phase.
- Lemon remains paused and not approved for production launch.
- Paid checkout remains fail-closed unless provider-approved and explicitly enabled.
- Entitlement, safety, privacy, and Android readiness docs must guide this design.

## 3. Android Application Identity Assumptions

- Final Android application ID is not finalized in this phase.
- Placeholder application ID reference: `app.dreemi.mobile`.
- This is a placeholder only.
- Final application ID must be selected in a later Android identity/Play Console phase.
- Product IDs should align with final app identity and Play Console decisions.
- Do not update Android package identifiers or app metadata in this phase.

## 4. Google Play Subscription Product Strategy

- Use subscription products as the initial Android monetization model.
- Use one product per plan tier where appropriate, with base plans for billing periods.
- Initial candidate plan tiers:
  - `INDIVIDUAL`
  - `FAMILY`
- `SCHOOL` remains deferred unless school distribution, support, compliance, and Play Console suitability are separately approved.
- `FREE` is not a Google Play product.
- `FREE` remains the default entitlement state.
- Consumable credits are not part of this Android mapping design.
- One-time in-app products are not part of this Android mapping design.

## 5. Proposed Android Product Matrix

| Internal Plan | Placeholder Google Product ID | Base Plan | Offer | EntitlementPlan | Initial Availability | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Individual | dreemi_subscription_individual | monthly | none | INDIVIDUAL | candidate | parent-owned single-child value |
| Individual | dreemi_subscription_individual | yearly | none | INDIVIDUAL | candidate | annual option |
| Family | dreemi_subscription_family | monthly | none | FAMILY | candidate | parent-owned family value |
| Family | dreemi_subscription_family | yearly | none | FAMILY | candidate | annual family option |
| School | dreemi_subscription_school | monthly | none | SCHOOL | deferred | only if Play distribution and school positioning are approved later |
| School | dreemi_subscription_school | yearly | none | SCHOOL | deferred | only if Play distribution and school positioning are approved later |

Clarifications:

- These IDs and base plans are placeholders only.
- They are not final Play Console product IDs.
- Final product IDs, base plans, and offers must be decided in a later Play Console phase.
- Offers such as trials, intro pricing, or promo offers are out of scope unless later approved.

## 6. Base Plan and Offer Strategy

- Monthly and yearly base plans are the initial planning options.
- Yearly plans may support better parent value but need clear cancellation/renewal copy.
- Intro offers or free trials are not enabled by default in this design.
- Any trial or intro offer must be reviewed for:
  - parent-facing clarity
  - entitlement mapping
  - cancellation behavior
  - refund/revocation behavior
  - store policy readiness
- Base plan IDs should be stable and simple:
  - `monthly`
  - `yearly`
- Final base plan IDs must be set in Play Console later.

## 7. Plan Tier Positioning

- `INDIVIDUAL` is the simplest parent plan.
- `FAMILY` is the expected primary Android subscription candidate because the product supports parent-owned child profiles and story library value.
- `SCHOOL` is not a default Android v1 candidate until school distribution, support, compliance, and Play Console suitability are separately approved.
- Family plan naming inside Dreemi does not automatically imply Google family library sharing or any platform family-sharing feature.

## 8. EntitlementPlan Mapping

| Google Product ID Pattern | Base Plan | EntitlementPlan | Effective User.plan Projection | Notes |
| --- | --- | --- | --- | --- |
| dreemi_subscription_individual | monthly or yearly | INDIVIDUAL | INDIVIDUAL | individual tier mapping |
| dreemi_subscription_family | monthly or yearly | FAMILY | FAMILY | family tier mapping |
| dreemi_subscription_school | monthly or yearly | SCHOOL | SCHOOL only if later approved | school tier remains deferred |
| unknown product ID | any | no grant | unchanged or FREE after recompute | fail closed |
| expired/no active Google entitlement | any | FREE unless another active entitlement exists | FREE unless another active entitlement exists | no paid access |

State:

- Google-specific product IDs must never be used directly in access checks.
- Access checks must use normalized effective entitlement.
- Unknown Google product IDs must fail closed.
- Base plans determine billing period metadata, not access logic by themselves.

## 9. Subscription Status Mapping

| Google State/Event Concept | Normalized EntitlementStatus | Access Behavior | Notes |
| --- | --- | --- | --- |
| active subscription | active | paid access | verified active entitlement |
| free trial if offered later | trialing | paid access while valid | applies only if trial is enabled later |
| grace period | grace_period | policy-defined paid access after final review | final behavior requires policy/API review |
| account hold or billing issue | past_due or billing_issue | policy-defined behavior after final review | depends on final entitlement policy |
| user canceled but not expired | active_until_expiry | paid access until expiry | cancel intent does not revoke immediately |
| paused if supported/enabled | paused | no paid access or policy-defined behavior after final review | requires final mapping policy |
| expired | expired | no paid access unless another active entitlement exists | return to FREE if no other source |
| revoked/refunded/voided | revoked | no paid access unless another active entitlement exists | remove Google paid access |
| unknown/unverified | none | no paid access | fail closed |

Clarifications:

- Final mapping must be checked against actual Google Play Billing and Developer API semantics before implementation.
- Paid access should remain fail-closed when verification is uncertain.

## 10. RTDN and Purchase Event Mapping

| Google Lifecycle Source | Normalized EntitlementEvent | Required Backend Effect | Notes |
| --- | --- | --- | --- |
| client purchase evidence | entitlement_purchase_pending_verification | verify token before grant | no paid grant before verification |
| verified purchase | entitlement_started | create/update Google source entitlement | start entitlement after verification |
| renewal notification | entitlement_renewed | extend entitlement period | standard renewal handling |
| cancellation notification | entitlement_cancel_scheduled | keep active until expiry if still valid | do not revoke immediately by default |
| expiration notification | entitlement_expired | recompute effective entitlement | remove access unless another source exists |
| refund/voided/revocation event | entitlement_revoked | remove Google paid access | normalized revoke handling |
| grace period notification | entitlement_grace_period_started | apply final policy | temporary billing-recovery state |
| account hold/billing issue | entitlement_billing_issue | apply final policy | policy-defined paid access behavior |
| recover/restore query | entitlement_restored | verify and recompute entitlement | restore requires verification |
| unknown RTDN | entitlement_event_unknown | log safely and do not grant access | fail closed |

Clarifications:

- Event names are planning labels only.
- No schema or enum changes happen in this phase.
- RTDN should not grant access without verification and idempotent processing.

## 11. Purchase Token Verification Design

- Android client may receive purchase token evidence from Google Play Billing.
- Client token evidence must not be treated as final proof by itself.
- Future backend should verify purchase tokens through a server-side strategy where appropriate.
- Verification must map product ID and base plan into EntitlementPlan.
- Verification must be idempotent.
- Tokens, signed payloads, API credentials, JWTs, and private story content must not be logged.
- Failed or uncertain verification must not grant paid access.
- This phase does not implement Google Play Developer API.

## 12. Restore and Recover Purchases Design

- Android must include a parent/account-facing recover/restore purchase control before paid launch.
- Restore should not blindly grant entitlement from client state alone.
- Restore should verify purchase state through backend where appropriate.
- Restore should map to the same normalized entitlement model.
- Restore result should be calm and clear.
- Restore should be tested for same device, new device, reinstall, and account mismatch scenarios.
- Users should not need a separate Dreemi account per platform.

## 13. Parent-Facing Android Paywall Mapping

- Paywall is parent-facing only.
- No child-facing checkout.
- Paywall should be reachable from account/pricing/subscription surfaces, not from child reading flow.
- Story library and export value should be described as parent benefits.
- Safety/privacy controls should be visible enough to build trust.
- Purchase calls should be isolated behind the future Android billing adapter.
- The app should not imply web checkout is the native Android purchase path.

## 14. Play Console Setup Checklist

Future setup tasks:

- Confirm final Android app name and application ID.
- Create or confirm Play Console app record.
- Configure subscription products.
- Configure base plans.
- Configure offers only if approved.
- Add localizations.
- Add pricing.
- Configure license testers.
- Configure internal testing track.
- Configure Google Play Developer API access later.
- Configure Real-time Developer Notifications later.
- Prepare Google Play Data Safety details.
- Prepare review notes explaining parent-first AI story product.
- Confirm paid access remains disabled until verified.

## 15. Backend Integration Design Boundary

- Future backend adapter should accept purchase token evidence and trusted Google server notifications.
- Future backend should map Google product IDs/base plans to EntitlementPlan.
- Future backend should record provider-specific evidence safely.
- Future backend should recompute effective entitlement.
- Future backend should support idempotency.
- Future backend should handle RTDN safely.
- Future backend should not log purchase tokens, service account credentials, signed payloads, JWTs, provider secrets, or private story content.
- This phase does not design final database schema.

## 16. Cross-Platform Entitlement Behavior

- A parent account may eventually have entitlement from Apple, Google, web provider, manual/internal, or future provider.
- The effective entitlement should be computed consistently.
- One active valid paid entitlement should grant access according to normalized plan rules.
- Platform-specific source should not fragment account access checks.
- Future conflict resolution rules are needed for overlapping Apple/Google/web subscriptions.
- Do not implement conflict resolution in this phase.

## 17. Safety and Privacy Dependencies

- Android paid launch readiness includes safety/reporting readiness.
- Android paid launch readiness includes Google Play Data Safety inventory.
- Google Play Billing readiness alone is not enough.
- Unsafe story reporting, AI safety checks, data export, account deletion, and logging hygiene must be reviewed before submission.
- Public/community story features remain out of mobile v1.

## 18. P0 Blockers Before Android Billing Implementation

- Final Android app identity and application ID accepted.
- Final Google Play product IDs accepted.
- Base plan and offer strategy accepted.
- Google product ID/base plan to EntitlementPlan mapping accepted.
- Google status/event mapping accepted.
- Purchase token verification strategy accepted.
- RTDN strategy accepted.
- Restore/recover purchases design accepted.
- Parent-facing paywall design accepted.
- Privacy/Data Safety inventory accepted.
- AI safety/reporting readiness accepted.
- No child-facing checkout confirmed.
- Paid access remains fail-closed until verified.

## 19. Implementation Non-Goals

- No Google Play Billing Library implementation in this phase.
- No Google Play Developer API implementation in this phase.
- No Real-time Developer Notifications implementation in this phase.
- No Google product IDs finalized in this phase.
- No base plans or offers created in this phase.
- No Play Console setup performed in this phase.
- No Android application ID changes in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No package changes in this phase.
- No runtime code changes in this phase.
- No deployment in this phase.

## 20. Recommended Follow-On Phases

- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D2-ANDROID - Google entitlement adapter implementation plan
- Phase 4-D2-IOS - Apple entitlement adapter implementation plan
- Phase 4-D2-S - unsafe story reporting implementation plan
- Phase 4-D2-U - privacy/data export/account deletion implementation review
- Phase 4-D3-ANDROID - Google Play Billing implementation phase planning

## 21. Current Status

- This design is documentation-only.
- Google product IDs are placeholders only.
- Google Play Billing implementation has not started.
- Play Console setup has not started.
- RTDN setup has not started.
- Entitlement implementation has not started.
- Android paid launch remains blocked until mapping, safety, privacy, and Play Console readiness are accepted.
