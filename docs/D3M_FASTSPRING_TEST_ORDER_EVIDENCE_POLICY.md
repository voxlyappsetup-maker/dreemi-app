# D3M FastSpring Test Order Evidence Policy

## Status

**ACTIVE** — applies to future FastSpring test-mode checkout execution phases only. No test order has been executed under this policy yet.

## Purpose

Define what may and may not be recorded when documenting a FastSpring test-mode checkout. Prevents accidental commit of PII, payment data, or provider secrets.

## Allowed Evidence

| Category | Allowed content |
| --- | --- |
| Mode | Test/trial mode confirmed: Yes/No |
| Offering | Public FastSpring product path/name only (e.g. `dreemi-individual-monthly`, "Dreemi Individual — Monthly") |
| Price display | USD amount and interval as shown (e.g. 4.99, Monthly) — must match catalog |
| Flow milestones | Checkout reached: Yes/No; Test order completed: Yes/No |
| Result | High-level outcome: PASS / PARTIAL / BLOCKED |
| Block reason | Generic non-sensitive message (e.g. "Live mode prompt appeared — stopped") |
| Date | Execution date (YYYY-MM-DD) without timestamps tied to transactions |

## Forbidden Evidence

Do not record, paste, commit, or share:

- Order ID, transaction ID, subscription ID, customer ID
- Checkout session URL or any checkout link
- FastSpring private account identifiers
- Buyer email, name, billing address, phone
- Card number, CVV, payment method details
- Tax ID or identity document numbers
- IP address
- Raw receipt, invoice PDF, or raw webhook payload
- API keys, webhook secrets, tokens
- Screenshots containing personal, transaction, or account data (default: no screenshots)

## Redaction Rules

If a future phase explicitly approves screenshots:

- Scrub all names, emails, addresses, IDs, URLs, and payment fields before storage
- Do not commit screenshots to the repository unless a separate approved artifact phase exists
- Prefer written safe evidence over images

If an internal reference is ever required (not recommended for first test):

- Use redacted placeholders only (e.g. `[REDACTED-ORDER-ID]`)
- Require explicit approval in the execution phase charter

## Stop Conditions

Stop recording and stop the test if capturing allowed evidence would require copying forbidden data.
Stop if dashboard or checkout displays secrets or full transaction identifiers needed for "proof."
Stop if evidence policy cannot be satisfied without violating forbidden evidence rules.

## Notes

- This policy complements `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md` and `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md`.
- Production billing remains **NO-GO** regardless of test evidence quality.
- Dreemi runtime entitlements must not change based on manual test-order evidence alone.
