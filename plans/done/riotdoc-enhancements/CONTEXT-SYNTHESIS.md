# Context Synthesis for RiotDoc Enhancements

**Generated**: 2026-01-30
**Purpose**: Deep synthesis of all ideation context to inform execution plan

---

## Core Problem (from IDEA.md)

RiotDoc exists but lacks key features that would make it truly useful for document creation:
- No narrative/conversation capture (like RiotPlan has)
- No version numbering (v0.1 → v1.0)
- Missing document type templates (email, project-plan, research-paper)
- No outline manipulation tools
- Templates don't drive the workflow

**Critical Insight**: Documents have different lifecycles than plans. Some are one-time (blog posts), others are living standards that evolve continuously.

---

## Key Evidence from Timeline (77 events analyzed)

### User Frustrations (Narrative Chunks)
1. **Narrative capture bug** (Event 72): User frustrated that narratives only go to timeline.jsonl, not .history/prompts/. "I'm really not happy that I have to go back and tell you this again."
2. **Missing podcast script** (Event 72): User repeatedly asked for podcast script template. "once again I don't think you're listening. I've told you a couple times"
3. **Templates too heavy** (Event 72): Blog post template asks too many questions upfront. Should split by lifecycle phase.

### Critical Insights from Narratives

**From Event 72 - Template Lifecycle Phases**:
> "when I'm starting to write a blog post and I'm starting to think about the idea, I'm gonna wanna focus on title Topic angle target length... categories an SCO is an after the fact concern"

**Synthesis**: Templates need TWO question phases:
- **Idea/Draft Phase**: title, topic, angle, length, purpose, tone (things you know NOW)
- **Publishing Phase**: SEO, categories, tags, images, links, CTA (things you figure out LATER)

**From Event 85 - Templates Drive Prompts**:
> "the templates should be the thing that gives those prompts the script of things to ask... explore idea should be looking at the idea draft phase section of podcast script template so that it knows like hey what's the episode called"

**Synthesis**: Templates are NOT just data structures - they're SCRIPTS that tell prompts what to ask. The explore_idea prompt should READ the template to know what questions to ask.

**From Event 89 - Template Format**:
> "markdown with well-defined section names... I don't think we need to go full game [YAML]"

**Synthesis**: Use markdown with consistent section structure. Machine-readable through convention, not YAML frontmatter.

**From Event 89 - Conversational Flow**:
> "the model he conversation doesn't have to ask all the questions at once I can just be like hey the step through them... ask you two or three at a time or four or five at a time"

**Synthesis**: Prompts should ask 2-5 questions per turn, conversationally, not dump all questions at once.

**From Event 89 - Shapes/Approaches**:
> "there are different ways to think about running Block. Some plugs are really quick and direct... The other thing is like this idea that we've explored... might be larger than one block... one shape is to generate multiple blog posts"

**Synthesis**: Templates define APPROACHES (shapes) for document creation:
- Blog Post: (1) Quick & Direct, (2) Structured Single Post, (3) Multi-Post Series
- Shape determines: one doc or multiple? quick or structured?

---

## Constraints from IDEA.md (MUST be honored)

1. **Reference formats**: Must support APA, MLA, Chicago, IEEE, etc.
2. **Structural requirements**: TOC, index, appendices
3. **Example documents**: Must allow style/tone references
4. **One-time vs living docs**: Support both lifecycles
5. **User-defined templates**: Templates modify workflow and questions
6. **Outline phase**: Distinct phase between idea and draft, outline remains editable
7. **Draft generation strategy**: Ask upfront (preserve voice vs AI-generated vs hybrid)
8. **Separate revision files**: draft-v0.1.md, draft-v0.2.md, etc.
9. **Narrative capture**: Must preserve deliberation like RiotPlan

---

## Evidence Files Analysis

### Blog Post Template (evidence/blog-post-template.md)
- Has questions but NOT split by phase
- Missing: CC/BCC fields (wait, that's email)
- Missing: Approach definitions
- **User feedback**: "too heavy" - asks SEO/categories upfront when those come later

### Podcast Script Template (evidence/podcast-script-template.md)
- ALREADY has lifecycle phases! (Idea/Draft Phase vs Publishing Phase)
- Good structure for segments, timing, production notes
- **This is the model** - other templates should follow this pattern

### Email Template (evidence/email-template.md)
- Good basic structure
- **Missing**: CC and BCC fields (user specifically noted this)
- Questions not split by phase
- User insight: "Sometimes you might just have a quick email... sometimes you have an email that you wanna sit on"

### Project Plan Template (evidence/project-plan-template.md)
- Comprehensive but user said "I don't really care about it too much"
- Lower priority than blog/podcast

### Research Paper Template (evidence/research-paper-template.md)
- Academic focus, complex structure
- Lower priority than blog/podcast

---

## Selected Approach (from SHAPING.md)

**Template-First with Copy-Paste Infrastructure**

**Rationale** (Event 80):
> "Speed of implantation sort of important to me... copy paste from riot planned... I don't want you to create a third project... just build it... template first"

**Key Points**:
- Speed matters
- Copy history/checkpoint/narrative from RiotPlan
- Accept code duplication (shared library later)
- Build all features together, not incrementally
- Templates drive everything

---

## What This Means for the Plan

### Phase 1: Template Foundation
**Evidence-driven requirements**:
1. Define canonical structure with TWO question phases (from Event 72)
2. Include approach/shape definitions (from Event 89)
3. Use markdown with well-defined sections (from Event 89)
4. Podcast script template is the model (already has phases)
5. Blog post template needs major revision (user said "too heavy")

### Phase 2: Infrastructure
**Evidence-driven requirements**:
1. Fix narrative bug FIRST - user very frustrated (Event 72, 81)
2. Copy from RiotPlan at `/Users/tobrien/gitw/kjerneverk/riotplan` (Event 80)
3. Save narratives to BOTH timeline.jsonl AND .history/prompts/ (Event 72)
4. Auto-number prompt files (001, 002, 003...)

### Phase 3: Version & Outline
**Evidence-driven requirements**:
1. User-controlled versioning: v0.1 → v1.0 (IDEA.md line 55)
2. Outline tools: insert, move, delete sections (IDEA.md line 53)
3. Direct editing primary, MCP tools optional (IDEA.md line 53)

### Phase 4: Prompt Updates
**Evidence-driven requirements**:
1. Prompts READ templates at runtime (Event 85)
2. Ask 2-5 questions per turn, conversationally (Event 89)
3. Present approaches from template (Event 89)
4. "This is where the real value is" - user emphasized this (Event 88)

### Phase 5: Testing
**Evidence-driven requirements**:
1. Focus on blog post and podcast script (most used - IDEA.md line 49)
2. Test full workflow end-to-end
3. Verify narrative capture works (user's biggest frustration)

---

## Critical Success Factors

1. **Fix narrative bug immediately** - User frustrated, mentioned multiple times
2. **Get blog post template right** - Most used, needs lifecycle phases
3. **Podcast script is the model** - Already has correct structure
4. **Prompts must read templates** - This is the innovation, not just data
5. **Conversational flow** - 2-5 questions at a time, not all at once
6. **Speed matters** - Copy-paste is fine, shared library later

---

## References to Timeline Events

- Event 72: Critical template feedback and narrative bug
- Event 80: Implementation approach selection
- Event 85: Templates drive prompts insight
- Event 88: Prompts must be updated (symbiotic relationship)
- Event 89: Template format and conversational flow
- Event 93: Approach selected

---

## References to Evidence Files

- `evidence/blog-post-template.md` - Needs revision (too heavy)
- `evidence/podcast-script-template.md` - Model to follow (has phases)
- `evidence/email-template.md` - Missing CC/BCC
- `evidence/project-plan-template.md` - Lower priority
- `evidence/research-paper-template.md` - Lower priority

---

## References to Constraints

All 9 constraints from IDEA.md lines 102-110 must be honored in implementation.
