# Evidence: CLI control advantage over MCP - enforceable tool scoping and plan integrity

**Source**: architectural analysis
**Original Query**: Capture the CLI control advantage for later documentation
**Added**: 2026-02-09T14:45:09.892Z
**Gathering Method**: model-assisted

---

## CLI Control Advantage: Enforceable Tool Scoping

### The Problem with MCP/Cursor

In Cursor, the model has access to ALL of Cursor's native tools (file editing via StrReplace, shell via Shell, file writing via Write, etc.) PLUS all MCP tools from RiotPlan. The MCP server offers structured tools for plan management, but **it cannot prevent the model from bypassing them**.

Examples of what can happen in Cursor that RiotPlan can't prevent:
- Model runs `cat > IDEA.md` to overwrite the idea file directly
- Model uses StrReplace to edit SHAPING.md, bypassing the shaping tools
- Model writes to plan files directly without updating the timeline
- Model creates files in the plan directory that don't follow conventions

The MCP server provides structure but cannot enforce it.

### The CLI Advantage: Tool Set IS the Model's World

When the CLI spins up the LLM, the tools registered with the model are the **only** things it can do. This enables precise, per-command tool scoping:

#### `riotplan explore` tool set:
- **Read-only file tools**: `read_file`, `list_files`, `grep` (see the codebase, can't touch it)
- **RiotPlan idea tools**: `idea_add_note`, `idea_add_constraint`, `idea_add_question`, `idea_add_evidence`, `idea_add_narrative` (structured modifications only)
- **Research tools**: `web_search` for evidence gathering
- **NO file write tools** — model physically cannot edit files

#### `riotplan build` tool set:
- **Read-only file tools**: same as explore
- **RiotPlan build tools**: `read_context`, `build`, plan generation
- **NO file write tools** — plan generation goes through RiotPlan's generator

#### `riotplan execute` tool set:
- **Full file tools**: `read_file`, `list_files`, `grep`, `write_file`, `edit_file`
- **RiotPlan step tools**: `step_start`, `step_complete`, `step_reflect`
- **Shell tools**: `run_command` for testing, building, etc.
- **Broader access** because execution requires actual code changes

#### `riotplan chat` tool set:
- **Everything** — full access for ad-hoc work

### Why This Matters

1. **Plan integrity is enforceable.** During exploration, every plan modification goes through RiotPlan's structured tools. The timeline gets updated. The format stays consistent. Nothing gets corrupted by direct file edits.

2. **Intent matches capability.** Exploration is read-and-think. Building is generate. Execution is do. Each command's tool set matches what that phase actually requires.

3. **Security by design, not convention.** In Cursor, "don't edit plan files directly" is a prompt instruction the model might ignore. In the CLI, it's a physical impossibility — the tool doesn't exist.

4. **Auditable.** Every plan modification has a paper trail because it went through a RiotPlan tool that logs to the timeline.

### Documentation Value

This should be highlighted as a feature of the CLI approach:
- "RiotPlan CLI provides enforceable tool boundaries that IDE integrations cannot offer"
- "Each command operates with precisely the tools its phase requires"
- "Plan integrity is guaranteed by architecture, not by prompt instructions"