# D3M FastSpring Activation Request Send Checklist

## Status

**SENT 2026-06-13** — manual send recorded at `docs/D3M_FASTSPRING_ACTIVATION_REQUEST_SENT_RECORD.md`. Awaiting FastSpring response.

Parent package: `docs/D3M_FASTSPRING_ACTIVATION_REQUEST_EMAIL.md`

Production billing remains **NO-GO**.

## Purpose

Concise pre-send and post-send checklist for the user when manually sending the FastSpring activation/review email.

## Manual Send Checklist

- [ ] Verify recipient is Louis / official FastSpring contact or official support channel.
- [ ] Copy subject and body from `docs/D3M_FASTSPRING_ACTIVATION_REQUEST_EMAIL.md`.
- [ ] Confirm no order reference, order ID, transaction ID, customer ID, subscription ID, checkout URL, screenshot, tax ID, bank details, payout details, API keys, webhook secrets, or private account identifiers are included.
- [ ] Confirm website links open publicly: https://www.dreemi.app/
- [ ] Confirm Terms link: https://www.dreemi.app/en/terms
- [ ] Confirm Privacy link: https://www.dreemi.app/en/privacy
- [ ] Confirm Refund Policy link: https://www.dreemi.app/en/refund
- [ ] Confirm demo video is accessible: https://drive.google.com/file/d/1uNimZx4qD17pWrtSnYUMHSLqiRHFB2y-/view?usp=drive_link
- [ ] Confirm message does not claim Live billing is enabled.
- [ ] Confirm message does not claim webhook/entitlement runtime integration is complete.
- [ ] Confirm message does not claim tax/KYC/payout/User Agreement is fully complete unless true in dashboard.
- [ ] Send manually from user's email client.
- [ ] Do not paste FastSpring dashboard secrets or private account IDs into the email or repo.

## Do Not Include

Order reference, order ID, transaction ID, customer ID, subscription ID, checkout URL, invoice URL, receipt, screenshot, buyer email, billing address, card details, tax ID, bank details, payout details, API keys, webhook secrets, private FastSpring account identifiers.

## After Sending

Recorded in `docs/D3M_FASTSPRING_ACTIVATION_REQUEST_SENT_RECORD.md`:

- Sent date: **2026-06-13**
- Channel: **email** to Louis / FastSpring support
- Outcome: **sent** — awaiting response

Do **not** record full email thread, private headers, or sensitive attachments in the repo.

## Next

**Primary:** `D3M-Payments-FastSpring-Response-Record`

**Alternative:** `D3M-Payments-FastSpring-Webhook-Integration-Plan`
