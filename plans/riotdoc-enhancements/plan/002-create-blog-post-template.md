# Step 2: Revise Blog Post Template with Lifecycle Phases

## Objective

Convert the blog post template from "too heavy" (user feedback) to lifecycle-aware with proper phase separation and approach definitions.

**Why this matters**: Blog post is the MOST USED template (IDEA.md line 49). User said current version is "too heavy" and asks wrong questions at wrong time (Timeline Event 72).

## Context from Evidence

### User Frustration (Timeline Event 72)
> "when I'm starting to write a blog post and I'm starting to think about the idea, I'm gonna wanna focus on title Topic angle target length I'm actually not really gonna focus too much on SCO keywords category tag both of those things categories an SCO is an after the fact concern"

**Problem**: Current template (`evidence/blog-post-template.md`) asks ALL questions upfront:
- Line 12-15: Basic Information (good - these are upfront)
- Line 17-21: Audience & Publication (WRONG - SEO/categories are "after the fact")
- Line 23-27: Content Strategy (mixed - purpose/tone upfront, CTA later)
- Line 29-32: Supporting Elements (WRONG - images/links come at the end)

**Solution**: Split into two phases based on WHEN questions are answered.

### What Goes in Each Phase (from Timeline Event 72)

**Idea/Draft Phase** (things you know NOW):
- Title (or idea for title)
- Topic
- Angle
- Target length
- Purpose
- Tone

**Publishing Phase** (things you figure out LATER):
- SEO keywords
- Categories
- Tags
- Images
- Links
- Call to action
- Related content
- Website/platform

### Approaches/Shapes (Timeline Event 89)

> "Some plugs are really quick and direct... The other thing is like this idea... might be larger than one block... one shape is to generate multiple blog posts"

**Three approaches for blog posts**:
1. **Quick & Direct**: Short entry, minimal planning, just write and publish
2. **Structured Single Post**: Complex idea, needs development, one well-structured post
3. **Multi-Post Series**: Idea too big for one post, generate multiple posts with publishing strategy

## Tasks

### 1. Split Questions by Lifecycle Phase

**Idea/Draft Phase Questions**:
```markdown
## Idea/Draft Phase Questions

### Core Concept
- **Title**: What's the title? (or idea for title)
- **Topic**: What's the main subject?
- **Angle**: What's your unique take or perspective?

### Scope & Approach
- **Target length**: Short (500-800 words), medium (1000-1500), long (2000+)?
- **Purpose**: Educate, entertain, persuade, inform?
- **Tone**: Casual, professional, humorous, serious?

### Audience
- **Target audience**: Who are you writing for?
```

**Publishing Phase Questions**:
```markdown
## Publishing Phase Questions

### SEO & Discovery
- **SEO keywords**: Any specific keywords to target?
- **Category/tags**: How should this be categorized?
- **Website/platform**: Where will this be published?

### Content Enhancement
- **Images needed**: Featured image, inline images, diagrams?
- **Links**: Internal links, external references?
- **Examples**: Real-world examples or case studies?
- **Related content**: Does this connect to other posts?

### Call to Action
- **Call to action**: What should readers do after reading?
```

### 2. Define Three Approaches

**Approach 1: Quick & Direct**
```markdown
### Quick & Direct

**When to use**: 
- Short blog entry (500-1000 words)
- Simple idea that doesn't need much development
- Want to publish quickly
- Personal blog or casual writing

**Strategy**:
- Skip outline phase
- Write draft directly from idea
- Minimal revision
- Quick publish

**Output**: Single blog post, v0.1 → v1.0 in 1-2 iterations

**Workflow**: Idea → Draft → Light revision → Publish
```

**Approach 2: Structured Single Post**
```markdown
### Structured Single Post

**When to use**:
- Complex idea (1500-3000 words)
- Needs clear structure and sections
- Professional or company blog
- Want high quality, polished result

**Strategy**:
- Build outline first
- Develop sections systematically
- Multiple revision cycles
- Add supporting elements (images, examples)

**Output**: Single well-structured blog post, v0.1 → v0.5+ → v1.0

**Workflow**: Idea → Outline → Draft → Revise → Add images/links → Publish
```

**Approach 3: Multi-Post Series**
```markdown
### Multi-Post Series

**When to use**:
- Idea too big for one post
- Natural breakdown into 3-5 related topics
- Want to build momentum with series
- Complex subject needs multiple angles

**Strategy**:
- Break idea into 3-5 sub-topics
- Create outline for each post
- Write posts in sequence or parallel
- Define publishing schedule
- Link posts together

**Output**: 3-5 related blog posts with publishing strategy

**Workflow**: Idea → Break into series → Outline each → Draft each → Publish series
```

### 3. Update Output Document Structure

Keep existing structure (it's fine), just reference it:
```markdown
## Output Document Structure

See lines 38-88 of current template - structure is good, no changes needed.
```

### 4. Remove Wrong Questions from Upfront

**Remove from initial questions** (move to publishing phase):
- SEO keywords (line 21)
- Category/tags (line 20)
- Website/platform (line 19) - unless user knows upfront
- Images needed (line 30)
- Links (line 31)
- Related content (line 27)

**Keep in initial questions**:
- Title (line 12)
- Topic (line 13)
- Angle (line 14)
- Target length (line 15)
- Target audience (line 18) - this is upfront
- Purpose (line 24)
- Tone (line 25)

## Acceptance Criteria

- [ ] Questions split into Idea/Draft Phase and Publishing Phase
- [ ] Idea/Draft Phase has: title, topic, angle, length, purpose, tone, audience
- [ ] Publishing Phase has: SEO, categories, tags, images, links, CTA, related content
- [ ] Three approaches defined: Quick & Direct, Structured, Multi-Post Series
- [ ] Each approach has: when to use, strategy, output, workflow
- [ ] Template follows canonical structure from Step 1
- [ ] Template can be parsed by prompts to extract questions
- [ ] No more "too heavy" - right questions at right time

## Dependencies

- Step 1: Canonical template structure defined
- `evidence/blog-post-template.md` (current version to revise)
- Timeline Event 72 (user feedback on what's too heavy)
- Timeline Event 89 (approach definitions)

## Constraints Honored

- Constraint 5 (IDEA.md line 106): Template modifies workflow based on approach selected
- Constraint 6 (IDEA.md line 107): Structured approach has distinct outline phase

## Evidence Referenced

- `evidence/blog-post-template.md` - Current version (needs major revision)
- Timeline Event 72: "too heavy... I'm gonna wanna focus on title Topic angle target length... categories an SCO is an after the fact concern"
- Timeline Event 89: "Some plugs are really quick and direct... might be larger than one block"
- IDEA.md line 49: Blog post is most-used template

## Estimated Effort

3-4 hours

**Breakdown**:
- Split questions by phase: 1 hour
- Define three approaches: 1.5 hours
- Test with prompts (manual): 0.5 hour
- Documentation: 1 hour

## Notes

**Critical**: This template is the most used. Get it right and others follow the pattern.

**User feedback** (Timeline Event 72): Current version asks SEO/categories upfront. These are "after the fact concerns" - they come AFTER writing, not before.

**Test question**: When prompt reads this template, does it ask title/topic/angle first, then later ask SEO/categories? If not, structure is wrong.
