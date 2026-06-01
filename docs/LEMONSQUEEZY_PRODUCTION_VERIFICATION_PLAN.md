# Lemon Squeezy Production Verification Plan

## Status Update (Phase 4-D1B-2)

- Lemon Squeezy store application was rejected at this time.
- Reconsideration/clarification was also denied.
- This verification plan is paused unless Lemon explicitly approves the store in the future.
- Do not use this plan as an active production path.
- Do not treat Lemon Squeezy as approved for production.

## 1. Purpose

- This document is a manual production verification plan for Lemon Squeezy checkout, webhook delivery, and subscription entitlement behavior.
- It does not contain secret values.
- It does not prove production has been verified until each checklist item is manually completed and recorded elsewhere.

## 2. Non-goals

- No secrets in docs/chat.
- No deploy instructions that require exposing tokens.
- No schema migration.
- No renaming of legacy Stripe-named DB fields.
- No automated webhook integration test in this phase.

## 3. Required Production Variable Names

Names only (no values).

API/server:
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `MISTRAL_API_KEY`
- `NODE_ENV`

Frontend/Vercel:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`

Notes:
- Values must be configured in hosting provider dashboards, not docs/chat.
- `FRONTEND_URL` must be the final public frontend URL, without relying on localhost.
- `NEXT_PUBLIC_API_URL` must be the final public API URL.
- `ALLOWED_ORIGINS` must include the final frontend origin(s).

## 4. Lemon Dashboard Setup Checklist

Manual checklist:
- Confirm store is the intended production store.
- Confirm product/variant IDs match `services/api/src/config/billing.ts`.
- Confirm production webhook URL:
  - `https://<production-api-domain>/api/payments/webhook`
- Confirm webhook secret matches API production `LEMONSQUEEZY_WEBHOOK_SECRET`.
- Confirm the provider sends the expected signature header used by this code path: `x-signature`.
- Enable/verify events required by current code:
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_expired`
  - `subscription_payment_success`
- If additional subscription events are enabled later, verify their payload includes status and variant data before relying on them.

## 5. Checkout Verification Checklist

Manual steps:
- Deploy frontend and API first.
- Confirm API `/health` is reachable.
- Confirm frontend loads from final domain.
- Confirm Vercel has `NEXT_PUBLIC_API_URL`.
- Confirm API has `FRONTEND_URL`.
- Confirm API has `ALLOWED_ORIGINS`.
- Log in as a test user.
- Start checkout from pricing page.
- Verify checkout URL is created successfully.
- Verify unknown/invalid variants are rejected server-side with `UNKNOWN_CHECKOUT_VARIANT`.
- Verify production checkout never redirects to `localhost`.
- Complete test purchase using the provider's safe test/sandbox process if available.
- Verify redirect returns to:
  - `/dashboard?success=true`

## 6. Webhook Verification Checklist

Manual steps:
- Trigger a signed subscription event from Lemon.
- Confirm API accepts signed webhook.
- Confirm invalid signature returns 401.
- Confirm missing event_name returns 400.
- Confirm raw parser remains before `express.json()`.
- Confirm server logs do not print secrets.
- Confirm `subscription_payment_success` is acknowledged without plan update.
- Confirm subscription create/update changes effective `User.plan` according to status.
- Confirm cancelled/expired event returns effective `User.plan` to `FREE`.
- Confirm unknown variant ID is logged and does not update plan.

## 7. Database Verification Checklist

Do not include values.

Manual checks should verify:
- `User.plan` changes to effective entitlement.
- `Subscription.plan` stores catalog plan.
- `Subscription.status` stores mapped local status.
- `stripeSubscriptionId` stores the Lemon subscription ID for now.
- `stripePriceId` stores the Lemon variant ID for now.
- `stripeId` stores Lemon customer ID for now.
- Legacy Stripe-named fields are intentionally retained until a future migration.

## 8. Plan Enforcement Verification Checklist

Manual checks:
- FREE user can generate up to 3 stories/month.
- Paid entitled user can generate beyond free limit.
- Non-entitled/canceled user is treated as FREE.
- Child limits:
  - FREE: 1
  - INDIVIDUAL: 1
  - FAMILY: 4
  - SCHOOL: Infinity

## 9. Rollback / Pause Plan

Safe operational options:
- Disable or hide paid checkout UI if payment verification fails.
- Keep users on FREE entitlement if webhook verification is uncertain.
- Do not manually change DB entitlement without a recorded reason.
- Do not deploy payment changes and schema changes together.
- If webhook is failing, pause paid launch and keep production checklist open.

## 10. Evidence to Record After Manual Verification

Record evidence names only (no secrets):
- deployment commit SHA
- frontend production URL
- API production URL
- Lemon webhook configured yes/no
- event type tested
- test user identifier or safe internal note, not password
- observed plan transition
- observed subscription status
- test result date
- blocker list

## 11. Current Status

- Production Lemon verification is not yet completed by this document.
- This phase only documents the manual verification plan.
