# lessons_learned.md

Reusable conclusions, not individual errors (those go in `error_log.jsonl`). Append-only.
Scan the headings; read a full entry only if it touches your current work.

---

## Keep PBRD state files short

Read `agent-info.md` + `plan.md` first; pull anything else on demand. Do not re-read the
Master Build Plan in full each turn — read only the active phase's section. Trim state
files when you update them.

## Never start llama.cpp with production context size during basic local tests

Large context + a large model exhausts RAM and blocks other components (e.g. STT). Use a
small model and modest context while iterating.

## Keep TTS provider logic outside ConversationEngine

`ConversationEngine` coordinates providers; it must not contain provider implementation
details.

## OpenClaw-specific types must not leak into the mobile API

Everything crosses the `AssistantRuntime` boundary. If a mobile type imports an OpenClaw
type, the abstraction is broken.

## Personality prompts must not control tool permissions

Permission classes (LOW / MEDIUM / HIGH) gate tool execution independently of which
personality is active. A foul-mouthed model still cannot bypass a HIGH-risk confirmation.

## Test both iOS and Android whenever mobile audio code changes

Do not develop Android for weeks and assume iOS audio sessions will behave the same.
