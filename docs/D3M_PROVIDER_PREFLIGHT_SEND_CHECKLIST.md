# D3M Provider Preflight Send Checklist

## Status

Docs-only send checklist. PayPro Global **SENT 2026-07-11** via Talk to Sales / contact form. Paddle and Creem **NOT SENT**.

Production billing remains **NO-GO**.

## Purpose

Operator checklist for manual provider preflight outreach via official channels only.

## Before Sending

- [ ] Confirm FastSpring remains **DECLINED** — do not return to FastSpring without explicit reopen
- [ ] Confirm story-first paid launch packaging per `docs/D3M_PAID_LAUNCH_RISK_REDUCTION_DECISION.md`
- [ ] Read provider-specific draft email
- [ ] Confirm official contact channel (support email, contact form, or documented preflight path only)
- [ ] Confirm no sensitive IDs or documents will be attached

## Provider List

- [x] PayPro Global — **SENT 2026-07-11** — Talk to Sales / contact form — see `docs/D3M_PROVIDER_PREFLIGHT_SENT_RECORD.md`
- [ ] Paddle — draft: `docs/D3M_PADDLE_PREFLIGHT_EMAIL_DRAFT.md`
- [ ] Creem — draft: `docs/D3M_CREEM_PREFLIGHT_EMAIL_DRAFT.md`

## Send Rules

- [ ] Use official provider contact channel only.
- [ ] Send preflight message before account/dashboard setup.
- [ ] Confirm no sensitive IDs or documents are attached.
- [ ] Confirm no dashboard URLs or screenshots are included.
- [ ] Confirm the message says category preflight, not full onboarding.
- [ ] Confirm product is described as story-first.
- [ ] Confirm no standalone open-ended image generator is claimed for paid launch.
- [ ] Confirm no provider-specific capabilities are assumed.
- [ ] Record sent date/channel only after manual send.

## Sensitive Data Rules

Do not include in preflight email:

- Tax IDs, passport/national ID numbers
- Bank or payout details
- Private provider account IDs
- Checkout URLs, order IDs, screenshots
- API keys or webhook secrets

## After Sending

- [ ] Update `docs/D3M_PROVIDER_PREFLIGHT_TRACKING_LOG.md`
- [ ] Run `D3M-Payments-Provider-Preflight-Sent-Record` docs-only phase
- [ ] Do not open dashboard or start onboarding until category response is classified
- [ ] If **ACCEPTABLE** or **CONDITIONAL**, pick one provider only — do not onboard all three in parallel

## Next

PayPro sent — `docs/D3M_PROVIDER_PREFLIGHT_SENT_RECORD.md`. Await response: `D3M-Payments-PayPro-Preflight-Response-Record`

If PayPro pushes call before category answer: `docs/D3M_PAYPRO_GLOBAL_FIRST_REPLY_HANDLING_DRAFT.md`
