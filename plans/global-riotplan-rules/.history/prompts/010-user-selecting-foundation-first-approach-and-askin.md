# Narrative: User selecting Foundation-First approach and asking about whether catalysts need their own module/package

**Date**: 2026-02-08T17:14:09.107Z
**Source**: voice
**Speaker**: user

---

User selecting Foundation-First approach and raising an important architectural question: should catalyst implementation live in the main riotplan codebase, or in a separate, simpler module?

Reasoning: if you're going to implement catalysts, the full riotplan source code is complex. A separate module would be simpler to work with, easier to test, and cleaner to reason about. Possibly a "riotplan-catalyst" or similar package that handles catalyst loading, resolution, merging, and schema -- consumed by riotplan as a dependency.

This aligns with the monorepo/multi-package approach already in use (execution, execution-anthropic, execution-gemini, etc.).
