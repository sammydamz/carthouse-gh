## Agent skills

### Issue tracker

Issues live in the GitHub repo `sammydamz/ea-first-class-autos`. Use the `gh` CLI for all operations. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage label vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Workflow

Each `ready-for-agent` issue is implemented in its own branch:
- Branch name: `<issue-number>-<slug>` (e.g., `2-foundation`, `4-car-detail-page`)
- PR per issue → independent review → merge
- Keeps history clean, enables parallel work

### Dev commands

- **Dev server:** `pnpm run dev` from `apps/storefront` (port 7777)
- **Build:** `pnpm run build` from `apps/storefront`
- **Lint:** `pnpm run lint` from `apps/storefront`
- **DB seed:** `pnpm run db:seed` from `apps/storefront`
- **Package manager:** pnpm only (never npm)
- **Browser testing:** Playwright CLI from `apps/storefront` — e.g. `npx playwright test` or `npx @playwright/mcp@latest` for interactive. No test files exist yet; use ad-hoc CLI commands.
