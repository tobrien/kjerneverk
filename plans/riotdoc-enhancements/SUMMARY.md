# RiotDoc Enhancements

## Objective

Transform RiotDoc from a basic document creation tool into a template-driven system where templates act as scripts that tell prompts what to ask, when to ask it, and what approaches to offer. Fix critical narrative capture bug and add version numbering and outline tools.

**Core Innovation**: Templates don't just define structure - they drive the entire user experience by telling prompts what questions to ask at each phase.

## Why This Matters

Documents have fundamentally different lifecycles than plans (IDEA.md). Blog posts are one-time creations. Charters are living documents that evolve continuously. RiotDoc must support both while preserving the narrative and deliberation that goes into creating them.

**User Pain Point** (Timeline Event 72): Current templates ask too many questions upfront. When writing a blog post, you care about title/topic/angle NOW, but SEO/categories/tags are "after the fact concerns." Templates need to split questions by lifecycle phase.

**Critical Bug** (Timeline Event 72): Narrative capture only saves to timeline.jsonl, not .history/prompts/. User frustrated: "I'm really not happy that I have to go back and tell you this again."

## Value

1. **Faster document creation**: Templates guide users through the right questions at the right time
2. **Better quality**: Conversational flow (2-5 questions at a time) vs overwhelming question dumps
3. **Flexibility**: Different approaches for different situations (quick draft vs structured vs multi-doc series)
4. **Context preservation**: Full narrative capture to .history/prompts/ for future reference
5. **Version control**: Clear progression from v0.1 drafts to v1.0 published documents

## Scope

### In Scope

**Phase 1: Template Foundation** (Evidence: podcast-script-template.md already has this right)
- Canonical template structure with TWO question phases: Idea/Draft and Publishing
- Approach/shape definitions (Quick & Direct, Structured, Multi-Doc Series)
- Markdown format with well-defined sections (not YAML - Timeline Event 89)
- Revise blog-post template (currently "too heavy" - Timeline Event 72)
- Add CC/BCC to email template (user noted missing - Timeline Event 72)

**Phase 2: Infrastructure** (Copy from /Users/tobrien/gitw/kjerneverk/riotplan)
- History mechanism (timeline.jsonl)
- Checkpoint mechanism (.history/checkpoints/)
- **FIX NARRATIVE BUG**: Save to BOTH timeline.jsonl AND .history/prompts/NNN-xxx.md
- Auto-number prompt files (001, 002, 003...)

**Phase 3: Version & Outline** (Constraints from IDEA.md lines 55, 53)
- Version numbering: v0.1 → v1.0 (user-controlled, not automatic)
- Outline manipulation tools: insert section, move section, delete section
- Direct editing primary, MCP tools optional

**Phase 4: Prompt Updates** (Timeline Event 88: "This is where the real value is")
- Prompts READ templates dynamically at runtime (Timeline Event 85)
- Ask 2-5 questions per turn, conversationally (Timeline Event 89)
- Present approaches from template definitions
- Integrate with narrative/checkpoint tools

**Phase 5: Testing** (Focus on most-used templates - IDEA.md line 49)
- Blog post workflow (most used)
- Podcast script workflow (most used)
- Verify narrative capture works correctly

### Out of Scope

- Shared infrastructure library (Timeline Event 80: "I don't want you to create a third project")
- Multi-user collaboration (IDEA.md line 57: "Audience of one")
- Complex approval workflows (IDEA.md line 57: "Don't overcomplicate")
- Living document versioning minor vs major (IDEA.md line 59: "Not relevant for v1")
- Automatic outline-to-document sync (IDEA.md line 53: "Don't worry about document sync")
- Project plan and research paper templates (user: "I don't really care about it too much")

## Success Criteria

1. **Templates drive prompts**: explore_idea reads "Idea/Draft Phase Questions" from template to know what to ask (Timeline Event 85)
2. **Lifecycle-aware questions**: Blog post asks title/topic/angle upfront, SEO/categories later (Timeline Event 72)
3. **Narrative bug fixed**: Saves to BOTH timeline.jsonl AND .history/prompts/ (Timeline Event 72)
4. **Conversational flow**: Prompts ask 2-5 questions at a time, not all at once (Timeline Event 89)
5. **Approaches work**: User can select Quick Draft vs Structured vs Multi-Post Series (Timeline Event 89)
6. **Version numbering**: User can increment v0.1 → v0.2 → v1.0 manually (IDEA.md line 55)
7. **Outline tools**: Can insert/move/delete sections via MCP tools (IDEA.md line 53)
8. **Blog & podcast workflows**: Both templates work end-to-end (IDEA.md line 49)

## Context

This plan synthesizes:
- **77 timeline events** including 5 narrative chunks with detailed user feedback
- **5 template prototypes** in evidence/ (podcast script is the model to follow)
- **9 constraints** from IDEA.md that must be honored
- **Selected approach** from shaping: Template-First with Copy-Paste Infrastructure
- **User frustrations**: Narrative bug, missing podcast script, templates too heavy
- **Key insight**: Templates are scripts that drive prompts, not just data structures
