# Feedback 031: Research References Document

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.27 → v0.28
- **Related Files**: 
  - Critical Review of the RiotPlan Framework.docx
  - evidence/research-references.md (created)
  - RIOTPLAN_ANALYSIS.md

## Feedback Given

**Tim's request:**

"I want you to look at the content in Critical Review of the RiotPlan Framework.docx and I want you to get all the references and content in 'Relevant Research Connections'. Capture this in a document that we can use to include it in the documentation. I want to make sure that we're explaining RiotPlan simply, but I'm also really interested in making sure that we're building on existing information. Go get the references and put them into Markdown in a way that we can list and reference."

## What Was Done

Extracted the "Relevant Research Connections" section from the ChatGPT 5.2 Pro critical review and created a comprehensive research references document at `evidence/research-references.md`.

### Research Areas Captured

| Area | Key Sources |
|------|------------|
| **Design Rationale** | IBIS (Rittel & Kunz, 1970), Wikipedia, ADRs (Agile Alliance) |
| **Metacognitive Tools** | Egara et al. (2025), Tankelevitch et al. (2023) |
| **Cognitive Load** | Chirayath & Premamalini (2025) |
| **Human-AI Trust** | He et al. (2025) - Plan-Then-Execute study |
| **Collaborative Workflows** | CSCW general field |

### Key Papers with Citations

1. **Issue-Based Information System (IBIS)** - Rittel & Kunz (1970)
   - Foundation for capturing design debates
   
2. **Architecture Decision Records (ADRs)** - Agile Alliance
   - Lightweight decision capture that RiotPlan generalizes
   
3. **Metacognitive Support Agents** - Tankelevitch et al. (2023)
   - Users need support in 3 phases: formulating, evaluating, integrating
   
4. **Cognitive Offloading vs. Overload** - Chirayath & Premamalini (2025)
   - Tools must complement human thinking, not replace it
   
5. **Plan-Then-Execute** - He et al. (2025), CHI 2025
   - Transparency + human review = trust in AI collaboration

### Document Structure

The new `evidence/research-references.md` includes:

1. **Full citations** with context and relevance to RiotPlan
2. **Summary table** mapping research to RiotPlan features
3. **How to cite** section with formal, practical, and simple versions
4. **Full URLs** for all sources

### Why This Matters

> "I want to make sure that we're explaining RiotPlan simply, but I'm also really interested in making sure that we're building on existing information."

The research references provide:
- **Credibility**: RiotPlan isn't invented from scratch; it builds on proven concepts
- **Vocabulary**: Terms like "metacognitive" have academic grounding
- **Validation**: Studies show these approaches work

## Resolution

1. Created `evidence/research-references.md` with all extracted references
2. Organized by research area with relevance to RiotPlan
3. Included citation examples for different audiences
4. Linked to original sources

## The One-Liner

> **Building on research makes explaining simpler—you're not inventing, you're applying proven concepts.**

