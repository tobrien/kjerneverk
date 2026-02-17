# Evidence: Architecture comparison - how CLI agent mirrors the Cursor MCP model

**Source**: conversation analysis
**Original Query**: How does the CLI agent architecture compare to the Cursor/MCP model?
**Added**: 2026-02-09T14:41:13.829Z
**Gathering Method**: model-assisted

---

## Architecture Comparison: Cursor/MCP vs CLI Agent

### How it works in Cursor today:

1. Cursor has **one model** running (e.g., Opus 4.6). That model is the conversational partner.
2. RiotPlan's MCP server registers **tools** (like `riotplan_idea_add_note`, `riotplan_idea_add_evidence`) and **prompts** (like the `explore_idea` prompt).
3. The `explore_idea` prompt is a big block of instructions that gets injected into the model's context. It says: "Here's how to explore ideas. When the user says X, call tool Y. Capture narratives, extract constraints, ask these kinds of questions..."
4. The model does **all the thinking**. It decides what questions to ask, what notes to capture, when to add evidence. It calls RiotPlan tools to do the bookkeeping.
5. The model **also** has access to Cursor's own tools — file read, grep, shell, code editing. That's how it can explore the codebase during an idea session.

The model is the brain. RiotPlan provides the organizational framework (tools + prompts). Cursor provides the environment tools (files, search, shell). The model orchestrates all of it.

### How the CLI needs to work:

Same architecture — but the CLI provides everything that Cursor and the MCP server provide today, unified:

1. The CLI spins up **one model** (Sonnet, Opus, GPT-4o — whatever API key is available). Same role as Opus in Cursor.
2. The CLI gives that model a **system prompt** — the same `explore_idea` prompt content that Cursor injects.
3. The CLI gives that model **RiotPlan tools** — the same operations the MCP server exposes, but registered as tool-use functions directly with the LLM API instead of going through MCP.
4. The CLI **also** gives that model **environment tools** — `read_file`, `list_files`, `grep`, `run_command`. These replace what Cursor provides natively.
5. The model does all the thinking, same as in Cursor. The CLI runs the agent loop.

### Comparison Table:

| Component | Cursor/MCP | CLI |
|---|---|---|
| **The brain** | Cursor's model (Opus 4.6) | CLI's model (Sonnet, Opus, GPT-4o) |
| **Plan instructions** | MCP prompt injected into Cursor's model | System prompt given to CLI's model |
| **Plan bookkeeping tools** | MCP tools called by Cursor's model | Tool-use functions called by CLI's model |
| **File/search/shell tools** | Cursor's built-in capabilities | CLI provides these as additional tools |
| **The agent loop** | Cursor manages this | CLI manages this (new thing we build) |
| **User interaction** | Cursor's chat UI | Terminal stdin/stdout |

### Key Insight:

The CLI is essentially building a minimal version of what Cursor does: host a model, give it tools, run the conversation loop, display results. The **same prompts and same tool implementations** can serve both paths. The MCP tools call the same underlying functions that the CLI tools would call.

### Identity Principle:

Each command (`explore`, `build`, `execute`, `chat`) creates a purpose-built agent with a specific identity via its system prompt, not a generic chatbot that happens to have RiotPlan tools available. When Cursor injects the `explore_idea` prompt, the model thinks "I am an idea exploration assistant." The CLI gets this same effect by using the prompt as the system message.

### Control Advantage:

Because the CLI spins up and configures the LLM directly, we have **more control** than in the MCP/Cursor model. We control exactly which tools are available, what the model can and cannot do. In Cursor, the model has access to all of Cursor's tools (file editing, shell, etc.) plus all MCP tools — the MCP server can't restrict what Cursor's own tools do. In the CLI, we define the complete tool set. If we don't want the model editing plan files directly, we simply don't give it a write_file tool — it can only modify plans through RiotPlan's structured tools (idea_add_note, etc.). This is a strict, enforceable boundary.