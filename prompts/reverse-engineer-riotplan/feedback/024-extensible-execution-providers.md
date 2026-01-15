# Feedback 024: Extensible Execution Providers

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.20 → v0.21
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review raised questions about execution integration:

> "Integration with execution: The 'Execution' stage presumably means carrying out the tasks, possibly by an AI agent or a human. RiotPlan provides STATUS.md to track progress. A question is how tightly integrated execution is – e.g., will RiotPlan's CLI actually run scripts or call AI agents for steps, or is it up to the user to do and update? If execution is manual, there's a risk of divergence (people forget to update STATUS.md). If automated, the tool becomes more complex (needing to interface with task runners or APIs)... It might be beneficial for future design to integrate with CI/CD or AI agent frameworks to automatically update plan status, reducing manual work."

## Feedback Given

**Tim's response:**

"Here's what I'll say about Steps and Phases in a Plan. And, this might be an odd thing to think about, but I do think that there are plans where some of the phases or steps might not be something we complete with just a model. Maybe there are some steps and phases that need to use a particular tool. For example, you might have a phase in a plan where you need to fact check a particular document, and you might choose to invoke the OpenAI API directly for this. On another task you might need to work with Claude Code or some other system like OpenAI's Codex from a CLI to work with this.

Other tasks might be something that you need to complete with a particular set of tools.

And, other tasks might be things that you specify that users have to complete. I think what this review has made me realize is that we need to build this plan model in a way that isn't tied to one tool or platform, when you execute a plan and execute a phase, maybe there's some facility to 'connect' your instance of RiotPlan to a particular tool and then leverage integration points with that tool.

Ideas of tools to start with:
- OpenAI API
- Anthropic API
- Gemini API
- Azure API
- GCP API
- or even just a more focused model like a ChatGPT Codex or Anthropic's Claude Code.

The model for executing a plan's phase or a plan should be extensible and something that is able to operate a number of tools, but it should also be able to define a phase for humans - 'phase 5 - someone needs to complete this offline process.'"

## Discussion

### The Insight: Pluggable Execution Providers

Plans aren't executed by one tool. Different steps require different capabilities:

| Step Type | Best Executed By | Example |
|-----------|------------------|---------|
| Code generation | Claude Code, Codex | "Implement the API endpoint" |
| Fact checking | OpenAI Deep Research | "Verify these claims are accurate" |
| Image generation | DALL-E, Midjourney | "Create architecture diagram" |
| Code review | Claude, GPT-4 | "Review this PR for security issues" |
| Human approval | Human | "Get stakeholder sign-off" |
| External process | CI/CD, Build systems | "Run integration tests" |
| Research | Perplexity, Deep Research | "Find industry benchmarks" |

### Architecture: Execution Providers

```
┌─────────────────────────────────────────────────────────────────┐
│                    RIOTPLAN EXECUTION MODEL                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    @riotplan/core                         │  │
│   │                                                           │  │
│   │   Plan Step:                                              │  │
│   │   {                                                       │  │
│   │     title: "Implement API endpoint",                      │  │
│   │     executor: "anthropic:claude-code",  // ← Provider     │  │
│   │     config: { ... },                                      │  │
│   │     fallback: "human"                                     │  │
│   │   }                                                       │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              Execution Provider Registry                  │  │
│   │                                                           │  │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│   │   │  anthropic  │  │   openai    │  │   human     │      │  │
│   │   │  provider   │  │  provider   │  │  provider   │      │  │
│   │   └─────────────┘  └─────────────┘  └─────────────┘      │  │
│   │                                                           │  │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│   │   │   gemini    │  │    azure    │  │    cicd     │      │  │
│   │   │  provider   │  │  provider   │  │  provider   │      │  │
│   │   └─────────────┘  └─────────────┘  └─────────────┘      │  │
│   │                                                           │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step Schema with Executor

```typescript
interface PlanStep {
  id: string;
  title: string;
  description: string;
  
  // NEW: Execution configuration
  executor: ExecutorConfig;
  
  // Existing fields
  status: StepStatus;
  dependencies: string[];
  // ...
}

interface ExecutorConfig {
  // Provider identifier
  provider: 'anthropic' | 'openai' | 'gemini' | 'azure' | 'gcp' | 'human' | 'cicd' | 'custom';
  
  // Model or tool within provider
  model?: string;  // e.g., "claude-code", "gpt-4", "codex"
  
  // Provider-specific configuration
  config?: Record<string, unknown>;
  
  // What to do if provider unavailable
  fallback?: 'human' | 'skip' | 'block';
  
  // Human-readable reason for this choice
  reason?: string;
}
```

### Example Plan with Mixed Executors

```markdown
# EXECUTION_PLAN.md

## Phase 1: Research & Design

### Step 1: Gather Requirements
- **Executor**: human
- **Reason**: Requires stakeholder interviews
- **Output**: requirements.md

### Step 2: Research Industry Patterns
- **Executor**: openai:gpt-4-turbo (deep research)
- **Reason**: Needs web search and synthesis
- **Output**: research-findings.md

### Step 3: Design API
- **Executor**: anthropic:claude-sonnet
- **Reason**: Complex reasoning about architecture
- **Output**: api-design.md

## Phase 2: Implementation

### Step 4: Implement API Endpoints
- **Executor**: anthropic:claude-code
- **Reason**: Code generation with file operations
- **Fallback**: human
- **Output**: src/api/*.ts

### Step 5: Write Tests
- **Executor**: anthropic:claude-code
- **Reason**: Test generation
- **Output**: tests/*.test.ts

### Step 6: Code Review
- **Executor**: human
- **Reason**: Requires human judgment on quality
- **Output**: Approval in PR

## Phase 3: Deployment

### Step 7: Run CI Pipeline
- **Executor**: cicd:github-actions
- **Reason**: Automated testing
- **Output**: CI pass/fail

### Step 8: Deploy to Staging
- **Executor**: cicd:terraform
- **Reason**: Infrastructure automation
- **Output**: Staging URL

### Step 9: Stakeholder Demo
- **Executor**: human
- **Reason**: Requires human presentation
- **Output**: Feedback captured
```

### Execution Provider Interface

```typescript
interface ExecutionProvider {
  // Provider identity
  id: string;
  name: string;
  
  // Capabilities
  capabilities: ProviderCapability[];
  
  // Execute a step
  execute(step: PlanStep, context: ExecutionContext): Promise<StepResult>;
  
  // Check if provider is available
  isAvailable(): Promise<boolean>;
  
  // Estimate cost/time for step
  estimate?(step: PlanStep): Promise<ExecutionEstimate>;
}

type ProviderCapability = 
  | 'code-generation'
  | 'code-execution'
  | 'research'
  | 'analysis'
  | 'image-generation'
  | 'human-interaction'
  | 'ci-cd'
  | 'file-operations';
```

### Built-in Providers

| Provider | ID | Capabilities | Use Cases |
|----------|-----|--------------|-----------|
| **Anthropic** | `anthropic` | code-gen, analysis, reasoning | Claude models, Claude Code |
| **OpenAI** | `openai` | code-gen, research, images | GPT-4, Codex, DALL-E |
| **Gemini** | `gemini` | code-gen, analysis | Google's models |
| **Azure** | `azure` | code-gen, analysis | Azure OpenAI Service |
| **GCP** | `gcp` | code-gen, analysis | Vertex AI |
| **Human** | `human` | any | Manual tasks, approvals |
| **CI/CD** | `cicd` | automation | GitHub Actions, Jenkins |
| **Custom** | `custom` | any | User-defined executors |

### The Human Provider

Critical insight: **Some steps must be done by humans.**

```typescript
const humanProvider: ExecutionProvider = {
  id: 'human',
  name: 'Human Executor',
  capabilities: ['human-interaction'],
  
  async execute(step, context) {
    // Notify user
    console.log(`\n⏳ Human action required: ${step.title}`);
    console.log(`   ${step.description}`);
    
    // Wait for confirmation
    const confirmed = await prompt('Mark as complete? [Y/n]');
    
    if (confirmed) {
      return { status: 'completed', executor: 'human' };
    } else {
      return { status: 'pending', executor: 'human' };
    }
  }
};
```

### CLI Integration

```bash
# Execute step with configured provider
$ riotplan execute 4

Step 4: Implement API Endpoints
Executor: anthropic:claude-code
Reason: Code generation with file operations

Connecting to Anthropic...
Running Claude Code agent...
[Agent output...]

Step complete. Update STATUS.md? [Y/n]

# Execute human step
$ riotplan execute 6

Step 6: Code Review
Executor: human
Reason: Requires human judgment on quality

⏳ This step requires human action.
   Please complete: Review PR #42 for quality and security

Mark as complete when done? [Y/n]

# Override executor for a step
$ riotplan execute 4 --executor human

Overriding executor: anthropic:claude-code → human
⏳ This step will be completed manually.
```

### Configuration

```yaml
# .riotplan/config.yaml

providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    default_model: claude-sonnet-4-20250514
    
  openai:
    api_key: ${OPENAI_API_KEY}
    default_model: gpt-4-turbo
    
  human:
    notification: slack  # or email, terminal
    timeout: 48h         # Auto-block if not completed
    
  cicd:
    type: github-actions
    repo: owner/repo
    workflow: ci.yml

defaults:
  fallback: human
  timeout: 1h
```

### Why This Matters

1. **No vendor lock-in**: Plans work with any AI provider
2. **Right tool for the job**: Research with one model, code with another
3. **Human in the loop**: Explicit human steps, not afterthoughts
4. **Extensible**: Add new providers as they emerge
5. **Portable**: Plan defines *what* to do; provider defines *how*

### Connection to Existing kjerneverk Work

RiotPlan already has execution packages:
- `@kjerneverk/execution` - Core execution interface
- `@kjerneverk/execution-anthropic` - Anthropic provider
- `@kjerneverk/execution-openai` - OpenAI provider
- `@kjerneverk/execution-gemini` - Gemini provider

These can be the foundation for RiotPlan's execution providers.

## Resolution

1. Add requirement R26: Extensible Execution Providers
2. Update step schema to include `executor` configuration
3. Document built-in providers (anthropic, openai, gemini, azure, gcp, human, cicd)
4. Show example plan with mixed executors
5. Note connection to existing kjerneverk execution packages

## Changes Made

1. Add R26: Extensible Execution Providers to requirements
2. Add "Execution Providers" section to architecture
3. Update step schema with executor config
4. Add provider interface and examples
5. Document human provider explicitly

## The One-Liner

> **Plans define what to do. Providers define how to do it. Humans are a valid provider.**

