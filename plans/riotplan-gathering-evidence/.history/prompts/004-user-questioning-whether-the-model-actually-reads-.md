# Narrative: User questioning whether the model actually reads plan files during transitions or just works from conversation memory

**Date**: 2026-02-08T05:24:51.179Z
**Source**: voice
**Speaker**: user

---

User clarifies the core problem: When developing a plan from an idea, the model isn't actually reading the IDEA.md, evidence files, or history. It's working from conversation memory instead. The user is dictating via voice in Cursor right now and questions whether the model is even looking at the plan files or just using what it remembers from the conversation. This is the fundamental issue - the model has the conversation context and uses that instead of reading the structured plan artifacts. When it transitions from idea to shaping to building, it should be re-reading the plan files, not relying on conversation memory which is lossy and may not include everything captured in the plan.
