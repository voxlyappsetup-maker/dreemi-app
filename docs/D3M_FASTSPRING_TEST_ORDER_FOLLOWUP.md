# D3M FastSpring Test Order Followup

## Status

This is a docs-only FastSpring test-order follow-up.

No checkout was opened.

No test order was retried.

No FastSpring dashboard change was saved.

No FastSpring API call was made.

No webhook was configured.

No provider credentials were added.

No env/secrets were read, printed, verified, or modified.

No tax/KYC/payout action was performed.

No Live activation was requested.

Production billing remains **NO-GO**.

## Purpose

Document why the prior Individual Monthly FastSpring test checkout was blocked, separate currency/localization findings from test-mode payment support, define decisions required before retry, and prepare a safe support question draft without retrying checkout or changing dashboard settings.

## Current Baseline

Latest stable commit: `2b2740d` Record FastSpring test order execution

Prior execution record: `docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md` (**BLOCKED**)

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| `docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md` | Yes | BLOCKED execution evidence |
| `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md` | Yes | Expected USD 4.99 / Monthly |
| `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` | Yes | Current policy expects catalog USD display |
| `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` | Yes | Catalog confirmed USD 4.99 |
| User safe observation (Languages and Currencies) | Yes | Auto-detect; overrides not enabled |

## Explicit Non-Goals

- No checkout retry
- No dashboard currency override save
- No FastSpring API or webhook work
- No runtime or entitlement changes
- No activation request send in this phase

## Previous Test Result

Previous Individual Monthly test checkout was **BLOCKED**.

Checkout reached: **Yes**.

Test order completed: **No**.

Expected display: **USD 4.99 / Monthly**.

Observed display: **SAR 22.99**.

Payment form displayed: **"Not supported while in testing mode."**

No runtime entitlement, webhook, API, or payment production change occurred.

## New Safe Observation

FastSpring Languages and Currencies settings showed **Default Country: Automatically Detected**.

**Override Store Languages** was not enabled.

**Override Store Currencies** was not enabled.

Settings text indicated these overrides are only needed when overriding default store settings.

The user inferred that FastSpring auto-detected the visitor country and displayed the local Saudi currency at checkout.

No screenshots were recorded or committed.

## Currency / Localization Interpretation

The **SAR 22.99** display is likely a checkout localization/currency conversion behavior caused by automatic country/currency detection. It does not necessarily prove the base FastSpring catalog price is wrong, because the catalog was previously confirmed as **USD 4.99** for `dreemi-individual-monthly`.

However, the current test evidence policy expected **USD 4.99**. Therefore, under the current test policy, the prior test remains **BLOCKED** until the team decides whether localized currency is acceptable test evidence or whether checkout should be forced/overridden to USD for the activation test.

See also: `docs/D3M_FASTSPRING_CHECKOUT_CURRENCY_DECISION.md`

## Test-Mode Payment Support Issue

The message **"Not supported while in testing mode"** is a **separate blocker** from the currency display.

Even if the currency issue is explained by localization, the test order cannot pass until FastSpring test-mode payment support is clarified.

See also: `docs/D3M_FASTSPRING_TEST_MODE_SUPPORT_QUESTION.md`

## Root Cause Separation

| Issue | Observed | Likely Cause | Impact | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| SAR 22.99 instead of USD 4.99 | Localized checkout amount/currency | Auto-detected visitor country/currency (Saudi Arabia → SAR) | Test evidence mismatch vs USD policy | **OPEN — explained, not resolved** | Currency decision + optional override phase |
| "Not supported while in testing mode" | Payment form blocked | Unclear test-mode payment method/country/currency support | Cannot complete test order | **OPEN** | Ask FastSpring/Louis; review official test guidance |
| Monthly interval not confirmed | User could not confirm Monthly at checkout | Localization display and/or incomplete checkout review | Test scope incomplete | **OPEN** | Re-verify on retry after blockers cleared |
| Test order not completed | Stopped before payment | Currency mismatch + test-mode payment message | Activation test evidence missing | **BLOCKED** | Do not retry until decisions made |

## Decision Needed Before Retry

- [ ] Decide whether localized currency display is acceptable for FastSpring test evidence.
- [ ] If exact USD evidence is required, decide whether to use checkout currency override in a later dashboard phase.
- [ ] Clarify whether FastSpring test-mode payment is supported for the current checkout/payment method/country/currency.
- [ ] Decide whether to ask Louis/FastSpring support before retrying.
- [ ] Do not retry test order until these decisions are made.

## Safe Next Options

| Option | Description | Pros | Risks | Decision Status |
| --- | --- | --- | --- | --- |
| **A** — Accept localized SAR if catalog remains USD | Treat SAR as expected localization when visitor is in Saudi Arabia | Matches MoR localization behavior; may reflect real buyer experience | Activation review may still want USD evidence; conversion must be verified | **PENDING** |
| **B** — Force/override checkout to USD | Later controlled dashboard phase: enable currency/country override for test | Matches current test plan USD 4.99 expectation | Dashboard change scope; must not affect Live without review | **PENDING** |
| **C** — Ask FastSpring/Louis | Send support question on localization + test-mode message | Official guidance before retry | Response timing unknown | **RECOMMENDED NEXT** |
| **D** — Retry with another official test method | Only after FastSpring guidance | May unblock test order | Premature retry without guidance wastes effort | **BLOCKED until C or B decision** |

## Recommended Position

**Recommended position:** Do not retry the test order yet. First ask FastSpring/Louis or review official dashboard guidance to clarify the test-mode payment support message and whether localized SAR checkout display is expected when the catalog is configured in USD. If FastSpring confirms localized display is expected, future evidence can accept localized currency only when the product path, converted price, and subscription interval are otherwise correct. If FastSpring requires USD display for review, use a controlled dashboard-currency override phase before retry.

## Support Question Draft

Draft only — **not sent** in this phase. Full copy also in `docs/D3M_FASTSPRING_TEST_MODE_SUPPORT_QUESTION.md`.

---

Hi Louis,

We created the initial Dreemi FastSpring test catalog and attempted a test-mode checkout for the Individual Monthly subscription.

The catalog item is configured as:

- dreemi-individual-monthly
- Dreemi Individual — Monthly
- USD 4.99
- Monthly subscription

When opening the checkout in TEST MODE from Saudi Arabia, the checkout displayed SAR 22.99 instead of USD 4.99, and the payment form showed: "Not supported while in testing mode."

Could you confirm:

1. Is the SAR display expected due to automatic country/currency localization even though the catalog price is USD?
2. Should we override the checkout country/currency to USD for the test order and activation review?
3. Why would the payment form show "Not supported while in testing mode" during a test checkout?
4. What is the recommended way to complete a valid FastSpring test order for this SaaS subscription before activation review?

No live payment was attempted.

Best regards,
Hayssam

---

No account IDs, checkout URLs, order IDs, screenshots, or private identifiers included.

## What Was Not Done

- No checkout retry
- No test order executed
- No dashboard currency setting saved
- No API/webhook configured
- No entitlement mapping implemented
- No tax/KYC submitted
- No User Agreement signed
- No payout activated
- No Live activation requested

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Checkout currency/localization decision pending | Test evidence | High | **OPEN** | Team or FastSpring guidance on acceptable evidence | Checkout currency override decision |
| Test-mode payment support unclear | Test checkout | **Critical** | **OPEN** | FastSpring answer on test-mode payment path | Test-mode support question |
| Actual test order not completed | Activation | **Critical** | **BLOCKED** | Safe test-mode PASS | Retry after guidance |
| Webhook integration not implemented | Runtime | Critical | **OPEN** | Webhook plan + implementation | Webhook integration plan |
| Entitlement runtime mapping not implemented | Runtime | Critical | **OPEN** | Product path → plan mapping | Future webhook phase |
| User Agreement not documented as signed | Business | High | **OPEN** | Signed record | Activation follow-up |
| Tax profile not documented as completed | Business | High | **OPEN** | Tax profile evidence | Activation follow-up |
| KYC readiness not documented | Business | High | **OPEN** | KYC evidence | Activation follow-up |
| Activation request not sent | Activation | High | **OPEN** | Post-requirements request | Activation request email |
| Payout not activated | Payout | High | **OPEN** | Post-Live payout | Post-approval phase |
| Production DB uptime decision pending | Infrastructure | Medium | **OPEN** | Infra decision doc | Infra decision phase |
| Production billing NO-GO | Launch | Critical | **BLOCKED** | All gates resolved | Multi-phase |

## Payment Readiness Impact

The follow-up clarifies that the blocked test order likely involves both currency localization and test-mode payment support. Production billing remains **NO-GO** until the test checkout blocker is resolved, a safe test order is completed, webhook/entitlement integration is planned and implemented, provider Live approval is complete, payout readiness is complete, business/tax/KYC readiness is handled, and infrastructure blockers are resolved.

## Launch Gate Impact

- Test-order follow-up gate: **PASS**
- FastSpring test checkout gate: **BLOCKED**
- Currency/localization decision gate: **OPEN**
- Test-mode payment support gate: **OPEN**
- Webhook gate: **BLOCKED**
- Entitlement runtime gate: **BLOCKED**
- Live billing gate: **BLOCKED**
- Payout gate: **BLOCKED**
- Production billing: **NO-GO**

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-Activation-Request-Email` — after retry **PASS** (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`)

**Alternative:** `D3M-Payments-FastSpring-Webhook-Integration-Plan`

## Notes For Next Chat

- First attempt **BLOCKED**; retry **PASS** — see `docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`
- SAR at checkout accepted as likely localization per follow-up analysis
- Production billing remains **NO-GO**
