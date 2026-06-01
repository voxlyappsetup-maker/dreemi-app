# Payment Provider Strategy After Lemon Squeezy Rejection

## 1. Purpose

- Document the payment-provider state after Lemon Squeezy rejected the store application.
- Prevent accidental paid launch assuming Lemon is approved.
- Define fallback provider candidates and required future phases.
- This document does not remove any existing Lemon Squeezy code.
- This document does not approve any payment provider for production.

## 2. Current Status

- Lemon Squeezy store application was rejected at this time.
- Lemon Squeezy production verification is paused.
- Existing Lemon Squeezy integration remains in the codebase but is not approved for commercial production use.
- No production payment verification has been completed.
- No paid launch should proceed until a provider is approved and verified.

## 3. Operational Decision

- Do not proceed with Lemon Squeezy production launch unless Lemon Squeezy explicitly approves the store later.
- Do not delete or refactor Lemon integration immediately.
- Reopen the payment-provider decision before any commercial launch.
- Any new provider integration requires a separate explicit phase.

## 4. Reconsideration Response

- One professional reconsideration email may be sent to Lemon Squeezy.
- The response should clarify:
  - Dreemi/Qisas is a SaaS application for AI-assisted children's story generation.
  - Paid products are subscriptions and/or in-app story-generation credits.
  - No physical goods, resale-rights content, adult content, marketplace goods, financial products, or manually delivered services are sold.
  - Product documentation, demo video, policies, and KYC/KYB information can be provided.
- Do not include secrets, API keys, tokens, or private credentials in the response.

## 5. Fallback Provider Candidates

Document candidates without committing to implementation:

Primary candidate:
- Paddle
- Reason: likely closest Merchant-of-Record style replacement candidate for SaaS subscriptions/digital products.
- Requires separate review and approval.
- Requires a future integration strategy.

Fallback MVP candidate:
- PayPal Business
- Reason: may support a limited MVP/payment path while longer-term billing is decided.
- Not equivalent to full Merchant-of-Record SaaS billing.
- Requires legal/tax/accounting review.

Long-term direct processor candidate:
- Stripe
- Only if using a valid supported legal entity.
- No workaround or inaccurate business information should be used.
- Requires separate entity/payment-provider decision.

## 6. Technical Impact

- Existing Lemon files remain unchanged for now:
  - `services/api/src/routes/payments.ts`
  - `services/api/src/services/lemonsqueezy.service.ts`
  - `services/api/src/config/billing.ts`
  - `services/api/src/config/billing.test.ts`
  - `services/api/src/routes/payments.security-regression.test.ts`
- Lemon production verification plan is now blocked unless approval changes.
- A future provider abstraction audit is recommended before replacing Lemon:
  - checkout creation
  - webhook verification
  - subscription event mapping
  - effective `User.plan` entitlement updates
  - product/variant catalog mapping
  - frontend pricing/checkout behavior

## 7. Commercial Launch Blockers

P0 blockers:
- Approved payment provider selected.
- Provider account approved.
- Production domain(s) finalized.
- Provider webhook URL finalized.
- Terms, Privacy, Refund, and AI/child-safety policy ready.
- Production payment smoke verification completed.
- No secrets in repo/docs/chat.

## 8. Future Recommended Phases

- Phase 4-D1C - payment provider abstraction audit
- Phase 4-D2A - Paddle suitability and integration planning
- Phase 4-D2B - PayPal MVP fallback planning
- Phase 4-D3 - selected provider implementation plan
- Phase 4-D4 - selected provider sandbox/test verification
- Phase 4-D5 - production payment verification

## 9. Current Status

- Lemon Squeezy is paused.
- Payment provider decision is reopened.
- No paid launch should proceed yet.
