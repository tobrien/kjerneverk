# Narrative: Identifying fundamental disconnect

**Date**: 2026-01-31T17:50:27.693Z
**Source**: typing
**Speaker**: user

---

User identified fundamental issue with RiotPlan: plan generation relies on model memory instead of agentic exploration of idea artifacts. The point of RiotPlan is to finely tune assumptions, evidence, ideas, ontologies - and ALL that should flow into plan generation. Current behavior (memory-based) works 'pretty well' but misses the point. It provides 'a little bit of structure' but not enough. Memory is lossy and doesn't capture the richness of idea exploration. Desired: agent reads IDEA.md, timeline, prompts, evidence and synthesizes into plan. Current memory-based approach should be FALLBACK when something breaks, not primary mode. Example: cardigantime plan created from memory without reading 92-line IDEA.md or 130-line code proposal. This is bigger than 'not reading evidence' - it's about fundamentally connecting plan generation to the structured knowledge built during idea phase.
