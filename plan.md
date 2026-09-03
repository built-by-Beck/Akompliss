# Active Phase

Phase: 0 — Repository and Agent Foundation
Goal: A clean pnpm/TypeScript monorepo foundation before any AI functionality, plus the
PBRD state files, so a new session can understand the project by reading `agent-info.md`
and `plan.md`.

## Current State

- Git repo + remote `origin` (GitHub `built-by-Beck/Akompliss`), branch `main`.
- `CLAUDE.md` and the two planning docs committed.
- PBRD state files created.
- No package.json, no build tooling, no services yet.

## Required Reading

- This file and `agent-info.md`.
- `PROJECT_RULES.md` (once).
- `aKom-Pliss — Master Build Plan.md` → "PHASE 0" section and "Repository Structure".

## Plan

1. Root workspace: `package.json` (private, `packageManager: pnpm@11.25.0`, scripts),
   `pnpm-workspace.yaml`, `tsconfig.base.json` + `tsconfig.json`, `biome.json`,
   `vitest.workspace.ts`.
2. Foundation files: `.env.example`, `docker-compose.yml`, `.nvmrc`, `.editorconfig`,
   `.github/workflows/ci.yml`; extend `.gitignore`; append a "Development setup" section to
   `README.md`.
3. Directory skeleton with `.gitkeep` / short `README.md`: `apps/mobile`,
   `services/{api,assistant,speech}`, `packages/{contracts,personalities,providers,shared}`,
   `infrastructure/{docker,llama,speaches,livekit}`, `firebase`, `scripts`,
   `tests/{integration,e2e,model-benchmark}`, `docs/{architecture,decisions,testing}`.
4. `services/api`: `package.json` (`@akom/api`, fastify), `tsconfig.json`, `src/server.ts`
   (`buildServer()` + `GET /health`), `src/index.ts` (listen on env port), and
   `test/health.test.ts`.
5. Run the verification block. Fix until green.
6. Update `BUILD_STATUS.md`, `agent-info.md`, `BUILD_PLAN.md` (Phase 0 → DONE, Phase 1 →
   ACTIVE), and this file's PBRD status. Commit + push.

## Build

Files expected to change/create: root `package.json`, `pnpm-workspace.yaml`,
`tsconfig*.json`, `biome.json`, `vitest.workspace.ts`, `.env.example`,
`docker-compose.yml`, `.nvmrc`, `.editorconfig`, `.github/workflows/ci.yml`, `.gitignore`,
`README.md`, `services/api/**`, placeholder `README.md`/`.gitkeep` across the skeleton,
`docs/decisions/0001-initial-tech-stack.md`, and the state files.

## Tests

- `services/api/test/health.test.ts`: `buildServer()`, inject `GET /health`, expect 200 and
  body `{ status: 'ok', uptime: <number>, version: <string> }`.
- `pnpm test` runs Vitest across the workspace and passes.

## Risks

- pnpm not preinstalled — resolved by `npm i -g pnpm` into `~/.local` (already done).
- Biome/TS config drift between root and package — mitigate by having package tsconfigs
  extend `tsconfig.base.json`.
- ESM vs CJS friction with Fastify + Vitest — use `"type": "module"` + `NodeNext`.

## Exit Criteria

- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all succeed.
- `node services/api/dist/index.js` serves `GET /health` → `{"status":"ok",...}`.
- `docker compose config` is valid. No secrets committed; `.env` untracked.
- State files updated; a fresh session can orient from `agent-info.md` + `plan.md`.

## PBRD Status

Plan: COMPLETE
Build: IN PROGRESS
Review/Test: IN PROGRESS
Document: IN PROGRESS
