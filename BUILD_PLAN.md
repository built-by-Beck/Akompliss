# BUILD_PLAN.md

`aKom-Pliss — Master Build Plan.md` is the authority for phase detail. This file is the
quick index + status. Read the master doc's section for a phase only when that phase is
active.

## Phases

| # | Name | Status |
|---|---|---|
| 0 | Repository and Agent Foundation | ACTIVE |
| 1 | Local Model Benchmark | TODO |
| 2 | LLM Runtime Service (llama.cpp + local text API) | TODO |
| 3 | Personality Engine | TODO |
| 4 | Speech-to-Text Foundation | TODO |
| 5 | Text-to-Speech Foundation | TODO |
| 6 | Full Local Voice Loop (+ barge-in) | TODO |
| 7 | OpenClaw Integration Layer | TODO |
| 8 | Memory System (profile / project / temporary) | TODO |
| 9 | Tool Permission System | TODO |
| 10 | Everyday Assistant Functions (reminders/tasks/calendar/weather/search/notes) | TODO |
| 11 | Firebase Accounts and Product Data | TODO |
| 12 | Expo / React Native Mobile App | TODO |
| 13 | Hands-Free Conversation | TODO |
| 14 | Premium ElevenLabs Voices | TODO |
| 15 | Voice Pack Economics and Payments | TODO |
| 16 | Hugging Face AI Storage | TODO |
| 17 | Security and Privacy Hardening | TODO |
| 18 | Licensing Review | TODO |
| 19 | Performance and Reliability | TODO |
| 20 | Deployment Architecture | TODO |
| 21 | Closed Beta | TODO |
| 22 | Model Improvement / Fine-Tuning | TODO |
| 23 | Public v1 Release | TODO |

Status values: `TODO` / `ACTIVE` / `DONE`.

## Milestones

- **Brain** (Phases 0–3): text → aKom-Pliss → local personality-aware LLM → text.
- **Voice** (Phases 4–6): voice → STT → aKom-Pliss → TTS → voice, interruptible.
- **Assistant** (Phases 7–10): conversation + memory + tools + reminders.
- **Product** (Phases 11–13): Firebase accounts, Android + iPhone, hands-free voice.
- **Business** (Phases 14–16): premium voices, payments, usage tracking, AI storage.
- **Production** (Phases 17–23): security, licensing, performance, deployment, beta, release.

## Repo layout target

`apps/mobile` · `services/{api,assistant,speech}` ·
`packages/{contracts,personalities,providers,shared}` ·
`infrastructure/{docker,llama,speaches,livekit}` · `firebase` · `scripts` ·
`tests/{integration,e2e,model-benchmark}` · `docs/{architecture,decisions,testing}`.
