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
