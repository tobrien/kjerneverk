# Feedback: Cross-Project Awareness and Global Guidance

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.7.4 → v0.7.5

## Feedback Given

### Cross-Project Awareness

> "When we're creating plans we need to have something that is aware of other projects and other systems. I'll get really specific—when we revised Kjerneverk to make it more secure, in the process of doing this we also started to identify that the plan was proposing features that probably need to exist in other projects."

> "When creating plans, it would be good to be able to supply a larger context such that the plan creation understands global ideas for a context."

### Global Guidance and Style

> "We also need to be able to define our rules over global guidance for things that we prefer to do and prefer to avoid. For example, when I'm writing a blog post or a plan to write a blog, I have a set of prompts and context that define my style. It would be good to expose that to riotplan either as a tool or a configuration."

## Resolution

Added **R22: Cross-Project Awareness**:
- Define an ecosystem of related projects (kjerneverk, fjellgrunn, utilarium)
- During plan creation, surface what capabilities exist elsewhere
- Identify when proposed features might belong in a different project
- Suggest: "This looks like it should be in project X, not here"
- Track which projects provide what capabilities (registry)

Added **R23: Global Guidance & Style Configuration**:
- Define personal/team rules that apply across all plans
- Configure writing style preferences (for blogs, documentation)
- Set coding conventions and patterns to prefer/avoid
- Provide default prompts and context for plan creation
- Hierarchical: global defaults → context overrides → plan overrides

Added CLI commands:
```bash
# Ecosystem
riotplan ecosystem
riotplan ecosystem add <path>
riotplan ecosystem capabilities
riotplan suggest-project <feature>

# Guidance
riotplan config guidance
riotplan config guidance add
riotplan config style <context>
```

## Key Insight

**Plans don't exist in isolation.** They exist within:
1. An **ecosystem** of projects (what exists elsewhere?)
2. A set of **personal/team preferences** (how do we do things?)

RiotPlan should be aware of both. When securing kjerneverk, features were identified that belonged in offrecord, pressurelid, cardigantime, spotclean. The system should have known these existed (or should exist) elsewhere.

