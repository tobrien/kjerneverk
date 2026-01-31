# Execution Plan

## Strategy

**Template-First with Copy-Paste Infrastructure** (Selected Timeline Event 93)

Build template system first because templates are the SCRIPTS that drive the entire user experience (Timeline Event 85). Everything else supports this template-driven workflow.

**Why this order?** (Evidence from Timeline Event 80, 85, 88, 89):
1. Templates tell prompts what to ask → Must define templates first
2. Prompts need narrative capture working → Fix bug while copying infrastructure
3. Prompts orchestrate tools → Update prompts last when all tools exist
4. Speed matters → Copy-paste from RiotPlan, accept duplication

## Implementation Order

### Phase 1: Template Foundation (Steps 1-4)
**Why first?** Templates are scripts that drive prompts (Timeline Event 85). Can't update prompts until templates exist.

**Evidence-driven requirements**:
- Podcast script template ALREADY has correct structure (evidence/podcast-script-template.md)
- Blog post template needs major revision - user said "too heavy" (Timeline Event 72)
- Must split questions into TWO phases: Idea/Draft vs Publishing (Timeline Event 72)
- Must define approaches/shapes (Quick, Structured, Multi-Doc) (Timeline Event 89)
- Use markdown with well-defined sections, NOT YAML (Timeline Event 89)

### Phase 2: Infrastructure Copy-Paste (Steps 5-7)
**Why second?** Prompts need working narrative capture. User very frustrated about bug (Timeline Event 72, 81).

**Evidence-driven requirements**:
- Copy from `/Users/tobrien/gitw/kjerneverk/riotplan` (Timeline Event 80)
- FIX NARRATIVE BUG: Save to BOTH timeline.jsonl AND .history/prompts/ (Timeline Event 72)
- User said "I'm really not happy that I have to go back and tell you this again"
- Auto-number prompt files: 001-xxx.md, 002-xxx.md, etc.
- Accept code duplication - shared library later (Timeline Event 80)

### Phase 3: Version & Outline Tools (Steps 8-9)
**Why third?** Infrastructure must exist before adding tools that use it.

**Evidence-driven requirements**:
- Version numbering: v0.1 → v1.0, user-controlled (IDEA.md line 55, Constraint)
- Outline tools: insert, move, delete sections (IDEA.md line 53, Constraint)
- Direct editing primary, MCP tools optional (IDEA.md line 53)
- "create an outline and see what happens, iterate from there" (Timeline Event 64)

### Phase 4: Prompt Integration (Steps 10-11)
**Why fourth?** "This is where the real value is" (Timeline Event 88). Prompts need templates and tools to exist first.

**Evidence-driven requirements**:
- Prompts READ templates at runtime (Timeline Event 85)
- Ask 2-5 questions per turn, conversationally (Timeline Event 89)
- Present approaches from template (Timeline Event 89)
- "prompts execute the workflow, tools are the units of work, resources provide context" (Timeline Event 88)
- Symbiotic relationship between prompts, tools, resources (Timeline Event 88)

### Phase 5: Testing & Documentation (Step 12)
**Why last?** Validate everything works together.

**Evidence-driven requirements**:
- Focus on blog post and podcast script (most used - IDEA.md line 49)
- Test narrative capture works (user's biggest frustration)
- Test conversational question flow (2-5 at a time)
- Test approach selection

## Key Decisions (with Evidence)

### 1. Templates are markdown with well-defined sections
**Evidence**: Timeline Event 89 - "markdown with well-defined section names... I don't think we need to go full game [YAML]"
**Rationale**: Machine-readable through convention. Simpler than YAML. Easier for humans to read/edit.

### 2. Prompts read templates at runtime
**Evidence**: Timeline Event 85 - "explore idea should be looking at the idea draft phase section of podcast script template so that it knows like hey what's the episode called"
**Rationale**: Templates are scripts. Prompts are stable, templates are dynamic. Template tells prompt what to ask.

### 3. Code duplication is acceptable
**Evidence**: Timeline Event 80 - "copy paste from riot planned... I don't want you to create a third project"
**Rationale**: Speed matters. Shared library later when patterns stabilize.

### 4. Questions asked conversationally
**Evidence**: Timeline Event 89 - "ask you two or three at a time or four or five at a time like what we're doing now"
**Rationale**: Natural dialogue. Don't overwhelm user. Adapt based on responses.

### 5. Shapes/approaches defined in templates
**Evidence**: Timeline Event 89 - "Some plugs are really quick and direct... The other thing is like this idea... might be larger than one block"
**Rationale**: Different situations need different strategies. Template offers options.

### 6. Fix narrative bug IMMEDIATELY
**Evidence**: Timeline Event 72, 81 - User frustrated, mentioned multiple times
**Rationale**: Critical blocker. User losing valuable context. High priority.

### 7. Podcast script is the model
**Evidence**: evidence/podcast-script-template.md already has Idea/Draft Phase and Publishing Phase sections
**Rationale**: Don't reinvent. Copy what works. Other templates follow this pattern.

### 8. Blog post template needs major revision
**Evidence**: Timeline Event 72 - "too heavy... I'm gonna wanna focus on title Topic angle target length... categories an SCO is an after the fact concern"
**Rationale**: Current template asks wrong questions at wrong time. Must split by phase.

## Dependencies

- **RiotDoc codebase**: `/Users/tobrien/gitw/kjerneverk/riotdoc` (IDEA.md line 7)
- **RiotPlan codebase**: `/Users/tobrien/gitw/kjerneverk/riotplan` (source for copy-paste, IDEA.md line 61)
- **Template prototypes**: `evidence/` directory (5 files, Timeline Events 66-69, 77)
- **Podcast script template**: Model to follow (evidence/podcast-script-template.md)
- **Blog post template**: Needs revision (evidence/blog-post-template.md)

## Constraints (from IDEA.md lines 102-110)

All 9 constraints MUST be honored:
1. Reference format requirements (APA, MLA, Chicago, IEEE)
2. Structural requirements (TOC, index, appendices)
3. Example documents as style/tone references
4. One-time vs living documents
5. User-defined templates modify workflow
6. Distinct outline phase, outline remains editable
7. Draft generation strategy (preserve voice vs AI vs hybrid)
8. Separate revision files (draft-v0.1.md, draft-v0.2.md)
9. Narrative conversation feedback preservation

## Risks & Mitigations

### Risk 1: Prompt updates might break existing workflows
**Evidence**: Existing RiotDoc has prompts that work
**Mitigation**: Test thoroughly with blog post and podcast script. Keep old prompts as backup.

### Risk 2: Code duplication creates maintenance burden
**Evidence**: Timeline Event 80 - User accepts this tradeoff
**Mitigation**: Document what was copied. Plan for shared library when patterns stabilize. Fix bugs in both places for now.

### Risk 3: Template format might need iteration
**Evidence**: Timeline Event 89 - User willing to iterate
**Mitigation**: Start simple. Test with blog/podcast. Adjust based on usage.

### Risk 4: Narrative bug fix might break something
**Evidence**: Timeline Event 72, 81 - Bug is critical
**Mitigation**: Test thoroughly. Verify files numbered correctly. Verify content preserved.

### Risk 5: Conversational flow might be awkward
**Evidence**: Timeline Event 89 - User wants 2-5 questions at a time
**Mitigation**: Test with real scenarios. Adjust grouping based on feedback.

## Success Metrics

1. **Narrative capture works**: Files appear in .history/prompts/ with correct numbering
2. **Templates drive prompts**: Changing template changes questions asked
3. **Conversational flow**: User not overwhelmed by question dumps
4. **Approach selection**: User can choose Quick vs Structured vs Multi-Doc
5. **Blog workflow**: Can create blog post from idea to v1.0
6. **Podcast workflow**: Can create podcast script from idea to v1.0
7. **User satisfaction**: No more frustration about lost narratives
