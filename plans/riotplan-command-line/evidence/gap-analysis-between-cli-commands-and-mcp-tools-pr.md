# Evidence: Gap analysis between CLI commands and MCP tools-prompts-resources

**Source**: codebase analysis
**Original Query**: What is the gap between CLI commands and MCP tools/prompts/resources?
**Added**: 2026-02-09T14:03:51.135Z
**Gathering Method**: model-assisted

---

## Current CLI Commands (from riotplan --help)
- amend - Provide amendment feedback on a plan
- amendments - View plan amendments
- analysis - Analysis management commands
- check-config - Show current configuration resolution and validation
- create - Interactively create a new plan
- elaborate - Add elaboration feedback to analysis
- feedback - Feedback management commands
- generate - Generate plan files from analysis or prompt
- plan - Plan management commands (init, validate, archive, template)
- render - Render plan to various formats
- status - Show plan status
- step - Manage plan steps (list, start, complete, add)
- verify - Verify plan alignment and completion

## MCP Tools (36 total) - NOT available in CLI
Full lifecycle support:
- Idea stage: idea_create, idea_add_note, idea_add_constraint, idea_add_question, idea_add_evidence, idea_add_narrative, idea_kill
- Shaping stage: shaping_start, shaping_add_approach, shaping_add_feedback, shaping_add_evidence, shaping_compare, shaping_select
- Build: riotplan_build (generates PROVENANCE.md, EXECUTION_PLAN.md, SUMMARY.md, step files)
- Checkpoints: checkpoint_create, checkpoint_list, checkpoint_show, checkpoint_restore
- History: history_show
- Catalysts: catalyst_list, catalyst_show, catalyst_associate
- Context: read_context
- Reflection: step_reflect, generate_retrospective
- Transition: transition between lifecycle stages

## MCP Prompts (8 workflow templates) - NOT available in CLI
- explore_idea - Guided idea exploration
- shape_approach - Compare approaches and decide
- create_plan - AI-generated plan creation
- develop_plan - Refine generated plan
- execute_plan - Execute with state management
- execute_step - Single step execution with tracking
- track_progress - Monitor progress
- generate_retrospective - Generate retrospective report

## MCP Resources (read-only access) - NOT available in CLI
- Plan metadata, status, steps, individual step content
- IDEA.md, SHAPING.md, timeline, prompts, evidence files, checkpoints

## Key Gap
The CLI has NONE of the lifecycle tools (idea, shaping, checkpoint, history, catalyst). The MCP prompts define the actual RiotPlan user experience (explore, shape, build, execute) but have no CLI equivalent. The CLI was built around an older "analysis → generate" workflow that predates the lifecycle model.