# Step 13: Document User Stories and Workflows

## Objective

Create comprehensive documentation that tells the story of RiotPlan through user journeys. Show potential users that RiotPlan works for both fast execution ("just build me a plan") and deep exploration ("I want to ideate"). Make it clear that the tool adapts to your needs, not the other way around.

## Background

RiotPlan needs documentation that communicates its dual nature:
1. **Speed**: For users who know what they want and need to execute quickly
2. **Depth**: For users who need to explore, ideate, and develop ideas over time

The four user stories (5 minutes, 15 minutes, 1-2 hours, multiple days) perfectly illustrate this spectrum. These stories should be the centerpiece of user-facing documentation, showing that RiotPlan is flexible and adapts to how you work.

## Tasks

### 1. Update README.md with User Stories

Update the main README.md to lead with user stories:

```markdown
# RiotPlan

AI-powered planning and execution for complex projects. Works at your speed - from 5 minutes to multiple days.

## How You'll Use RiotPlan

### Story 1: "Just Build Me a Plan" (5 minutes)

You know what you want. You need a plan fast.

```bash
# You: "I need to add authentication to my app"
riotplan create auth-system "Add JWT authentication with user login"

# AI generates 8 steps automatically
# You: "Execute the plan"
# AI guides you through each step
# Done.
```

**What you get**: Fast, guided execution with no overhead.

---

### Story 2: "I Want to Refine the Plan First" (15 minutes)

You have an idea, but the generated plan needs adjustments.

```bash
# Plan is generated
# You: "Step 3 is too vague, and we need more testing steps"
# AI captures feedback, updates plan, shows changes
# You: "Better! Now execute it"
# AI guides execution
```

**What you get**: Quick iteration on the plan before execution.

---

### Story 3: "I'm Not Sure What I Want Yet" (1-2 hours)

You're exploring an idea. You need to think it through.

```bash
# You: "I'm thinking about adding some kind of notification system..."
# AI asks questions, captures your thinking
# You paste meeting notes, add evidence
# You explore different approaches
# You create checkpoints to save your thinking
# Eventually: "OK, I'm ready to build a plan"
# AI helps you shape approaches, select one
# Plan is generated and executed
```

**What you get**: Rich ideation with evidence and checkpoints.

---

### Story 4: "I'm Working on Something Complex Over Multiple Days"

You're tackling a big problem. You need time to think.

```bash
# Day 1: Explore the idea, capture thinking, create checkpoint
# Day 3: Continue exploration, try new direction, restore checkpoint
# Day 5: Execute the plan, complete steps, create checkpoint
# Day 7: Resume execution, finish plan
```

**What you get**: Long-term ideation with state preservation.

---

## Which Story Is Yours?

**Fast users**: Use Stories 1-2. Quick plan generation and execution.

**Thorough users**: Use Stories 3-4. Deep exploration with checkpoints and evidence.

**Most users**: Start with Story 1, graduate to Story 3 as needed.

## Key Features

- **Conversational**: All workflows are dialogue-based
- **Optional depth**: Use checkpoints and evidence when you need them
- **State management**: System remembers where you are
- **Model-driven**: Leverages AI capabilities for evidence gathering
- **Filesystem-based**: Simple Markdown and JSONL storage

## Installation

[Installation instructions...]
```

### 2. Create User Stories Guide

Create `guide/user-stories.md`:

```markdown
# RiotPlan User Stories

This guide shows how different users approach RiotPlan based on their needs.

## The Spectrum of Use

RiotPlan adapts to your workflow:

```
Fast ←────────────────────────────────→ Thorough
5 min        15 min        1-2 hrs        Multiple days
Story 1      Story 2       Story 3        Story 4
```

## Story 1: The Speed Runner (5 minutes)

**Profile**: You know exactly what you want. You've done this before. You just need a structured plan.

**Workflow**:
1. Describe what you want
2. AI generates plan
3. Execute with AI guidance
4. Done

**Tools Used**:
- `riotplan create` - Plan generation
- `execute_plan` prompt - Guided execution

**Example**: Adding authentication to an app you've built many times before.

**Key Insight**: No overhead. Just fast execution.

---

## Story 2: The Refiner (15 minutes)

**Profile**: You have a clear idea, but the generated plan needs tweaking. Maybe steps are too vague, or the order is wrong.

**Workflow**:
1. Generate plan
2. Review and provide feedback
3. AI updates plan based on feedback
4. Execute refined plan

**Tools Used**:
- `riotplan create` - Plan generation
- `develop_plan` prompt - Plan refinement
- `execute_plan` prompt - Guided execution

**Example**: Building a feature where you want to ensure testing is thorough.

**Key Insight**: Quick iteration without starting from scratch.

---

## Story 3: The Explorer (1-2 hours)

**Profile**: You have a fuzzy idea. You need to think it through, gather evidence, explore approaches.

**Workflow**:
1. Start exploring with `explore_idea`
2. Capture thinking, add evidence
3. Create checkpoints at stopping points
4. Try different directions
5. Shape approaches with `shape_approach`
6. Select best approach
7. Generate and execute plan

**Tools Used**:
- `explore_idea` prompt - Guided exploration
- Evidence tools - Attach documents, transcripts
- Checkpoints - Save state, recover from dead ends
- `shape_approach` prompt - Compare approaches
- `riotplan create` - Plan generation
- `execute_plan` prompt - Guided execution

**Example**: Designing a new notification system where you're not sure about the best approach.

**Key Insight**: Rich exploration without losing your thinking.

---

## Story 4: The Architect (Multiple days)

**Profile**: You're tackling a complex problem. You need time to think, research, and iterate. This might take days or weeks.

**Workflow**:
1. **Day 1**: Explore idea, capture extensive notes, gather evidence, create checkpoint
2. **Day 3**: Resume exploration, try new approach, restore checkpoint if needed
3. **Day 5**: Shape approaches, select one, generate plan
4. **Day 7**: Execute plan (partially), create checkpoint
5. **Day 10**: Resume execution, complete plan

**Tools Used**:
- Everything: exploration, evidence, checkpoints, shaping, plan creation, execution
- Timeline history - See how thinking evolved
- Checkpoint restoration - Recover from wrong turns

**Example**: Redesigning your entire data architecture.

**Key Insight**: Long-term ideation with full context preservation.

---

## Choosing Your Approach

### Start Here

Most users should **start with Story 1**:
- Generate a plan
- Execute it
- See if it works for you

### Graduate to Exploration

Move to **Story 3** when:
- You're not sure what you want
- Multiple approaches are possible
- You need to gather evidence
- You're exploring new territory

### Go Deep

Use **Story 4** when:
- The problem is complex
- You need time to think
- You're working over multiple sessions
- You want to preserve your thinking

## Key Principles

1. **No forced complexity**: Simple cases stay simple
2. **Opt-in depth**: Use rich features when you need them
3. **Natural progression**: Each story builds on simpler ones
4. **Conversational**: All workflows are dialogue-based
5. **State preservation**: System remembers where you are

## What's Optional?

- **Checkpoints**: Only create them when you want to save state
- **Evidence**: Only attach when you have supporting materials
- **Exploration**: Skip straight to plan creation if you know what you want
- **Shaping**: Skip if there's only one obvious approach

## What's Always There?

- **Plan generation**: Core feature
- **Execution guidance**: AI helps you complete steps
- **State management**: System tracks progress
- **Timeline history**: Everything is captured

---

## Real-World Examples

[Include actual examples from users once the system is in use]

---

## FAQ

**Q: Do I have to use checkpoints?**
A: No. They're optional for when you want to save state.

**Q: Do I have to explore ideas before creating plans?**
A: No. You can go straight to plan creation (Story 1).

**Q: Can I switch between fast and thorough modes?**
A: Yes. Start fast, add depth when needed.

**Q: What if I'm not sure which story fits me?**
A: Start with Story 1. You'll naturally discover if you need more.
```

### 3. Create Workflow Diagrams

Create `docs/workflows.md` with visual representations:

```markdown
# RiotPlan Workflows

## Fast Path (Stories 1-2)

```
Idea → Create Plan → Execute Plan → Done
       (5 min)       (varies)
```

## Exploration Path (Story 3)

```
Fuzzy Idea → Explore → Gather Evidence → Shape Approaches
                ↓           ↓                ↓
            Checkpoints  Narrative      Compare Options
                                            ↓
                                    Select Approach
                                            ↓
                                      Create Plan
                                            ↓
                                      Execute Plan
                                            ↓
                                         Done
```

## Long-Term Path (Story 4)

```
Day 1: Explore → Evidence → Checkpoint
         ↓
Day 3: Resume → Try New Direction → Restore Checkpoint
         ↓
Day 5: Shape → Select → Create Plan
         ↓
Day 7: Execute (partial) → Checkpoint
         ↓
Day 10: Resume → Complete
```

## Decision Tree

```
Do you know exactly what you want?
├─ Yes → Story 1 (Fast Path)
└─ No → Do you need to explore?
    ├─ Yes → Is it complex/long-term?
    │   ├─ Yes → Story 4 (Architect)
    │   └─ No → Story 3 (Explorer)
    └─ No → Do you need to refine?
        ├─ Yes → Story 2 (Refiner)
        └─ No → Story 1 (Fast Path)
```

## Prompt Usage Matrix

| Prompt | Story 1 | Story 2 | Story 3 | Story 4 |
|--------|---------|---------|---------|---------|
| explore_idea | ❌ | ❌ | ✅ | ✅ |
| shape_approach | ❌ | ❌ | ✅ | ✅ |
| create_plan | ✅ | ✅ | ✅ | ✅ |
| develop_plan | ❌ | ✅ | Optional | Optional |
| execute_plan | ✅ | ✅ | ✅ | ✅ |

## Tool Usage Matrix

| Tool | Story 1 | Story 2 | Story 3 | Story 4 |
|------|---------|---------|---------|---------|
| Plan creation | ✅ | ✅ | ✅ | ✅ |
| Execution | ✅ | ✅ | ✅ | ✅ |
| Feedback capture | ❌ | ✅ | Optional | Optional |
| Narrative capture | ❌ | ❌ | ✅ | ✅ |
| Evidence | ❌ | ❌ | ✅ | ✅ |
| Checkpoints | ❌ | ❌ | Optional | ✅ |
```

### 4. Update Main Documentation Index

Update `docs/index.md`:

```markdown
# RiotPlan Documentation

## Start Here

New to RiotPlan? Read the [User Stories](../guide/user-stories.md) to see how people use it.

## Quick Links

- **Fast users**: [5-Minute Quickstart](#)
- **Thorough users**: [Exploration Guide](#)
- **Everyone**: [Workflows](workflows.md)

## Core Concepts

- [Ideas, Plans, and Execution](#)
- [Prompts and Tools](#)
- [Timeline and History](#)
- [Checkpoints](#)
- [Evidence](#)

## User Guides

- [User Stories](../guide/user-stories.md) - See yourself in these stories
- [Workflows](workflows.md) - Visual workflow diagrams
- [Prompts Guide](prompts.md) - How to use each prompt
- [Tools Reference](tools.md) - MCP tool documentation

## For Developers

- [Architecture](architecture.md)
- [Contributing](../CONTRIBUTING.md)
- [API Reference](api/)
```

### 5. Create Marketing Copy

Create `docs/why-riotplan.md`:

```markdown
# Why RiotPlan?

## The Problem

You're using AI assistants (Claude, ChatGPT, Cursor) to build software. But:

- **Plans get lost** in chat history
- **Context disappears** when you close the window
- **Thinking isn't preserved** - you lose the "why"
- **Resuming is hard** - where were you?
- **Evidence scatters** - links, docs, notes everywhere

## The Solution

RiotPlan captures your thinking, preserves context, and guides execution.

### For Fast Users

Generate a plan in seconds. Execute with AI guidance. Done.

No overhead. Just speed.

### For Thorough Users

Explore ideas deeply. Gather evidence. Create checkpoints. Shape approaches.

Full context preservation. Never lose your thinking.

### For Everyone

Start fast. Add depth when needed. The tool adapts to you.

## What Makes RiotPlan Different?

1. **Conversational**: All workflows are dialogue-based
2. **Flexible**: Works for 5-minute plans and multi-day explorations
3. **Preserves context**: Timeline captures everything
4. **Model-driven**: Leverages AI capabilities
5. **Simple storage**: Markdown and JSONL files

## Who Is It For?

- **Solo developers** building complex features
- **Teams** coordinating on large projects
- **Architects** designing systems
- **Anyone** who wants to preserve their thinking

## Try It

[Installation instructions...]

Start with a 5-minute plan. See if it works for you.
```

## Acceptance Criteria

- [ ] README.md leads with four user stories
- [ ] guide/user-stories.md provides detailed story descriptions
- [ ] docs/workflows.md includes visual workflow diagrams
- [ ] docs/index.md updated with story-first navigation
- [ ] docs/why-riotplan.md explains value proposition
- [ ] All documentation emphasizes flexibility (fast vs. thorough)
- [ ] Examples show real-world usage
- [ ] Decision trees help users choose their path
- [ ] Tool/prompt usage matrices show what's optional

## Testing

```bash
# Review documentation
cat README.md
cat guide/user-stories.md
cat docs/workflows.md
cat docs/why-riotplan.md

# Get feedback from users
# - Can they see themselves in the stories?
# - Is it clear which path to take?
# - Does it feel approachable?

# Test with new users
# - Give them README.md
# - Ask: "Which story are you?"
# - See if they can get started
```

## Files Changed

- `README.md` - Add user stories as primary content
- `guide/user-stories.md` (new) - Detailed story descriptions
- `docs/workflows.md` (new) - Visual workflow diagrams
- `docs/index.md` - Update with story-first navigation
- `docs/why-riotplan.md` (new) - Value proposition
- `docs/quickstart.md` - Update with story references

## Notes

- Lead with stories, not features
- Show don't tell - use examples
- Emphasize flexibility - no forced complexity
- Make it clear what's optional
- Help users self-select their path
- Use real-world language, not jargon
- Visual diagrams help understanding
- Decision trees guide choices
- The goal: users see themselves in the stories
