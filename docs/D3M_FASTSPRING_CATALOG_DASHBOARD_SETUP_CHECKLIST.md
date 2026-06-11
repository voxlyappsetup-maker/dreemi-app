# D3M FastSpring Catalog Dashboard Setup Checklist

## Status

**Checklist only — no dashboard actions in catalog plan phase.**

Use in **`D3M-Payments-FastSpring-Catalog-Dashboard-Setup`** after approving `docs/D3M_FASTSPRING_CATALOG_PLAN.md`.

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

## Products To Create Later

| Proposed ID | Public name | Interval | Price (USD) | Internal plan |
| --- | --- | --- | --- | --- |
| `dreemi-individual-monthly` | Individual | Monthly | 4.99 | INDIVIDUAL |
| `dreemi-individual-yearly` | Individual | Yearly | 47.90 | INDIVIDUAL |
| `dreemi-family-monthly` | Family | Monthly | 9.99 | FAMILY |
| `dreemi-family-yearly` | Family | Yearly | 95.90 | FAMILY |

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

- [ ] Product IDs confirmed match proposed IDs (or document any FastSpring-assigned variance)
- [ ] Prices entered correctly
- [ ] Product names match website intent
- [ ] Store still in Test/trial mode
- [ ] Live still disabled

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
