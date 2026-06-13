# Phase 4-D3M-Triage-B8 — Payment Provider External Verification Checklist

## 1) Current payment posture

- **Lemon Squeezy: REJECTED / NOT ACTIVE** (final rejection after risk/supportability review; see `docs/D3M_LEMON_REJECTION_RECONCILIATION.md`).
- Lemon external verification is **closed** unless the user explicitly chooses a short appeal.
- **Alternate MoR/payment provider required** before production billing can be considered.
- Existing payment runtime remains fail-closed.
- Paid checkout remains blocked.
- No checkout/purchase/webhook/provider verification has been run.
- No production payment readiness claim is allowed.
- No alternative provider may be implemented before external verification and explicit approval.

## 2) Purpose

- Prepare an external checklist to verify provider suitability before any implementation phase.
- Reduce KYC/KYB rejection risk and avoid building non-usable integrations.
- Define required questions and documents before applying or integrating.
- Keep payments disabled until provider/legal/payout verification is completed.

**FastSpring catalog dashboard setup COMPLETE:** four launch subscriptions in test/trial dashboard (`docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md`). **Website pricing alignment COMPLETE** (`docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md`). **Test-order plan COMPLETE** (`docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`). **Activation gap audit COMPLETE** — minimum requirements **PARTIAL** (`docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md`). **No test order executed yet.** External activation still pending. Trial store **not Live**.

## 3) Candidate provider categories

- Merchant of Record candidates (for example Paddle, FastSpring, or similar alternatives).
- Stripe or another payment processor only if a supported legal entity/country and compliant KYC path exist.
- UAE/GCC/local provider path only if a proper legal structure is selected.
- No-payment/waitlist mode as a safe temporary option.
- Manual service/invoice path only after qualified legal/accounting review.

## 4) External verification checklist

### A) Business and product eligibility

- Does the provider accept SaaS/digital subscription products?
- Does the provider accept AI-assisted children/family content products (if applicable to Dreemi positioning)?
- Is a demo video required?
- Is a public website required?
- Are Terms, Privacy, and Refund Policy pages required?
- Are social profiles or founder verification artifacts required?
- Are there restrictions on AI-generated content or children/family app categories?
- Are there restrictions tied to founder nationality/residency or business country?

### B) Founder / entity / payout

- Who is the approved payout recipient?
- Can the provider onboard founder-as-individual cases?
- Is a company/entity mandatory?
- Is a Lebanese resident in Saudi Arabia eligible under provider policy?
- Is a foreign entity (for example US LLC) required for eligibility?
- What exact KYC/KYB documents are required?
- Which payout methods are supported for this case?
- Are Wise/Payoneer/bank-transfer options supported, and under what conditions?
- Is proof of address required?
- Are tax forms required, and which ones?

### C) Merchant of Record vs payment processor

- Is the provider truly Merchant of Record, or only a payment processor?
- Who is the seller of record toward the customer?
- Who handles VAT/GST/sales-tax collection/remittance?
- Who issues invoices/receipts?
- Who handles refunds/chargebacks?
- What obligations remain on Dreemi (especially local income-tax/accounting and local regulatory duties)?

### D) Subscription and checkout capabilities

- Supports monthly/yearly subscriptions?
- Supports trials/coupons?
- Supports customer portal?
- Supports cancellation/refund workflows?
- Supports web checkout?
- Supports hosted checkout without direct card-data handling?
- Supports required webhook events?
- Supports sandbox/test mode?
- Supports controlled no-purchase smoke or limited verification flow?
- Supports immediate checkout-disable rollback control?

### E) Integration and security

- API documentation availability and clarity.
- Webhook signing support.
- Stable product/variant identifiers.
- Environment-variable and configuration requirements.
- Required secrets (names only in internal checklist; no values in docs/chat).
- Clear local/staging/production separation.
- Error-code mapping capability.
- Fail-closed strategy for unavailable provider state.
- No secret logging policy.
- No raw provider-error leakage to end users.

### F) Legal/documentation requirements

- Terms of Use updates required?
- Privacy Policy updates required?
- Refund Policy requirements.
- Pricing-disclosure requirements.
- Subscription-cancellation disclosure requirements.
- Child/family/AI disclaimers if required.
- Support/contact page requirements.
- Billing-support workflow requirements.
- Data-retention/account-deletion impacts.

### G) Operational readiness

- Who handles billing/support operations?
- Refund SLA expectations.
- Failed-payment handling process.
- Dispute/chargeback handling process.
- Subscription-cancellation processing.
- Customer invoice access flow.
- Internal admin notes/runbook requirements.
- Monitoring/alerts requirements.
- Rollback plan readiness.
- Production runbook readiness.

## 5) Questions to ask provider before applying/integrating

- Do you accept a SaaS web app for AI-assisted children’s story generation?
- Do you accept founders who are Lebanese residents in Saudi Arabia?
- Do you require a legal entity for onboarding/payout?
- What payout countries and bank-account requirements apply?
- Are you Merchant of Record for VAT/GST/sales tax in this model?
- What KYC/KYB documents are required?
- Do you support recurring subscriptions and hosted checkout?
- What refund/chargeback workflows are supported?
- Are there policy restrictions on children/family/AI products?
- Can we run controlled checkout verification before enabling broad public payments?

## 6) Required evidence before implementation

- Provider acceptance or clear eligibility confirmation.
- Payout-recipient/entity decision.
- Qualified legal/accounting review.
- KYC/KYB document readiness.
- Terms/Privacy/Refund updates drafted and reviewed.
- Sandbox/test capability confirmation.
- Webhook-signing documentation confirmation.
- Subscription lifecycle mapping confirmation.
- Fail-closed rollback plan documented.
- Explicit implementation approval.

## 7) Decision gate

Payment implementation remains **BLOCKED** until all of the following are satisfied:

- provider eligibility is externally verified,
- payout/legal path is confirmed,
- accounting/tax review is completed or explicitly accepted as pending risk,
- provider sandbox/test access is available,
- implementation scope is approved,
- no-secrets handling plan is documented.

Any unresolved item requires qualified legal/accounting review before moving to implementation.

## 8) Recommended next posture

- Keep paid checkout disabled.
- Use waitlist/no-payment mode where needed.
- Prepare provider application package.
- Do not implement provider-specific runtime logic yet.
- Do not remove Lemon code unless a separate cleanup phase is explicitly approved.
- Do not claim production payment readiness.

## 9) Proposed next phase (B9)

**Phase 4-D3M-Triage-B9 — Payment Provider Application Package Draft**

B9 should remain documentation-only unless explicitly approved.

B9 target outputs:

- provider-application narrative and product description draft,
- demo checklist,
- founder/business answer pack,
- refund/support policy draft,
- no code changes, no secrets, no provider calls.
