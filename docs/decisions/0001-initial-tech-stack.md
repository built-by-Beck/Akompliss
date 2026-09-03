# ADR 0001 — Initial tech stack

Date: 2026-09-03
Status: Accepted

## Context

Phase 0 needs a monorepo foundation. The Master Build Plan fixes some choices (Expo /
React Native mobile, TypeScript, Firebase, llama.cpp) and leaves others open ("Fastify or
equivalent", "linting", "test framework", package manager "pnpm unless a technical
blocker").

## Decision

- **Package manager:** pnpm workspaces. `packageManager` pinned in root `package.json`.
- **Language:** TypeScript, `strict`, `NodeNext` module resolution, Node >= 22.
- **Lint + format:** Biome — one fast tool, minimal config, good monorepo performance.
- **Test runner:** Vitest — native ESM/TS, Jest-compatible API, one config across the
  workspace.
- **API framework:** Fastify — lightweight, first-class TypeScript types, `app.inject()`
  for fast route tests.
- **Mobile app:** deferred to Phase 12. `apps/mobile/` is a placeholder until then; no Expo
  toolchain is added in Phase 0.

## Consequences

- Biome has a smaller plugin ecosystem than ESLint; if a React Native-specific lint need
  appears in Phase 12, revisit with a follow-up ADR.
- Contributors must have Corepack or a global pnpm; documented in `README.md`.
- Provider interfaces (`packages/contracts`) are **not** created in Phase 0 — that is
  Phase 2+ work, per the "no speculative abstractions" rule.
