# iOS App Store Product and Subscription Mapping Design

## 1. Purpose

- Define the future iOS App Store product/subscription mapping before implementation.
- Translate the Apple IAP readiness plan into a concrete product mapping design.
- Ensure Apple product IDs map into the provider-neutral entitlement model.
- Keep all monetization parent-facing.
- Cross-reference entitlement implementation planning:
  - `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`
- This document is planning only.
- It does not implement StoreKit, App Store Server API, App Store Server Notifications, schema, migrations, runtime code, package changes, env changes, or deployment.

## 2. Current Project Position

- Dreemi/Qisas is parent-first and mobile-first.
- iOS paid launch planning starts with Apple IAP / StoreKit.
- Apple IAP integration has not started.
- Bundle ID and App Store Connect product IDs are not finalized in this phase.
- Lemon remains paused and not approved for production launch.
- Paid checkout remains fail-closed unless provider-approved and explicitly enabled.
- Entitlement, safety, and privacy readiness docs must guide this design.

## 3. Subscription Group Strategy

- Use one initial App Store subscription group for Dreemi/Qisas paid access.
- Working group reference name: Dreemi Premium.
- This is a placeholder only.
- Final subscription group name must be confirmed in App Store Connect later.
- A single group is preferred initially so parent users can hold one active Dreemi subscription at a time.
- Multiple groups should not be introduced unless a later product strategy requires independent subscription families.
- The group should support upgrade/downgrade movement between monthly/yearly and plan tiers if Apple review and product strategy allow.

Note:

- Apple subscription group behavior must be reviewed again before App Store submission.
- Group levels and subscription ordering must be finalized in App Store Connect later.

## 4. Proposed iOS Product Matrix

| Internal Plan | Billing Period | Placeholder Apple Product ID | EntitlementPlan | Initial Availability | Notes |
| --- | --- | --- | --- | --- | --- |
| Individual | Monthly | com.dreemi.app.subscription.individual.monthly | INDIVIDUAL | candidate | parent-owned single-child value |
| Individual | Yearly | com.dreemi.app.subscription.individual.yearly | INDIVIDUAL | candidate | annual option |
| Family | Monthly | com.dreemi.app.subscription.family.monthly | FAMILY | candidate | parent-owned family value |
| Family | Yearly | com.dreemi.app.subscription.family.yearly | FAMILY | candidate | annual family option |
| School | Monthly | com.dreemi.app.subscription.school.monthly | SCHOOL | deferred | only if App Store distribution and school positioning are approved later |
| School | Yearly | com.dreemi.app.subscription.school.yearly | SCHOOL | deferred | only if App Store distribution and school positioning are approved later |

Clarifications:

- These IDs are placeholders only.
- They are not final App Store Connect product IDs.
- Final product IDs must match final bundle/app identity and App Store Connect decisions.
- FREE is not an Apple product.
- FREE remains default entitlement state.

## 5. Plan Tier Positioning

- INDIVIDUAL is the simplest parent plan.
- FAMILY is the expected primary mobile subscription candidate because the product supports parent-owned child profiles and story library value.
- SCHOOL is not a default iOS v1 candidate until school distribution, support, compliance, and App Store suitability are separately approved.
- Family plan naming inside Dreemi does not automatically mean Apple Family Sharing is enabled.
- Apple Family Sharing, if considered later, must be reviewed separately.

## 6. EntitlementPlan Mapping

| Apple Product ID Pattern | EntitlementPlan | Effective User.plan Projection | Notes |
| --- | --- | --- | --- |
| individual.* | INDIVIDUAL | INDIVIDUAL | individual tier products map to individual paid access |
| family.* | FAMILY | FAMILY | family tier products map to family paid access |
| school.* | SCHOOL | SCHOOL only if later approved | school tier is deferred until separate approval |
| unknown product ID | no grant | fail closed | unknown IDs do not grant access |
| expired/no active Apple entitlement | FREE | FREE unless another active entitlement exists | recompute from all active sources |

State:

- Apple-specific product IDs must never be used directly in access checks.
- Access checks must use normalized effective entitlement.
- Unknown Apple product IDs must fail closed.

## 7. Subscription Status Mapping

| Apple State/Event Concept | Normalized EntitlementStatus | Access Behavior | Notes |
| --- | --- | --- | --- |
| active paid subscription | active | paid access | standard active entitlement path |
| trial period if offered later | trialing | paid access while valid | applies only if trial is configured later |
| billing retry / grace period | grace_period or past_due | policy-defined paid access after final review | final behavior requires Apple semantics review |
| user canceled but not expired | active_until_expiry | paid access until expiry | cancel intent does not remove access immediately |
| expired | expired | no paid access unless another active entitlement exists | return to FREE if no other valid source |
| refunded/revoked | revoked | no paid access unless another active entitlement exists | remove Apple paid access |
| unknown/unverified | none | no paid access | fail closed on uncertain verification |

Clarifications:

- Final mapping must be checked against actual Apple API/notification semantics before implementation.
- Paid access should remain fail-closed when verification is uncertain.

## 8. Apple Event Mapping

| Apple Lifecycle Event | Normalized EntitlementEvent | Required Backend Effect | Notes |
| --- | --- | --- | --- |
| purchase | entitlement_started | create/update Apple source entitlement | initial start event |
| renewal | entitlement_renewed | extend entitlement period | continuation of paid access |
| cancellation intent | entitlement_cancel_scheduled | keep active until expiry if still valid | no immediate revoke by default |
| expiration | entitlement_expired | recompute effective entitlement | remove access unless another source is valid |
| refund | entitlement_revoked | remove Apple paid access | refund removes Apple source entitlement |
| revocation | entitlement_revoked | remove Apple paid access | same normalized revoke handling |
| grace period start | entitlement_grace_period_started | apply final policy | temporary state pending final mapping policy |
| billing retry | entitlement_billing_issue | apply final policy | billing recovery logic remains policy-defined |
| restore | entitlement_restored | verify and recompute entitlement | restoration must be verified before grant |
| unknown notification | entitlement_event_unknown | log safely and do not grant access | fail closed for unknown events |

Clarifications:

- Event names are planning labels only.
- No schema or enum changes happen in this phase.

## 9. Restore Purchases Design

- iOS must include a parent/account-facing Restore Purchases control before paid launch.
- Restore Purchases should not be automatic on app launch.
- Restore must not blindly grant entitlement from client state alone.
- Future backend should verify Apple transaction evidence where appropriate.
- Restore result should be calm and clear.
- Restore should map to the same normalized entitlement model.
- Restore should be tested for same device, new device, reinstall, and account mismatch scenarios.

## 10. Parent-Facing Paywall Mapping

- Paywall is parent-facing only.
- No child-facing checkout.
- Paywall should be reachable from account/pricing/subscription surfaces, not from child reading flow.
- Story library and export value should be described as parent benefits.
- Safety/privacy controls should be visible enough to build trust.
- Purchase calls should be isolated behind the future iOS billing adapter.
- The app should not imply web checkout is the native iOS purchase path.

## 11. App Store Connect Setup Checklist

Future setup tasks:

- Confirm final iOS app name and bundle ID.
- Create App Store Connect app record.
- Configure subscription group.
- Create subscription products.
- Add localizations.
- Add pricing.
- Add App Review screenshots for IAP if required.
- Configure sandbox testers.
- Configure App Store Server Notifications sandbox and production URLs later.
- Prepare privacy details.
- Prepare review notes explaining parent-first AI story product.
- Confirm paid access remains disabled until verified.

## 12. Backend Integration Design Boundary

- Future backend adapter should accept verified Apple transaction evidence or trusted Apple server notifications.
- Future backend should map Apple product IDs to EntitlementPlan.
- Future backend should record provider-specific evidence safely.
- Future backend should recompute effective entitlement.
- Future backend should support idempotency.
- Future backend should not log signed payloads, shared secrets, API keys, JWTs, or private story content.
- Apple product mapping must be implemented through the future provider-neutral entitlement service, not through provider-specific access checks.
- This phase does not design final database schema.

## 13. Cross-Platform Entitlement Behavior

- A parent account may eventually have entitlement from Apple, Google, web provider, manual/internal, or future provider.
- The effective entitlement should be computed consistently.
- One active valid paid entitlement should grant access according to normalized plan rules.
- Platform-specific source should not fragment account access checks.
- Future conflict resolution rules are needed for overlapping Apple/Google/web subscriptions.
- Do not implement conflict resolution in this phase.

## 14. Safety and Privacy Dependencies

- iOS paid launch readiness includes safety/reporting readiness.
- iOS paid launch readiness includes privacy/App Privacy inventory.
- StoreKit readiness alone is not enough.
- Unsafe story reporting, AI safety checks, data export, account deletion, and logging hygiene must be reviewed before submission.
- Public/community story features remain out of mobile v1.

## 15. P0 Blockers Before iOS IAP Implementation

- Final iOS app identity and bundle ID accepted.
- Final App Store product IDs accepted.
- Subscription group strategy accepted.
- Apple product ID to EntitlementPlan mapping accepted.
- Apple status/event mapping accepted.
- Restore Purchases design accepted.
- Parent-facing paywall design accepted.
- Apple server validation strategy accepted.
- App Store Server Notifications strategy accepted.
- Privacy/App Privacy inventory accepted.
- AI safety/reporting readiness accepted.
- No child-facing checkout confirmed.
- Paid access remains fail-closed until verified.

## 16. Implementation Non-Goals

- No StoreKit implementation in this phase.
- No App Store Server API implementation in this phase.
- No App Store Server Notifications implementation in this phase.
- No Apple product IDs finalized in this phase.
- No subscription group created in this phase.
- No App Store Connect setup performed in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No package changes in this phase.
- No runtime code changes in this phase.
- No deployment in this phase.

## 17. Recommended Follow-On Phases

- Phase 4-D1J - Android Play Console product and subscription mapping design
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D2-IOS - Apple entitlement adapter implementation plan
- Phase 4-D2-S - unsafe story reporting implementation plan
- Phase 4-D2-U - privacy/data export/account deletion implementation review
- Phase 4-D3-IOS - StoreKit implementation phase planning

## 18. Current Status

- This design is documentation-only.
- Apple product IDs are placeholders only.
- Apple IAP implementation has not started.
- App Store Connect setup has not started.
- Entitlement implementation has not started.
- iOS paid launch remains blocked until mapping, safety, privacy, and App Store readiness are accepted.
