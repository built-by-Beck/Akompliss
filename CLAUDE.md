# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repo currently contains **only planning documentation** — no code, no `package.json`, no build tooling yet. The two source-of-truth documents are:

- `README.md` — product vision for **aKom-Pliss**, a mobile-first AI everyday assistant with a personality system (Casual / Savage / Argumentative / Roast Me / One-Upper), local-first voice, long-term memory, and tools.
- `aKom-Pliss — Master Build Plan.md` — the authoritative roadmap: Phase 0 through Phase 23, technology decisions, repo layout, and the PBRD workflow. **Read this before starting any implementation work.**

When code is added, update this file with the real build/lint/test commands.

## Development workflow: PBRD

Every phase follows **Plan → Build → Review/Test → Document**, and no phase skips a step. Key rules from the Master Build Plan:

- Work **only on the active phase**. Do not start a future phase because it is convenient, and do not add speculative abstractions the active phase does not require.
- Before touching code, read the persistent state files (these will be created in Phase 0): `PROJECT_RULES.md`, `plan.md`, `agent-info.md`, `BUILD_STATUS.md`, `BUILD_PLAN.md`, `lessons_learned.md`, `error_log.jsonl`.
- Run tests before declaring work done. Never hide broken tests, and never swap a failing implementation for a mock/fake and call the phase complete (unless the phase explicitly asks for a mock).
- On phase completion: update `BUILD_STATUS.md` and `agent-info.md`, add to `lessons_learned.md` if relevant, log unresolved failures in `error_log.jsonl`, mark the phase COMPLETE, and stop. The next phase starts in a fresh context.
- A phase that grows too large is split (`Phase 5A`, `5B`, ...) rather than worked across unrelated systems.
- `plan.md` uses the "Cursor Phase Execution Template" near the end of the Master Build Plan.

## Architecture principles (these outlive individual implementation choices)

- **Provider independence.** LLM, STT, TTS, agent runtime, memory, and realtime transport are all swappable behind interfaces: `LLMProvider`, `STTProvider`, `TTSProvider`, `AssistantRuntime`, `MemoryProvider`, `RealtimeProvider`. The app talks to these interfaces, never to a concrete implementation. Concrete adapters (e.g. `LlamaCppProvider`, `OpenClawAdapter`, `ElevenLabsProvider`) are the only place vendor-specific types are allowed.
- **OpenClaw stays behind `AssistantRuntime`.** OpenClaw-specific types must never leak into the mobile app or the conversation engine. It must be replaceable without rewriting the conversation engine.
- **Free path first.** The core assistant must work without per-message third-party AI charges: local/self-hosted STT (Silero VAD + faster-whisper via Speaches), local LLM (llama.cpp serving a GGUF model over its OpenAI-compatible API), and system or Kokoro TTS. ElevenLabs is an optional premium enhancement, never a dependency for normal conversation.
- **Personality is separate from capability.** A personality package controls *how the assistant talks* (prompt, examples, temperature, sarcasm/profanity/argument/roleplay levels, preferred voice/model). It must **never** control authentication, authorization, tool permissions, or confirmation requirements. "That's a dumbass idea, but here's the weather" is fine; a personality that can bypass a high-risk tool confirmation is not.
- **Tools are safer than prompts.** The LLM is treated as untrusted input when it tries to use a tool — deliberately so, since the project experiments with less-restricted models. Tool access is gated by permission classes (LOW = auto, MEDIUM = configurable confirmation, HIGH = confirmation required: send message, delete file, run shell, modify external data, purchase).
- **STT/TTS must not sanitize profanity.** The speech pipeline preserves normal adult language.
- **Build vertically.** Get `voice → brain → voice` working (Phases 0–6) before Firebase, payments, premium voices, or elaborate UI.
- **Measure before optimizing**, and **document every major architectural decision** as an ADR under `docs/decisions/`.
- Avoid premature complexity (Qdrant, Mem0, multi-model routing, Kubernetes, fine-tuning, wake words, multi-agent) until the existing system proves it needs it.

## Planned structure and stack (from the Master Build Plan)

pnpm monorepo (`pnpm` unless a technical blocker forces otherwise):

- `apps/mobile/` — Expo + React Native + TypeScript (Android and iPhone first; test both from the start).
- `services/api/` — lightweight TypeScript server (Fastify or equivalent). Exposes the aKom-Pliss interface to the mobile app.
- `services/assistant/` — conversation engine + `AssistantRuntime` / `OpenClawAdapter`.
- `services/speech/` — Speaches config for faster-whisper / Kokoro.
- `packages/contracts/` — shared types / provider interfaces.
- `packages/personalities/` — one directory per personality (`casual/`, `savage/`, ...), each with `prompt.md`, `examples.json`, `config.json`. Personalities are config packages, not code.
- `packages/providers/`, `packages/shared/`.
- `infrastructure/` — `docker/`, `llama/`, `speaches/`, `livekit/` (LiveKit only if it demonstrably simplifies the realtime layer).
- `firebase/` — `firestore.rules`, `indexes.json`, `functions/`. Firebase is the product/account database only (auth, profiles, settings, subscription state, entitlements, tool-permission settings) — never the AI brain. User data must be isolated per account.
- `tests/integration/`, `tests/e2e/`, `tests/model-benchmark/` (the permanent 75–100 prompt LLM benchmark suite from Phase 1).
- `docs/architecture/`, `docs/decisions/`, `docs/testing/`.

Large AI assets (GGUF models, Whisper/Kokoro weights, datasets, checkpoints) live in **Hugging Face Storage Buckets**, not in git — not in the transactional database either.

### Planned Phase 0 verification commands (not yet implemented)

Per the Master Build Plan, Phase 0 must make these all succeed: `pnpm install`, `pnpm lint`, `pnpm test`, `pnpm build`. Update this section with real commands (including how to run a single test) once the tooling exists.

## Model plan

Local runtime is **llama.cpp** serving GGUF over its OpenAI-compatible API — the app never opens a GGUF file directly. Phase 1 benchmarks candidates (Qwen3.5-4B Abliterated for dev, Qwen3.5-9B Abliterated as production candidate, Rocinante-X-12B Heretic Uncensored as a roleplay candidate) against the permanent prompt suite and picks one `PRIMARY_MODEL` on evidence. No dynamic model routing unless the benchmark justifies it.

## Git / attribution

Remote: `git@github.com:built-by-Beck/Akompliss.git` (branch `main`). SSH auth is configured and working. Local git identity is set on this repo (`built-by-Beck <davidbeck.aka.db@gmail.com>`).
