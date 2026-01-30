# Step 10: Update explore_document Prompt to Read Templates Dynamically

## Objective

Transform the document exploration prompt from static to dynamic by reading template questions and approaches at runtime.

**Why this is the REAL VALUE** (Timeline Event 88): "This is where the real value is - prompts orchestrate tools and resources. There's a symbiotic relationship: prompts execute the workflow, tools are the units of work, resources provide context. Prompts must integrate all three."

## Context from Evidence

### The Core Innovation (Timeline Event 85)

> "the templates should be the thing that gives those prompts the script of things to ask... explore idea should be looking at the idea draft phase section of podcast script template so that it knows like hey what's the episode called"

**Synthesis**: Templates are SCRIPTS. Prompts READ the script to know what to ask.

**Current state**: Prompts have hardcoded questions
**New state**: Prompts read template to get questions

**Example**:
- User says "I want to write a blog post"
- Prompt reads `templates/blog-post.md`
- Finds `## Idea/Draft Phase Questions` section
- Extracts: title, topic, angle, length, purpose, tone
- Asks these questions conversationally

### Conversational Flow (Timeline Event 89)

> "the model he conversation doesn't have to ask all the questions at once I can just be like hey the step through them... ask you two or three at a time or four or five at a time like what we're doing now"

**Synthesis**: Ask 2-5 questions per turn, not all at once. Natural dialogue.

**Bad**: "What's the title, topic, angle, length, purpose, tone, audience, and SEO keywords?"
**Good**: "What's the title or idea for the title? What's the main topic?" [wait for response] "What's your unique angle or perspective?" [wait for response]

### Template Format (Timeline Event 89)

> "markdown with well-defined section names... I don't think we need to go full game [YAML]"

**Synthesis**: Templates are markdown. Parse by finding section headers (`## Idea/Draft Phase Questions`).

### Approach Selection (Timeline Event 89)

> "Some plugs are really quick and direct... The other thing is like this idea... might be larger than one block"

**Synthesis**: After initial questions, present approaches from template. Help user select based on their situation.

## Tasks

### 1. Create Template Reading Module

Create `src/prompts/template-reader.ts`:

```typescript
interface TemplateQuestions {
    ideaDraft: string[];
    publishing: string[];
}

interface TemplateApproach {
    name: string;
    whenToUse: string;
    strategy: string;
    output: string;
}

interface Template {
    questions: TemplateQuestions;
    approaches: TemplateApproach[];
    outputStructure: string;
}

export async function readTemplate(templatePath: string): Promise<Template> {
    const content = await readFile(templatePath, 'utf-8');
    
    // Parse Idea/Draft Phase Questions
    const ideaDraftSection = extractSection(content, '## Idea/Draft Phase Questions');
    const ideaDraftQuestions = parseQuestions(ideaDraftSection);
    
    // Parse Publishing Phase Questions
    const publishingSection = extractSection(content, '## Publishing Phase Questions');
    const publishingQuestions = parseQuestions(publishingSection);
    
    // Parse Available Approaches
    const approachesSection = extractSection(content, '## Available Approaches');
    const approaches = parseApproaches(approachesSection);
    
    // Parse Output Structure
    const outputSection = extractSection(content, '## Output Document Structure');
    
    return {
        questions: {
            ideaDraft: ideaDraftQuestions,
            publishing: publishingQuestions
        },
        approaches,
        outputStructure: outputSection
    };
}

function extractSection(content: string, header: string): string {
    const start = content.indexOf(header);
    if (start === -1) return '';
    
    const nextHeader = content.indexOf('\n## ', start + header.length);
    return nextHeader === -1 
        ? content.substring(start) 
        : content.substring(start, nextHeader);
}

function parseQuestions(section: string): string[] {
    // Extract lines starting with - ** or just -
    const lines = section.split('\n');
    const questions = [];
    
    for (const line of lines) {
        if (line.trim().startsWith('- **')) {
            // Extract question: "- **Title**: What's the title?" → "What's the title?"
            const match = line.match(/- \*\*[^*]+\*\*: (.+)/);
            if (match) questions.push(match[1]);
        } else if (line.trim().startsWith('- ')) {
            // Simple list item
            questions.push(line.trim().substring(2));
        }
    }
    
    return questions;
}

function parseApproaches(section: string): TemplateApproach[] {
    // Parse approach definitions
    // Look for ### headings followed by **When to use**, **Strategy**, **Output**
    // Implementation details...
    return [];
}
```

### 2. Update explore_document Prompt

**Location**: `src/mcp/prompts/explore_document.md` (or create if doesn't exist)

**New structure**:

```markdown
# Explore Document

## Purpose
Guide user through document creation by reading template questions and presenting approaches.

## Workflow

### 1. Detect Document Type
Ask user: "What type of document do you want to create?"
Options: blog-post, podcast-script, email, project-plan, research-paper

### 2. Load Template
```typescript
const template = await readTemplate(`templates/${documentType}.md`);
```

### 3. Ask Idea/Draft Phase Questions (Conversationally)

**CRITICAL**: Don't ask all questions at once. Ask 2-5 at a time.

Group related questions:
- Group 1: Core concept (title, topic, angle)
- Group 2: Scope (length, purpose, tone)
- Group 3: Audience

For each group:
1. Ask questions naturally
2. Wait for user response
3. Capture response with riotdoc_add_narrative
4. Move to next group

### 4. Present Approaches

After initial questions, present approaches from template:

"Based on what you've told me, here are three ways we could create this [document type]:

1. **[Approach 1 Name]**: [When to use]
2. **[Approach 2 Name]**: [When to use]
3. **[Approach 3 Name]**: [When to use]

Which approach fits your situation?"

### 5. Capture Selection

User selects approach. Log to timeline:
```typescript
await logEvent({
    type: 'approach_selected',
    data: { approach: selectedApproach }
});
```

### 6. Proceed Based on Approach

Different approaches have different next steps:
- Quick & Direct: Skip outline, go straight to draft
- Structured: Build outline first
- Multi-Doc: Break into series, outline each

## Tools to Use

- `riotdoc_add_narrative`: Capture user responses
- `riotdoc_create_checkpoint`: Save state at key moments
- `riotdoc_log_event`: Log decisions to timeline

## Example Conversation

**AI**: "What type of document do you want to create?"
**User**: "A blog post"

**AI**: [Reads templates/blog-post.md]

**AI**: "Great! Let's start with the core concept. What's the title or idea for the title? And what's the main topic you want to write about?"
**User**: "Title is 'Why Templates Matter'. Topic is about template-driven development."

**AI**: [Captures narrative, moves to next group]

**AI**: "What's your unique angle or perspective on this? What makes your take different?"
**User**: "Templates aren't just data structures - they're scripts that drive behavior."

**AI**: [Captures narrative, moves to next group]

**AI**: "How long do you want this post to be? Short (500-800 words), medium (1000-1500), or long (2000+)?"
**User**: "Medium, around 1200 words."

**AI**: [After all questions, presents approaches]

**AI**: "Based on what you've told me, here are three ways we could create this blog post:

1. **Quick & Direct**: Write a draft quickly, minimal planning, publish fast
2. **Structured Single Post**: Build an outline, develop sections systematically, multiple revisions
3. **Multi-Post Series**: Break into multiple related posts with a publishing strategy

Which approach fits your situation?"

**User**: "Structured single post - I want it to be well-developed."

**AI**: [Logs approach selection]

**AI**: "Perfect. Let's build an outline first..."
```

### 3. Add Template Path Resolution

Create `src/templates/` directory with templates:
- `blog-post.md`
- `podcast-script.md`
- `email.md`
- `project-plan.md`
- `research-paper.md`

Prompt resolves path: `templates/${documentType}.md`

### 4. Test with Blog Post

**Test scenario**:
1. User says "I want to write a blog post"
2. Prompt reads `templates/blog-post.md`
3. Extracts Idea/Draft Phase questions
4. Asks 2-3 questions at a time
5. Captures responses with narrative tool
6. Presents 3 approaches
7. User selects "Structured Single Post"
8. Prompt proceeds to outline phase

**Verify**:
- Questions match template (title, topic, angle, length, purpose, tone)
- NOT asking SEO/categories (those are publishing phase)
- Conversational flow (not all at once)
- Approaches presented correctly
- Selection captured

### 5. Test with Podcast Script

Same test but with podcast script template. Verify different questions asked (episode title, format, segments, etc.).

## Acceptance Criteria

- [ ] Template reading module works (extracts questions and approaches)
- [ ] Prompt reads template dynamically based on document type
- [ ] Questions asked conversationally (2-5 at a time, grouped logically)
- [ ] Only Idea/Draft Phase questions asked (not publishing phase)
- [ ] Approaches presented from template after initial questions
- [ ] User can select approach
- [ ] Selection logged to timeline
- [ ] Narrative capture used for user responses
- [ ] Works for blog post template
- [ ] Works for podcast script template
- [ ] Different document types ask different questions

## Dependencies

- Steps 1-4: Templates created with canonical structure
- Step 7: Narrative capture working
- Step 5-6: History/checkpoint infrastructure

## Constraints Honored

- Constraint 5 (IDEA.md line 106): "User-defined document type templates that modify the workflow and questions asked"

## Evidence Referenced

- Timeline Event 85: "templates should be the thing that gives those prompts the script"
- Timeline Event 88: "This is where the real value is - prompts orchestrate tools and resources"
- Timeline Event 89: "ask you two or three at a time or four or five at a time"
- Timeline Event 89: "markdown with well-defined section names"
- `templates/blog-post.md`: Idea/Draft Phase questions
- `templates/podcast-script.md`: Different questions for different type

## Estimated Effort

6-8 hours

**Breakdown**:
- Create template reading module: 2 hours
- Update explore_document prompt: 2 hours
- Add template path resolution: 1 hour
- Test with blog post: 1.5 hours
- Test with podcast script: 1.5 hours
- Documentation: 1 hour

## Notes

**From Timeline Event 88**: "prompts execute the workflow, tools are the units of work, resources provide context. Prompts must integrate all three."

This is the CORE INNOVATION. Templates drive prompts. Prompts orchestrate tools. Everything works together.

**Test question**: If you change the blog post template to add a new question, does the prompt automatically ask it? If not, the dynamic reading isn't working.
