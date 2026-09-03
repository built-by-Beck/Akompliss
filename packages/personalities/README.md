# packages/personalities

One directory per personality (`casual/`, `savage/`, `argumentative/`, `roast-me/`,
`one-upper/`), each a config package:

```
savage/
  prompt.md
  examples.json
  config.json
```

**Placeholder until Phase 3.** A personality controls tone only — prompt, examples,
temperature, sarcasm/profanity/argument/roleplay levels, preferred voice/model. It must
never control authentication, tool permissions, or confirmation requirements.
