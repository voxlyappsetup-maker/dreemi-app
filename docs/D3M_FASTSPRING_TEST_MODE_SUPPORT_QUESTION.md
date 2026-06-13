# D3M FastSpring Test Mode Support Question

## Status

**DRAFT — NOT SENT** — prepared during test-order follow-up. No message sent. No FastSpring API or dashboard action.

Production billing remains **NO-GO**.

Parent record: `docs/D3M_FASTSPRING_TEST_ORDER_FOLLOWUP.md`

## Purpose

Provide a concise, safe draft message for Louis or FastSpring support about blocked test-mode checkout: SAR localization and "Not supported while in testing mode."

## Draft Message

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

## Do Not Include

When sending (future phase), do **not** include:

- Order ID, transaction ID, customer ID, subscription ID
- Checkout URL or session link
- Account IDs or private store identifiers
- Buyer email, billing address, or payment instrument details
- Screenshots with PII or secrets
- Webhook secrets or API credentials

## Next

**Phase:** `D3M-Payments-FastSpring-Test-Mode-Support-Question` — user reviews draft, sends manually, records non-sensitive response in a follow-up doc phase.

**After response:** Update currency decision and retry plan; only then schedule safe test-order retry.
