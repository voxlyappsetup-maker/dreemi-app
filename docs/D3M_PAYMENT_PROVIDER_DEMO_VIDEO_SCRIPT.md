# D3M Payment Provider Demo Video Script

## Status

Practical 2–4 minute demo outline for Lemon Squeezy KYB review.
Use fictional data only. Upload to `[Demo video link]` after recording.
Do not record or send this phase from Cursor—user records manually.

## Goal

Show Dreemi's product, multilingual support, child-safe positioning, and honest payment-unavailable state without checkout, secrets, or real child data.

## Recording Rules

- Screen recording + optional voiceover in English.
- Use fictional names only (e.g., "Demo Child", "Test Story").
- Show pricing as **Unavailable** if provider approval is still pending.
- State clearly that **payments are not live yet** pending provider approval.
- Prefer public or local demo URL—never show `.env` or internal config.

## What Not To Show

- `.env`, API keys, webhook secrets, database URLs
- Lemon Squeezy or other provider dashboards
- Tokens, cookies, request headers, raw logs
- Real child names, photos, or customer data
- Live checkout or test purchase
- Provider API responses

## Suggested Length

**2–4 minutes** total.

## Shot List

| # | Scene | ~Duration | Action |
| --- | --- | --- | --- |
| 1 | Landing/home | 20s | Open `[Website/app URL]` or `/en` — branding, navigation |
| 2 | Languages | 25s | Show `/ar` (RTL) and `/fr` — localized UI |
| 3 | Pricing | 30s | `/en/pricing` — plan names; **Unavailable** labels; payments not live |
| 4 | Generate UI | 35s | `/en/generate` — form only; **do not** submit generation unless safe fixture exists |
| 5 | Example story/PDF | 35s | Safe fictional story/PDF **only if already available**; else skip with voiceover |
| 6 | Safety | 20s | Brief safety posture; blocked-prompt copy if safe fixture exists |
| 7 | Closing | 25s | Subscriptions, adult buyers, support `[Support email]`, site `[Website/app URL]` |

## Script

**Opening (15s):** "This is Dreemi—a multilingual app that helps parents and educators create personalized, child-appropriate bedtime stories in Arabic, English, and French."

**Product (30s):** "Customers buy digital subscription access, not physical goods. Planned tiers include Individual, Family, and School plans for different family or classroom needs."

**How it works (30s):** "Stories are created through our app using AI-assisted generation with automated safety checks on user input and generated output."

**Languages (20s):** "The app supports Arabic with RTL layout, plus English and French."

**Pricing (25s):** "This pricing page shows our planned plans. Checkout is temporarily unavailable while provider approval is pending—payments are not live in this demo."

**Safety (20s):** "Dreemi is designed for child-safe storytelling. We block unsafe prompts and do not offer adult content, gambling, or a user marketplace."

**Closing (20s):** "Purchases are made by adults—parents, guardians, or schools—not children. Thank you for reviewing Dreemi. Support: [Support email]. Website: [Website/app URL]."

## Evidence Checklist

- [ ] Length 2–4 minutes
- [ ] Fictional data only
- [ ] No secrets on screen
- [ ] Pricing unavailable state shown honestly
- [ ] No checkout performed
- [ ] Uploaded to `[Demo video link]`

## Before Upload Checklist

- [ ] Re-watch full video for accidental secret/PII frames
- [ ] Confirm `[Demo video link]` is accessible to reviewer
- [ ] Paste link into `docs/D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md` before sending email
- [ ] Complete `docs/D3M_PAYMENT_PROVIDER_SEND_CHECKLIST.md` final review
