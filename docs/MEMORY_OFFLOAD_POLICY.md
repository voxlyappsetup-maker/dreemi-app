# Memory Offload Policy

## Purpose

Project state must live in repository files, not assistant/chat memory.
This policy defines where and how to persist operational context between sessions.

## Canonical Docs

- `docs/PROJECT_HANDOFF.md` â€” high-level technical handoff and guardrails.
- `docs/CURRENT_PROJECT_STATE.md` â€” current focus and immediate operational state.
- `docs/PDF_EXPORT_STATE.md` â€” PDF-specific implementation and quality/perf state.
- `docs/NEXT_CHAT_PROMPT.md` â€” copy-ready bootstrap prompt for next session.
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md` â€” manual PDF validation contract.

## Required Session Startup

Every new assistant/session should:

1. Read README/config + all docs above.
2. Read critical implementation files relevant to current task.
3. Run:
   - `git status -sb`
   - `git diff --check`
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build`
4. If local app/env is already configured, run one manual smoke (generation + PDF export).

## Update Rules

When significant work is completed:

- Update relevant docs in `docs/` with factual, code-backed state.
- Use concrete file paths and commands.
- Record what is stable, what is pending, and safe next actions.
- Keep notes concise and deterministic; avoid speculative statements.

## Security and Compliance Rules

- Never log/print/request secrets or credentials.
- Never persist secret values into docs.
- Never alter `.env`, schema/migrations, or deployment settings unless explicitly approved.
- Never claim manual validation happened unless actually performed.

## PR/Change Hygiene

- Do not auto-commit.
- Keep docs and code changes scoped to the requested task.
- Run validation commands and report pass/fail with exact command names.
