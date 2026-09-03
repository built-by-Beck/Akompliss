# packages/contracts

Shared TypeScript types and provider interfaces: `LLMProvider`, `STTProvider`,
`TTSProvider`, `AssistantRuntime`, `MemoryProvider`, `RealtimeProvider`.

**Placeholder until Phase 2.** Not created in Phase 0 — the "no speculative abstractions"
rule means an interface is added only when the active phase needs it. Vendor-specific types
never belong here; they live in the concrete adapter package.
