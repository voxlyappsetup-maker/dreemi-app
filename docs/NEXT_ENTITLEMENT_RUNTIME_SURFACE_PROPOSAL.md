# Next Entitlement Runtime Surface Proposal (Phase 4-D3I)

## 1. Purpose and Boundary

- Phase: `4-D3I` (documentation-only proposal/review).
- Objective: select the safest next candidate runtime surface after D3G and D3H.
- This phase does not implement runtime wiring and does not change behavior.
- No code, schema, migration, provider, checkout, webhook, app, deployment, package, or env changes are allowed.

## 2. Current Runtime State (Post-D3G, Post-D3H)

- D3G runtime wiring is committed at `b46af7a`.
- D3H verification and rollback-readiness review is committed at `42ce704`.
- Only child-limit decision in `services/api/src/routes/children.ts` is wired to `EntitlementService`.
- Story generation path remains legacy (`services/api/src/middleware/plans.middleware.ts`, `services/api/src/routes/stories.ts`).
- Payments/checkout/webhook path remains legacy (`services/api/src/routes/payments.ts`, `services/api/src/config/billing.ts`).
- `User.plan` remains the current compatibility projection.
- External security context (outside Git): Supabase RLS enabled on `public.users`, `public.children`, `public.stories`, `public.subscriptions`; no public policies added.

## 3. Candidate Surface Comparison

## A) Story generation path / monthly story limit

- Current file/path:
  - `services/api/src/routes/stories.ts`
  - `services/api/src/middleware/plans.middleware.ts`
- Current middleware/function involved:
  - `checkStoryLimit` in `plans.middleware.ts`
  - route order in `stories.ts`: `authenticateToken -> generateRateLimit -> checkStoryLimit`
- Current FREE monthly limit behavior:
  - `FREE_MONTHLY_LIMIT = 3`
  - non-FREE plans bypass monthly cap
- Dependency on story count/month window:
  - depends on `prisma.story.count` with month-start window (`createdAt >= monthStart`)
- Risk level:
  - medium-high (monthly window logic + middleware ordering + user-facing generation path)
- Expected test burden:
  - high (limit parity, month boundary cases, order invariants, response parity)
- Rollback complexity:
  - medium (single domain but hot path for generation)
- Likely user impact if wrong:
  - high (FREE users blocked or over-granted generation, billing trust impact)

## B) plans.middleware

- Current file/path:
  - `services/api/src/middleware/plans.middleware.ts`
- Current role in access checks:
  - central story-limit gate for `POST /api/stories/generate`
- Story-limit relationship:
  - direct owner of FREE cap check and paid bypass policy
  - route-level behavior depends on this middleware
- Risk level:
  - medium (single file surface, but directly in generation critical path)
- Expected test burden:
  - medium-high (policy parity + invocation/order proofs in `stories.ts`)
- Rollback complexity:
  - low-medium (single middleware revert is straightforward if isolated)
- Likely user impact if wrong:
  - high (generation availability and perceived subscription fairness)

## C) Payments / checkout / webhook projection path

- Current files/paths:
  - `services/api/src/routes/payments.ts`
  - `services/api/src/config/billing.ts`
- Relationship to User.plan projection:
  - webhook currently writes effective `User.plan`
  - checkout gate and provider-state checks are centralized in billing config
- Provider approval status:
  - Lemon Squeezy remains not approved for production launch
  - paid checkout remains fail-closed by gate
- Webhook risk:
  - high (idempotency/order/state transitions affect entitlement and user access)
- Checkout risk:
  - high (commercial and trust-sensitive, could expose disabled checkout or wrong variants)
- Risk level:
  - highest
- Expected test burden:
  - very high (checkout gate, variant mapping, webhook status mapping, projection parity, fail-closed proofs)
- Rollback complexity:
  - high (payment state transitions and subscription projection path)
- Likely user impact if wrong:
  - very high (incorrect billing/access behavior, support incidents, production risk)

## 4. D3I Recommendation (Safest Next Phase Type)

- Recommended next phase: `D3J` as a deeper proposal/test-plan phase, not implementation.
- Recommended candidate for D3J planning focus: story-generation access gate through `plans.middleware` (single-surface proposal scope).
- Rationale:
  - significantly safer than payments/checkout/webhook path.
  - can be scoped tighter than broad story-route changes by focusing on middleware boundary first.
  - still requires high test confidence due to monthly window and route ordering sensitivity.
- Explicit guardrail:
  - no second runtime wiring should occur automatically.
  - implementation requires explicit user approval after D3J plan acceptance.

## 5. Required Tests Before Any Second Runtime Wiring

- Static guardrails that only the approved surface changes.
- Parity tests proving current behavior is preserved.
- Fail-closed tests for missing/unknown plans.
- Regression tests proving D3G child-limit wiring remains untouched.
- Regression tests proving non-selected surfaces remain untouched.
- Provider-specific ID exclusion tests where relevant.
- Route/middleware ordering tests where relevant.
- Response shape parity tests where relevant.

### D3J planning baseline test matrix

- `plans.middleware` policy parity:
  - FREE monthly limit remains `3`
  - non-FREE bypass behavior unchanged
- month-window counting parity:
  - month start boundary
  - exactly-at-limit and over-limit paths
- route ordering parity in `stories.ts`:
  - `authenticateToken -> generateRateLimit -> checkStoryLimit`
- response contract parity:
  - `403` payload shape for `STORY_LIMIT_REACHED` remains stable
- no-touch regressions:
  - `children.ts` remains D3G-only entitlement surface
  - `payments.ts` and billing gate remain unchanged
- provider ID policy scan:
  - no provider variant/product IDs in story access-check policy files

## 6. Acceptance Criteria for Any Future Implementation Phase

- one runtime surface only.
- no schema/migration changes.
- no provider adapter changes.
- no checkout/webhook behavior changes unless a payments-specific phase is explicitly selected and approved.
- no `apps/web` changes unless explicitly approved.
- no env/secrets/package changes.
- all validation commands pass with explicit exit codes.
- manual smoke checks are documented and executed.

## 7. Rollback Considerations

- Revert only the second-surface wiring change set.
- Preserve D3G child-limit wiring unless D3G is proven to be causal.
- No RLS rollback unless independently proven necessary.
- No schema rollback should be needed for proposal-only or single-surface wiring.
- Payment/webhook rollback is high-risk and must be handled separately from story/middleware rollback.

## 8. D3J Entry Gate

- D3I must be committed and accepted first.
- D3J must start as proposal/test-plan unless explicit approval upgrades it.
- No runtime implementation starts until user gives explicit approval after D3J review.

## 9. D3J Outcome Update

- D3J proposal/test-plan is documented at `docs/STORY_GENERATION_ENTITLEMENT_WIRING_TEST_PLAN.md`.
- D3J remains documentation-only and adds no runtime wiring.
- D3K0 static guardrail preflight is complete as a test-only phase and adds no runtime wiring.
- D3K may be a future one-surface implementation phase only with explicit approval after D3J acceptance.
- If risk remains high, run an extra test-only/static-guardrail phase before D3K implementation.
