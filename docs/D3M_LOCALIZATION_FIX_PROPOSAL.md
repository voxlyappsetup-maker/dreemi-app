# D3M Localization Fix Proposal

## 1. Purpose and boundary

- This is a documentation-only proposal/test-plan phase.
- No code changes.
- No runtime changes.
- No test changes.
- No i18n file changes.
- No backend error message changes.
- No D3K rollback.
- No third runtime wiring surface by default.

## 2. Source finding

- Source docs:
  - `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`
  - `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- Finding: English UI shows Arabic limit message.
- Classification: `WARN / Localization issue`.

## 3. Observed behavior

- FREE at/over monthly limit appears to block generation correctly.
- The message language is wrong when English UI is active.
- Functional entitlement behavior appears intact.
- This is treated as a display/localization issue, not an access-control failure.

## 4. Likely cause hypothesis

- Cautious hypothesis from current source inspection:
  - Backend returns stable code `STORY_LIMIT_REACHED` plus a human-readable Arabic `error` string from `plans.middleware.ts`.
  - Frontend generate flow appears to surface `ApiError.message` directly.
  - Frontend API helper appears to set that message from backend `error` text.
- Therefore, the likely mismatch is:
  - UI is using backend human-readable text instead of mapping stable error code to locale-specific copy.
- This is a working hypothesis, not a final root-cause proof.

## 5. Preferred future fix direction

- Preserve backend stable response shape and code.
- Do not remove `STORY_LIMIT_REACHED`.
- Do not rely on backend human-readable text for final UI message.
- In the frontend generate flow, map `STORY_LIMIT_REACHED` to locale-specific copy.
- Add or verify message catalog entries for:
  - English
  - Arabic
  - French
- Keep fallback behavior safe for unknown errors.

Proposed strings (proposal only; do not edit i18n files in this phase):
- English: `You have reached your monthly story limit. Upgrade your plan to create more stories.`
- Arabic: `لقد وصلت إلى حد القصص الشهري. قم بترقية خطتك لإنشاء المزيد من القصص.`
- French: `Vous avez atteint votre limite mensuelle d'histoires. Mettez votre offre a niveau pour creer plus d'histoires.`

## 6. Affected surfaces for future fix

Future fix candidates (not current edits):
- `apps/web/src/app/[locale]/generate/page.tsx`
- `apps/web/src/lib/api.ts`
- Locale message catalogs:
  - `apps/web/messages/en.json`
  - `apps/web/messages/ar.json`
  - `apps/web/messages/fr.json`
  - or actual message paths if refactored
- Tests/static guardrails if existing test framework covers localized error display
- Supporting docs updates only if needed

## 7. Test plan for future fix

Static/source checks:
- Ensure `STORY_LIMIT_REACHED` remains in backend response contract.
- Ensure frontend maps `STORY_LIMIT_REACHED` to localized UI copy.
- Ensure backend Arabic human-readable text is not directly surfaced in English UI for this code path.
- Ensure AR/EN/FR message catalogs contain the needed key(s).
- Ensure no payment/checkout/webhook/provider/schema files are touched.

Manual smoke checks:
- English UI + FREE at/over limit shows English copy.
- Arabic UI + FREE at/over limit shows Arabic copy.
- French UI + FREE at/over limit shows French copy.
- FREE below limit still generates successfully.
- Non-limit generation errors still show safe fallback.
- No D3K access-control behavior changes.

Automated validation (future implementation phase only):
- `git diff --check`
- mojibake scan for touched docs/messages
- secret scan
- `pnpm.cmd --filter @dreemi/api test`
- `pnpm.cmd test`
- `pnpm.cmd lint`
- `pnpm.cmd build`

## 8. Guardrails

- Do not change child-limit behavior.
- Do not change story monthly limit value.
- Do not change `FREE_MONTHLY_LIMIT = 3`.
- Do not change payment behavior.
- Do not change checkout/webhook behavior.
- Do not change provider config.
- Do not change schema/migrations.
- Do not change image generation behavior.
- Do not wire new entitlement surfaces.
- Do not remove stable backend error codes.

## 9. Rollback plan for future implementation

If a future localization fix causes regression:
- Revert only the localization fix commit.
- Do not revert D3K.
- Do not touch D3G.
- Do not touch payments or image generation.
- Re-run full validation.

## 10. Recommended next phase

- Recommended: `D3M-Triage-A1` - implement localization fix for `STORY_LIMIT_REACHED` display.
- Alternative: proceed to `D3M-Triage-B` payment config/readiness clarification.
- No third runtime wiring surface should proceed by default.

## 11. D3M-Triage-A1 implementation status update

- D3M-Triage-A1 frontend localization mapping is now implemented.
- Implementation keeps backend response contract unchanged, including `code: "STORY_LIMIT_REACHED"`.
- D3K and D3G runtime wiring surfaces remain unchanged.
- No backend, payment/provider, schema/migration, or image-generation files were changed in this phase.
- Manual smoke verification is still required for EN/AR/FR limit-message display.
