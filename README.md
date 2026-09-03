# aKom-Pliss

## An everyday AI assistant with a personality

**aKom-Pliss** is a mobile-first AI assistant designed to feel less like a corporate chatbot and more like a real digital sidekick.

It can talk, listen, remember things, use tools, handle everyday tasks, and switch between different personalities—including personalities that use natural profanity, sarcasm, roasting, and argumentative behavior.

The goal is not to create another chatbot that only answers questions.

The goal is to build an AI assistant that can become part of a user's everyday life.

aKom-Pliss is being designed for **Android and iPhone first**, with future support for web and other platforms.

---

# What aKom-Pliss Will Do

The finished application is intended to support:

- Natural text conversations
- Natural voice conversations
- Speech-to-text
- Text-to-speech
- Interruptible AI speech
- Long-term memory
- Reminders
- Tasks
- Calendar interaction
- Notes
- Web search
- Weather
- File and tool access
- Custom personalities
- Tool permissions
- Free local/self-hosted AI operation where practical
- Optional premium ElevenLabs voice packs
- User accounts and synced settings
- Android and iOS applications

The assistant should eventually be able to handle requests such as:

> "Remind me Friday to pay my insurance."

> "What do I have going on tomorrow?"

> "Remember that I prefer TypeScript for this project."

> "Search the web and find out which GPU would run this model."

> "Why is this code broken?"

> "Add that appointment to my calendar."

> "Tell me if this is a dumb idea."

The difference is that aKom-Pliss does not have to sound like a customer-service bot while doing it.

Depending on the selected personality, it may answer politely, sarcastically, aggressively, humorously, or with natural profanity.

---

# The Main Idea

Most AI voice products rely heavily on paid APIs.

That makes them easy to build, but expensive to operate.

aKom-Pliss is being designed around a different principle:

> **Use self-hosted and open-source AI for the core assistant whenever practical, and only use paid services when they add clear value.**

The free path should eventually use:

- Local/self-hosted speech recognition
- Local/self-hosted language models
- Local/system text-to-speech
- Self-hosted assistant tools
- Self-hosted memory where practical

ElevenLabs remains available as a premium voice option rather than being required for every conversation.

This allows a user to talk to aKom-Pliss without automatically creating a third-party AI bill every time they speak.

---

# High-Level Architecture

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
 Local Language Model
        |
        v
   Response Text
        |
   +----+----------------+
   |                     |
   v                     v
FREE TTS             PREMIUM TTS
System/Kokoro        ElevenLabs
```

Voice input follows this path:

```text
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
```

AI assets such as models, datasets, checkpoints, and speech models can be stored in Hugging Face Storage Buckets.

---

# Core Technology Stack

## Mobile Application

**Expo + React Native + TypeScript**

The primary application will target:

- Android
- iPhone

A web version may be added later.

Expo and React Native allow the project to share most application logic across platforms while still supporting native mobile features such as microphone access, audio playback, notifications, and device permissions.

---

# AI Brain

## llama.cpp

aKom-Pliss uses **llama.cpp** as the local/self-hosted LLM runtime.

llama.cpp allows GGUF models to run locally or on a private server and exposes an OpenAI-compatible API.

That gives the project the ability to change models without rewriting the rest of the application.

The application should interact with an internal provider interface rather than directly depending on one specific model.

---

# Language Models

The initial models being evaluated are:

## Qwen3.5 Abliterated

Primary everyday-assistant candidate.

Planned testing includes:

- Qwen3.5 4B Abliterated
- Qwen3.5 9B Abliterated

The smaller model is useful during local development.

The larger model is a possible production target when better hardware is available.

Qwen is attractive because it combines:

- Strong conversational ability
- Reasoning
- Instruction following
- Tool calling
- Long context
- Good general assistant behavior

---

## Rocinante-X-12B Heretic Uncensored

Rocinante is being evaluated as an alternate personality/roleplay model.

Its strengths include:

- Roleplay
- Dialogue
- Creative responses
- Strong character behavior
- Natural profanity
- Less restrained conversational style

It may eventually be used for personalities such as Savage or Roast Me if testing shows that it performs significantly better than the primary model.

The project will not assume that multiple models are necessary.

Model routing will only be added if benchmark results justify the extra complexity.

---

# Personality System

aKom-Pliss is not intended to have one fixed personality.

The initial personality modes are:

## Casual

The everyday default.

Helpful, conversational, relaxed, and not overly formal.

---

## Savage

High sarcasm, strong personality, natural profanity, teasing, and direct answers.

Savage should still be useful.

The goal is not to randomly insert curse words into normal chatbot answers.

The personality should feel consistent.

---

## Argumentative

Challenges assumptions and does not automatically agree with the user.

Useful for debate, testing ideas, and getting a different point of view.

---

## Roast Me

A dedicated roasting mode.

The assistant focuses on jokes, insults, and playful roasting when explicitly activated.

---

## One-Upper

The assistant humorously tries to one-up stories, claims, or situations.

---

# Personality Architecture

Personalities should be stored as independent configuration packages rather than being hard-coded throughout the application.

Example:

```text
packages/
└── personalities/
    ├── casual/
    │   ├── prompt.md
    │   ├── examples.json
    │   └── config.json
    │
    ├── savage/
    ├── argumentative/
    ├── roast-me/
    └── one-upper/
```

A personality may control:

- Prompt
- Example conversations
- Temperature
- Profanity level
- Sarcasm
- Argument tendency
- Roleplay strength
- Preferred voice
- Preferred model
- Response style

Personality must never control security or tool permissions.

A personality can change **how aKom-Pliss talks**.

It cannot change **what dangerous actions it is allowed to perform**.

---

# Speech-to-Text

The planned local speech stack is:

- **Silero VAD**
- **faster-whisper**
- **Speaches**

## Silero VAD

Voice Activity Detection determines when the user starts and stops speaking.

This helps the assistant distinguish speech from silence and enables natural turn-taking.

---

## faster-whisper

faster-whisper converts microphone audio into text.

The speech pipeline must preserve normal adult language and profanity instead of sanitizing it.

---

## Speaches

Speaches provides an OpenAI-compatible speech API around local speech technologies.

It simplifies integration between the rest of the aKom-Pliss backend and speech models.

---

# Text-to-Speech

aKom-Pliss will use a provider-based TTS system.

Planned providers include:

## Device/System TTS

Default free option.

Advantages:

- Very low operating cost
- Fast
- Uses the user's device
- Reduces server load

---

## Kokoro

Optional enhanced free/self-hosted voice.

Kokoro provides higher-quality generated speech without requiring a paid API for every response.

---

## ElevenLabs

Premium voice provider.

ElevenLabs will be used for optional high-quality voice packs rather than being required for the core assistant.

The intended architecture is:

```text
User speaks
    ↓
Local STT
    ↓
aKom-Pliss AI
    ↓
Response text
    ↓
TTS provider
    ├── System voice
    ├── Kokoro
    └── ElevenLabs premium voice
```

This means the AI brain, memory, and tool system remain the same regardless of which voice is selected.

---

# Premium Voice Packs

One of the planned business models is premium ElevenLabs voice access.

Free users should still have a complete working assistant.

Premium voices are an enhancement.

Possible future monetization may include:

- Monthly voice subscriptions
- Voice minute allowances
- Voice credits
- Premium voice packs

Pricing will be based on actual usage data rather than guessed before the application is tested.

---

# OpenClaw

OpenClaw is being evaluated as the assistant runtime behind aKom-Pliss.

Its job is not to provide the personality itself.

Instead, it can provide infrastructure for:

- Agent sessions
- Tools
- Skills
- Memory
- Scheduled actions
- Reminders
- Automation
- Everyday assistant capabilities

aKom-Pliss should not become tightly coupled to OpenClaw.

The application will use an abstraction such as:

```text
AssistantRuntime
```

with an implementation such as:

```text
OpenClawAdapter
```

The mobile application and core conversation system will communicate with the aKom-Pliss interface rather than directly with OpenClaw internals.

This allows OpenClaw to be replaced later if necessary.

---

# Everyday Assistant Tools

The first useful tools are expected to include:

- Reminders
- Tasks
- Calendar
- Weather
- Web search
- Notes
- Memory

Future tools may include:

- Email
- Files
- Computer control
- Smart-home devices
- Additional third-party integrations
- Custom user skills

Tools will be added one at a time.

Each major tool should be treated as its own development task with dedicated tests.

---

# Tool Permissions

An uncensored or foul-mouthed model does **not** mean unrestricted tools.

Tool access must be controlled separately from AI personality.

Example permission levels:

## Low Risk

May execute automatically.

Examples:

- Read weather
- Search the web
- Read calendar
- Read notes

## Medium Risk

May require configurable confirmation.

Examples:

- Create reminder
- Add calendar event
- Create note

## High Risk

Should normally require confirmation.

Examples:

- Send a message
- Delete a file
- Execute a shell command
- Modify external data
- Make a purchase

The assistant may say:

> "That's a dumbass idea, but here's what I found."

That is personality.

It should never be able to say:

> "Fuck it, I deleted your files."

and bypass the permission system.

---

# Long-Term Memory

aKom-Pliss should be able to remember information between conversations.

Memory should not simply save every sentence.

The initial design separates memory into:

## Profile Memory

Long-lived information and preferences.

Examples:

- Preferred workflow
- Preferred coding language
- Recurring preferences
- Stable personal information the user intentionally shares

## Project Memory

Information associated with ongoing work.

Examples:

- Project architecture
- Decisions
- Current goals
- Development conventions

## Temporary Memory

Short-lived conversational context.

Temporary information does not need to become permanent memory.

---

# Memory Controls

Users should be able to say things equivalent to:

- "Remember that..."
- "Forget that."
- "What do you remember about me?"
- "Show my memories."
- "Delete this memory."
- "Delete all my memories."

Memory must remain inspectable and removable.

---

# Firebase

Firebase is intended to manage product and user data.

Responsibilities include:

- Authentication
- User profiles
- Settings
- Selected personality
- Selected voice
- Device information
- Subscription state
- Voice entitlements
- Tool permission settings

Firebase is not the AI brain.

It is the product/application database.

User data must be isolated so one account cannot access another account's information.

---

# Hugging Face Storage Buckets

Hugging Face Storage Buckets are intended to store large AI-specific assets.

Examples:

```text
models/
speech/
datasets/
training/
checkpoints/
benchmarks/
artifacts/
```

Possible contents include:

- GGUF language models
- Whisper models
- Kokoro assets
- Training datasets
- Benchmark data
- Fine-tuning data
- Checkpoints
- AI artifacts

Hugging Face storage should not replace the main transactional application database.

Frequently updated user data still belongs in Firebase or another proper database.

---

# Voice Conversation

The finished assistant should support natural voice conversation.

The desired flow is:

```text
User speaks
    ↓
VAD detects speech
    ↓
Speech-to-text
    ↓
Assistant thinks
    ↓
Response generated
    ↓
Text-to-speech
    ↓
Assistant speaks
```

The user should also be able to interrupt the assistant.

Example:

```text
aKom-Pliss is speaking
        ↓
User begins talking
        ↓
Current TTS stops
        ↓
User speech is captured
        ↓
New turn begins
```

This feature is sometimes called **barge-in**.

It is important because a voice assistant that cannot be interrupted feels much less natural.

---

# Push-to-Talk and Hands-Free Modes

Initial voice interaction should prioritize reliability.

The first implementation may use:

- Push-to-talk
- Hold-to-talk
- Automatic end-of-speech detection

After that works reliably, the project can add:

- Continuous hands-free conversation
- Automatic turn detection
- Optional wake-word support

A wake word such as:

> "Hey aKom-Pliss"

is a future convenience feature.

It should not delay the core assistant.

---

# Mobile Application

The initial mobile application should include:

- Onboarding
- Login
- Conversation screen
- Microphone control
- Text input
- Assistant transcript
- User transcript
- Listening indicator
- Thinking indicator
- Speaking indicator
- Stop-response control
- Personality selector
- Voice selector
- Memory settings
- Tool permissions
- Account settings

The first version should prioritize function over visual effects.

---

# Realtime Voice

Realtime transport may use LiveKit if testing shows that it meaningfully simplifies:

- Streaming audio
- Interruptions
- Turn detection
- Mobile audio handling
- Reconnection
- Low-latency conversation

LiveKit should only be added if it solves a real problem.

The project should not add infrastructure simply because it is popular.

---

# Development Philosophy

aKom-Pliss should be developed vertically.

The first major goal is:

```text
Microphone
    ↓
Speech-to-text
    ↓
Local AI
    ↓
Personality
    ↓
Text-to-speech
    ↓
Speaker
```

Before building subscriptions, elaborate account screens, advanced stores, or huge tool collections, the central conversation experience must be excellent.

If talking to the assistant feels bad, the rest of the product does not matter.

---

# PBRD Development Workflow

Development follows:

> **Plan → Build → Review/Test → Document**

Each phase must complete the entire cycle before the next phase begins.

Cursor agents must read the persistent project state before making changes.

Required files include:

```text
PROJECT_RULES.md
BUILD_PLAN.md
BUILD_STATUS.md
agent-info.md
lessons_learned.md
plan.md
error_log.jsonl
```

---

# Project State Files

## BUILD_PLAN.md

The long-term roadmap.

Defines development phases, architecture, milestones, and exit gates.

---

## plan.md

The current active development plan.

Only contains the work being performed now.

---

## BUILD_STATUS.md

Current project status.

Includes:

- Completed phases
- Active phase
- Known issues
- Test status
- Blockers
- Next phase

---

## agent-info.md

Shared handoff state for Cursor agents.

It should explain:

- What currently works
- What was just changed
- Important architecture decisions
- Known limitations
- What the next agent should do
- What must not be changed casually

---

## lessons_learned.md

Reusable lessons discovered during development.

This prevents future agents from repeating old mistakes.

---

## error_log.jsonl

Structured record of meaningful development failures and their resolutions.

---

# Model Benchmarking

Before permanently selecting the production AI model, aKom-Pliss will benchmark candidates against the same prompt suite.

The benchmark should evaluate:

- Normal conversation
- Natural profanity
- Savage personality
- Roleplay
- Argumentative behavior
- Roast behavior
- One-Upper behavior
- Reasoning
- Instruction following
- Structured output
- Tool calls
- Memory-style tasks
- Context retention
- Refusal behavior
- Latency
- RAM usage
- Tokens per second

The final model should be selected based on actual performance inside aKom-Pliss, not model-card advertising.

---

# Provider Independence

Major AI systems should be replaceable.

The project should use provider interfaces for:

```text
LLMProvider
STTProvider
TTSProvider
AssistantRuntime
MemoryProvider
RealtimeProvider
```

This means aKom-Pliss should be able to replace:

- llama.cpp
- a language model
- Whisper
- Kokoro
- ElevenLabs
- OpenClaw
- memory infrastructure
- realtime transport

without rewriting the entire application.

---

# Cost Philosophy

The core assistant should avoid unnecessary per-message AI charges.

The target free path is:

```text
Local/self-hosted STT
        ↓
Local/self-hosted LLM
        ↓
Local assistant runtime
        ↓
System/Kokoro TTS
```

This does not mean the system has zero operating cost.

Servers, bandwidth, storage, and hardware still cost money.

The goal is to avoid making every user conversation depend on expensive third-party AI API calls.

---

# Security Philosophy

The language model is treated as untrusted input when it attempts to use tools.

This is especially important because the project intentionally experiments with less-restricted language models.

The LLM may be allowed to say almost anything within product safety rules.

That does not mean it is allowed to **do** anything.

The application controls:

- Authentication
- Authorization
- Tool permissions
- Confirmation requirements
- File access
- External writes
- Billing
- Account data
- Secrets

---

# Privacy

The project should support:

- Account deletion
- Memory deletion
- Explicit memory inspection
- Clear microphone permissions
- Secure authentication
- User-data isolation
- Safe secret handling

Sensitive data should never be placed in prompts, logs, or external storage unless required and intentionally designed.

---

# Commercial Licensing

Before public release, every production dependency and model must receive a documented licensing review.

This includes:

- OpenClaw
- llama.cpp
- Qwen models
- Abliterated model derivatives
- Rocinante
- Speaches
- faster-whisper
- Silero VAD
- Kokoro
- LiveKit if used
- Expo/React Native dependencies

Prototype use does not automatically mean a component is approved for commercial production.

---

# Future Possibilities

After the core application is stable, possible future features include:

- Wake word
- Desktop application
- Web application
- User-created personalities
- Personality marketplace
- Additional premium voices
- Local Brain Mode
- Home-server mode
- On-device models
- Smart-home control
- Email integration
- Computer control
- Multi-agent workflows
- Custom skills
- Plugin marketplace
- Custom aKom-Pliss fine-tuned model
- User-owned local AI server
- Advanced offline operation

These features should not delay v1.

---

# What v1 Should Accomplish

The first public version of aKom-Pliss should allow a user to:

1. Create an account.
2. Talk or type to the assistant.
3. Select a personality.
4. Hear the assistant speak.
5. Use a free voice.
6. Optionally use a premium ElevenLabs voice.
7. Interrupt the assistant while it is speaking.
8. Save useful memories.
9. View and delete memories.
10. Create reminders and tasks.
11. Interact with calendar functions.
12. Use basic everyday tools.
13. Configure tool permissions.
14. Use the application on Android and iPhone.

---

# The End Goal

aKom-Pliss is intended to become more than a chatbot.

The finished product should feel like a persistent digital companion that can:

```text
Listen
Talk
Remember
Think
Search
Plan
Remind
Act
Use tools
Develop a consistent personality
```

The assistant should be useful enough to handle everyday life but have enough personality that using it is actually entertaining.

It should be capable of being helpful without always sounding polite, polished, or corporate.

The long-term goal is simple:

> **Build the everyday AI assistant people actually want to talk to.**

Not another chatbot.

An aKom-Pliss.
