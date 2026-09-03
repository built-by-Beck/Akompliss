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

Phase 0 — Repository and Agent Foundation. In progress.

## What was just completed

- Git repo initialized, remote `git@github.com:built-by-Beck/Akompliss.git`, branch `main`.
- `CLAUDE.md` added.
- PBRD state files created (this file, `PROJECT_RULES.md`, `BUILD_PLAN.md`,
  `BUILD_STATUS.md`, `lessons_learned.md`, `error_log.jsonl`, `plan.md`).

## Files changed most recently

`PROJECT_RULES.md`, `BUILD_PLAN.md`, `BUILD_STATUS.md`, `agent-info.md`,
`lessons_learned.md`, `error_log.jsonl`, `plan.md`, `docs/decisions/0001-initial-tech-stack.md`.

## What works

- Nothing runs yet. Docs and process only.

## What does not work / not built

- No package.json / build tooling / services yet (being added in Phase 0 Part B).
- Everything Phase 1+ (model benchmark, llama.cpp, personalities, STT, TTS, Firebase,
  mobile app).

## Decisions locked (change only via ADR + discussion)

- Package manager: pnpm workspaces. Language: TypeScript strict. Node >= 22.
- Lint + format: Biome. Tests: Vitest.
- API framework: Fastify.
- Mobile Expo app deferred to Phase 12 (`apps/mobile/` is a placeholder until then).
- LLM runtime: llama.cpp serving GGUF over its OpenAI-compatible API.

## Must NOT change without discussion

- Provider interface boundaries once defined.
- OpenClaw isolation behind `AssistantRuntime`.
- Personality / tool-permission separation.
- Free-path-first (no required paid AI for core conversation).

## What the next agent should do

Finish Phase 0 Part B (monorepo scaffold + health endpoint + tests), run the verification
block in `plan.md`, update the state files, commit, push. Then stop — Phase 1 is a fresh
session.
