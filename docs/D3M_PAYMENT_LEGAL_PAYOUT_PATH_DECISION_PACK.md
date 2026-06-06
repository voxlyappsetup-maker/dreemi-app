# Phase 4-D3M-Triage-B7 — Payment Legal/Payout Path Decision Pack

## 1) Current payment posture

- Lemon Squeezy is rejected/unavailable for this app.
- Existing payment runtime remains fail-closed.
- Paid checkout remains blocked.
- No checkout/purchase/webhook/provider verification has been run.
- No production payment readiness claim is allowed.
- Alternative provider selection alone is not enough without legal payout-path confirmation.

## 2) Founder/legal context

- Founder context for planning: Lebanese resident in Saudi Arabia, not Saudi citizen.
- Product direction is global (not Saudi-only or Arab-only).
- Do not assume standard Saudi citizen commercial-registration/freelance-document pathways are available in the same way.
- Do not use another person’s business account or informal personal-account collection.
- Any operating/payout path requires qualified legal/accounting review before activation decisions.

## 3) Main legal/payout path options to evaluate

- A) Merchant of Record path without separate entity, if accepted and compliant.
- B) Supported foreign-entity path (for example US LLC) plus provider/KYC path.
- C) UAE/GCC entity path.
- D) Saudi investment/commercial path, only if legally available and cost-appropriate.
- E) Temporary no-payment/waitlist-only mode.
- F) Manual service/invoice path only after legal/accounting review.

## 4) Comparison matrix (decision support)

| Path | Description | Who is seller / Merchant of Record? | Who receives payout? | Entity required? | Fit for Lebanese resident in Saudi Arabia | Estimated setup burden | Estimated recurring burden | KYC/KYB complexity | Tax/accounting implications | Sales tax/VAT/GST handling | Compatibility with SaaS subscriptions | Compatibility with future mobile strategy | Main risks | Required external verification | Recommended status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A) Merchant of Record path (no separate entity if accepted) | Use MoR provider where provider can contract and onboard founder context directly | Provider acts as MoR | Provider pays out to approved beneficiary account | Not always, depends on provider policy | Potentially viable but requires external verification | Low to medium | Medium | Medium to high | Local income-tax/accounting duties still remain and need qualified review | MoR may simplify sales-tax/VAT/GST operations; does not remove local tax obligations | Usually strong for web SaaS, requires provider confirmation | Usually compatible as part of web path; mobile still needs Apple/Google billing strategy | Provider rejection, payout-country constraints, policy mismatch | Provider onboarding rules, founder eligibility, payout-country support, qualified legal/accounting review | Candidate |
| B) Supported foreign entity (for example US LLC) + provider path | Establish entity first, then onboard provider with compliant KYC/KYB | Depends on provider (MoR or processor model) | Entity bank account or registered payout recipient | Yes | Possible but requires external verification | Medium to high | Medium to high | High | Ongoing accounting, filing, governance, and cross-border tax obligations require qualified review | Depends on provider model; merchant-side responsibilities may remain significant | Strong if setup is completed correctly | Can support future multi-platform strategy, still needs platform-specific billing planning | Setup cost, ongoing admin burden, compliance mistakes | Entity formation feasibility, banking, provider acceptance, qualified legal/accounting review | Research needed |
| C) UAE/GCC entity path | Form entity in UAE/GCC then onboard suitable provider | Depends on selected provider/model | Entity payout account | Yes | Potentially viable but requires external verification | Medium to high | Medium to high | High | Cross-border and local accounting/tax obligations require qualified review | Depends on provider/model and jurisdiction setup | Potentially strong once established | Can be compatible long-term; cost may be high for MVP stage | Upfront and recurring cost pressure for early-stage product | Entity feasibility, cost structure, provider compatibility, qualified legal/accounting review | Research needed |
| D) Saudi investment/commercial path (if legally available) | Formal local Saudi path only if legally available for this founder context | Depends on selected provider/model | Registered local business payout account | Usually yes | Unclear; must not be assumed available without external verification | Medium to high | Medium to high | High | Local obligations and regulatory duties require qualified review | Depends on provider/model and legal structure | Potentially good if feasible | Can support broader strategy if legally established | Eligibility uncertainty, timeline, regulatory complexity | Local legal availability, licensing, compliance, qualified legal/accounting review | Research needed |
| E) Temporary no-payment / waitlist mode | Keep paid checkout disabled while legal and provider path is unresolved | Not applicable | Not applicable | No | High (safe interim option) | Low | Low | Not applicable | Low immediate payment-tax complexity, but business/accounting planning still needed | Not applicable while no paid checkout | Not applicable for paid subscriptions | Compatible as temporary posture while strategy is prepared | No direct revenue during interim | Product/commercial viability assumptions, go-to-market timing | Candidate |
| F) Manual service/invoice path (after review only) | Limited manual billing for service-style engagements if legally reviewed | Business issuer per approved legal setup | Approved legal payout recipient | Usually yes for sustained operations | Possible only with qualified review; not default SaaS path | Low technical, medium operational | Medium | Medium | Invoice, bookkeeping, and reporting obligations require qualified review | Merchant responsibility | Weak fit for scalable subscription SaaS | Weak direct fit for consumer app subscriptions | Operational inconsistency and compliance mistakes | Legal allowance, invoicing obligations, qualified legal/accounting review | Backup |
| Not recommended: personal collection / third-party account | Informal collection through personal account or another person/entity | Misaligned / unacceptable | Personal or unrelated third-party account | Not a compliant project path | Not acceptable | Low apparent setup | High hidden risk | High risk | High legal/compliance exposure | Unclear/high risk | Not suitable | Not suitable | Account ownership/compliance/legal risk | Not applicable; this path is disallowed | Not recommended |

## 5) Analysis rules and guardrails

- Distinguish clearly between Merchant of Record and payment processor in all decisions.
- Merchant of Record may help with sales-tax/VAT/GST operations but does not eliminate local income-tax or other local obligations.
- Stripe is not a direct immediate path unless supported legal-entity/country and compliant KYC/KYB path are confirmed.
- Foreign entities (for example US LLC) introduce annual accounting/compliance obligations and should not be created without qualified review.
- UAE/GCC entity path may become suitable later but may exceed early-stage budget/operations.
- Saudi formal path for non-Saudi resident cases requires qualified legal review and should not be assumed easy/available.
- Keeping payments closed with waitlist/no-payment mode remains a safe temporary option.
- Avoid categorical claims such as "fully legal" or "fully tax compliant" without qualified legal/accounting review.

## 6) Recommended decision posture (conservative)

- Immediate operational posture: keep paid checkout disabled.
- Primary research path: Merchant of Record provider that can accept this founder/legal context without informal collection.
- Conditional path: supported foreign entity only if provider/KYC requires it and qualified review confirms feasibility.
- Backup operational path: no-payment/waitlist mode until legal payout path is confirmed.
- Not recommended: personal collection, third-party business account use, informal money collection, or production-readiness claims.

## 7) Required decisions before any payment implementation

- Payout-recipient identity/entity.
- Provider candidate.
- KYC/KYB feasibility.
- Tax/accounting review.
- Refund policy.
- Terms and Privacy updates.
- Pricing model.
- Invoice/receipt handling.
- Support and refund workflow.
- Controlled checkout verification plan.
- Rollback/fail-closed plan.
- Explicit approval before runtime code changes.

## 8) What remains blocked after B7

- Paid production checkout remains blocked.
- Legal payout path remains unconfirmed.
- Payout-recipient entity remains unselected.
- Provider KYC/KYB feasibility remains unverified.
- No real checkout/purchase/webhook/provider verification has been run.

## 9) Proposed next phase (B8)

Proposed next phase:

**Phase 4-D3M-Triage-B8 — Payment Provider External Verification Checklist**

Scope of B8 should remain planning/research-only:

- prepare an external verification checklist for the chosen candidate path,
- define required documents/questions for provider onboarding and KYC/KYB,
- define legal/accounting review checkpoints,
- do not execute provider API calls,
- do not run checkout/purchase/webhook flows,
- do not introduce runtime code changes.
