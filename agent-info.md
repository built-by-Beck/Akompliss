# agent-info.md

Read this first, every session. Then read `plan.md`. Everything else on demand
(see the token-conscious reading protocol in `PROJECT_RULES.md`).

Keep this file short. If it grows past ~150 lines, trim history into `docs/`.

## What we are building

aKom-Pliss: a mobile-first (Android + iPhone) AI everyday assistant with a personality
system (Casual / Savage / Argumentative / Roast Me / One-Upper), local-first voice, long-
term memory, and everyday tools. Free path avoids per-message third-party AI charges;
ElevenLabs is optional premium voice.

## Architecture in force

Provider-independent: `LLMProvider`, `STTProvider`, `TTSProvider`, `AssistantRuntime`,
`MemoryProvider`, `RealtimeProvider`. OpenClaw stays behind `AssistantRuntime`. Personality
controls tone only, never tool permissions. See `PROJECT_RULES.md` for the full principles.

## Current phase

Phase 0 COMPLETE. Phase 1 (Local Model Benchmark) not started — begin in a fresh session.

## What was just completed (Phase 0)

- pnpm/TypeScript monorepo: root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`
  + project references, `biome.json`, `vitest.workspace.ts`.
- Foundation files: `.env.example`, `docker-compose.yml` (only `api` active; llama.cpp /
  Speaches commented for later phases), `.nvmrc`, `.editorconfig`,
  `.github/workflows/ci.yml`.
- Directory skeleton across `apps/`, `services/`, `packages/`, `infrastructure/`,
  `firebase/`, `scripts/`, `tests/`, `docs/` with placeholder READMEs / `.gitkeep`.
- `services/api` (`@akom/api`): Fastify `buildServer()` + `GET /health`, `src/index.ts`
  entrypoint, `test/health.test.ts` (Vitest, passing), `Dockerfile`.
- README got a "Development setup" section. ADR 0001 records the stack choices.

## What works

- `pnpm install | lint | typecheck | test | build` all pass.
- `node services/api/dist/index.js` → `GET /health` returns
  `{"status":"ok","uptime":<n>,"version":"0.0.0"}`.
- `docker compose config` is valid.

## What does not work / not built

- Everything Phase 1+: model benchmark, llama.cpp integration + provider interfaces,
  personality packages, STT, TTS, conversation engine, OpenClaw, memory, tools, Firebase,
  Expo mobile app.
- `services/api/test/` files are not covered by `tsc -b` typecheck (outside `rootDir`).

## Decisions locked (change only via ADR + discussion)

- pnpm workspaces · TypeScript strict · Node >= 22.
- Biome (lint+format) · Vitest (tests) · Fastify (API).
- Mobile Expo app deferred to Phase 12 (`apps/mobile/` is a placeholder).
- LLM runtime: llama.cpp serving GGUF over its OpenAI-compatible API.
- pnpm build scripts are allow-listed in `pnpm-workspace.yaml` (`allowBuilds`) for
  `@biomejs/biome` and `esbuild`.

## Must NOT change without discussion

- Provider interface boundaries once defined.
- OpenClaw isolation behind `AssistantRuntime`.
- Personality / tool-permission separation.
- Free-path-first (no required paid AI for core conversation).

## What the next agent should do

Start **Phase 1 — Local Model Benchmark**. Read the "PHASE 1" section of
`aKom-Pliss — Master Build Plan.md`, rewrite `plan.md` from the Cursor Phase Execution
Template, build the permanent prompt suite under `tests/model-benchmark/`, run the
candidates, write `docs/model-benchmark.md`, and select `PRIMARY_MODEL`. Do not start
llama.cpp integration (Phase 2) or the mobile app.
