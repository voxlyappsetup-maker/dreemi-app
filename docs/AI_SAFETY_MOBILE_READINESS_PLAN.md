# AI Safety and Unsafe Story Reporting Mobile Readiness Plan

## 1. Purpose

- Define mobile readiness requirements for AI story safety and unsafe generated story reporting.
- Ensure future iOS and Android releases include a parent-facing way to report or flag unsafe generated stories.
- Preserve the parent-first product model.
- Keep mobile v1 safer by avoiding public/community story features until moderation is designed.
- This document is planning only.
- It does not implement runtime code, schema, migrations, AI provider changes, PDF changes, reporting UI, moderation tooling, or deployment.

## 2. Current Project Position

- Dreemi/Qisas generates personalized stories for parents/guardians.
- Children are story subjects/readers, not buyers or account owners.
- Parent account owns children, stories, exports, data export, account deletion, and subscription state.
- Current product direction keeps stories private in mobile v1.
- Export/PDF is parent-controlled.
- Safety and reporting readiness is a P0 mobile launch track.
- Existing safety service/tests should be treated as a foundation, not final mobile readiness.
- No unsafe-story reporting feature is implemented in this phase.

## 3. Mobile Safety Principle

Generated story access and export must fail safe when content safety is uncertain.

- AI generation can produce unsuitable output even with prompt controls.
- Parent trust depends on clear safety controls.
- Unsafe content should be reportable from inside the app.
- Export/PDF should not bypass safety controls.
- Public/community story features should not be enabled until moderation/reporting is implemented.

## 4. Unsafe Story Reporting Direction

Future reporting direction:

- Reporting should be parent-facing.
- Reporting should be available from story detail and story library surfaces.
- Reporting should not require leaving the app.
- Reporting should allow clear categories and optional parent description.
- Reporting should create a backend-visible record in a future implementation.
- Reporting should not expose secrets, AI prompts, provider credentials, or raw sensitive logs.
- Reporting result should show a calm confirmation message.
- Reporting should not delete parent data automatically unless a separate reviewed workflow is designed.

Suggested report categories:

- `unsafe_for_child`
- `sexual_or_adult_content`
- `violence_or_fear`
- `self_harm`
- `hate_or_harassment`
- `drugs_or_weapons`
- `privacy_or_personal_data`
- `prompt_injection_or_model_failure`
- `other`

Clarifications:

- These are planning labels only.
- They do not imply schema changes in this phase.

## 5. AI Safety Review Pipeline

Intended future pipeline:

- Input safety check before generation.
- Generation constraints for child-appropriate tone and content.
- Output safety check before story display.
- Optional regeneration path when output is unsafe.
- Parent-visible safe failure message.
- Safety metadata suitable for internal audit without storing unnecessary child-sensitive data.
- Export/PDF should only be available for stories that passed the required safety state.
- Future tests should cover blocked prompts, unsafe output, reporting, and export gating.

## 6. Parent-Facing Safety UX

- Safety controls should be written for parents/guardians.
- Do not scare or blame the parent.
- Unsafe story reporting should be easy to find.
- Report flow should be short and calm.
- Parent should understand what happened after reporting.
- Child-facing story surfaces should not contain alarming technical safety language.
- If child-facing surfaces exist later, account/safety controls should remain parent-gated.

## 7. Private Story Model for Mobile v1

- Mobile v1 should keep stories private by default.
- No public story gallery in mobile v1.
- No comments in mobile v1.
- No user-to-user messaging in mobile v1.
- No public community feed in mobile v1.
- External sharing/export remains parent-controlled and should be reviewed for privacy/safety copy.
- Any future public/community feature requires separate moderation, reporting, blocking, contact, and policy planning.

## 8. UGC Risk Boundary

- Private generated stories are lower risk than public UGC.
- If stories become visible to other users, UGC rules and moderation obligations increase.
- Future public sharing/community must include:
  - content moderation
  - report flow
  - takedown process
  - block user or equivalent abuse control if users interact
  - support/contact path
  - review response workflow
- Public/community story features are non-goals for mobile v1.

## 9. Export/PDF Safety Rules

- Export/PDF is a core parent value.
- Export should not bypass story safety state.
- Export should be parent-controlled.
- Exported stories may include child-related details.
- Export copy should remind parents to share thoughtfully.
- Future implementation should consider watermark/brand/referral carefully without targeting children.
- Unsafe or flagged stories may need export restrictions or warnings in a future implementation.

## 10. Data, Privacy, and Logging Guardrails

- Reporting data may include child-linked story content and parent descriptions.
- Future implementation should minimize stored sensitive data.
- Do not log API keys, provider payload secrets, JWTs, purchase tokens, or full private data in normal logs.
- Safety audit metadata should be useful but privacy-aware.
- Data export and account deletion must account for future report records.
- Privacy/Data Safety/App Privacy inventory must include reporting and AI safety data flows later.

## 11. AI Provider and Prompt Safety

- AI provider usage should remain server-controlled.
- Prompt injection and unsafe prompt attempts should be handled.
- Model output should not be trusted without safety review.
- Provider errors should not expose internal details to parents.
- Future provider changes must preserve safety checks.
- Safety test coverage should grow before mobile release.

## 12. Admin/Review Readiness

Future internal needs:

- Report records should be visible to trusted operators/admins in a future phase.
- Reviewers should see enough context to evaluate the report.
- Reviewers should not see secrets.
- Review workflow should support states such as:
  - `new`
  - `reviewed`
  - `action_taken`
  - `dismissed`
- Action options may include hide story, mark unsafe, request regeneration, update filters, or contact support.
- Admin tooling is not implemented in this phase.

## 13. App Store / Google Play Readiness Dependencies

- Store readiness requires rechecking current Apple and Google Play policy before submission.
- AI-generated content apps may require in-app reporting/flagging and responsible moderation.
- Parent-first positioning does not remove the need for generated content safety.
- Kids/family positioning may increase privacy and safety scrutiny.
- Mobile submission should not proceed until unsafe story reporting and safety review design are accepted.

## 14. P0 Blockers Before Mobile Release

- Unsafe generated story reporting path designed.
- Output safety check before display designed.
- Export/PDF safety gating designed.
- Parent-facing safety UX accepted.
- Private story model for mobile v1 accepted.
- Public/community story features explicitly deferred.
- Reporting data/privacy handling plan accepted.
- Safety test plan accepted.
- Admin/review workflow plan accepted.
- Privacy/Data Safety/App Privacy inventory updated to include reporting and AI safety flows.

## 15. Implementation Non-Goals

- No reporting UI implementation in this phase.
- No backend report route implementation in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No AI provider changes in this phase.
- No safety service runtime changes in this phase.
- No PDF/export code changes in this phase.
- No admin tooling implementation in this phase.
- No deployment in this phase.

## 16. Recommended Follow-On Phases

- Phase 4-D1H - privacy and data safety inventory
- Phase 4-D1I - iOS App Store product and subscription mapping design
- Phase 4-D1J - Android Play Console product and subscription mapping design
- Phase 4-D2 - entitlement model implementation plan
- Phase 4-D2-S - unsafe story reporting implementation plan
- Phase 4-D2-T - AI safety test expansion plan

## 17. Current Status

- This plan is documentation-only.
- Unsafe story reporting implementation has not started.
- AI safety mobile implementation has not started.
- Admin/report review implementation has not started.
- Public/community story features remain out of mobile v1.
- Mobile release remains blocked until reporting/safety readiness is accepted.
