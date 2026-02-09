# Evidence: Riotplan codebase analysis - catalyst integration points

**Source**: codebase analysis
**Original Query**: Explore riotplan source code for catalyst integration points
**Added**: 2026-02-08T17:17:28.083Z
**Gathering Method**: model-assisted

---

## Key Integration Points for Catalyst System

### Config System (src/config/)
- Uses Zod for validation, CardiganTime for loading
- Config schema: planDirectory, defaultProvider, defaultModel, templateDirectory
- Hierarchical discovery: walks up directory tree looking for riotplan.config.* or .riotplan/config.*
- Environment variable override support
- Add catalyst config fields (catalysts array, catalyst directories) to RiotPlanConfigSchema

### Generator (src/ai/generator.ts)
- buildArtifactAwarePrompt() constructs labeled sections: PLAN NAME, CORE CONCEPT, CONSTRAINTS, SELECTED APPROACH, EVIDENCE, HISTORY CONTEXT, OPEN QUESTIONS, GENERATION INSTRUCTIONS
- GenerationContext interface carries all data to generator
- Token budget system with tiering for large artifact sets
- Inject catalyst content as new sections (CATALYST CONTEXT, CATALYST CONSTRAINTS, etc.)

### MCP Tools (src/mcp/)
- Pattern: Zod schema → implementation function → executor wrapper → McpTool definition
- Register via registerTool() in server.ts
- ToolExecutionContext provides session, mcpServer, sendNotification
- Add catalyst tools following same pattern

### Plan Structure
- Files: IDEA.md, SHAPING.md, LIFECYCLE.md, SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, PROVENANCE.md
- Directories: plan/, evidence/, feedback/, .history/
- No existing plan manifest file (plan.yaml would be new)
- loadPlan() discovers and parses all plan files

### Artifact Loading (src/ai/artifacts.ts)
- loadArtifacts() loads all artifacts in parallel
- ArtifactBundle interface carries everything to generator
- extractConstraints(), extractQuestions(), extractSelectedApproach() parse from markdown
- readEvidenceFiles() loads from evidence/ directory
- Extend with loadCatalystContent() and add to ArtifactBundle

### Lifecycle Touchpoints
- Idea: idea_create, idea_add_note/constraint/question/evidence/narrative
- Shaping: shaping_start, shaping_add_approach/feedback/evidence, shaping_compare, shaping_select
- Build: loadArtifacts() → buildArtifactAwarePrompt() → generatePlan() → write files
- Each phase is a catalyst integration point