# D3M FastSpring Catalog Dashboard Setup Checklist

## Status

Setup record: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` — result **COMPLETE** (Individual/Family monthly/yearly in test/trial dashboard).

Store: **Testing / trial mode**. **Not Live.** Production billing **NO-GO**.

## Purpose

Safe manual checklist for creating planned catalog entries in FastSpring dashboard without secrets, Live mode, or premature checkout.

## Pre-Setup Safety Rules

- Do not copy bank/PayPal/tax/identity details into repo or chat.
- Do not commit screenshots.
- Do not create API keys or webhook secrets in this phase unless a later phase explicitly approves.
- Do not enable Live mode.
- Do not run test checkout unless dedicated test-mode phase approves.
- Record status/decisions only — no sensitive IDs unless user explicitly approves redacted summary.

## Products Created (Confirmed)

| Proposed ID | Public name | Interval | Price (USD) | Internal plan | Status |
| --- | --- | --- | --- | --- | --- |
| `dreemi-individual-monthly` | Dreemi Individual — Monthly | Monthly | 4.99 | INDIVIDUAL | Created |
| `dreemi-individual-yearly` | Dreemi Individual — Yearly | Yearly | 47.90 | INDIVIDUAL | Created |
| `dreemi-family-monthly` | Dreemi Family — Monthly | Monthly | 9.99 | FAMILY | Created |
| `dreemi-family-yearly` | Dreemi Family — Yearly | Yearly | 95.90 | FAMILY | Created |

## Products Not To Create Yet

| Proposed ID | Status |
| --- | --- |
| `dreemi-school` | **DEFERRED_DO_NOT_CREATE_YET** |

## Values To Enter

- Currency: **USD**
- Prices: exact values from catalog plan (4.99, 47.90, 9.99, 95.90)
- Product display names: **Individual**, **Family** (match public website)
- Subscription type: recurring per interval above

## Do Not Touch

- Live activation toggle
- Payout / bank / PayPal setup (separate phase)
- Tax profile submission (separate phase)
- User Agreement signing (separate phase)
- Webhook/API credential generation (integration phase)
- Test order (test-mode phase)

## Evidence To Capture

Record in docs only (no secrets):

- [x] Product IDs confirmed match proposed IDs
- [x] Prices entered correctly
- [x] Product names match plan
- [x] Store still in Test/trial mode
- [x] Live still disabled

## Stop Conditions

Stop and do not proceed if:

- Required to enter secrets into repo/chat
- Prompted to enable Live before checklist complete
- Product IDs cannot be set to planned values without breaking integration plan — escalate to catalog plan revision phase
- School product creation requested without explicit approval

## Next Phase

After dashboard setup (when approved):

- **`D3M-Payments-FastSpring-Website-Pricing-Alignment`** or
- **`D3M-Payments-FastSpring-Test-Order`** (dedicated test-mode phase) or
- Activation checklist continuation (tax/KYC/Live when ready)

Reference: `docs/D3M_FASTSPRING_CATALOG_PLAN.md`
