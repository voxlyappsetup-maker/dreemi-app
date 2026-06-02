# Privacy and Data Safety Inventory

## 1. Purpose

- Create a technical/product inventory of data categories and data flows before mobile submission.
- Support future Apple App Privacy and Google Play Data Safety preparation.
- Preserve the parent-first product model.
- Identify privacy-sensitive flows before mobile implementation.
- This document is planning and inventory only.
- It does not implement code, schema, migrations, policies, provider changes, or deployment.

## 2. Current Project Position

- Dreemi/Qisas is parent-first and mobile-first.
- Parent account owns children, generated stories, exports, data export, account deletion, subscription state, and future reports.
- Children are story subjects/readers, not account owners or buyers.
- Stories are private by default in intended mobile v1.
- Public/community story features remain out of mobile v1.
- Export/PDF is parent-controlled and privacy-sensitive.
- AI safety and unsafe story reporting readiness are P0 mobile launch requirements.

## 3. Inventory Scope

This inventory covers:

- account data
- authentication data
- child profile data
- story prompt/input data
- generated story content
- story metadata
- PDF/export data
- image generation data
- AI provider data flow
- safety moderation data
- future unsafe story report data
- subscription/payment data
- account deletion data
- data export data
- operational logs
- support/contact data if added later
- analytics data if added later

## 4. Data Category Inventory

| Category | Examples | Current Source | Current Storage/Processor | Parent/Child Sensitivity | Mobile Disclosure Review Needed | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| parent account identity | name, email, language, avatar URL | parent signup/profile updates | API + PostgreSQL via Prisma | Parent PII | Yes | App Privacy/Data Safety classification needs final pre-submit review. |
| email/login credentials or auth identifiers | password hash, account ID, refresh token subject | auth register/login/refresh | API auth layer + PostgreSQL | Parent authentication-sensitive | Yes | Passwords are hashed; final disclosure depends on implemented auth flows in mobile apps. |
| JWT/session-related data | access token, refresh token, auth header | API auth middleware and frontend storage | client local storage + API token verification | Parent authentication-sensitive | Yes | Token lifecycle and retention behavior must be reviewed before submission. |
| child profile names/ages/preferences if present | child name, age, gender, skin tone, hair color, personality, hobbies, favorite animal | parent-managed child profile forms | API + PostgreSQL | Child-linked sensitive profile data | Yes | Child data is parent-managed but still sensitive and should be minimized. |
| story generation inputs | theme, moral, selected child context, language, duration | parent generation flow | API request handling + AI provider request path | Parent-entered, child-linked context | Yes | Review required for what is sent to AI providers and retained. |
| generated story text | title, content, moral | AI generation output | API + PostgreSQL | Child-linked private content | Yes | Treated as private parent-owned content for mobile v1. |
| generated images | image prompt context, resulting image URL | image generation service | external image provider + stored URL in DB | Child-linked derived content | Yes | Final storage duration and provider handling need explicit review. |
| story metadata | story ID, language, theme, timestamps, favorite flag, child link | API story routes | PostgreSQL | Child-linked metadata | Yes | Metadata can still reveal sensitive family context. |
| PDF/export output | downloadable PDF files and content copies | parent export action | generated on device/browser export flow | Child-linked private content | Yes | Export can leave app control when shared/printed/saved. |
| subscription status and plan | FREE/INDIVIDUAL/FAMILY/SCHOOL, subscription status dates | billing/webhook processing | PostgreSQL | Parent account commercial data | Yes | Mobile disclosures depend on final billing implementation per platform. |
| payment provider customer/subscription identifiers | provider customer ID, subscription ID, price/variant mapping IDs | payment integration/webhook events | PostgreSQL + payment provider APIs | Parent billing-sensitive | Yes | No final disclosure claims in this phase; provider-specific review required later. |
| future Apple purchase evidence | transaction evidence, server notification payload references | future iOS billing flow | future Apple adapter + backend | Parent billing-sensitive | Yes | Planning item only; policy interpretation required before final answers. |
| future Google purchase token evidence | purchase token evidence, RTDN-related references | future Android billing flow | future Google adapter + backend | Parent billing-sensitive | Yes | Planning item only; token retention/minimization needs explicit design. |
| future unsafe story reports | story ID, category, parent description, report status | future parent report flow | future report records in backend/admin paths | Child-linked sensitive report context | Yes | Must be included in privacy/data safety review before submission. |
| future safety review metadata | moderation state, reviewer decision, timestamps | future review workflow | future backend/admin tooling | Child-linked safety context | Yes | Access controls and retention must be defined later. |
| account deletion records | deletion request confirmation and deletion operation metadata | parent account deletion flow | API + backend logs/records | Parent and child-linked account lifecycle data | Yes | Retention exceptions require policy/legal review outside this phase. |
| data export records | export request events and exported package contents | parent data export flow | API export generation + client download | Parent and child-linked content | Yes | Export scope for future report records must be defined. |
| logs/errors | API errors, operational events, service logs | backend runtime and services | server logs/monitoring surfaces | Mixed sensitivity, can include account-linked context | Yes | Logging redaction and secret hygiene require production review. |
| support/contact messages if future feature exists | support tickets, contact form messages | future support flow | future support processor tooling | Parent and possible child-linked context | Yes | Feature not implemented yet; disclosure review required if introduced. |
| analytics if future feature exists | events, session metadata, product usage metrics | future analytics SDK/events | future analytics provider(s) | Potential parent and child-linked telemetry | Yes | Do not add analytics without explicit phase and inventory update. |

## 5. Parent and Child Data Boundary

- Parent account is the account owner.
- Child data is still sensitive because stories and profiles may contain child-linked details.
- Children should not be buyers or account owners.
- Parent controls child profiles, stories, export, data export, deletion, and reporting.
- Future mobile UX should avoid collecting data directly from children.
- Any child-facing surface must be reviewed for privacy and parental gate requirements.

## 6. AI Provider Data Flow

- Story generation may send prompt/story context to an AI text provider.
- Image generation may send image prompt/context to an image provider.
- AI provider usage should be server-controlled.
- Provider requests must not include unnecessary child-sensitive data.
- Provider errors should not expose internal details to parents.
- Future privacy inventory must identify what data each AI provider receives, stores, and returns.
- Provider changes must update this inventory and privacy disclosures.

## 7. Story and Export/PDF Data Flow

- Generated stories are private parent-owned content in mobile v1.
- Export/PDF can contain child-linked story content.
- Export is parent-controlled.
- Export can leave the app ecosystem when shared, printed, or saved by the parent.
- Export copy should encourage thoughtful sharing.
- Export safety gating must be designed before mobile release.
- Exported content should be included in privacy and safety review.

## 8. Payment and Subscription Data Flow

- Lemon remains paused and not approved for production launch.
- Paid checkout remains disabled by default unless explicitly enabled and provider-approved.
- Current backend may store plan/subscription-related identifiers.
- Future Apple IAP data flow may include transaction evidence and server notification data.
- Future Google Play Billing data flow may include purchase tokens and RTDN-related data.
- Payment tokens, provider secrets, signed payloads, and purchase tokens should not be logged.
- Web provider decisions must fit the entitlement model and this privacy inventory.

## 9. Future Unsafe Story Reporting Data Flow

- Unsafe story reports may include story IDs, report category, optional parent description, safety metadata, and review status.
- Reports may contain child-linked story context.
- Reporting data must be minimized and access-controlled in future implementation.
- Report records should be included in future data export and deletion design unless retention obligations require otherwise.
- Admin/reviewer access should avoid secrets and unnecessary sensitive data.

## 10. Account Deletion and Data Export

- Account deletion exists and must remain parent-facing.
- Data export exists and must remain parent-facing.
- Future data export should account for:
  - parent account data
  - child profiles
  - stories
  - exports or export metadata
  - subscription state where appropriate
  - future report records where appropriate
- Future account deletion should account for:
  - user account
  - child profiles
  - stories
  - generated assets
  - subscription records where policy/accounting requires special handling
  - future report records
- Retention exceptions, if any, must be disclosed in future policy/legal review.

## 11. Logs and Operational Data

- Normal logs should not include secrets.
- Normal logs should not include full private story content unless explicitly required for a controlled debug workflow.
- Logs should not include JWTs, API keys, provider secrets, purchase tokens, signed payloads, or raw payment payloads.
- Error messages shown to parents should be safe and non-technical.
- Future production logging should be reviewed before mobile release.

## 12. App Store and Google Play Disclosure Readiness

- Apple App Privacy and Google Play Data Safety answers are not finalized in this phase.
- This inventory is a preparation artifact.
- Before submission, the team must review actual implemented data flows, SDKs, permissions, providers, and retention behavior.
- Third-party services and SDKs must be included in disclosures where required.
- Privacy policy and terms must be checked against implemented behavior.
- Any change to AI provider, payment provider, analytics, crash reporting, or storage requires inventory update.

## 13. Mobile v1 Privacy Guardrails

- Keep stories private by default.
- Keep public/community features out of mobile v1.
- Avoid child-facing account/payment/reporting complexity.
- Keep parent in control of child profiles, stories, reports, exports, data export, and deletion.
- Do not introduce analytics or tracking SDKs without explicit review.
- Do not introduce ads in mobile v1 without a separate privacy and store readiness phase.
- Keep paid checkout and entitlement fail-closed.

## 14. Open Questions

- Which final AI providers will be used in production?
- Will generated images be stored long term or regenerated?
- What exact story/report data should be included in data export?
- What report records must be retained after account deletion?
- Will analytics or crash reporting be added?
- Will mobile apps use native SDKs that require additional privacy manifests/disclosures?
- How will Apple/Google purchase evidence be retained and minimized?
- What support/contact workflow will exist for mobile users?

## 15. P0 Blockers Before Mobile Submission

- Final implemented data-flow review completed.
- Apple App Privacy draft completed.
- Google Play Data Safety draft completed.
- Privacy policy aligned with implemented behavior.
- Account deletion reviewed against implemented data model.
- Data export reviewed against implemented data model.
- AI provider data handling documented.
- Payment provider/mobile billing data handling documented.
- Unsafe story reporting data handling documented.
- Production logging reviewed for secrets and sensitive data.
- Public/community features confirmed deferred for mobile v1.
- Any analytics/crash SDKs inventoried before inclusion.

## 16. Implementation Non-Goals

- No code changes in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No privacy policy rewrite in this phase.
- No App Store privacy answers finalized in this phase.
- No Google Play Data Safety answers finalized in this phase.
- No provider changes in this phase.
- No analytics or SDK additions in this phase.
- No deployment in this phase.

## 17. Recommended Follow-On Phases

- Phase 4-D1I - iOS App Store product and subscription mapping design
- Phase 4-D1J - Android Play Console product and subscription mapping design
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D2-S - unsafe story reporting implementation plan
- Phase 4-D2-U - privacy/data export/account deletion implementation review
- Phase 4-D2-V - production logging and secrets hygiene review

## 18. Current Status

- This inventory is documentation-only.
- Privacy/Data Safety answers are not finalized.
- Mobile submission has not started.
- No new providers or SDKs were added.
- Mobile release remains blocked until privacy and data safety readiness is accepted.
