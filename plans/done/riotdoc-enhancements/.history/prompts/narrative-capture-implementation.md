# Checkpoint: narrative-capture-implementation

**Timestamp**: 2026-01-29T23:19:26.606Z
**Stage**: idea
**Message**: Captured state during discussion about implementing prompt/narrative capture feature. User frustrated that feature was discussed but not implemented. This checkpoint preserves the full conversation about why this feature is critical and what needs to be done.

## Current State

**Current Stage**: idea

### IDEA.md

# Idea: riotdoc-document-lifecycle

## Core Concept

A document-focused system similar to RiotPlan but designed for creating, drafting, revising, and managing documents with different lifecycles than plans. Documents can be blog posts, reference docs, charters, living standards - each with unique requirements for voice, tone, audience, structure, versioning, and revision tracking.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Key difference from RiotPlan: Plans are temporary with clear execution endpoints (idea → plan → execute → retrospective → archive). Documents have varied lifecycles - some are one-time (blog posts), others are living standards (charters, constitutions) that evolve continuously.
- Proposed document creation flow: idea → evidence/references gathering → planning (objectives, audience, voice, tone, structure) → draft generation → review/revision cycles → versioning/finalization
- Documents need metadata that plans don't: voice, tone, audience, format requirements, reference style, structural elements (TOC, index), example documents to emulate
- Shared infrastructure with RiotPlan: history mechanism, checkpoint mechanism, similar MCP patterns for prompts/tools/resources. But different entities: sections instead of steps, drafts instead of execution states
- Industry standard document lifecycle (OASIS, IETF, W3C): Working Draft → Review/Feedback → Approval → Publication → Maintenance. Key principle: documents don't revert to earlier stages once advanced. Some orgs use "standing rules" to streamline approval processes.
- ISO/IEC/IEEE 26531:2023 covers content management for product lifecycles, including how content is gathered, managed, and published through component content management systems (CCMS). Applies to both printed and electronic information.
- Versioning standards: RFC 3253 defines WebDAV versioning extensions including automatic versioning, version history management, workspace management, and URL namespace versioning. ISO 19475:2021 covers storage requirements for maintaining authenticity, integrity, and readability.
- Proposed RiotDoc lifecycle synthesis: Idea → Evidence/References → Outline/Planning → Draft (v0.1) → Review/Revision cycles (v0.2, v0.3...) → Approval/Finalization (v1.0) → Publication → Maintenance (v1.1, v1.2...). Living documents may skip "final" state and remain in continuous maintenance.
- Document types are essential and should affect workflow. Examples: blog posts (title, subtitle, tags, categories, short length) vs charters (complex, set format, long). RiotDoc should ship with well-known document types but be flexible for user-defined templates. Document type changes the questions asked during idea exploration.
- Outline phase is critical: Idea → Outline/Structure → Draft. Outline defines structure (chapters, sections) and triggers feedback cycles. Outline should remain accessible after draft creation to allow reordering sections ("move this section before that section").
- Draft generation strategy spectrum: (1) User writes draft in idea phase, AI refines it preserving voice ("don't change it too much, I own this voice"), (2) User provides stream-of-consciousness thoughts/evidence, AI writes full draft, (3) Hybrid approach. Ask user upfront which strategy they prefer, similar to RiotPlan's shaping approach selection.
- Revision tracking: Use separate files (draft-v0.1.md, draft-v0.2.md, etc.) for simplicity. Future could explore diffs or embedded formats, but start simple with separate files. File size is not a concern.
- Example documents can be: (1) file path reference to emulate, (2) copied into project, (3) URL to document. Use cases: emulation (style/tone reference) or evidence. Style/tone is bigger than individual documents - may be application-level context, discuss separately.
- Shared infrastructure decision: Copy/paste history and checkpoint code from RiotPlan to RiotDoc for now (keep in sync manually). Don't create shared library yet - there are existing projects that can be resuscitated later. Priority: history first, checkpoint second. Easier to copy/paste initially, ensure doesn't drift too far.
- Refined lifecycle with outline phase: Idea → Evidence/References → Outline/Structure → Draft Generation Strategy Selection → Draft (v0.1) → Review/Revision (v0.2+) → Approval/Finalization (v1.0) → Publication → Maintenance (v1.1+). Living documents may skip finalization.
- MCP integration: RiotDoc should expose MCP tools for document creation, outline manipulation, draft generation, revision tracking, and version management. Similar pattern to RiotPlan's MCP tools but adapted for document workflow.
- Built-in document types for v1: (1) Blog Post - most used, (2) Podcast Script - most used, (3) Email, (4) Project Plan, (5) Research Paper. Focus on blog post and podcast script as primary use cases.
- Template system: Could be YAML, JSON, or Markdown. Need to prototype and show what it looks like, then iterate from there. Flexible approach.
- Outline manipulation: Primary method is direct editing of outline file. Optional MCP tools: "review outline" or "alter outline" for programmatic changes. Future consideration: when outline changes, potentially update associated document structure automatically. Don't worry about document sync for now.
- Version numbering: Start at v0.1. User-controlled increment. Drafts can go v0.1 → v0.2 → ... → v0.99+. When user is comfortable, they explicitly update to v1.0 (published status). This is a manual decision point, not automatic.
- Approval/finalization: Audience of one (single user). No complex approval workflows or multi-user collaboration for v1. User decides when to finalize. Don't overcomplicate with migrations or multi-user features.
- Living documents: Don't distinguish between minor/major updates for v1. Not a relevant question yet. Keep it simple.
- RiotPlan location: Sibling directory to RiotDoc. Can reference for history/checkpoint implementation patterns.
- IMPORTANT: Need to capture narrative conversation feedback in RiotPlan/RiotDoc. This conversational exploration is valuable and should be saved as part of the idea/planning process. RiotPlan was rebuilt to support this.
- RiotPlan has a feedback system that preserves deliberation, not just decisions. Creates numbered feedback records (001-xxx.md) with: what was proposed, feedback given, discussion, resolution, changes made, open questions, participants, platform, plan version. This narrative conversation capture should be adapted for RiotDoc.
- RiotDoc already exists at /Users/tobrien/gitw/kjerneverk/riotdoc with: document types (blog-post, podcast-script, technical-doc, newsletter, custom), assistance levels (generate, expand, revise, cleanup, spellcheck), lifecycle status (idea, outlined, drafting, revising, final, exported), voice config, objectives, evidence tracking, draft history. Missing: feedback/narrative capture, version numbering (v0.1, v1.0), document type templates, outline manipulation tools.
- Current RiotDoc has 4 built-in types but missing: email, project-plan, research-paper. Has: blog-post ✓, podcast-script ✓, technical-doc, newsletter. Need to add the missing types and ensure blog-post and podcast-script are well-developed since those are most used.
- CRITICAL ISSUE: The /riotplan/explore_idea Cursor prompt does not have access to riotplan_idea_add_narrative tool. User's full voice narrative responses are NOT being captured to timeline, only extracted structured notes. Need to fix the Cursor prompt to include narrative capture tool, or manually save narrative chunks. The raw conversational text is valuable context that should be preserved in timeline.jsonl as 'narrative_chunk' events.
- CORRECTION: Podcast script IS already in RiotDoc types. What's MISSING: email, project-plan, research-paper. What EXISTS: blog-post ✓, podcast-script ✓, technical-doc, newsletter, custom. Blog-post and podcast-script are the two most-used types and should be prioritized.

## Constraints

- _Add constraints..._
- Must support specifying reference format requirements (APA, MLA, Chicago, IEEE, etc.)
- Must support structural requirements like table of contents, index, appendices
- Must allow providing example documents as style/tone references
- Must support both one-time documents (blog posts) and living documents (charters, standards) with continuous evolution
- Must support user-defined document type templates that modify the workflow and questions asked
- Must have distinct outline/structure phase between idea and draft, with outline remaining editable after draft creation
- Must ask user upfront about draft generation strategy (preserve user voice vs AI-generated vs hybrid)
- Revision tracking must use separate files (draft-v0.1.md, draft-v0.2.md, etc.) for initial implementation
- Must capture narrative conversation feedback similar to RiotPlan's feedback system - preserving deliberation about document decisions

## Questions

- _Add questions..._
- What is the standard document lifecycle? Are there industry standards (ISO, IEEE, etc.) that define document states and transitions?
- How should versioning work? Automatic version bumps on revision vs manual version control? What constitutes a "final" version vs ongoing revisions?
- Should the idea phase include narrative arc, argument structure, and section planning? Or does that belong in a separate "outline" phase?
- How do we handle different document types (blog post, charter, reference doc, living standard) with potentially different lifecycles in the same system?
- What built-in document types should ship with RiotDoc v1? (blog post, charter, research paper, email, technical spec, etc.) What metadata/workflow does each need?
- How do users define custom document type templates? YAML config? JSON schema? What properties can be customized (fields, workflow stages, questions)?
- Should outline manipulation be command-based ("move section 3 before section 2") or interactive/visual? How does this work in MCP context?
- When does a draft version number increment? On every revision? On user command? What triggers v0.1 → v0.2 vs v1.0 → v1.1?
- How do we handle the transition from "draft" (v0.x) to "published" (v1.0)? Is there an approval/finalization step? Who approves?
- For living documents that never reach "final", how do we distinguish between minor updates (typos) and major revisions (content changes)?
- Where is RiotPlan located? Need to reference its history and checkpoint implementation to copy into RiotDoc.

## Evidence

_Attach relevant documents, images, or files_

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-29T22:56:18.887Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._




## Files at This Point

- IDEA.md
- LIFECYCLE.md

## Recent Timeline

- 1/29/2026, 3:13:00 PM: note_added - {"note":"Approval/finalization: Audience of one (single user). No complex approval workflows or multi-user collaboration for v1. User decides when to finalize. Don't overcomplicate with migrations or multi-user features."}
- 1/29/2026, 3:13:01 PM: note_added - {"note":"Living documents: Don't distinguish between minor/major updates for v1. Not a relevant question yet. Keep it simple."}
- 1/29/2026, 3:13:02 PM: note_added - {"note":"RiotPlan location: Sibling directory to RiotDoc. Can reference for history/checkpoint implementation patterns."}
- 1/29/2026, 3:13:03 PM: note_added - {"note":"IMPORTANT: Need to capture narrative conversation feedback in RiotPlan/RiotDoc. This conversational exploration is valuable and should be saved as part of the idea/planning process. RiotPlan was rebuilt to support this."}
- 1/29/2026, 3:14:28 PM: note_added - {"note":"RiotPlan has a feedback system that preserves deliberation, not just decisions. Creates numbered feedback records (001-xxx.md) with: what was proposed, feedback given, discussion, resolution, changes made, open questions, participants, platform, plan version. This narrative conversation capture should be adapted for RiotDoc."}
- 1/29/2026, 3:14:29 PM: constraint_added - {"constraint":"Must capture narrative conversation feedback similar to RiotPlan's feedback system - preserving deliberation about document decisions"}
- 1/29/2026, 3:14:40 PM: note_added - {"note":"RiotDoc already exists at /Users/tobrien/gitw/kjerneverk/riotdoc with: document types (blog-post, podcast-script, technical-doc, newsletter, custom), assistance levels (generate, expand, revise, cleanup, spellcheck), lifecycle status (idea, outlined, drafting, revising, final, exported), voice config, objectives, evidence tracking, draft history. Missing: feedback/narrative capture, version numbering (v0.1, v1.0), document type templates, outline manipulation tools."}
- 1/29/2026, 3:14:41 PM: note_added - {"note":"Current RiotDoc has 4 built-in types but missing: email, project-plan, research-paper. Has: blog-post ✓, podcast-script ✓, technical-doc, newsletter. Need to add the missing types and ensure blog-post and podcast-script are well-developed since those are most used."}
- 1/29/2026, 3:18:23 PM: note_added - {"note":"CRITICAL ISSUE: The /riotplan/explore_idea Cursor prompt does not have access to riotplan_idea_add_narrative tool. User's full voice narrative responses are NOT being captured to timeline, only extracted structured notes. Need to fix the Cursor prompt to include narrative capture tool, or manually save narrative chunks. The raw conversational text is valuable context that should be preserved in timeline.jsonl as 'narrative_chunk' events."}
- 1/29/2026, 3:18:25 PM: note_added - {"note":"CORRECTION: Podcast script IS already in RiotDoc types. What's MISSING: email, project-plan, research-paper. What EXISTS: blog-post ✓, podcast-script ✓, technical-doc, newsletter, custom. Blog-post and podcast-script are the two most-used types and should be prioritized."}

---

This checkpoint captures the state of the plan at this moment in time.
You can restore to this checkpoint using: `riotplan_checkpoint_restore({ checkpoint: "narrative-capture-implementation" })`
