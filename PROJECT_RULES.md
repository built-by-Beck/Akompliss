# PROJECT_RULES.md

The constitution for building aKom-Pliss. Keep this file tight. If it grows past ~150
lines, move detail into `docs/` and leave a pointer.

## PBRD workflow

Every phase runs **Plan → Build → Review/Test → Document**. No phase skips a stage.

- Work **only on the active phase** (see `BUILD_STATUS.md`). Do not start a future phase
  because it is convenient.
- No speculative abstractions. Add an interface/layer only when the active phase needs it.
- Reuse working code before writing new code.
- Run tests before calling work done. Never hide broken tests. Never swap a failing
  implementation for a mock and call the phase complete (unless the phase asks for a mock).
- Split an oversized phase into `5A / 5B / 5C` rather than working across unrelated systems.
- On phase completion: update `BUILD_STATUS.md`, `agent-info.md`, `BUILD_PLAN.md`; add to
  `lessons_learned.md` if there is a reusable lesson; log unresolved failures in
  `error_log.jsonl`; mark the phase done; stop. Next phase starts in a fresh session.

## Token-conscious reading protocol

The point of the state files is that a session orients from **two short files**, not from
re-reading a 2000-line plan every turn.

- **Always read first:** `agent-info.md`, then `plan.md`. Nothing else by default.
- `PROJECT_RULES.md`: read once per session if it is not already in context (it is
  summarized in `CLAUDE.md`).
- `aKom-Pliss — Master Build Plan.md`: read **only the active phase's section**, never the
  whole file.
- `lessons_learned.md`: scan headings; read a lesson in full only if it touches current
  work.
- `error_log.jsonl`: `tail` the recent lines or `grep` by `component`. Never cat the whole
  file.
- `BUILD_STATUS.md`: read for current state. `BUILD_PLAN.md`: read only at phase
  transitions.
- When you update a state file, trim it. Move superseded detail into `docs/`.

## Architecture principles (do not violate without an ADR)

- **Provider independence.** LLM, STT, TTS, agent runtime, memory, realtime transport all
  sit behind interfaces (`LLMProvider`, `STTProvider`, `TTSProvider`, `AssistantRuntime`,
  `MemoryProvider`, `RealtimeProvider`). Vendor types live only in the adapter.
- **OpenClaw stays behind `AssistantRuntime`.** No OpenClaw-specific types in the mobile
  app or the conversation engine.
- **Free path first.** Core assistant works with no per-message third-party AI charges:
  local STT (Silero VAD + faster-whisper via Speaches), local LLM (llama.cpp / GGUF over
  its OpenAI-compatible API), system or Kokoro TTS. ElevenLabs is optional premium only.
- **Personality ≠ capability.** A personality controls *how it talks*. It must never
  control auth, tool permissions, or confirmation requirements.
- **Tools safer than prompts.** The LLM is untrusted when it requests a tool. Permission
  classes gate execution: LOW = auto, MEDIUM = configurable confirm, HIGH = confirm
  required.
- **STT/TTS never sanitize profanity.**
- **Build vertically.** Get `voice → brain → voice` working (Phases 0–6) before Firebase,
  payments, premium voices, or elaborate UI.
- **Measure before optimizing.**
- Every major decision or replacement gets an ADR under `docs/decisions/`.

## Coding standards

- TypeScript `strict`. Node >= 22. pnpm workspaces.
- Biome for lint + format. Vitest for tests.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- Commit trailers: `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` and the
  `Claude-Session` line.

## Secrets

- Never in git, mobile bundle, logs, prompt files, or error reports.
- `.env` is git-ignored. `.env.example` is the only committed env file and holds
  placeholders only.

## error_log.jsonl format

One JSON object per line:
`{"date","phase","component","error","cause","resolution","status"}`
`status` is `resolved` or `open`.
