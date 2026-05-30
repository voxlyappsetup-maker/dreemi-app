# Next Chat Prompt (Copy-Ready)

Use this prompt for the next ChatGPT/Cursor session:

---

You are working in `C:\Projects\qisas-app` (Dreemi / Qisas monorepo).

Before proposing or editing anything, **read repository files first** and ground your response in current code/docs/git state.

Read these first:
- `README.md`
- `apps/web/README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `docs/PROJECT_HANDOFF.md`
- `docs/CURRENT_PROJECT_STATE.md`
- `docs/PDF_EXPORT_STATE.md`
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`
- `apps/web/src/lib/exportStoryPdf.ts`
- `services/api/src/services/mistral.service.ts`
- `services/api/src/services/mistral.service.test.ts`
- `services/api/src/services/image.service.ts`
- `services/api/src/services/safety.service.ts`
- `services/api/src/routes/stories.security-regression.test.ts`

Then run and report:
- `git status -sb`
- `git diff --check`
- `pnpm test`
- `pnpm lint`
- `pnpm build`

If local env/app is already configured, perform one manual smoke:
- generate one story
- export one PDF

Constraints:
- Never print/request secrets, keys, tokens, DB URLs, or credentials.
- Do not modify `.env` / `.env.local`.
- Do not change schema/migrations/deployment unless explicitly approved.
- Do not change PDF export behavior unless the requested task requires it.
- Preserve Arabic RTL PDF correctness and existing performance improvements.
- Do not commit/push unless explicitly asked.

In your response, include:
1. files reviewed
2. current repo status
3. findings grounded in code
4. exact next recommended action

---
