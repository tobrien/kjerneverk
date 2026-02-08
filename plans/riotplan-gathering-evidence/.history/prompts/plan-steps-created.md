# Checkpoint: plan-steps-created

**Timestamp**: 2026-02-08T05:34:32.955Z
**Stage**: shaping
**Message**: 7 implementation steps created with detailed tasks, acceptance criteria, file locations, and model recommendations. Selected approach: Prompt-Plus-Tools. Ready for execution.

## Current State

**Current Stage**: shaping

### IDEA.md

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


### SHAPING.md

# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Prompt-First

**Description**: Fix the problem primarily through prompt changes. Update explore_idea, shape_approach, build_plan, and execute_plan prompts to: (1) instruct proactive evidence capture when the user asks for research, (2) require re-reading all plan artifacts at stage transitions, (3) use descriptive evidence file names. Also fix the MCP server registration to expose the full evidence schema that already exists in the tool code. Minimal code changes - mostly prompt engineering plus the server.ts registration fix.

**Tradeoffs**:
- + Cheapest to implement - mostly editing markdown prompt files
- + Aligned with RiotPlan's prompt-based architecture
- + No new tools or APIs to maintain
- + Can ship incrementally - one prompt at a time
- - Relies on model compliance - prompts are suggestions, not enforcement
- - Different models may follow prompts with varying fidelity
- - No validation that evidence was actually read or captured
- - Dead metadata fields get fixed but no new fields (sourceUrl, originalQuery) added

**Assumptions**:
- Models will reliably follow prompt instructions for evidence capture
- The existing evidence tool schema is sufficient once properly exposed
- Users will trigger evidence capture through natural language ('go look up X') that the model can detect from prompt guidance


### Approach: Tool-Enhanced

**Description**: Fix through a combination of prompt changes AND tool/schema enhancements. Everything in the Prompt-First approach, PLUS: (1) Add sourceUrl and originalQuery fields to the evidence schema, (2) Fix MCP server registration to expose ALL evidence fields, (3) Add a 'read_plan_context' tool or behavior that aggregates IDEA.md + evidence + history into a single context payload for stage transitions, (4) Update inline evidence file naming to use descriptive names based on content patterns (research-*.md, analysis-*.md) instead of timestamps, (5) Consider adding validation that warns if evidence exists but wasn't referenced in generated steps.

**Tradeoffs**:
- + Structured metadata makes evidence useful long-term (searchable, queryable)
- + read_plan_context tool makes re-reading artifacts a single call instead of hoping the model does it
- + Descriptive filenames make evidence browsable without reading each file
- + Validation catches the 'model ignored evidence' problem mechanically
- - More code changes across schema, tools, and prompts
- - New fields (sourceUrl, originalQuery) need migration consideration for existing plans
- - read_plan_context tool adds API surface to maintain
- - Risk of over-engineering - building tools for problems that prompts might solve

**Assumptions**:
- Prompts alone won't be reliable enough - some mechanical enforcement is needed
- Evidence metadata will be used beyond the plan lifecycle (referenced in other contexts)
- The added complexity is justified by making evidence a first-class, structured system


### Approach: Prompt-Plus-Tools

**Description**: Combined approach: prompts set the behavior expectations, tools enforce and enable them. Specifically: (1) PROMPTS: Update explore_idea to instruct proactive evidence capture when user asks for research. Update shape_approach, build_plan, execute_plan to require re-reading all plan artifacts before proceeding. Add guidance on descriptive evidence file naming. (2) SCHEMA: Add sourceUrl and originalQuery fields to evidence schema. Fix MCP server registration to expose ALL evidence fields (source, gatheringMethod, relevanceScore, summary, content, sourceUrl, originalQuery). (3) TOOLS: Create a read_plan_context tool (or enhance riotplan_status) that returns a consolidated view of IDEA.md + SHAPING.md + evidence file list + recent history - giving the model one call to load all context at transition points. Update inline evidence file naming to use descriptive patterns instead of timestamps. (4) VALIDATION: Add a check during build_plan that warns if evidence/ has files but the generated steps don't reference them. Not blocking, just a warning. This is belt-and-suspenders: prompts tell the model what to do, tools make it easy to do it right, and validation catches when it doesn't.

**Tradeoffs**:
- + Prompts guide behavior, tools enforce it - defense in depth
- + Structured metadata (sourceUrl, originalQuery) makes evidence useful beyond the plan
- + read_plan_context makes re-reading artifacts trivially easy - one tool call instead of many
- + Validation catches the 'model ignored evidence' failure mode
- + Descriptive file naming makes evidence browsable
- + Gets evidence right as a first-class system
- - Most work of all approaches - touches prompts, schema, tools, and validation
- - Need to coordinate changes across multiple files
- - read_plan_context adds API surface to maintain
- - New schema fields need consideration for backward compatibility with existing plans

**Assumptions**:
- Neither prompts nor tools alone are sufficient - both are needed
- The investment is worth it because evidence is foundational to plan quality
- Backward compatibility can be handled gracefully (new fields are optional)
- A consolidated context view is more useful than forcing the model to make many individual read calls


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Prompt-Plus-Tools

**Reasoning**: Neither prompts nor tools alone are sufficient. Prompts guide behavior, tools make it easy to do the right thing, and validation catches failures. The user wants to get evidence right as a first-class system and is comfortable with the investment. This combined approach provides defense in depth.

**Selected At**: 2026-02-08T05:30:11.947Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-08T05:26:54.749Z
**Next**: Select an approach and transition to 'built'




## Files at This Point

- IDEA.md
- LIFECYCLE.md
- SHAPING.md

## Recent Timeline

- 2/7/2026, 9:22:29 PM: note_added - {"note":"INVESTIGATION: Evidence file naming - currently inline evidence uses evidence-{timestamp}.md (e.g., evidence-1234567890.md). The types define recognized patterns: what-happened-in-*.md, research-*.md, analysis-*.md, example-*.md (from PLAN_CONVENTIONS.evidencePatterns). File references can use any name. Recommendation: for model-gathered evidence, use descriptive names matching patterns (research-voice-tone-standards.md) rather than timestamp-based names. Timestamp names make it hard to identify content without reading the file."}
- 2/7/2026, 9:22:46 PM: narrative_chunk - {"content":"Full investigation of current RiotPlan evidence implementation completed. Key findings:\n\nWHAT ALREADY EXISTS:\n- Evidence is already an MCP resource (list + read individual files)\n- riotplan_idea_add_evidence supports both file references and inline content creation\n- The tool schema has metadata fields (source, gatheringMethod, relevanceScore, summary) but the MCP server registration doesn't expose them - only evidencePath, description, and path are wired through\n- Evidence directory is already non-hidden (evidence/, not .evidence/)\n- explore_idea and shape_approach prompts reference evidence gathering\n- Evidence file patterns are defined in PLAN_CONVENTIONS\n\nWHAT'S MISSING:\n1. MCP server registration doesn't pass through the full evidence schema - metadata fields are dead code\n2. Key metadata fields not in schema at all: source URL, original query/question, retrieval date\n3. No prompt instructions to READ evidence before creating implementation steps (the 'model not reading evidence' bug)\n4. No proactive evidence capture behavior - prompts ask about evidence but don't instruct the model to capture findings automatically\n5. History directory still uses .history/ dot-prefix (evidence/ is already correct)\n6. Inline evidence uses timestamp-based filenames instead of descriptive names\n\nTWO BUGS ANALYZED:\n1. step_add wrong directory - code looks correct in current codebase (uses getPlanDir() which returns plan/ subdirectory). May have been fixed already or may be a path resolution edge case. Needs reproduction.\n2. Model not reading evidence - workflow/prompt gap, not code bug. Prompts tell model to gather evidence but never tell it to read evidence when creating steps. Fix is to add instructions to build/execute prompts.\n\nCONCRETE WORK ITEMS EMERGING:\n1. Fix MCP server registration to expose full evidence schema (source, gatheringMethod, relevanceScore, summary, content)\n2. Add sourceUrl, originalQuery fields to evidence schema\n3. Update explore_idea prompt to instruct proactive evidence capture during research\n4. Update build/execute prompts to instruct reading evidence before creating steps\n5. Improve evidence file naming (descriptive names instead of timestamps)\n6. Rename .history/ to history/ (separate concern but identified here)\n7. Verify/reproduce step_add directory bug","source":"typing","context":"Full investigation synthesis after reading bug reports, exploring codebase, and analyzing current evidence implementation","speaker":"user"}
- 2/7/2026, 9:24:51 PM: narrative_chunk - {"content":"User clarifies the core problem: When developing a plan from an idea, the model isn't actually reading the IDEA.md, evidence files, or history. It's working from conversation memory instead. The user is dictating via voice in Cursor right now and questions whether the model is even looking at the plan files or just using what it remembers from the conversation. This is the fundamental issue - the model has the conversation context and uses that instead of reading the structured plan artifacts. When it transitions from idea to shaping to building, it should be re-reading the plan files, not relying on conversation memory which is lossy and may not include everything captured in the plan.","source":"voice","context":"User questioning whether the model actually reads plan files during transitions or just works from conversation memory","speaker":"user"}
- 2/7/2026, 9:26:53 PM: constraint_added - {"constraint":"At every stage transition (idea→shaping, shaping→build, build→execute), prompts MUST instruct the model to re-read all plan artifacts (IDEA.md, SHAPING.md, evidence/ files, recent history) before proceeding. The model must never rely on conversation memory alone - the plan files are the source of truth, not the context window."}
- 2/7/2026, 9:26:54 PM: shaping_started - {}
- 2/7/2026, 9:27:11 PM: approach_added - {"name":"Prompt-First","description":"Fix the problem primarily through prompt changes. Update explore_idea, shape_approach, build_plan, and execute_plan prompts to: (1) instruct proactive evidence capture when the user asks for research, (2) require re-reading all plan artifacts at stage transitions, (3) use descriptive evidence file names. Also fix the MCP server registration to expose the full evidence schema that already exists in the tool code. Minimal code changes - mostly prompt engineering plus the server.ts registration fix.","tradeoffs":["+ Cheapest to implement - mostly editing markdown prompt files","+ Aligned with RiotPlan's prompt-based architecture","+ No new tools or APIs to maintain","+ Can ship incrementally - one prompt at a time","- Relies on model compliance - prompts are suggestions, not enforcement","- Different models may follow prompts with varying fidelity","- No validation that evidence was actually read or captured","- Dead metadata fields get fixed but no new fields (sourceUrl, originalQuery) added"],"assumptions":["Models will reliably follow prompt instructions for evidence capture","The existing evidence tool schema is sufficient once properly exposed","Users will trigger evidence capture through natural language ('go look up X') that the model can detect from prompt guidance"]}
- 2/7/2026, 9:27:20 PM: approach_added - {"name":"Tool-Enhanced","description":"Fix through a combination of prompt changes AND tool/schema enhancements. Everything in the Prompt-First approach, PLUS: (1) Add sourceUrl and originalQuery fields to the evidence schema, (2) Fix MCP server registration to expose ALL evidence fields, (3) Add a 'read_plan_context' tool or behavior that aggregates IDEA.md + evidence + history into a single context payload for stage transitions, (4) Update inline evidence file naming to use descriptive names based on content patterns (research-*.md, analysis-*.md) instead of timestamps, (5) Consider adding validation that warns if evidence exists but wasn't referenced in generated steps.","tradeoffs":["+ Structured metadata makes evidence useful long-term (searchable, queryable)","+ read_plan_context tool makes re-reading artifacts a single call instead of hoping the model does it","+ Descriptive filenames make evidence browsable without reading each file","+ Validation catches the 'model ignored evidence' problem mechanically","- More code changes across schema, tools, and prompts","- New fields (sourceUrl, originalQuery) need migration consideration for existing plans","- read_plan_context tool adds API surface to maintain","- Risk of over-engineering - building tools for problems that prompts might solve"],"assumptions":["Prompts alone won't be reliable enough - some mechanical enforcement is needed","Evidence metadata will be used beyond the plan lifecycle (referenced in other contexts)","The added complexity is justified by making evidence a first-class, structured system"]}
- 2/7/2026, 9:28:52 PM: narrative_chunk - {"content":"User says we need both prompt and tool enhancement. Not worried about over-engineering, wants to get this right. Looking for an approach that combines both - prompts for guidance and tools for enforcement. Comfortable with the investment.","source":"voice","context":"User responding to the two shaping approaches, wanting a combined approach","speaker":"user"}
- 2/7/2026, 9:29:06 PM: approach_added - {"name":"Prompt-Plus-Tools","description":"Combined approach: prompts set the behavior expectations, tools enforce and enable them. Specifically: (1) PROMPTS: Update explore_idea to instruct proactive evidence capture when user asks for research. Update shape_approach, build_plan, execute_plan to require re-reading all plan artifacts before proceeding. Add guidance on descriptive evidence file naming. (2) SCHEMA: Add sourceUrl and originalQuery fields to evidence schema. Fix MCP server registration to expose ALL evidence fields (source, gatheringMethod, relevanceScore, summary, content, sourceUrl, originalQuery). (3) TOOLS: Create a read_plan_context tool (or enhance riotplan_status) that returns a consolidated view of IDEA.md + SHAPING.md + evidence file list + recent history - giving the model one call to load all context at transition points. Update inline evidence file naming to use descriptive patterns instead of timestamps. (4) VALIDATION: Add a check during build_plan that warns if evidence/ has files but the generated steps don't reference them. Not blocking, just a warning. This is belt-and-suspenders: prompts tell the model what to do, tools make it easy to do it right, and validation catches when it doesn't.","tradeoffs":["+ Prompts guide behavior, tools enforce it - defense in depth","+ Structured metadata (sourceUrl, originalQuery) makes evidence useful beyond the plan","+ read_plan_context makes re-reading artifacts trivially easy - one tool call instead of many","+ Validation catches the 'model ignored evidence' failure mode","+ Descriptive file naming makes evidence browsable","+ Gets evidence right as a first-class system","- Most work of all approaches - touches prompts, schema, tools, and validation","- Need to coordinate changes across multiple files","- read_plan_context adds API surface to maintain","- New schema fields need consideration for backward compatibility with existing plans"],"assumptions":["Neither prompts nor tools alone are sufficient - both are needed","The investment is worth it because evidence is foundational to plan quality","Backward compatibility can be handled gracefully (new fields are optional)","A consolidated context view is more useful than forcing the model to make many individual read calls"]}
- 2/7/2026, 9:30:11 PM: approach_selected - {"approach":"Prompt-Plus-Tools","reason":"Neither prompts nor tools alone are sufficient. Prompts guide behavior, tools make it easy to do the right thing, and validation catches failures. The user wants to get evidence right as a first-class system and is comfortable with the investment. This combined approach provides defense in depth."}

---

This checkpoint captures the state of the plan at this moment in time.
You can restore to this checkpoint using: `riotplan_checkpoint_restore({ checkpoint: "plan-steps-created" })`
