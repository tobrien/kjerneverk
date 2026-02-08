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
- INVESTIGATION: Evidence IS already exposed as an MCP resource. Two resources exist: (1) riotplan://evidence/{path} - lists all evidence files with name/size/modified, (2) riotplan://evidence-file/{path}/{file} - reads a specific evidence file's content. Defined in src/mcp/resources/evidence.ts and registered in src/mcp/resources/index.ts (lines 77-87). This answers the question 'Is evidence currently exposed as an MCP resource?' - YES.
- INVESTIGATION: The riotplan_idea_add_evidence tool already supports richer metadata than just path+description. The schema in idea.ts (lines 33-42) includes: source (string), gatheringMethod (enum: manual/model-assisted), relevanceScore (number 0-1), summary (string), and content (for inline evidence). HOWEVER, the server registration in server.ts (lines 412-420) only exposes evidencePath, description, and path - the other schema fields are NOT exposed through MCP. This is a bug/gap - the implementation supports metadata but the MCP interface doesn't pass it through.
- INVESTIGATION: Evidence metadata gaps - even the full schema is missing key metadata identified in this plan: (1) source URL - not stored as a distinct field, could be embedded in 'source' or 'content' but not structured, (2) original query/question that prompted the research - not stored, (3) retrieval date - uses 'Added' timestamp at creation time, which is correct but not explicit in the schema. The plan calls for these to be first-class fields.
- INVESTIGATION: Directory visibility status - evidence/ already uses the non-hidden name (no dot prefix). But .history/ still uses dot-prefix. The convention is in types.ts (line 987-988): evidence: "evidence", history: ".history". So only history needs renaming. This is a separate change from evidence gathering but should be tracked.
- BUG ANALYSIS - step_add wrong directory: Code in steps/operations.ts uses getPlanDir() (lines 113-123) which creates and returns plan/ subdirectory. insertStep() (line 236) calls getPlanDir() and constructs path with join(planDir, filename) at line 264. The code LOOKS correct. Possible causes: (1) plan.metadata.path is wrong, (2) getPlanDir() has a fallback that skips plan/ subdirectory, (3) bug was already fixed. Need to verify with actual reproduction.
- BUG ANALYSIS - model not reading evidence: This is a workflow/prompt problem, not a code bug. The explore_idea prompt mentions evidence gathering during exploration, but there's NO instruction in build/execute prompts to READ evidence before creating steps. Three fix options documented: (1) Add instructions to prompts ('before creating steps, read all evidence files'), (2) Create riotplan_step_generate_from_evidence tool that forces evidence reading, (3) Add riotplan_validate_steps that checks if evidence was incorporated. Option 1 is cheapest and most aligned with the prompt-based approach RiotPlan uses.
- INVESTIGATION: Evidence file naming - currently inline evidence uses evidence-{timestamp}.md (e.g., evidence-1234567890.md). The types define recognized patterns: what-happened-in-*.md, research-*.md, analysis-*.md, example-*.md (from PLAN_CONVENTIONS.evidencePatterns). File references can use any name. Recommendation: for model-gathered evidence, use descriptive names matching patterns (research-voice-tone-standards.md) rather than timestamp-based names. Timestamp names make it hard to identify content without reading the file.

## Constraints

- _Add constraints..._
- Evidence gathering should be proactive, not reactive - don't wait for user to ask 'where is that thing you found?'
- Evidence should be captured DURING idea exploration, before moving to shaping stage
- Evidence files should be well-organized and easy to reference - clear filenames, good descriptions when added to plan
- Don't go overboard - not everything is evidence. Only capture when user explicitly asks for research or information lookup.
- Must work across platforms - Cursor, Cloud Code, command line. Cannot rely on Cursor-specific features.
- Evidence files must include metadata: retrieval date, source URL, original question/query that prompted the research
- At every stage transition (idea→shaping, shaping→build, build→execute), prompts MUST instruct the model to re-read all plan artifacts (IDEA.md, SHAPING.md, evidence/ files, recent history) before proceeding. The model must never rely on conversation memory alone - the plan files are the source of truth, not the context window.

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
