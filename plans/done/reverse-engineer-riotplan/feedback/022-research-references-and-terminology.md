# Feedback 022: Research References and Terminology Guidance

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.18 → v0.19
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review provided valuable research grounding:

> "This usage is conceptually appropriate: metacognition in psychology refers to awareness and regulation of one's thought processes (like planning, monitoring, and evaluating one's approach)... Recent HCI research supports the importance of such metacognitive support in AI workflows."

However, it also cautioned:

> "That said, the term 'metacognitive' could be overused or come across as buzzwordy if not grounded for the audience... The document should ensure to explain this in plain language... If RiotPlan is pitched beyond an internal tech audience, substituting or supplementing 'metacognitive' with terms like 'reasoning trace', 'planning rationale', or 'decision log' could communicate the idea more directly."

## Feedback Given

**Tim's response:**

"This is awesome content, and I want you to go into that Word Document and get all of the references, list those papers and references in the plan and also make sure that we're referencing some of these in the project that we generate.

But I also want to make sure that we have documentation that doesn't rely on people understanding the buzzwordy jargon, please heed some of the feedback on terminology and don't overuse the term metacognitive. It's a bit too German philosophy for many."

## Research References (Extracted from ChatGPT Review)

### Academic Papers

| Paper | Authors | Year | Key Contribution | URL |
|-------|---------|------|------------------|-----|
| **Plan-Then-Execute** | He et al. | 2025 | User trust and team performance with LLM agents; importance of user-reviewed planning | [arXiv 2502.01390](https://arxiv.org/abs/2502.01390), [ResearchGate](https://www.researchgate.net/publication/388685638_Plan-Then-Execute_An_Empirical_Study_of_User_Trust_and_Team_Performance_When_Using_LLM_Agents_As_A_Daily_Assistant) |
| **Cognitive and Metacognitive Challenges in GenAI Design Workflows** | Tankelevitch et al. | 2023 | Three metacognitive phases in AI work: formulating, evaluating, integrating | [DIS 2023](https://arxiv.org/html/2506.12879v1) |
| **Cognitive offloading or overload? How AI alters coping** | Chirayath & Premamalini | 2025 | Balancing cognitive offloading vs overload in AI tools | [Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1699320/full) |
| **Metacognition in HCI: Designing for Planning and Flexibility** | Conway & Zachry | 2025 | Metacognition underexplored in tool design | HCII 2025 Proceedings |
| **Exploring the Potential of Metacognitive Support Agents** | (Various) | 2024 | AI tools that prompt reflection improve outcomes | [arXiv](https://arxiv.org/html/2506.12879v1) |

### Foundational Concepts

| Concept | Source | Relevance |
|---------|--------|-----------|
| **Design Rationale** | Wikipedia/IBIS (Rittel & Kunz, 1970) | Capturing the "why" behind design decisions; RiotPlan applies this to plans | [Wikipedia](https://en.wikipedia.org/wiki/Design_rationale) |
| **Architecture Decision Records (ADRs)** | Agile Alliance | Lightweight decision logs; practical industry validation | [Agile Alliance](https://agilealliance.org/resources/experience-reports/distribute-design-authority-with-architecture-decision-records/) |
| **Issue-Based Information System (IBIS)** | Rittel & Kunz, 1970 | First framework for capturing design debates | Academic |

### Key Research Findings

1. **Involving humans in AI planning increases trust and outcomes** (He et al. 2025)
2. **Capturing reasoning is beneficial for future understanding** (Design Rationale literature)
3. **Tools that enhance metacognitive reflection improve performance** (Tankelevitch et al. 2023)
4. **Cognitive offloading helps, but can lead to overload if not managed** (Chirayath 2025)
5. **Design rationale tools historically failed due to being too intrusive** (Historical lesson)

## Terminology Guidance

### The Problem

"Metacognitive" is:
- ✅ Academically accurate
- ✅ Grounded in research
- ❌ German philosophy vibes
- ❌ Buzzwordy to practitioners
- ❌ Alienating to non-academic audiences

### Alternative Terms (Use These Instead)

| Instead of... | Use... | When |
|---------------|--------|------|
| "Metacognitive planning" | **Reflective planning** | General audience |
| "Metacognitive process" | **Thinking about the approach** | Casual explanation |
| "Metacognitive data" | **Decision log** or **reasoning trace** | Technical docs |
| "Metacognitive framework" | **Planning and reflection tool** | Marketing/docs |
| "Metacognition" | **Thinking about thinking** | If you must explain it |

### Plain Language Equivalents

| Jargon | Plain English |
|--------|--------------|
| "Capture metacognitive deliberation" | "Save the conversations where you figured out how to approach the problem" |
| "Metacognitive phases" | "The times when you're deciding *how* to do something, not just doing it" |
| "Metacognitive support" | "Help thinking through your approach" |

### When to Use "Metacognitive"

✅ **Use it:**
- In the Philosophy documentation (for those who want depth)
- When citing research papers
- In academic contexts
- Once, with explanation, then use plain terms after

❌ **Don't use it:**
- Quick Start documentation
- CLI help text
- First-time user experience
- Marketing materials
- Without explaining what it means

### Example: Good vs Bad

**Bad (buzzwordy):**
> "RiotPlan is a metacognitive framework for capturing deliberative processes in multi-session AI workflows."

**Good (plain):**
> "RiotPlan saves your planning conversations so you don't lose the reasoning behind decisions."

**Good (with depth available):**
> "RiotPlan saves your planning conversations. [Why this matters →]"
> *(Link goes to philosophical explanation with "metacognitive" properly explained)*

## Resolution

1. Add research references section to the analysis
2. Document terminology guidance in the analysis
3. Ensure Quick Start path avoids jargon
4. Use "metacognitive" sparingly and always with explanation
5. Prefer: "reasoning trace", "decision log", "planning rationale", "reflective planning"

## Changes Made

1. Add "Research References" section with all papers and URLs
2. Add "Terminology Guidance" section with alternatives
3. Note that Philosophy path can use academic terms, Practical path should not
4. Update documentation requirements to reflect terminology awareness

## The One-Liner

> **Use "metacognitive" in the philosophy docs. Use "thinking about how to approach the problem" everywhere else.**

