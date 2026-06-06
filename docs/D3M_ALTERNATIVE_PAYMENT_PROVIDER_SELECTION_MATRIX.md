# Phase 4-D3M-Triage-B6 — Alternative Payment Provider Selection Matrix

## 1) Current payment state

- Lemon Squeezy is rejected/unavailable for this app.
- Existing payment code remains fail-closed.
- Production checkout remains blocked.
- No real checkout/purchase/webhook/provider verification has been run.
- No production payment readiness claim is allowed.

## 2) Phase goal

- Compare alternative payment-provider paths conservatively.
- Select an initial candidate set for legal/accounting review.
- Explicitly list what remains blocked.
- Do not implement technical integration in this phase.

## 3) Core evaluation criteria

- Merchant of Record availability.
- SaaS/digital subscription support.
- KYC/KYB requirements.
- Ability for a Lebanese resident in Saudi Arabia to lawfully receive payouts.
- Need for legal entity.
- Supported payout countries and methods.
- VAT/GST/sales-tax handling clarity.
- Income-tax/accounting implications.
- Refund/chargeback handling.
- Subscription lifecycle support.
- Web-first checkout support.
- Future mobile strategy compatibility.
- Integration complexity.
- Risk of rejection.
- Required documentation before application.
- Fit with low-budget MVP constraints.

## 4) Candidate paths to compare

- Paddle as a Merchant of Record candidate.
- Stripe only if a supported legal entity/country path exists.
- FastSpring as a Merchant of Record candidate if relevant.
- 2Checkout/Verifone as a possible global digital-payments candidate if relevant.
- UAE/GCC/local provider only if a proper legal structure is selected.
- Manual no-payment/waitlist mode as temporary fallback.
- Manual invoice/service-only sale only after legal review.
- Not recommended: personal-account collection or another person’s business account.

## 5) Selection matrix

### Paddle

- Provider/path: Paddle
- Type: Merchant of Record
- Best use case: web-first SaaS subscriptions with MoR handling
- Legal/entity requirement: requires external verification
- Payout feasibility for current founder situation: requires external verification
- Subscription support: likely strong; requires external verification
- Tax/VAT handling: MoR can reduce operational burden for VAT/GST/sales tax; income-tax obligations still remain local and separate
- KYC/KYB burden: requires external verification
- Integration complexity: medium
- Main risk: application/compliance rejection risk remains until reviewed and approved
- Recommended status: Candidate
- Notes: strongest first research path in this phase, pending legal/accounting validation

### FastSpring

- Provider/path: FastSpring
- Type: Merchant of Record
- Best use case: web digital subscriptions where MoR is preferred
- Legal/entity requirement: requires external verification
- Payout feasibility for current founder situation: requires external verification
- Subscription support: expected available; requires external verification
- Tax/VAT handling: MoR may help sales-tax/VAT/GST operations, but does not remove income-tax/accounting duties
- KYC/KYB burden: requires external verification
- Integration complexity: medium
- Main risk: fit, pricing, and compliance acceptance uncertainty
- Recommended status: Backup
- Notes: conservative backup MoR path to compare against Paddle

### Stripe (conditional)

- Provider/path: Stripe
- Type: payment processor (not Merchant of Record by default)
- Best use case: teams with supported legal entity and compliant KYC path
- Legal/entity requirement: supported legal entity is typically required; requires external verification
- Payout feasibility for current founder situation: blocked unless legal-entity and supported-country path is confirmed
- Subscription support: strong if account/legal prerequisites are satisfied
- Tax/VAT handling: mostly merchant responsibility unless separate tax tooling is added
- KYC/KYB burden: can be substantial; requires external verification
- Integration complexity: medium
- Main risk: legal-entity/country eligibility failure
- Recommended status: Research needed
- Notes: not a direct immediate path without legal-entity decision and verified eligibility

### 2Checkout/Verifone (conditional)

- Provider/path: 2Checkout/Verifone
- Type: global digital-payments candidate (model details require verification)
- Best use case: possible global digital sales where regional eligibility matters
- Legal/entity requirement: requires external verification
- Payout feasibility for current founder situation: requires external verification
- Subscription support: requires external verification
- Tax/VAT handling: requires external verification
- KYC/KYB burden: requires external verification
- Integration complexity: medium to high
- Main risk: unknown fit until documentation/eligibility is verified
- Recommended status: Research needed
- Notes: include only as a comparative research path, not an assumed approved option

### UAE/GCC/local provider path

- Provider/path: UAE/GCC/local provider
- Type: local provider path
- Best use case: founders operating via proper local legal entity and compliant payout setup
- Legal/entity requirement: proper legal structure required
- Payout feasibility for current founder situation: blocked until legal structure is selected
- Subscription support: depends on provider; requires external verification
- Tax/VAT handling: local compliance obligations remain and require accounting review
- KYC/KYB burden: likely high; requires external verification
- Integration complexity: variable, often medium to high
- Main risk: legal/compliance setup delays
- Recommended status: Research needed
- Notes: do not use personal bank/account workaround

### Manual no-payment / waitlist mode

- Provider/path: waitlist/no-payment mode
- Type: fallback
- Best use case: continue product validation while paid path is unresolved
- Legal/entity requirement: none for payment processing because no paid checkout is active
- Payout feasibility for current founder situation: not applicable
- Subscription support: not applicable
- Tax/VAT handling: not applicable for no-payment mode
- KYC/KYB burden: not applicable
- Integration complexity: low
- Main risk: no direct revenue during interim period
- Recommended status: Candidate
- Notes: safest temporary operational posture until legal/provider path is approved

### Manual invoice/service-only sale (legal-reviewed only)

- Provider/path: manual invoice/service-only
- Type: fallback
- Best use case: narrowly scoped legally reviewed B2B/service scenarios
- Legal/entity requirement: requires legal/accounting review first
- Payout feasibility for current founder situation: requires external verification
- Subscription support: weak for scalable subscription SaaS
- Tax/VAT handling: merchant/local obligations remain and must be reviewed
- KYC/KYB burden: operational/compliance burden can remain on founder/entity
- Integration complexity: low technical, high operational
- Main risk: compliance and process inconsistency risk
- Recommended status: Backup
- Notes: only if legally reviewed; not a substitute for proper SaaS payment path

### Not recommended path

- Provider/path: personal-account collection / third-party business account
- Type: not recommended
- Best use case: none
- Legal/entity requirement: misaligned/unacceptable
- Payout feasibility for current founder situation: high legal/compliance risk
- Subscription support: not suitable
- Tax/VAT handling: unclear/high risk
- KYC/KYB burden: problematic
- Integration complexity: irrelevant
- Main risk: legal/compliance/account-ownership violations
- Recommended status: Not recommended
- Notes: explicitly disallowed for this project

## 6) Analysis guardrails

- No final provider decision is made in this phase where external facts are unresolved.
- Use `requires external verification` for non-confirmed legal/compliance/payment facts.
- Keep conservative language; no provider is treated as approved before real application review.
- Distinguish Merchant of Record from payment processor in all follow-up discussions.
- Merchant of Record may help sales-tax/VAT/GST operations but does not remove local income-tax/accounting obligations.
- Stripe remains conditional and not immediate without supported legal-entity/country and compliant KYC path.
- Any local/GCC path requires proper legal structure, not personal-account collection.

## 7) Conservative recommendation

- Primary research candidate: Paddle (MoR), subject to legal/accounting and eligibility verification.
- Backup candidate: FastSpring (or similar MoR), subject to verification.
- Conditional candidate: Stripe only after supported legal-entity decision and eligibility confirmation.
- Temporary operational posture: keep paid checkout disabled and use waitlist/no-payment mode until provider/legal path is approved.
- Not recommended: personal collection, third-party account, or informal payment collection.

## 8) Required decisions before any implementation

- Legal entity and payout-recipient decision.
- Payment provider candidate selection.
- KYC/KYB feasibility confirmation.
- Accounting/tax review outcome.
- Pricing model confirmation.
- Refund-policy confirmation.
- Terms and Privacy update scope.
- Controlled checkout-verification plan.
- Rollback/fail-closed plan.
- Explicit approval before any runtime code changes.

## 9) Still blocked after B6

- Production payment path remains blocked.
- Provider approval status remains unverified for alternatives.
- Legal payout path remains unconfirmed.
- Real checkout/purchase/webhook/provider verification remains not executed by design in this phase.
