# Narrative: User confirming fixes, adding provenance requirement, raising design question about generation mechanism

**Date**: 2026-02-08T06:54:29.804Z
**Source**: voice
**Speaker**: user

---

User confirmed the three fixes (wire read_context into build, rewrite generator prompt, post-generation validation) and added a fourth requirement: generation provenance - a summary showing HOW the plan was affected by the idea, history, and evidence. Which constraints mapped to which steps, which evidence was incorporated, how the selected approach shaped the plan. This makes the connection visible and auditable, not just implicit.

User also raised a key design question: how should this work mechanically? Are we stuffing everything into one massive prompt (big prompt approach), or is it agentic (read artifacts, reason, then generate)? User wants to understand the mechanism before committing to an approach. This is a shaping question.

User is ready to move to shaping to explore approaches for the generation mechanism.
