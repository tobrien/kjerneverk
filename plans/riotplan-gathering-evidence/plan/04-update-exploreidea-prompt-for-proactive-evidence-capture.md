# Step 4: Update explore_idea prompt for proactive evidence capture

**Model: Sonnet 4.5** — Prompt engineering that requires understanding the existing prompt structure and adding precise behavioral instructions. Needs good judgment about what to add without bloating the prompt.

## Objective

Update the `explore_idea.md` prompt to instruct models to proactively capture evidence when the user asks for research, investigation, or information lookup during idea exploration. The model should detect research requests and automatically use `riotplan_idea_add_evidence` with full metadata.

## Context

The current `explore_idea.md` (at `src/mcp/prompts/explore_idea.md`) mentions evidence gathering but only in a passive way: "Do you have any evidence?" (line 115). It doesn't instruct the model to proactively capture findings when the user asks "go look up X" or "how does this work?". The constraint from IDEA.md states: "Evidence gathering should be proactive, not reactive."

## Files to Modify

1. **`src/mcp/prompts/explore_idea.md`** — Add a new section on proactive evidence capture

## Tasks

- [ ] Add a new section "### Proactive Evidence Capture" between the existing sections 4 (Capture Responses) and 5 (Decide Next Steps)
- [ ] Include trigger detection guidance: when user says things like "go look up", "find out about", "how does X work", "what's the standard for", "can you check" — this is a research request
- [ ] Include instructions to capture findings as evidence using `riotplan_idea_add_evidence` with full metadata:
  - `description`: What was found
  - `content`: The actual findings (code, text, analysis)
  - `source`: Where it came from (e.g., "codebase analysis", "web search")
  - `sourceUrl`: URL if applicable
  - `originalQuery`: The user's original question/request
  - `gatheringMethod`: "model-assisted"
- [ ] Include guidance on descriptive file naming (use description, not timestamp)
- [ ] Add anti-pattern: "Don't investigate without capturing — if user asks you to research something, the findings go in evidence/"
- [ ] Add anti-pattern: "Don't wait for user to ask 'where is that thing you found?' — capture it proactively"
- [ ] Add example showing the full flow: user asks for research → model investigates → model creates evidence file with metadata

## Acceptance Criteria

- [ ] explore_idea.md has clear instructions for proactive evidence capture
- [ ] Trigger detection guidance helps the model recognize research requests
- [ ] Example shows full metadata usage (sourceUrl, originalQuery, gatheringMethod)
- [ ] Anti-patterns cover the specific failures documented in bug reports
- [ ] Prompt remains readable and not overly long

## Evidence

- Bug report: `.evidence/bug-model-not-reading-evidence.md` — model doesn't capture findings
- IDEA.md constraint: "Evidence gathering should be proactive, not reactive"
- IDEA.md constraint: "Only capture when user explicitly asks for research or information lookup"
- IDEA.md example: "Voice and tone plan - user asked 'can you go find a standard' but URLs and sources weren't recorded"

## Dependencies

- Steps 1-2 should be complete so the schema fields (sourceUrl, originalQuery) exist and are wired through MCP
