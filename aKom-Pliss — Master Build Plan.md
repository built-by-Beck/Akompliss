# aKom-Pliss — Master Build Plan

## Project Goal

Build **aKom-Pliss**, a mobile-first AI everyday assistant with a strong personality system, natural voice conversations, long-term memory, useful tools, reminders/automation, and optional premium ElevenLabs voices.

The assistant must be capable of casual adult conversation and natural profanity without sounding like a generic customer-service chatbot.

The architecture must avoid unnecessary recurring AI API costs. Wherever practical, STT, LLM inference, memory, and free TTS should use local/self-hosted open-source components.

Premium ElevenLabs voices remain optional paid features.

---

# 1. Core Architecture

Initial target architecture:

```text
                     aKom-Pliss
                Expo / React Native
                       |
              Text + Microphone
                       |
                       v
              aKom-Pliss Backend
                       |
                AssistantService
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   Conversation     OpenClaw       User Data
      Engine        Adapter        Firebase
        |              |
        |         Tools / Skills
        |         Jobs / Memory
        |
        v
     llama.cpp
        |
        v
 Qwen3.5 Abliterated
        |
        v
   Response Text
        |
   +----+----------------+
   |                     |
   v                     v
FREE TTS             PREMIUM TTS
System/Kokoro        ElevenLabs


VOICE INPUT

Microphone
    |
    v
Silero VAD
    |
    v
faster-whisper
    |
    v
Transcribed Text
    |
    v
Conversation Engine


AI ASSETS

Hugging Face Storage Buckets
    |
    +-- GGUF models
    +-- STT models
    +-- TTS models
    +-- datasets
    +-- checkpoints
    +-- AI artifacts
```

OpenClaw must sit behind an aKom-Pliss abstraction layer.

The mobile application must **never become tightly coupled to OpenClaw**.

If OpenClaw is replaced later, the mobile app should not require major changes.

---

# 2. Initial Technology Decisions

These are the starting decisions unless testing proves one of them unsuitable.

| Component | Initial Choice |
|---|---|
| Mobile | Expo / React Native / TypeScript |
| App backend | TypeScript |
| API framework | Fastify or equivalent lightweight TS server |
| Authentication | Firebase Auth |
| App database | Firestore |
| Agent runtime | OpenClaw behind adapter |
| LLM runtime | llama.cpp |
| Development LLM | Qwen3.5 4B Abliterated GGUF |
| Production candidate | Qwen3.5 9B Abliterated GGUF |
| Roleplay candidate | Rocinante-X-12B Heretic Uncensored |
| VAD | Silero VAD |
| STT | faster-whisper through Speaches |
| Free TTS | Device/system voice initially |
| Enhanced free TTS | Kokoro through Speaches |
| Premium TTS | ElevenLabs |
| AI storage | Hugging Face Storage Buckets |
| Assistant memory | OpenClaw initially |
| Realtime voice | provider abstraction; evaluate LiveKit |
| Payments | Deferred until core assistant works |

---

# 3. Development Rule: PBRD

Every phase follows:

**Plan → Build → Review/Test → Document**

No phase may skip a step.

Every Cursor agent turn must begin by reading the project state files before touching code.

Required files:

```text
PROJECT_RULES.md
agent-info.md
lessons_learned.md
plan.md
error_log.jsonl
BUILD_STATUS.md
BUILD_PLAN.md
```

The agent must also read any documentation relevant to the current phase.

## Cursor Rules

The agent must:

1. Work only on the active phase.
2. Never begin a future phase because it is convenient.
3. Avoid speculative abstractions not required by the active phase.
4. Reuse existing working code whenever reasonable.
5. Run tests before declaring work complete.
6. Record failures in `error_log.jsonl`.
7. Record reusable lessons in `lessons_learned.md`.
8. Update `agent-info.md` with the exact current state.
9. Update `BUILD_STATUS.md`.
10. Stop after the phase exit gate passes.
11. Never hide broken tests or unfinished work.
12. Never replace a failing implementation with fake/mock functionality and call the phase complete unless the phase explicitly calls for a mock.

A phase that becomes too large should be divided into:

```text
Phase 5A
Phase 5B
Phase 5C
```

rather than allowing the agent to work across unrelated systems.

---

# 4. Repository Structure

Target monorepo:

```text
akom-pliss/
|
+-- apps/
|   |
|   +-- mobile/
|       +-- src/
|       +-- assets/
|       +-- app/
|
+-- services/
|   |
|   +-- api/
|   |   +-- src/
|   |   +-- tests/
|   |
|   +-- assistant/
|   |   +-- src/
|   |   +-- tests/
|   |
|   +-- speech/
|       +-- config/
|
+-- packages/
|   |
|   +-- contracts/
|   +-- personalities/
|   +-- providers/
|   +-- shared/
|
+-- infrastructure/
|   |
|   +-- docker/
|   +-- livekit/
|   +-- llama/
|   +-- speaches/
|
+-- firebase/
|   |
|   +-- firestore.rules
|   +-- indexes.json
|   +-- functions/
|
+-- scripts/
|
+-- tests/
|   +-- integration/
|   +-- e2e/
|
+-- docs/
|   +-- architecture/
|   +-- decisions/
|   +-- testing/
|
+-- PROJECT_RULES.md
+-- BUILD_PLAN.md
+-- BUILD_STATUS.md
+-- agent-info.md
+-- lessons_learned.md
+-- error_log.jsonl
+-- plan.md
+-- README.md
```

---

# PHASE 0 — Repository and Agent Foundation

## Goal

Create a clean project foundation before implementing AI functionality.

## Plan

Define:

- monorepo layout
- Node/TypeScript standards
- environment variable rules
- documentation structure
- linting
- formatting
- test framework
- package manager
- Docker strategy
- development scripts

Use `pnpm` unless a technical blocker is discovered.

## Build

Create the initial repository structure.

Create all persistent agent-state documents.

Create:

```text
.env.example
.gitignore
docker-compose.yml
README.md
```

Add basic TypeScript configuration.

Add linting and formatting.

Add a trivial API health endpoint.

## Review/Test

Verify:

```text
pnpm install
pnpm lint
pnpm test
pnpm build
```

all succeed.

Verify no secrets are committed.

## Document

Update:

```text
BUILD_STATUS.md
agent-info.md
README.md
```

## Exit Gate

The empty project builds successfully and a new Cursor agent can understand the project entirely by reading the required state files.

---

# PHASE 1 — Local Model Benchmark

## Goal

Choose the actual v1 LLM based on evidence rather than model-card marketing.

Do **not** build the mobile application yet.

## Candidates

Test:

```text
Qwen3.5-4B Abliterated Q4_K_M
Qwen3.5-9B Abliterated Q4_K_M
Rocinante-X-12B-v1-Heretic-Uncensored Q4_K_M
```

If hardware prevents one candidate from running reliably, document that result instead of forcing it.

## Create Benchmark Suite

Create approximately 75-100 permanent benchmark prompts covering:

```text
normal conversation
casual conversation
natural profanity
Savage personality
Argumentative personality
Roast Me
One-Upper
roleplay
instruction following
reasoning
structured JSON
tool-call formatting
memory-style questions
refusal tendency
context retention
response latency
RAM usage
tokens/sec
```

Store these tests permanently.

Example location:

```text
tests/model-benchmark/
```

## Important

"Cussing" alone is not enough.

The winning model must still be capable of functioning as an everyday assistant.

## Review

Produce:

```text
docs/model-benchmark.md
```

with comparative results.

## Decision

Select:

```text
PRIMARY_MODEL
```

and optionally:

```text
ROLEPLAY_MODEL
```

Do not implement dynamic model routing yet unless benchmark results show a compelling reason.

## Exit Gate

One model has been officially selected as the default v1 brain.

---

# PHASE 2 — LLM Runtime Service

## Goal

Make the selected local model available through a stable API.

## Build

Install/configure:

```text
llama.cpp
```

Run the model through its OpenAI-compatible server.

The application must not talk directly to a GGUF file.

Create an internal provider interface such as:

```text
LLMProvider

chat()
stream()
health()
modelInfo()
```

Create:

```text
LlamaCppProvider
```

## Required Features

Support:

- normal completion
- streamed completion
- system prompts
- conversation history
- temperature configuration
- max-token configuration
- cancellation
- health checks
- timeout handling

## Review/Test

Tests must prove:

```text
API -> llama.cpp -> model -> valid response
```

Test server restart behavior.

Test malformed requests.

Test timeout handling.

Test cancellation.

## Exit Gate

The project has a stable local text-chat API independent of the mobile app.

### Milestone

At this point aKom-Pliss should work as a basic **text-only local chatbot**.

---

# PHASE 3 — Personality Engine

## Goal

Separate personality behavior from application code.

Do NOT hard-code massive prompts inside controllers.

## Structure

Create:

```text
packages/personalities/

casual/
savage/
argumentative/
roast-me/
one-upper/
```

Each personality should support:

```text
prompt
example conversations
temperature
response behavior
profanity level
sarcasm level
argument tendency
roleplay strength
preferred model
voice preference
tool restrictions
```

Example:

```text
savage/
    prompt.md
    examples.json
    config.json
```

## Personalities

### Casual

Normal everyday assistant.

Friendly but not corporate.

Profanity may occur naturally.

### Savage

High profanity.

High sarcasm.

Teasing.

Willing to tell the user when an idea is bad.

Must still remain useful.

### Argumentative

Frequently challenges assumptions.

Does not blindly agree.

Can debate the user.

### Roast Me

Focused on humorous roasting.

Requires explicit Roast Mode activation.

### One-Upper

Humorously attempts to one-up stories and claims.

## Critical Rule

Personality affects **speech and behavior**.

It must never remove tool safety controls.

A foul-mouthed assistant is fine.

A reckless tool executor is not.

## Review/Test

Run personality regression prompts.

Ensure personalities actually sound different.

Ensure Savage does not merely insert random curse words into otherwise identical responses.

## Exit Gate

Personality can be switched at runtime without changing application code.

---

# PHASE 4 — Speech-to-Text Foundation

## Goal

Convert microphone speech reliably into text.

## Components

```text
Silero VAD
Speaches
faster-whisper
```

## Build Order

First implement transcription from an audio file.

Then microphone capture.

Then VAD.

Then streaming/partial transcription if useful.

Do not implement TTS in this phase.

## Required Behavior

System must detect:

```text
silence
speech begins
speech continues
speech ends
```

and produce a final transcript.

## Tests

Test:

- quiet room
- background noise
- short sentences
- long sentences
- profanity
- fast speech
- pauses
- false VAD activation
- no speech

Important: profanity must not be sanitized by the STT pipeline.

## Metrics

Record:

```text
transcription latency
CPU usage
RAM usage
false VAD triggers
missed speech
```

## Exit Gate

Speaking into the microphone produces reliable text locally.

---

# PHASE 5 — Text-to-Speech Foundation

## Goal

Create a replaceable voice provider system.

## Provider Interface

Create something similar to:

```text
TTSProvider

synthesize()
stream()
stop()
voices()
health()
```

Initial providers:

```text
SystemTTSProvider
KokoroProvider
ElevenLabsProvider
```

Only implement what is required for this phase.

ElevenLabs may initially be a stub interface if credentials are intentionally deferred, but fake successful responses must not be used in integration tests.

## Free Voice Priority

First prove:

```text
LLM response -> free voice -> speaker
```

Device/system TTS should remain the cheapest default option for mobile.

Kokoro becomes the enhanced self-hosted voice option.

## Required Behavior

TTS must correctly speak profanity generated by the LLM.

Do not automatically censor:

```text
fuck
shit
damn
ass
etc.
```

## Exit Gate

Text generated by aKom-Pliss can be spoken aloud using a free voice provider.

---

# PHASE 6 — Full Local Voice Loop

## Goal

Combine the pieces into the first real aKom-Pliss conversation.

```text
Microphone
   ↓
VAD
   ↓
STT
   ↓
LLM
   ↓
Personality
   ↓
TTS
   ↓
Speaker
```

## Build

Create `ConversationEngine`.

It should coordinate providers rather than contain their implementation details.

Support:

```text
conversation state
turn IDs
cancellation
errors
timeouts
streaming
current personality
```

## Interruptions

Add barge-in support:

If the assistant is speaking and the user begins talking:

```text
stop TTS
capture user speech
transcribe
start next assistant turn
```

Evaluate whether LiveKit materially simplifies the realtime layer.

If LiveKit is adopted, document the architectural decision in:

```text
docs/decisions/
```

Do not adopt it simply because it exists.

## Exit Gate

A user can hold a natural spoken conversation locally and interrupt the assistant while it is talking.

### Major Milestone

**LOCAL TALKING aKom-Pliss EXISTS.**

Nothing involving Firebase, subscriptions, voice stores, or fancy UI should have delayed reaching this milestone.

---

# PHASE 7 — OpenClaw Integration Layer

## Goal

Turn the chatbot into an assistant.

OpenClaw must exist behind our own interface.

## Create

```text
AssistantRuntime
```

with an adapter such as:

```text
OpenClawAdapter
```

The rest of aKom-Pliss talks to `AssistantRuntime`, not OpenClaw-specific code.

## Initial OpenClaw Capabilities

Only integrate basic functions first:

```text
agent session
tools
memory
scheduled tasks
skills
```

Do not install a huge collection of random tools.

## Tests

Prove that a text request can:

1. reach the assistant runtime
2. cause a supported tool decision
3. execute the tool
4. return the result
5. produce a natural assistant response

## Exit Gate

OpenClaw can be removed/replaced without rewriting the conversation engine.

---

# PHASE 8 — Memory System

## Goal

Give aKom-Pliss controlled long-term memory.

## Memory Types

Implement conceptually:

```text
PROFILE
PROJECT
TEMPORARY
```

### PROFILE

Long-lived information and preferences.

### PROJECT

Information associated with an ongoing project/topic.

### TEMPORARY

Short-lived conversational context.

## Commands

Support natural-language behavior equivalent to:

```text
Remember that...
Forget that...
What do you remember about...
Show my memories.
Delete this memory.
Delete all my memories.
```

## Automatic Memory

Do not save everything.

Develop rules for determining what is worth remembering.

Examples of good memory candidates:

```text
stable preference
ongoing project
preferred workflow
important recurring fact
explicit user instruction
```

Poor candidates:

```text
random meal
temporary mood
one-off sentence
irrelevant small talk
```

## User Control

Memory must be inspectable and deletable.

## Exit Gate

Important information persists between separate assistant sessions and can be intentionally deleted.

---

# PHASE 9 — Tool Permission System

## Goal

Prevent assistant personality from affecting action safety.

Create permission classes.

Example:

```text
LOW
read weather
search web
read calendar

MEDIUM
create reminder
create note
create calendar event

HIGH
send message
delete file
execute shell command
modify external data
purchase anything
```

## Rules

Low-risk actions may execute automatically.

Medium-risk behavior should be configurable.

High-risk actions require confirmation unless the user has explicitly configured a safe exception.

## Critical Design Principle

This:

> "That's a dumbass idea, but here's the weather."

is personality.

This:

> "Fuck it, I deleted the folder."

is unacceptable tool behavior.

Keep the systems separate.

## Exit Gate

Tools cannot bypass the permission layer regardless of personality/model output.

---

# PHASE 10 — Everyday Assistant Functions

## Goal

Implement the first genuinely useful assistant capabilities.

Start small.

Initial tools:

```text
reminders
tasks
calendar
weather
web search
notes
basic memory
```

Each tool is its own mini-PBRD cycle.

For example:

```text
Phase 10A — Reminders
Phase 10B — Tasks
Phase 10C — Calendar
Phase 10D — Weather
Phase 10E — Web Search
Phase 10F — Notes
```

Do not build all tools simultaneously.

## Tool Contract

Each tool must have:

```text
typed input
typed output
permission classification
error handling
tests
documentation
```

## Exit Gate

The assistant reliably completes useful everyday tasks rather than only chatting.

---

# PHASE 11 — Firebase Accounts and Product Data

## Goal

Add real users.

Use Firebase for application/account data rather than AI inference.

## Firebase Responsibilities

```text
Firebase Auth
user profile
settings
personality selection
voice selection
subscription state
device registrations
app metadata
tool permissions
```

Possible structure:

```text
users/{uid}
settings/{uid}
devices/{uid}/...
subscriptions/{uid}
```

Memory storage should remain abstracted.

## Authentication

Implement:

```text
account creation
login
logout
token refresh
protected backend routes
```

Add Apple/Google authentication later unless required immediately.

## Security

Firestore rules must be tested.

User A must never be capable of accessing User B's data.

## Exit Gate

Multiple test accounts are fully isolated.

---

# PHASE 12 — Expo / React Native Mobile App

## Goal

Turn the functioning backend into the actual aKom-Pliss product.

The backend must already work before this phase.

## Initial Screens

Create only what is required:

```text
Onboarding
Login
Conversation
Personality selector
Voice selector
Memory/settings
Tool permissions
Account/settings
```

## Main Conversation Screen

Must support:

```text
microphone
push-to-talk
text input
assistant transcript
user transcript
speaking indicator
listening indicator
thinking indicator
stop response
personality display
```

Do not overload the first version with visual effects.

Function first.

## Platform Targets

Test:

```text
Android
iPhone
```

from the beginning.

Do not develop Android for months and assume iOS will magically work.

## Exit Gate

A real physical Android device and a real physical iPhone can both communicate with aKom-Pliss.

### Major Milestone

**MOBILE aKom-Pliss EXISTS.**

---

# PHASE 13 — Hands-Free Conversation

## Goal

Move beyond push-to-talk.

Implement:

```text
continuous listening mode
VAD-based turn detection
assistant interruption
audio session recovery
microphone permission handling
background/foreground transitions
```

Wake-word support is NOT required yet.

## Optional Evaluation

Evaluate:

```text
openWakeWord
```

only after hands-free talk works.

Wake words are convenience, not a core dependency.

## Exit Gate

User can have a natural back-and-forth conversation without pressing the microphone button every turn.

---

# PHASE 14 — Premium ElevenLabs Voices

## Goal

Introduce the first paid AI functionality only after the free assistant works.

## Architecture

Do not route the entire assistant through ElevenLabs Agents.

Preferred long-term flow:

```text
STT
 ↓
our LLM
 ↓
our assistant
 ↓
response text
 ↓
TTS Provider

FREE -> system/Kokoro
PAID -> ElevenLabs
```

This prevents premium TTS from becoming a dependency for normal conversation.

## Voice Provider

Finish `ElevenLabsProvider`.

Support:

```text
voice ID
streaming
usage tracking
errors
fallback
quota
```

## Failure Behavior

If ElevenLabs becomes unavailable:

```text
premium voice fails
        ↓
offer/fallback to free voice
```

The conversation itself should continue.

## Exit Gate

Switching between free and premium voices does not affect the AI brain, memory, or tools.

---

# PHASE 15 — Voice Pack Economics and Payments

## Goal

Choose monetization using actual usage data.

Do not choose pricing based on guesses made before the product exists.

Measure:

```text
average conversation minutes
ElevenLabs cost/minute
average premium usage
payment fees
server costs
desired margin
```

Evaluate:

```text
subscription
voice-minute credits
subscription + minutes
voice packs with monthly allowance
```

Avoid unlimited lifetime premium voice purchases unless the economics clearly support them.

## Build

Only after the business model is selected:

```text
store
purchase flow
entitlements
usage accounting
quota
restore purchases
```

Mobile store requirements must be considered for iOS/Android.

## Exit Gate

A premium user cannot accidentally create unlimited unbilled TTS expenses.

---

# PHASE 16 — Hugging Face AI Storage

## Goal

Organize AI assets separately from user/app data.

Hugging Face Storage Buckets should contain things such as:

```text
models/
stt/
tts/
datasets/
benchmarks/
training/
checkpoints/
artifacts/
```

Example:

```text
akom-ai/

models/
    qwen/
    rocinante/

speech/
    whisper/
    kokoro/

training/
    raw/
    cleaned/
    synthetic/

benchmarks/

checkpoints/
```

## Do NOT Use HF Buckets For

Primary transactional data such as:

```text
subscription state
login state
user permissions
voice ownership
frequently updated user settings
```

Those belong in the database.

## Exit Gate

AI assets can be versioned, retrieved, and deployed reproducibly.

---

# PHASE 17 — Security and Privacy Hardening

## Goal

Treat aKom-Pliss like a real product.

Review:

```text
Firebase security
API authentication
rate limiting
tool permissions
prompt injection
OpenClaw permissions
secrets
logging
memory isolation
audio handling
file uploads
user deletion
account deletion
```

## Local LLM Warning

An uncensored model must NEVER mean an uncensored tool system.

The model may generate colorful language.

The surrounding application still controls actions.

## Secrets

No credentials may exist in:

```text
Git
mobile bundle
logs
prompt files
error reports
```

## Exit Gate

Security review passes and known issues are documented.

---

# PHASE 18 — Licensing Review

## Goal

Confirm commercial compatibility before public release.

Review licenses for every production dependency, especially:

```text
OpenClaw
llama.cpp
Qwen model
abliterated derivative
Rocinante
Speaches
faster-whisper
Silero VAD
Kokoro
LiveKit if used
Expo libraries
```

Record results in:

```text
docs/licenses.md
```

A dependency with unclear licensing cannot silently enter production.

## Exit Gate

Every shipping component has documented license status.

---

# PHASE 19 — Performance and Reliability

## Goal

Find the real bottlenecks.

Measure complete voice latency:

```text
speech ends
    ↓
STT complete
    ↓
LLM first token
    ↓
TTS first audio
    ↓
user hears response
```

Record each separately.

Track:

```text
STT latency
LLM tokens/sec
time to first token
TTS latency
RAM
VRAM
CPU
network latency
tool latency
crashes
```

## Optimize Only What Measurements Identify

Do not randomly optimize code.

Focus on the measured slowest piece.

## Stress Testing

Test:

```text
long conversations
rapid interruptions
reconnects
LLM crash
STT crash
TTS crash
network loss
OpenClaw restart
Firebase outage
ElevenLabs outage
```

## Exit Gate

Failures degrade gracefully instead of crashing the entire assistant.

---

# PHASE 20 — Deployment Architecture

## Goal

Move from local development into a repeatable environment.

Containerize applicable services.

Potential layout:

```text
API
OpenClaw
llama.cpp
Speaches
LiveKit if adopted
supporting services
```

Use:

```text
Docker Compose
```

for development.

Production orchestration can be selected later based on actual scale.

## Environments

Create:

```text
development
staging
production
```

Never test dangerous migrations directly against production.

## Exit Gate

A fresh machine can deploy the backend using documented instructions.

---

# PHASE 21 — Closed Beta

## Goal

Find real-world problems before public launch.

Do not add major features during the first beta unless required to fix a fundamental design problem.

Collect:

```text
crashes
latency
STT failures
bad personality responses
memory mistakes
tool mistakes
premium voice usage
device compatibility
battery usage
server cost
```

Create explicit feedback controls such as:

```text
Good response
Bad response
Forgot something
Wrong tool action
Voice problem
```

This feedback may eventually become useful fine-tuning data.

## Exit Gate

Critical bugs are resolved and usage costs are understood.

---

# PHASE 22 — Model Improvement / Fine-Tuning

This is intentionally late.

Do NOT fine-tune a model merely because fine-tuning sounds impressive.

First collect evidence that prompting and personality configuration cannot solve the problem.

Possible future dataset:

```text
good Savage responses
bad Savage responses
ideal roleplay
tool calls
Argumentative conversations
Roast Me conversations
One-Upper conversations
memory behavior
```

Store appropriate datasets in Hugging Face storage.

Potential future result:

```text
aKom-Pliss-9B
```

## Exit Gate

Fine-tuning is only performed when real product data demonstrates a reason for it.

---

# PHASE 23 — Public v1 Release

Minimum v1 should contain:

```text
Android + iOS
accounts
text chat
voice chat
Casual
Savage
Argumentative
Roast Me
One-Upper
memory
reminders
tasks
calendar
basic tools
free voice
premium ElevenLabs voice
tool permissions
account deletion
memory deletion
```

The following should NOT block v1:

```text
wake word
on-device 9B LLM
custom fine-tuned model
smart-home integration
dozens of tools
multi-agent orchestration
complex model routing
desktop app
huge plugin marketplace
```

Those are later features.

---

# Development Milestones

## Milestone 1 — Brain

After Phases 0-3:

```text
Text
 ↓
aKom-Pliss
 ↓
Local uncensored/personality-aware LLM
 ↓
Text
```

## Milestone 2 — Voice

After Phases 4-6:

```text
Voice
 ↓
STT
 ↓
aKom-Pliss
 ↓
TTS
 ↓
Voice
```

## Milestone 3 — Assistant

After Phases 7-10:

```text
Conversation
Memory
Tools
Reminders
Everyday assistant behavior
```

## Milestone 4 — Product

After Phases 11-13:

```text
Firebase accounts
Android
iPhone
Hands-free voice
```

## Milestone 5 — Business

After Phases 14-16:

```text
Premium voices
Payments
Usage tracking
AI storage
```

## Milestone 6 — Production

After Phases 17-23:

```text
Security
Licensing
Performance
Deployment
Beta
Release
```

---

# Cursor Phase Execution Template

For every phase, Cursor should create/update `plan.md` using this format:

```text
# Active Phase

Phase:
Goal:

## Current State

What already exists?

## Required Reading

Which existing files/docs apply?

## Plan

Exact tasks in order.

## Build

Files expected to change.

## Tests

Tests that must pass.

## Risks

Known technical risks.

## Exit Criteria

Observable conditions proving completion.

## PBRD Status

Plan: COMPLETE / IN PROGRESS
Build: COMPLETE / IN PROGRESS
Review/Test: COMPLETE / IN PROGRESS
Document: COMPLETE / IN PROGRESS
```

When all four PBRD stages are complete:

```text
1. Update BUILD_STATUS.md
2. Update agent-info.md
3. Update lessons_learned.md if appropriate
4. Record unresolved errors in error_log.jsonl
5. Mark the phase COMPLETE
6. STOP
```

The next phase begins in a fresh task/agent context.

---

# BUILD_STATUS.md Suggested Format

```text
# aKom-Pliss Build Status

Current Phase:
Current Subphase:
Overall Status:

## Completed

Phase 0:
Phase 1:
...

## Active

Current goal:

## Blocked

None / details

## Known Issues

...

## Tests

Passing:
Failing:

## Last Verified Build

Date:
Commit:

## Next Phase

...
```

---

# agent-info.md Purpose

`agent-info.md` is the shared handoff state between Cursor agents.

It should answer:

```text
What are we building?

What architecture are we currently using?

What phase are we in?

What was just completed?

What files changed?

What currently works?

What currently does not work?

What decisions have already been made?

What must NOT be changed without discussion?

What should the next agent do?
```

Keep this concise enough that a new agent can read it before working.

---

# error_log.jsonl

Every meaningful development failure should be recorded.

Example:

```json
{"date":"2026-09-03","phase":"4","component":"faster-whisper","error":"Model failed to load due to RAM exhaustion","cause":"12B LLM and STT loaded simultaneously","resolution":"Reduced local model size during speech testing","status":"resolved"}
```

The purpose is to prevent future agents from repeating the same mistakes.

---

# lessons_learned.md

This file records reusable conclusions rather than individual errors.

Examples:

```text
- Never start llama.cpp with production context size during basic local tests.
- Keep TTS provider logic outside ConversationEngine.
- OpenClaw-specific types must not leak into the mobile API.
- Personality prompts must not control tool permissions.
- Test both iOS and Android whenever mobile audio code changes.
```

---

# Architecture Principles

These principles should survive individual implementation choices.

**Provider independence**

LLM, STT, TTS, agent runtime, memory, and realtime transport must be replaceable.

**Free path first**

A user should be able to use the core assistant without generating third-party per-message AI charges.

**Premium voices are optional**

ElevenLabs should enhance aKom-Pliss, not become required for it to function.

**Personality is separate from capability**

Savage can swear while executing the exact same safe reminder logic as Casual.

**Tools are safer than prompts**

Never rely on the LLM prompt alone to prevent dangerous tool actions.

**Measure before optimizing**

Benchmark actual bottlenecks.

**Build vertically**

Get:

```text
voice -> brain -> voice
```

working before spending weeks building account stores and payment screens.

**Avoid premature complexity**

Do not add:

```text
Qdrant
Mem0
multi-model routing
Kubernetes
custom fine-tuning
wake words
multi-agent architecture
```

until the existing system proves it needs them.

**Document every architectural decision**

Any major addition or replacement should create an ADR under:

```text
docs/decisions/
```

---

# Immediate Starting Sequence

Development should begin in this exact order:

```text
PHASE 0
Repository foundation
        ↓
PHASE 1
Model benchmark
        ↓
PHASE 2
llama.cpp + local text API
        ↓
PHASE 3
Personality engine
        ↓
PHASE 4
STT
        ↓
PHASE 5
TTS
        ↓
PHASE 6
Complete local voice conversation
```

At that point STOP and reassess the architecture.

Do not build Firebase, payment systems, premium voices, or elaborate mobile UI before proving that the central experience is good.

The first major objective is extremely simple:

> **Talk to aKom-Pliss, have it understand you, get a useful foul-mouthed response from the local model, hear that response spoken aloud, and be able to interrupt it naturally.**

If that experience is excellent, everything else has a strong foundation.

If that experience sucks, no amount of Firebase, subscriptions, animations, or app-store polish will save the product.