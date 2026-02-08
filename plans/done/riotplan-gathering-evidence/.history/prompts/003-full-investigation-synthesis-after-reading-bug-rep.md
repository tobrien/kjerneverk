# Narrative: Full investigation synthesis after reading bug reports, exploring codebase, and analyzing current evidence implementation

**Date**: 2026-02-08T05:22:46.405Z
**Source**: typing
**Speaker**: user

---

Full investigation of current RiotPlan evidence implementation completed. Key findings:

WHAT ALREADY EXISTS:
- Evidence is already an MCP resource (list + read individual files)
- riotplan_idea_add_evidence supports both file references and inline content creation
- The tool schema has metadata fields (source, gatheringMethod, relevanceScore, summary) but the MCP server registration doesn't expose them - only evidencePath, description, and path are wired through
- Evidence directory is already non-hidden (evidence/, not .evidence/)
- explore_idea and shape_approach prompts reference evidence gathering
- Evidence file patterns are defined in PLAN_CONVENTIONS

WHAT'S MISSING:
1. MCP server registration doesn't pass through the full evidence schema - metadata fields are dead code
2. Key metadata fields not in schema at all: source URL, original query/question, retrieval date
3. No prompt instructions to READ evidence before creating implementation steps (the 'model not reading evidence' bug)
4. No proactive evidence capture behavior - prompts ask about evidence but don't instruct the model to capture findings automatically
5. History directory still uses .history/ dot-prefix (evidence/ is already correct)
6. Inline evidence uses timestamp-based filenames instead of descriptive names

TWO BUGS ANALYZED:
1. step_add wrong directory - code looks correct in current codebase (uses getPlanDir() which returns plan/ subdirectory). May have been fixed already or may be a path resolution edge case. Needs reproduction.
2. Model not reading evidence - workflow/prompt gap, not code bug. Prompts tell model to gather evidence but never tell it to read evidence when creating steps. Fix is to add instructions to build/execute prompts.

CONCRETE WORK ITEMS EMERGING:
1. Fix MCP server registration to expose full evidence schema (source, gatheringMethod, relevanceScore, summary, content)
2. Add sourceUrl, originalQuery fields to evidence schema
3. Update explore_idea prompt to instruct proactive evidence capture during research
4. Update build/execute prompts to instruct reading evidence before creating steps
5. Improve evidence file naming (descriptive names instead of timestamps)
6. Rename .history/ to history/ (separate concern but identified here)
7. Verify/reproduce step_add directory bug
