# Feedback 019: API-First Architecture and Open Adoption

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.15 → v0.16
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review raised a concern about CLI ergonomics:

> "CLI ergonomics and UX challenges: The initial reliance on a CLI with many commands could be daunting. The team noted a flat CLI might become unwieldy (60+ commands). If not designed with usability in mind (command grouping, good help, autocompletion), the CLI could deter users. A purely CLI tool also limits non-developers until GUIs mature."

## Feedback Given

**Tim's response:**

"I get it, I want to start with the CLI interface and then, ultimately, I can see some of this moving over to a UI interface. One idea I want to explore is that RiotPlan would be running in the background and providing shared APIs and a Web Interface. I'm 100% not looking to set up a Commercial SaaS service, but if this project were to define an API this is something that companies could implement.

I'm at the point in my career and where I am where I'm really just looking for this to become something people use. I'm not motivated by revenue or money at this point."

## Discussion

### The Architecture Insight: API-First Design

The CLI isn't the end point—it's the first client. The real architecture should be:

```
┌─────────────────────────────────────────────────────────────────┐
│                     RiotPlan Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               @riotplan/server (Background Daemon)        │   │
│  │                                                           │   │
│  │   ┌─────────────────────────────────────────────────┐    │   │
│  │   │               REST/GraphQL API                   │    │   │
│  │   │  (Open specification - others can implement)     │    │   │
│  │   └─────────────────────────────────────────────────┘    │   │
│  │                          │                                │   │
│  │   ┌─────────────────────────────────────────────────┐    │   │
│  │   │               @riotplan/core                     │    │   │
│  │   │   Plan operations, status, feedback, history     │    │   │
│  │   └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐              │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐         │
│  │    CLI     │      │  VS Code   │      │ Dashboard  │         │
│  │ (terminal) │      │ Extension  │      │  (Web UI)  │         │
│  └────────────┘      └────────────┘      └────────────┘         │
│                                                                  │
│  All clients use the same API                                    │
│  CLI can work offline (direct to core)                           │
│  API spec is open - companies can build their own clients        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Background daemon**: `@riotplan/server` runs locally, provides API + web dashboard
2. **Open API specification**: REST/GraphQL spec that anyone can implement
3. **CLI as first client**: CLI talks to API (or directly to core when offline)
4. **Multiple interfaces**: CLI, VS Code, Web dashboard all equal citizens
5. **No SaaS dependency**: Everything runs locally, user owns data

### The Motivation: Impact Over Revenue

> "I'm at the point in my career and where I am where I'm really just looking for this to become something people use. I'm not motivated by revenue or money at this point."

This fundamentally shapes the project:

| Traditional OSS | RiotPlan Approach |
|-----------------|-------------------|
| MIT/Apache license, hope for stars | Design for actual adoption |
| Build it and they will come | Documentation-first ("The Book") |
| Single implementation | Open API spec for others to implement |
| Community contributions | Community implementations |
| Measure: GitHub stars | Measure: People using it in their workflows |

### What This Means for Design

1. **API specification is a first-class deliverable**
   - OpenAPI/Swagger spec
   - Published alongside implementation
   - Versioned and stable

2. **Reference implementation, not the only implementation**
   - `@riotplan/server` is the reference
   - Companies could build: Slack bots, Notion integrations, enterprise versions
   - API spec enables ecosystem

3. **Local-first, not cloud-first**
   - Everything works offline
   - No account required
   - Data stays on user's machine
   - Server is optional (CLI can use core directly)

4. **Documentation for adoption**
   - "The Book" isn't marketing, it's enablement
   - API documentation as good as CLI docs
   - Examples of building custom clients

### Enterprise Path (Without Being Enterprise)

If a company wants to:
- Build a RiotPlan-compatible system internally → use the API spec
- Integrate with their tools → build client against API
- Contribute improvements → standard OSS contribution

RiotPlan provides the spec and reference implementation. Others build on top.

## Resolution

Update the architecture to reflect API-first design:

1. **Elevate API specification as deliverable**: Not just implementation detail
2. **Document daemon/server architecture**: Background process model
3. **Clarify non-commercial stance**: Open source for adoption, not revenue
4. **Add API documentation to Phase 1**: Spec alongside implementation

## Changes Made

1. Add section on API-first architecture to Part 7 (Project Structure)
2. Update `@riotplan/server` description to emphasize open API
3. Add new deliverable: OpenAPI/GraphQL specification
4. Note motivation: impact over revenue
5. Update implementation phases to include API spec

## Open Questions

1. REST vs GraphQL vs both?
2. Should API spec be its own package (`@riotplan/api-spec`)?
3. WebSocket for real-time updates (attention tracking, status changes)?

## Personal Note

This feedback captures something important about the project's philosophy. RiotPlan isn't a business venture—it's a tool that should exist because managing complex AI-assisted workflows is a real problem. The measure of success is whether people use it and find it valuable, not whether it generates revenue.

This aligns with the broader open source ethos: build something useful, give it away, let the ecosystem grow.

