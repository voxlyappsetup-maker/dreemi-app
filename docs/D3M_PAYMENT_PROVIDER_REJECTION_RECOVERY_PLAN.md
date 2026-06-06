# Phase 4-D3M-Triage-B5 — Payment Provider Rejection Recovery & Alternative Provider Plan

## 1) Current state

- Lemon Squeezy is rejected/unavailable for this app at this time.
- Existing Lemon-related code remains fail-closed and unavailable by design.
- Checkout remains unavailable by design when provider readiness/config is incomplete.
- No real checkout, purchase, webhook, or provider verification flow has been run in this phase.
- Production payment readiness remains blocked.

## 2) Corrected payment posture

- Lemon is not an active production payment path for this app.
- Do not proceed with Lemon activation steps unless a future explicit approval/acceptance occurs.
- The next valid payment work is alternative provider evaluation, not provider activation.
- Existing Lemon runtime code remains as implementation detail only until a replacement path is selected and approved.

Safety posture:

Lemon Squeezy is not an active production payment path for this app because the application/account was rejected. Current payment code remains fail-closed and unavailable by design. The next payment phase must evaluate and document alternative legal payment providers before any provider activation, checkout verification, or production payment claim.

## 3) Alternative provider evaluation criteria

Evaluate future candidates against:

- legal ability for a Lebanese resident in Saudi Arabia to receive funds lawfully,
- Merchant of Record support where possible,
- digital subscription support,
- SaaS/web checkout support,
- clear KYC/KYB requirements,
- tax/VAT/sales-tax handling clarity,
- refund/chargeback handling,
- supported countries and payout methods,
- integration complexity,
- web-first compatibility,
- future mobile subscription strategy compatibility.

## 4) Candidate provider paths to evaluate later

- Paddle as a Merchant of Record candidate.
- Stripe only if a supported legal entity/country path exists.
- UAE/GCC/local provider path only if a proper legal structure is selected.
- Manual waitlist / no-paid-access mode until legal payment path is selected.
- Do not use personal-account collection or another person’s business account.

## 5) Required decisions before any paid production path

- legal entity / payout recipient model,
- provider candidate short-list and selection decision,
- KYC/KYB feasibility confirmation,
- tax/accounting review,
- pricing model confirmation,
- controlled no-purchase or low-risk checkout verification plan,
- rollback and unavailable UX confirmation.

## 6) Guardrails for follow-up phases

- No provider activation until legal/payment-path decision is documented and approved.
- No production payment readiness claim before approved provider verification evidence exists.
- No checkout/purchase/webhook/provider API execution in planning-only phases.
- No secrets in docs/chat/repo.
