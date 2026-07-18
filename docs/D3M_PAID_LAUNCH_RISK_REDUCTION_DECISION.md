# D3M Paid Launch Risk Reduction Decision

## Status

Docs-only decision record. **Recommended but not yet implemented.** No runtime features were changed in this phase.

Production billing remains **NO-GO**.

## Purpose

Reduce payment-provider category risk by defining a lower-risk Paid Launch v1 packaging after FastSpring gateway product-category decline, before new provider preflight outreach.

## Problem

FastSpring declined Dreemi due to gateway product-category restriction. Lemon Squeezy is unavailable/rejected. New providers may apply similar category/risk filters — especially for AI, children's content, and image generation features. Full-feature packaging may increase rejection risk before category preflight.

## Recommended Paid Launch Packaging

Paid Launch v1 should be **story-first** and lower risk:

- Parent/guardian account ownership.
- AI-assisted children's story generation.
- No child account login.
- No public story sharing.
- No marketplace.
- No creator payouts.
- No standalone image generator.
- Story illustrations either disabled, deferred, or described as tightly controlled story illustrations only, pending provider acceptance.

## Deferred Or Restricted Features

- Standalone open-ended image generator — **deferred** from paid launch v1 packaging.
- Public story sharing — **not included** in paid launch v1.
- Marketplace / creator payouts — **out of scope**.
- Child-direct login accounts — **not included**.

## Safety Positioning

Dreemi is positioned as a parent/guardian-managed children's storytelling SaaS with safety controls, privacy policy, and no public UGC marketplace in paid launch v1. AI is used for child-friendly story creation under adult account ownership.

## Payment Provider Impact

Story-first packaging may improve category acceptance with PayPro Global, Paddle, Creem, and future providers. Preflight outreach must disclose generative-AI story creation honestly and ask whether **generative AI SaaS** is acceptable — not just SaaS subscriptions. FastSpring clarified generative AI as the blocker; subscription model was **not** the issue. Story-first packaging may reduce image-generation-specific risk but does **not** remove generative-AI risk.

## Product Impact

This is a **packaging and go-to-market decision** for paid launch — not a mandatory immediate runtime change. Implementation planning is a separate approved phase if owner accepts story-first v1 scope.

## Decision

**Recommended but not yet implemented.** No runtime features were changed in this phase.

Owner should confirm story-first Paid Launch v1 scope before provider preflight outreach and before any product/runtime reduction implementation phase.

## Next

**Primary:** `D3M-Payments-PayPro-Preflight-Response-Record` — if PayPro replies

**No-response:** `docs/D3M_PAYPRO_PREFLIGHT_NO_RESPONSE_RECORD.md` — **NO RESPONSE** as of **2026-07-18**

**Alternative (portfolio decision):** `D3M-Portfolio-Dreemi-Reactivation-Or-Exception-Decision`
