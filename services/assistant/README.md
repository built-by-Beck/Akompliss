# services/assistant

The conversation engine and `AssistantRuntime` (with `OpenClawAdapter` behind it).

**Placeholder until Phase 6–7.** `ConversationEngine` coordinates providers; it must not
contain provider implementation details. OpenClaw-specific types must not leak past
`AssistantRuntime`.
