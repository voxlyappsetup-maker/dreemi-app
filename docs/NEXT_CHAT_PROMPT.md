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
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- `docs/DEPLOYMENT_PROVIDER_DECISION.md`
- `docs/PDF_EXPORT_STATE.md`
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`
- `vercel.json`
- `services/api/railway.json`
- `services/api/src/index.ts`
- `apps/web/src/lib/api.ts`
- `.env.example`
- `apps/web/src/lib/exportStoryPdf.ts`
- `services/api/src/services/mistral.service.ts`
- `services/api/src/services/mistral.service.test.ts`
- `services/api/src/services/image.service.ts`
- `services/api/src/services/safety.service.ts`
- `services/api/src/routes/stories.security-regression.test.ts`
- `services/api/src/routes/payments.ts`
- `services/api/src/services/lemonsqueezy.service.ts`
- `services/api/src/config/billing.ts`
- `services/api/src/config/billing.test.ts`
- `services/api/src/routes/payments.security-regression.test.ts`
- `services/api/src/middleware/plans.middleware.ts`
- `services/api/src/routes/children.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/components/LandingPricing.tsx`
- `apps/web/src/app/[locale]/children/page.tsx`

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
- Billing provider is Lemon Squeezy.
- Never print/request secrets, keys, tokens, DB URLs, or credentials.
- Do not ask for or print Lemon/Supabase/Render/Vercel/API secret values.
- Treat `.env.example` as safe to read, but never replace placeholders with real values.
- Do not modify `.env` / `.env.local`.
- Treat `.env` files as off-limits.
- Do not change schema/migrations/deployment unless explicitly approved.
- No migrations/deployment changes without explicit approval.
- Do not deploy or alter deployment config without explicit approval.
- Do not add, remove, rename, or modify deployment provider config without explicit approval.
- Treat Render vs Railway as unresolved unless a later commit/document states otherwise.
- Production env values must be handled outside chat.
- Frontend API URL guard is expected: `apps/web/src/lib/api.ts` must not use a production fallback URL and should require `NEXT_PUBLIC_API_URL` in production.
- Lemon production verification must not include secret values in chat/docs.
- Do not claim Lemon production verification passed unless manual evidence has been provided.
- Do not change PDF export behavior unless the requested task requires it.
- Preserve Arabic RTL PDF correctness and existing performance improvements.
- Do not commit/push unless explicitly asked.

In your response, include:
1. files reviewed
2. current repo status
3. findings grounded in code
4. exact next recommended action

---
