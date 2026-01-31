# Idea: riotplan-gathering-evidence

## Core Concept

Make RiotPlan more proactive about gathering and recording evidence during idea exploration - code snippets, documents, standards, findings should be captured as evidence automatically

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- PROBLEM STATEMENT: During cardigantime-file-resolution exploration, the model investigated code, found implementations, analyzed behavior - but didn't proactively capture this as evidence. Evidence was only added after user explicitly asked 'where is that code you proposed?'
- WHAT HAPPENED: User asked model to investigate how CardiganTime resolves paths, find code locations, understand current behavior. Model did all this faithfully - launched agents, read code, analyzed functions. BUT the evidence gathered (code snippets, file locations, behavior analysis) wasn't captured in the plan as evidence.
- CORE INSIGHT: When exploring an idea, the model should be PROACTIVE about capturing evidence. If user says 'can you look at the code that does X' or 'find the document about Y', the findings should automatically go into .evidence/ directory and be linked to the plan.
- DIRECTORY STRUCTURE NOTE: User pointed out that .evidence/ and .history/ don't need to be hidden directories (dot-prefixed). They're interesting in themselves and don't need to be hidden from users. Consider renaming to evidence/ and history/.
- EXAMPLES OF EVIDENCE THAT SHOULD HAVE BEEN CAPTURED: (1) Code snippets showing resolvePathValue() implementation, (2) Test file analysis showing what's tested vs gaps, (3) File locations where changes needed (hierarchical.ts, read.ts), (4) Current behavior documentation, (5) Proposed fix with code examples
- POTENTIAL SOLUTION: Add to Cursor rules or RiotPlan workflow - 'When investigating code/docs/standards during idea exploration, immediately create evidence files capturing findings. Use riotplan_idea_add_evidence to link them to the plan with clear descriptions.'
- USER CLARIFICATION: Evidence capture timing - when user asks 'go look up this', 'how does this work?', or asks questions requiring research, that's the right time to capture evidence. Don't auto-capture everything, just the core things user explicitly asks for.
- EXAMPLE: Voice and tone plan - user asked 'can you go find a standard on voice and tone?'. System found standards but didn't record: (1) what the standards were, (2) URLs where found, (3) where to find more info. This should have been captured as evidence.
- EVIDENCE METADATA: Evidence files should include chain of evidence - when was it retrieved? what URL? what was the query/question? This makes evidence useful beyond the lifetime of the plan - can reference later what research was done.
- IMPLEMENTATION: This must be RiotPlan tool/prompt/resource interaction, NOT a Cursor rule. RiotPlan needs to work in Cursor, Cloud Code, and command line. Solution must be platform-agnostic.
- EVIDENCE AS RESOURCE: Evidence should already be a resource in RiotPlan MCP. Need to verify if it exists, and if not, add it. This would allow browsing/reading evidence through MCP resource interface.
- FILE NAMING: Use best judgment - descriptive names based on content (e.g., 'voice-tone-standard.md') or numbered like prompt history (001-voice-tone-standard.md). Consistency with prompt numbering might be good pattern.
- DIRECTORY VISIBILITY: evidence/ and history/ should NOT be hidden (remove dot-prefix). They are features of a plan, not hidden support files. This is separate from this plan's core concept but should be implemented.

## Constraints

- _Add constraints..._
- Evidence gathering should be proactive, not reactive - don't wait for user to ask 'where is that thing you found?'
- Evidence should be captured DURING idea exploration, before moving to shaping stage
- Evidence files should be well-organized and easy to reference - clear filenames, good descriptions when added to plan
- Don't go overboard - not everything is evidence. Only capture when user explicitly asks for research or information lookup.
- Must work across platforms - Cursor, Cloud Code, command line. Cannot rely on Cursor-specific features.
- Evidence files must include metadata: retrieval date, source URL, original question/query that prompted the research

## Questions

- _Add questions..._
- What types of evidence should be automatically captured? Code snippets, file locations, behavior analysis, standards/specs, related documentation?
- When should evidence be captured? Immediately after investigation? At natural breakpoints? When user asks a question that requires research?
- Should this be a Cursor rule ('when exploring RiotPlan ideas, capture findings as evidence') or a change to RiotPlan MCP tools/workflow?
- How should evidence files be named? By topic? By timestamp? By question being answered?
- Should evidence/ and history/ directories be renamed to remove the dot-prefix (make them visible)?
- Is evidence currently exposed as an MCP resource? If not, how should it be structured?
- Should there be a specific MCP tool for adding evidence with metadata (date, URL, query)? Or enhance existing riotplan_idea_add_evidence?
- How should the model detect 'user is asking for research'? Pattern matching on phrases like 'go find', 'look up', 'how does', 'what is the standard'?

## Evidence

_Attach relevant documents, images, or files_
- [Bug report: riotplan_step_add creates files in plan root instead of plan/subdirectory, causing inconsistent structure](.evidence/bug-step-files-wrong-directory.md)
- [Bug report: Model creates implementation steps from memory instead of reading evidence files, resulting in superficial plans that don't incorporate gathered details](.evidence/bug-model-not-reading-evidence.md)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T17:17:12.734Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
