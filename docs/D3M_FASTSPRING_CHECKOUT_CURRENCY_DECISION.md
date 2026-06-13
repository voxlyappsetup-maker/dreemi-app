# D3M FastSpring Checkout Currency Decision

## Status

**PENDING** — docs-only decision framing. No dashboard override was saved.

**Update:** Retry execution **PASS** with localized SAR display (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`). Localized currency accepted for test evidence; catalog base remains USD 4.99.

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

| Option | Summary | When to use | Status |
| --- | --- | --- | --- |
| **Accept localized display** | PASS test evidence if product path, interval, and localized price are correct | MoR localization expected for Saudi visitors | **Accepted for retry PASS** |
| **Require USD at checkout** | Test must show USD 4.99 before PASS | Activation review requires USD display | Not required for current retry |
| **Defer until support answer** | Keep BLOCKED; ask Louis/FastSpring first | Before retry | **Superseded by successful retry** |

## Recommended Position

Localized SAR at checkout is **accepted for test evidence** when product path (`dreemi-individual-monthly`) and Monthly interval are correct, per retry **PASS** (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`). Catalog base price remains **USD 4.99**.

Optional: update `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` in a dedicated docs phase to codify localized currency evidence rules.

## Next

- `D3M-Payments-FastSpring-Activation-Request-Email` — after test PASS
- Optional support question if FastSpring written confirmation of localization is desired (`docs/D3M_FASTSPRING_TEST_MODE_SUPPORT_QUESTION.md`)
