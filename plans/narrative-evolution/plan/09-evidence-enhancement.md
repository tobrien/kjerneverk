# Step 09: Enhance Evidence Tools

## Objective

Enhance evidence tools to support model-driven evidence gathering through a symbiotic relationship between RiotPlan and the AI models using it. RiotPlan provides the structure to capture and organize evidence, while the models (Claude, ChatGPT, etc.) use their own capabilities and MCP tools to gather, analyze, and attach evidence.

## Background

Evidence gathering is one of the most transformational capabilities of this system. The key architectural insight is that **RiotPlan doesn't do the gathering - the MODEL does**. When running in Cursor, Claude Desktop, or ChatGPT, the model has access to:
- Web search capabilities
- File system access
- Other MCP tools
- Built-in analysis capabilities

Users will:
1. Ask the model to search for information ("go search the web for information about this topic")
2. Paste long transcripts or notes ("here's a transcript, some of this might inform the plan")
3. Point to files ("analyze this document and incorporate as evidence")

RiotPlan's role is to provide tools for the model to **capture** and **organize** the evidence it gathers, not to do the gathering itself. This is a symbiotic relationship.

## Tasks

### 1. Simplify Evidence Attachment Tool

The primary tool should be simple - just attach evidence that the model has gathered:
```typescript
export const evidenceTools = {
  riotplan_evidence_add: {
    description: "Add evidence to an idea or plan. The model should gather/analyze evidence using its own capabilities, then use this tool to attach it.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea/plan directory (defaults to current directory)"
        },
        evidencePath: {
          type: "string",
          description: "Path to evidence file, or 'inline' for pasted text"
        },
        description: {
          type: "string",
          description: "Description of the evidence and its relevance"
        },
        content: {
          type: "string",
          description: "Inline content if evidencePath is 'inline' (for pasted text/transcripts)"
        },
        source: {
          type: "string",
          description: "Where evidence came from (e.g., 'web search', 'user paste', 'file analysis')"
        }
      },
      required: ["description"]
    }
  }
};
```

### 2. Implement Evidence Add Handler

```typescript
async function handleEvidenceAdd(args: {
  path?: string;
  evidencePath?: string;
  description: string;
  content?: string;
  source?: string;
}): Promise<{ message: string; evidenceId: string }> {
  const ideaPath = args.path || process.cwd();
  
  // Validate idea/plan exists
  await validatePath(ideaPath);
  
  let evidenceId: string;
  
  if (args.evidencePath === "inline" || args.content) {
    // Handle inline/pasted content
    evidenceId = await addInlineEvidence(
      ideaPath,
      args.content || "",
      args.description,
      args.source || "user paste"
    );
  } else if (args.evidencePath) {
    // Handle file reference
    if (!await fileExists(args.evidencePath)) {
      throw new Error(`Evidence file does not exist: ${args.evidencePath}`);
    }
    
    evidenceId = await addFileEvidence(
      ideaPath,
      args.evidencePath,
      args.description,
      args.source || "file reference"
    );
  } else {
    throw new Error("Must provide either evidencePath or content");
  }
  
  return {
    message: `✅ Evidence added: ${args.description}`,
    evidenceId
  };
}
```

### 3. Implement Inline Evidence Storage

```typescript
async function addInlineEvidence(
  ideaPath: string,
  content: string,
  description: string,
  source: string
): Promise<string> {
  // Create evidence directory if needed
  const evidenceDir = path.join(ideaPath, ".history", "evidence");
  await fs.mkdir(evidenceDir, { recursive: true });
  
  // Generate unique ID for evidence
  const evidenceId = `evidence-${Date.now()}`;
  const evidencePath = path.join(evidenceDir, `${evidenceId}.md`);
  
  // Write evidence content
  const evidenceContent = `# Evidence: ${description}\n\n` +
    `**Source**: ${source}\n` +
    `**Added**: ${new Date().toISOString()}\n\n` +
    `---\n\n${content}`;
  
  await fs.writeFile(evidencePath, evidenceContent);
  
  // Add evidence event to timeline
  await addEvidenceEvent(ideaPath, {
    evidenceId,
    type: "inline",
    description,
    source,
    path: evidencePath
  });
  
  return evidenceId;
}

async function addFileEvidence(
  ideaPath: string,
  filePath: string,
  description: string,
  source: string
): Promise<string> {
  const evidenceId = `evidence-${Date.now()}`;
  
  // Add evidence event to timeline (reference to external file)
  await addEvidenceEvent(ideaPath, {
    evidenceId,
    type: "file",
    description,
    source,
    path: filePath
  });
  
  return evidenceId;
}
```

### 4. Investigate MCP Sampling for Model-Driven Gathering

Research and document MCP Sampling capability:
```typescript
// MCP Sampling allows models to autonomously use tools
// This is the mechanism for models to gather evidence on their own
// 
// Example workflow:
// 1. User: "Search the web for information about X"
// 2. Model uses its web search capability (not RiotPlan's)
// 3. Model analyzes results
// 4. Model calls riotplan_evidence_add to attach findings
//
// RiotPlan doesn't need to implement search - just capture results

// Document in evidence.ts:
/**
 * Evidence Gathering Philosophy
 * 
 * RiotPlan provides tools for CAPTURING evidence, not GATHERING it.
 * The model using RiotPlan (Claude, ChatGPT, etc.) is responsible for:
 * - Searching the web
 * - Reading files
 * - Analyzing content
 * - Determining relevance
 * 
 * RiotPlan's role is to provide a structured way to attach and organize
 * the evidence the model gathers.
 * 
 * This architectural separation allows:
 * - Models to use their full capabilities
 * - RiotPlan to stay focused and simple
 * - Symbiotic relationship between tool and model
 */
```

Research MCP Sampling:
- Read MCP specification about sampling
- Understand how models can autonomously use tools
- Document how this applies to evidence gathering
- Create examples of model-driven evidence workflows

### 5. Update Prompts to Guide Model-Driven Evidence Gathering

Update `explore_idea.md` and `develop_plan.md` to guide models:
```markdown
## Evidence Gathering

You have powerful capabilities to gather evidence. Use them!

### Web Search
When the user asks you to search for information:
1. Use your web search capability to find relevant information
2. Analyze and synthesize what you find
3. Attach it as evidence:
```
riotplan_evidence_add({
  evidencePath: "inline",
  content: "[Your synthesized findings]",
  description: "Web research on [topic]",
  source: "web search"
})
```

### File Analysis
When the user points to a file:
1. Read the file using your file access capabilities
2. Analyze its relevance to the idea/plan
3. Attach it as evidence:
```
riotplan_evidence_add({
  evidencePath: "/path/to/file",
  description: "Analysis: [what you learned from the file]",
  source: "file analysis"
})
```

### Pasted Content
When the user pastes text (transcripts, notes, etc.):
1. Analyze the content for relevant insights
2. Attach it as evidence:
```
riotplan_evidence_add({
  evidencePath: "inline",
  content: "[The pasted text]",
  description: "User-provided [transcript/notes/etc] containing insights about [topic]",
  source: "user paste"
})
```

### Your Role
- YOU gather the evidence using your capabilities
- YOU analyze and determine relevance
- YOU synthesize and summarize
- RiotPlan just captures and organizes what you find
```

### 6. Add Evidence Listing Tool

```typescript
export const evidenceTools = {
  // ... add tool
  
  riotplan_evidence_list: {
    description: "List all evidence attached to an idea or plan",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea/plan directory"
        }
      }
    }
  }
};

async function handleEvidenceList(args: {
  path?: string;
}): Promise<{
  evidence: Array<{
    id: string;
    type: "inline" | "file";
    description: string;
    source: string;
    timestamp: string;
  }>;
}> {
  const ideaPath = args.path || process.cwd();
  const timeline = await readTimeline(ideaPath);
  const evidenceEvents = timeline.filter(e => e.type === "evidence_added");
  
  return {
    evidence: evidenceEvents.map(e => ({
      id: e.data.evidenceId,
      type: e.data.type,
      description: e.data.description,
      source: e.data.source,
      timestamp: e.timestamp
    }))
  };
}
```

## Acceptance Criteria

- [ ] riotplan_evidence_add tool supports inline content (pasted text)
- [ ] riotplan_evidence_add tool supports file references
- [ ] Inline evidence is stored in .history/evidence/ directory
- [ ] File evidence is referenced (not copied)
- [ ] Evidence events are added to timeline with source tracking
- [ ] riotplan_evidence_list shows all attached evidence
- [ ] Prompts guide models to use their own capabilities for gathering
- [ ] MCP Sampling is researched and documented
- [ ] Tests cover inline and file evidence scenarios
- [ ] Manual test: paste text as evidence, reference file as evidence

## Testing

```bash
# Unit tests
npm test src/mcp/tools/evidence.test.ts

# Integration test - add inline evidence (pasted text)
{
  "tool": "riotplan_evidence_add",
  "arguments": {
    "path": "./plans/hello-idea",
    "evidencePath": "inline",
    "content": "This is a long transcript from a voice note about the planning process...",
    "description": "Voice transcript discussing planning workflow and pain points",
    "source": "user paste"
  }
}

# Expected: Evidence stored in .history/evidence/ and added to timeline

# Integration test - add file evidence
{
  "tool": "riotplan_evidence_add",
  "arguments": {
    "path": "./plans/hello-idea",
    "evidencePath": "./plans/done/reverse-engineer-riotplan/SUMMARY.md",
    "description": "Original RiotPlan plan showing evolution of planning concepts",
    "source": "file reference"
  }
}

# Expected: File reference added to timeline

# List all evidence
{
  "tool": "riotplan_evidence_list",
  "arguments": {
    "path": "./plans/hello-idea"
  }
}

# Expected: Returns all evidence with types, descriptions, and sources

# Verify evidence storage
ls -la plans/hello-idea/.history/evidence/
cat plans/hello-idea/.history/timeline.jsonl | grep evidence_added
```

## Files Changed

- `src/mcp/tools/evidence.ts` (new) - Evidence add and list tools
- `src/mcp/tools/evidence.test.ts` (new) - Tests for evidence tools
- `src/mcp/server.ts` - Register evidence tools
- `src/history/evidence.ts` (new) - Evidence storage utilities
- `src/mcp/prompts/explore_idea.md` - Add model-driven evidence gathering guidance
- `src/mcp/prompts/develop_plan.md` - Add model-driven evidence gathering guidance
- `docs/tools.md` - Document evidence tools
- `docs/evidence.md` (new) - Document evidence gathering philosophy and workflow
- `docs/mcp-sampling.md` (new) - Research and document MCP Sampling for evidence gathering

## Notes

- **Architectural principle**: RiotPlan captures evidence, models gather it
- This is a symbiotic relationship - tool provides structure, model provides intelligence
- Models use their own capabilities: web search, file access, analysis
- RiotPlan stays simple and focused on organization
- Inline evidence supports pasted transcripts, notes, and text
- File evidence supports references to existing files
- Evidence source tracking helps understand where evidence came from
- MCP Sampling may be key mechanism for autonomous model behavior
- This approach works in Cursor, Claude Desktop, ChatGPT - anywhere models have capabilities
- Don't build search into RiotPlan - let models use their search tools
- Evidence gathering is transformational because it leverages full model power
