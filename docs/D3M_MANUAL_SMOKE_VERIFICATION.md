# D3M Manual Smoke Verification

## A. Purpose and boundary

- Phase: `4-D3M`.
- Scope: manual smoke verification documentation after D3K runtime wiring.
- This phase is documentation-only.
- No runtime, test, schema, provider, frontend, deployment, package, or env changes are included.
- Smoke checks are to be executed manually later by the user, not by Cursor in this phase.
- User-reported execution evidence for this checklist is documented in:
  - `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`

## B. Current entitlement surfaces to protect

- D3G runtime surface:
  - `services/api/src/routes/children.ts`
  - child-limit decision uses `getChildLimit(userId, user.plan)`
- D3K runtime surface:
  - `services/api/src/middleware/plans.middleware.ts`
  - story-generation monthly-limit plan decision uses `getPlanForAccessCheck(userId, user.plan)`
- Non-wired surfaces to preserve:
  - no direct EntitlementService wiring in `services/api/src/routes/stories.ts`
  - no EntitlementService wiring in `services/api/src/routes/payments.ts`
  - checkout remains non-wired
  - webhook remains non-wired
  - billing/provider logic remains non-wired to runtime access checks
  - `apps/web` behavior remains unchanged

## C. Prerequisites for manual smoke run

- [ ] Repo is clean at the latest accepted commit for the run.
- [ ] API and web can be started with the normal local project commands.
- [ ] A test user can authenticate successfully.
- [ ] At least one child profile exists (or can be created safely).
- [ ] Test data is safe/non-production or controlled for verification.
- [ ] No production secrets are printed during verification.
- [ ] Paid-plan checks are performed only with safe/stubbed/test data unless provider approval explicitly allows otherwise.

## D. Manual smoke checklist

Notes for all rows:
- Do not manipulate production data recklessly.
- Prefer local/test account data or a controlled test database.
- For plan checks, record which plan state was used without recording secrets.

| ID | Area | Steps | Expected result | Actual result | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Auth | Login with valid test user credentials. | Login succeeds and session is established. |  |  |  |
| 2 | Generate page | Open generate page as authenticated user. | Generate page loads without entitlement-related errors. |  |  |  |
| 3 | FREE below limit | Use FREE test user below monthly limit and generate story. | Story generation succeeds. |  |  |  |
| 4 | FREE at/over limit | Use FREE test user at or above monthly limit and generate story. | Same limit behavior appears (HTTP 403 + `STORY_LIMIT_REACHED` flow). |  |  |  |
| 5 | Paid behavior | Use paid-plan test user and generate story. | Paid behavior remains unchanged (non-FREE bypass remains effective). |  |  |  |
| 6 | Story detail | Open existing story detail page. | Story detail loads correctly for owner. |  |  |  |
| 7 | Children page | Open children page as authenticated user. | Children page loads correctly. |  |  |  |
| 8 | Child limit | Attempt child-create flow per plan state in controlled test data. | Child-limit behavior remains unchanged from D3G baseline. |  |  |  |
| 9 | Pricing page | Open pricing page while authenticated. | Pricing page loads normally. |  |  |  |
| 10 | Checkout UI | Use pricing/subscription UI path without completing provider transactions. | Checkout UI flow remains unchanged and no unexpected gating regressions appear. |  |  |  |
| 11 | Payment status route | Verify payment status fetch path through app/API surface. | Payment status behavior remains unchanged. |  |  |  |
| 12 | Subscription route | Verify subscription fetch path through app/API surface. | Subscription route behavior remains unchanged. |  |  |  |
| 13 | Story list/dashboard | Open story list/dashboard as authenticated owner. | List/dashboard remains accessible and stable. |  |  |  |
| 14 | Story ownership protection | Attempt wrong-user story detail access with controlled test users. | Access remains blocked; no story existence leakage. |  |  |  |
| 15 | Public sharing gate | Verify unauthenticated direct story access path behavior. | Public unauthenticated story sharing remains disabled unless separately approved. |  |  |  |
| 16 | Arabic flow | Generate and view Arabic story content path. | Arabic generation/display path behaves normally. |  |  |  |
| 17 | English flow | Generate and view English story content path. | English generation/display path behaves normally. |  |  |  |
| 18 | French flow | Generate and view French story content path. | French generation/display path behaves normally. |  |  |  |
| 19 | PDF export | Export existing story PDF from UI (if feature is available in current environment). | PDF export works with no entitlement regressions observed. |  |  |  |
| 20 | Mobile-width UI | Check generate/children/story pages at mobile width in browser dev tools/device. | No visible regression in mobile-width layout on these pages. |  |  |  |

## E. Evidence log template

| Date/time | Environment | Commit | Tester | Browser/device | API status | Web status | Test account type | Result summary | Blockers | Follow-up issue/phase |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |

## F. Failure triage

- Do not add runtime changes immediately.
- Capture:
  - exact step ID
  - expected result
  - actual result
  - safe screenshot/log summary (no secrets)
- Confirm whether the failure is likely D3K-related or unrelated.
- If suspected D3K regression, use rollback guidance in:
  - `docs/D3K_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`
- Do not rollback RLS, schema, payments, or providers unless independently proven causal.

## G. Next phase gate

- After D3M is committed and accepted, the next phase can be:
  - `D3M-Run`: user-executed manual smoke run and evidence capture, or
  - payment-provider production readiness review, or
  - entitlement schema proposal review.
- D3M must not start a third runtime wiring surface.
- No third runtime wiring surface until a separate proposal/test-plan is completed and explicitly approved.
