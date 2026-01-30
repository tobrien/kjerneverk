# Step 1: Define Canonical Template Structure

## Objective

Create the canonical template structure that all document types will follow. This structure must support lifecycle-aware questions (idea/draft vs publishing) and approach/shape definitions.

**Why this matters**: Templates are SCRIPTS that tell prompts what to ask (Timeline Event 85). The structure must be machine-readable so prompts can parse it at runtime.

## Context from Evidence

### User Insight (Timeline Event 72)
> "when I'm starting to write a blog post... I'm gonna wanna focus on title Topic angle target length... categories an SCO is an after the fact concern"

**Synthesis**: Questions must be split by WHEN they're answered:
- **Idea/Draft Phase**: Things you know NOW (title, topic, angle, length, purpose, tone)
- **Publishing Phase**: Things you figure out LATER (SEO, categories, tags, images, links, CTA)

### Template Format (Timeline Event 89)
> "markdown with well-defined section names... I don't think we need to go full game [YAML]"

**Synthesis**: Use markdown with consistent section structure. Machine-readable through convention, not YAML frontmatter.

### Podcast Script is the Model
The podcast script template (`evidence/podcast-script-template.md`) ALREADY has this structure:
- `## Idea/Draft Phase` (lines 11-34)
- `## Publishing Phase` (lines 36-49)

**This is the pattern to follow.**

### Approaches/Shapes (Timeline Event 89)
> "Some plugs are really quick and direct... The other thing is like this idea... might be larger than one block... one shape is to generate multiple blog posts"

**Synthesis**: Templates must define different strategies for creating the document:
- Blog Post: Quick & Direct, Structured Single Post, Multi-Post Series
- Shape determines: one doc or multiple? quick or structured?

## Tasks

### 1. Document Canonical Structure

Create `TEMPLATE-STRUCTURE.md` defining:

```markdown
# Template Structure Specification

## Required Sections

### 1. Idea/Draft Phase Questions
Questions to ask when exploring and drafting the document.
These are things the user knows NOW.

Example for blog post:
- Title (or idea for title)
- Topic
- Angle
- Target length
- Purpose
- Tone

### 2. Publishing Phase Questions
Questions to ask before publishing the document.
These are things the user figures out LATER.

Example for blog post:
- SEO keywords
- Categories
- Tags
- Images
- Links
- Call to action

### 3. Available Approaches
Different strategies for creating this document type.
Each approach defines:
- **Name**: Clear, descriptive name
- **When to use**: Situation where this approach fits
- **Strategy**: How the document will be created
- **Output**: What gets produced (one doc, multiple docs, etc.)

Example for blog post:
- Quick & Direct: Short entry, minimal planning, write and publish fast
- Structured Single Post: Complex idea, build outline, develop sections
- Multi-Post Series: Idea too big, break into 3-5 related posts

### 4. Output Document Structure
The markdown structure of the final document.
Shows what the finished document looks like.
```

### 2. Create Parsing Guide for Prompts

Document how prompts will read templates:

```markdown
# How Prompts Read Templates

## Reading Questions
1. Load template markdown file
2. Find `## Idea/Draft Phase Questions` section
3. Parse questions (lines starting with `-` or `**`)
4. Ask 2-5 questions at a time, conversationally
5. Capture responses with narrative tool

Later, when publishing:
1. Find `## Publishing Phase Questions` section
2. Ask remaining questions
3. Finalize document

## Reading Approaches
1. Find `## Available Approaches` section
2. Parse approach definitions
3. Present to user: "How do you want to create this?"
4. Capture selected approach
5. Adjust workflow based on selection
```

### 3. Validate with Existing Templates

**Podcast Script Template** (`evidence/podcast-script-template.md`):
- ✅ Already has `## Idea/Draft Phase` (line 11)
- ✅ Already has `## Publishing Phase` (line 36)
- ❌ Missing `## Available Approaches` section
- ✅ Has `## Output Document Structure` (line 53)

**Action**: Podcast script is 75% there. Just needs approaches added.

**Blog Post Template** (`evidence/blog-post-template.md`):
- ❌ Has `## Questions to Answer` but NOT split by phase
- ❌ Asks SEO/categories upfront (should be publishing phase)
- ❌ Missing `## Available Approaches` section
- ✅ Has `## Output Document Structure` (line 36)

**Action**: Blog post needs major revision. User said "too heavy" (Timeline Event 72).

**Email Template** (`evidence/email-template.md`):
- ❌ Has `## Questions to Answer` but NOT split by phase
- ❌ Missing CC and BCC fields (user noted - Timeline Event 72)
- ❌ Missing `## Available Approaches` section
- ✅ Has `## Output Document Structure` (line 37)

**Action**: Email needs phase split and CC/BCC added.

### 4. Create Example Template

Create `TEMPLATE-EXAMPLE.md` showing the canonical structure with a simple example (maybe "meeting-notes" or "memo").

## Acceptance Criteria

- [ ] `TEMPLATE-STRUCTURE.md` documents canonical structure
- [ ] Structure has 4 required sections: Idea/Draft Questions, Publishing Questions, Approaches, Output Structure
- [ ] Parsing guide explains how prompts read templates
- [ ] Validated against podcast script template (model to follow)
- [ ] Validated against blog post template (needs major revision)
- [ ] Validated against email template (needs phase split)
- [ ] Example template created showing structure in practice
- [ ] Structure is markdown with well-defined sections (NOT YAML)
- [ ] Structure supports conversational flow (2-5 questions at a time)

## Dependencies

- Template prototypes in `evidence/` directory (Timeline Events 66-69, 77)
- Podcast script template as reference model
- User feedback from Timeline Event 72 (lifecycle phases)
- User feedback from Timeline Event 89 (markdown format, approaches)

## Constraints Honored

- Constraint 5 (IDEA.md line 106): "User-defined document type templates that modify the workflow and questions asked"
- Constraint 6 (IDEA.md line 107): "Distinct outline/structure phase between idea and draft"

## Evidence Referenced

- `evidence/podcast-script-template.md` - Model to follow (already has phases)
- `evidence/blog-post-template.md` - Needs revision (too heavy)
- `evidence/email-template.md` - Missing CC/BCC
- Timeline Event 72: Lifecycle phases insight
- Timeline Event 89: Markdown format, approaches/shapes
- Timeline Event 85: Templates drive prompts

## Estimated Effort

3-4 hours

**Breakdown**:
- Document structure: 1 hour
- Create parsing guide: 1 hour
- Validate against existing templates: 1 hour
- Create example template: 1 hour

## Notes

**From Timeline Event 89**: "markdown with well-defined section names... I don't think we need to go full game [YAML]"

Keep it simple. The structure should be obvious to humans and parseable by prompts through consistent section names.
