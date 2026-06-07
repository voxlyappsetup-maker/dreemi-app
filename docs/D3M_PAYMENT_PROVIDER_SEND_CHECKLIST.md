# D3M Payment Provider Send Checklist

## Status

Pre-send checklist for Lemon Squeezy KYB response.
The email is **not sent** by this repository phase.
Production billing remains **NO-GO** until provider approval and live verification evidence exist.

## Required Before Sending

- [ ] All placeholders in `docs/D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md` replaced with real values
- [ ] Demo video recorded per `docs/D3M_PAYMENT_PROVIDER_DEMO_VIDEO_SCRIPT.md`
- [ ] `[Demo video link]` tested in a private/incognito browser
- [ ] Social profile URLs open and match founder identity
- [ ] Privacy and Terms URLs load publicly
- [ ] Support email inbox monitored
- [ ] Pricing/plan wording reviewed for accuracy (no invented prices in repo)
- [ ] Refund policy wording confirmed
- [ ] Generated-content licensing wording confirmed with Terms
- [ ] Second-person review: no secrets in email or attachments

## Placeholders To Replace

| Placeholder | Filled? | Value (keep out of git if sensitive) |
| --- | --- | --- |
| `[Demo video link]` | [ ] | |
| `[Founder social profile URL 1]` | [ ] | |
| `[Founder social profile URL 2]` | [ ] | |
| `[Optional professional profile URL]` | [ ] | |
| `[Founder legal name]` | [ ] | |
| `[Company/legal entity, if applicable]` | [ ] | |
| `[Country]` | [ ] | |
| `[Support email]` | [ ] | |
| `[Website/app URL]` | [ ] | |
| `[Individual plan price + billing interval]` | [ ] | |
| `[Family plan price + billing interval]` | [ ] | |
| `[School plan availability / planned-only]` | [ ] | |
| `[Privacy policy URL]` | [ ] | |
| `[Terms URL]` | [ ] | |
| `[Refund policy URL or wording]` | [ ] | |
| `[Generated-content licensing wording to confirm]` | [ ] | |

## Links To Prepare

- [ ] `[Demo video link]`
- [ ] `[Website/app URL]`
- [ ] `[Website/app URL]/en/pricing` (informational; unavailable state OK)
- [ ] `[Privacy policy URL]`
- [ ] `[Terms URL]`
- [ ] `[Founder social profile URL 1]`
- [ ] `[Founder social profile URL 2]`

## Files / Screenshots To Attach

Optional only if Lemon requests or email allows:

- [ ] Safe product screenshots (no PII, no secrets)
- [ ] Demo video link (preferred over large attachment)
- [ ] Company registration doc (if applicable—**do not commit to repo**)

## What Not To Attach

- [ ] Confirmed absent: API keys, webhook secrets, env files
- [ ] Confirmed absent: database URLs, JWTs, tokens, cookies
- [ ] Confirmed absent: provider dashboard screenshots with secrets
- [ ] Confirmed absent: raw logs, customer/child data
- [ ] Confirmed absent: claims that checkout is live

## Final Manual Review

- [ ] Email subject: `Additional details for Dreemi application review`
- [ ] Tone: professional, transparent, concise
- [ ] AI-assisted generation disclosed
- [ ] Subscription model clear (not physical goods / marketplace)
- [ ] Payment-not-live statement included
- [ ] No fake URLs or invented personal data

## Send Decision

| Decision | Check |
| --- | --- |
| Ready to send | [ ] All required placeholders filled + checklists complete |
| Defer | [ ] Missing demo video, social URLs, legal links, or pricing confirmation |
| Do not send | [ ] Any secret or unverified claim would be included |

## Post-Send Tracking

| Item | Owner | Status | Notes |
| --- | --- | --- | --- |
| Email sent date | User | PENDING | Record in provider thread only |
| Lemon reply received | User | PENDING | No secrets in docs |
| Approval outcome | User | PENDING | Do not mark gates PASS from reply alone |
| Post-approval checkout smoke | Team | BLOCKED | Separate phase |
| Post-approval webhook smoke | Team | BLOCKED | Separate phase |
| Production billing Go/No-Go | Team | NO-GO | Until gates close |

Recommended next phase after send: **`D3M-Payments-Provider-Send`** (track reply) or controlled post-approval verification phases.
