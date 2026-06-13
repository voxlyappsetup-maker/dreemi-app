# D3M FastSpring Checkout Currency Decision

## Status

**PENDING** — docs-only decision framing. No dashboard override was saved. No checkout retry in this phase.

Production billing remains **NO-GO**.

Parent record: `docs/D3M_FASTSPRING_TEST_ORDER_FOLLOWUP.md`

## Purpose

Frame whether localized checkout currency (e.g. SAR from Saudi Arabia) can count as valid FastSpring test evidence when the catalog base price is USD 4.99, or whether checkout must show USD for activation review.

## Observed Behavior

- Catalog: `dreemi-individual-monthly` at **USD 4.99** (confirmed in dashboard setup record)
- Checkout from Saudi Arabia in test mode displayed **SAR 22.99**
- FastSpring Languages and Currencies: **Default Country: Automatically Detected**; override languages/currencies **not enabled**
- Current test evidence policy (`docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md`) expects USD amount matching catalog

## Decision Options

| Option | Summary | When to use |
| --- | --- | --- |
| **Accept localized display** | PASS test evidence if product path, interval, and localized converted price are correct and FastSpring confirms localization is expected | FastSpring confirms MoR/localization is normal for review |
| **Require USD at checkout** | Test must show USD 4.99 before PASS | FastSpring or internal policy requires USD for activation evidence |
| **Defer until support answer** | Keep BLOCKED; ask Louis/FastSpring first | **Current recommended state** |

## Recommended Position

**Defer decision until FastSpring guidance.** Do not retry test checkout until either:

1. FastSpring confirms localized SAR is acceptable test evidence for a USD catalog item, with clear rules for verifying converted price and Monthly interval, **or**
2. The team approves a separate **dashboard currency override phase** to force USD for the activation test only.

If localized currency is later accepted, update `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` in a dedicated docs phase to document allowed localized evidence rules.

## Next

- `D3M-Payments-FastSpring-Test-Mode-Support-Question` — clarify localization + test-mode payment
- `D3M-Payments-FastSpring-Checkout-Currency-Override-Decision` — if USD display is required and support confirms override approach
