# Research References for RiotPlan

This document compiles academic and industry research that supports and informs RiotPlan's design decisions. These references can be used in documentation to provide credibility and context.

---

## Design Rationale and Knowledge Capture

### Issue-Based Information System (IBIS)
**Rittel & Kunz (1970)**

One of the first frameworks to capture design debates in a structured way. IBIS treats design as a social, collaborative process where issues, positions, and arguments are explicitly recorded.

- **Relevance**: RiotPlan's feedback capture is a modern evolution of IBIS, updated for human-AI deliberation.
- **Source**: [Wikipedia: Design Rationale](https://en.wikipedia.org/wiki/Design_rationale)

### Design Rationale Research
**General**

Design rationale research emphasizes recording decisions along with alternatives and justifications. Research warns that capturing rationale can be intrusive and is often abandoned if it's too cumbersome.

- **Key insight**: Capture must be low-friction to succeed.
- **Relevance**: RiotPlan integrates capture into normal workflow (importing chats, AI co-documentation).
- **Source**: [Wikipedia: Design Rationale](https://en.wikipedia.org/wiki/Design_rationale)

### Architecture Decision Records (ADRs)
**Agile Alliance**

A modern lightweight embodiment of design rationale. ADRs are simple Markdown files that record "we chose X because..." for architectural decisions.

- **Key insight**: Even minimal text records greatly aid future understanding.
- **Relevance**: RiotPlan generalizes ADRs to all decisions in a project plan, not just architectural ones.
- **Citation**: "An architecture decision record is a document that captures an important architectural decision made along with its context and consequences."
- **Source**: [Agile Alliance: Distribute Design Authority with ADRs](https://agilealliance.org/resources/experience-reports/distribute-design-authority-with-architecture-decision-records/)

---

## Metacognitive Tools and Cognitive Load

### Metacognition in Learning and Problem-Solving
**Egara et al. (2025)**

Metacognition in psychology refers to awareness and regulation of one's thought processes (planning, monitoring, evaluating one's approach). Tools that support metacognition have been shown to improve problem-solving and learning outcomes.

- **Relevance**: RiotPlan is a metacognitive scaffold for project work—encouraging teams to reflect on their plans.
- **Source**: [PMC: Mapping the Scaffolding of Metacognition and Learning by AI Tools](https://pmc.ncbi.nlm.nih.gov/articles/PMC12653222/)

### Metacognitive Challenges in GenAI Workflows
**Tankelevitch et al. (2023)**

When users work with generative AI, they need support in at least three metacognitive phases:
1. **Formulating the prompt** (planning the approach)
2. **Evaluating the AI's output**
3. **Deciding how to integrate the AI** into the task

- **Key insight**: These are "thinking about the task strategy" steps—exactly what RiotPlan aims to preserve.
- **Relevance**: Directly supports RiotPlan's mission to capture reflective phases when working with AI.
- **Source**: [arXiv: Exploring the Potential of Metacognitive Support Agents](https://arxiv.org/html/2506.12879v1)

### Metacognitive Support Agents
**Tankelevitch et al. (2023)**

Studies show that when AI tools prompt users to reflect (asking questions, encouraging think-aloud planning), users achieve better outcomes and appreciate the guidance in structuring their problem-solving.

- **Key insight**: Capturing reflective dialogue isn't just pedantic—it improves quality.
- **Relevance**: RiotPlan's emphasis on deliberation capture is empirically supported.
- **Source**: [arXiv: Exploring the Potential of Metacognitive Support Agents](https://arxiv.org/html/2506.12879v1)

### Cognitive Offloading vs. Cognitive Overload
**Chirayath & Premamalini (2025)**

Tools like RiotPlan offload memory (you don't have to remember all decisions), which is generally positive for reducing cognitive effort. However, if overused or if users rely on the tool without engaging mentally, it could lead to shallower understanding or cognitive overload from too much information.

- **Key insight**: AI tools can both lighten cognitive burdens and inadvertently encourage overreliance. Tools need to *complement* human thinking, not replace it.
- **Relevance**: RiotPlan should aid memory and thinking but also prompt users to engage.
- **Source**: [Frontiers in Psychology: Cognitive offloading or cognitive overload?](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1699320/full)

---

## Human-AI Collaboration and Trust

### Plan-Then-Execute: User Trust and LLM Agents
**He et al. (2025)** — CHI 2025

This study examined how giving users a **plan-and-review stage** with an AI (instead of the AI executing directly) affected trust and performance.

**Key findings:**
- LLM agents worked well when users could ensure a high-quality plan and stayed involved in execution
- Users easily mistrusted the AI when it presented plausible-sounding plans without transparency
- User agency in planning is important for trust

- **Key insight**: Transparency and a chance for human correction lead to better outcomes.
- **Relevance**: RiotPlan provides a structure for that transparency (the plan and its history). The AI doesn't just run off and do things; its contributions are captured where a human can inspect and approve them.
- **Citation**: "LLM agents worked well when users could ensure a high-quality plan and stayed involved in execution, but users easily mistrusted the AI when it presented plausible-sounding plans without transparency."
- **Sources**: 
  - [ResearchGate: Plan-Then-Execute](https://www.researchgate.net/publication/388685638_Plan-Then-Execute_An_Empirical_Study_of_User_Trust_and_Team_Performance_When_Using_LLM_Agents_As_A_Daily_Assistant)
  - [ChatPaper: Plan-Then-Execute](https://chatpaper.com/paper/104538)
  - arXiv: 2502.01390

---

## Collaborative Workflows and CSCW

### Computer-Supported Cooperative Work (CSCW)
**General Field**

The broader field of CSCW provides relevant insights on:
- Maintaining single sources of truth vs. diverging copies
- Awareness (knowing who did what, and what changed)
- Collaborative knowledge building

- **Relevance**: RiotPlan's use of a repository and git integration creates a single source of truth for plans. Features like change logs, author attributions, and notifications keep collaborators aware.

### IBIS as Collaborative Reasoning
**Rittel (1970)**

IBIS treated design as a social, collaborative process. RiotPlan updates Rittel's idea by capturing not just human-to-human arguments but human-to-AI deliberations too, and making them persistent.

---

## Summary Table

| Research Area | Key Paper/Source | Key Insight | RiotPlan Relevance |
|--------------|------------------|-------------|-------------------|
| **Design Rationale** | IBIS (Rittel & Kunz, 1970) | Capture debates structured | Foundation for feedback capture |
| **Design Rationale** | Wikipedia | Capture must be low-friction | Import chats, AI co-docs |
| **ADRs** | Agile Alliance | Minimal records aid understanding | Generalize to all decisions |
| **Metacognition** | Egara et al. (2025) | Metacognitive tools improve outcomes | RiotPlan as metacognitive scaffold |
| **GenAI Workflows** | Tankelevitch et al. (2023) | Users need support in 3 phases | Capture reflective phases |
| **Cognitive Load** | Chirayath et al. (2025) | Tools must complement, not replace | Aid memory but prompt engagement |
| **Human-AI Trust** | He et al. (2025) | Transparency + human review = trust | Plan history enables inspection |
| **CSCW** | General field | Single source of truth, awareness | Git integration, change tracking |

---

## How to Cite in Documentation

### For Academic/Formal Context
> RiotPlan's approach to capturing deliberation aligns with design rationale research, which emphasizes recording decisions along with alternatives and justifications (Wikipedia, "Design Rationale"). Recent HCI research by Tankelevitch et al. (2023) further supports this, identifying that users working with generative AI need explicit metacognitive support in planning, evaluating, and integrating AI outputs.

### For Practical/Developer Context
> The idea behind capturing "why" decisions were made isn't new—it's been proven valuable in Architecture Decision Records (ADRs) used across the industry. RiotPlan extends this pattern from architectural decisions to the entire planning process.

### For Simple Explanation
> Think of it like keeping meeting minutes, but for your planning conversations with AI. Research shows that teams who record their reasoning make better decisions and spend less time re-explaining things later.

---

## Sources (Full URLs)

1. **Design Rationale (Wikipedia)**
   https://en.wikipedia.org/wiki/Design_rationale

2. **Distribute Design Authority with Architecture Decision Records (Agile Alliance)**
   https://agilealliance.org/resources/experience-reports/distribute-design-authority-with-architecture-decision-records/

3. **Mapping the Scaffolding of Metacognition and Learning by AI Tools (PMC)**
   https://pmc.ncbi.nlm.nih.gov/articles/PMC12653222/

4. **Exploring the Potential of Metacognitive Support Agents (arXiv)**
   https://arxiv.org/html/2506.12879v1

5. **Cognitive offloading or cognitive overload? (Frontiers in Psychology)**
   https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1699320/full

6. **Plan-Then-Execute: User Trust and LLM Agents (ResearchGate)**
   https://www.researchgate.net/publication/388685638_Plan-Then-Execute_An_Empirical_Study_of_User_Trust_and_Team_Performance_When_Using_LLM_Agents_As_A_Daily_Assistant

7. **Plan-Then-Execute (ChatPaper)**
   https://chatpaper.com/paper/104538

---

*Document created: 2026-01-14*
*Extracted from: Critical Review of the RiotPlan Framework (ChatGPT 5.2 Pro Deep Research)*

