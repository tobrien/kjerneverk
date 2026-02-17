# Evidence: Quality comparison - Cursor vs rp_build generated plans

**Source**: manual comparison
**Original Query**: Compare plan quality between Cursor and rp_build generated plans
**Added**: 2026-02-12T16:55:19.583Z
**Gathering Method**: model-assisted

---

## Plan Quality Comparison

### riotplan-command-line (Cursor-generated, 7 steps) - HIGH QUALITY
Characteristics:
- Names specific files: `execution/src/index.ts`, `agentic/src/loop.ts`, `riotplan/src/cli/commands/explore.ts`
- References actual classes/methods: `ConversationManager`, `AgentLoop`, `executeStream()`, `ToolRegistry`
- Tasks are concrete checkboxes: "Add `tools` parameter to the `Request` interface"
- Has "Key Files" sections listing exact paths
- Has "Dependencies" sections showing step ordering
- "Background" sections explain WHY with reference to existing code
- Each step reads like a developer who studied the codebase

### riotplan-format (rp_build-generated, 5 steps) - LOW QUALITY
Characteristics:
- Placeholder "Files Changed" sections: `_List files that will be modified..._`
- Tasks numbered generically: "01.1 Design core entity tables: plans (id, name...)"
- References evidence files but not actual code
- No "Key Files" or "Dependencies" sections
- Background references concepts not specific implementations
- Each step reads like a consultant who read requirements but never saw code

### What makes Cursor plans better:
1. Cursor has full codebase access (read files, grep, list directories)
2. Cursor iterates - it reads code, thinks, reads more, drafts
3. Cursor knows the actual file structure, interface names, method signatures
4. Cursor can verify that proposed changes align with existing patterns