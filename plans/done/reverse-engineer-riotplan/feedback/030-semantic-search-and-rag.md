# Feedback 030: Semantic Search and RAG Support (Future)

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.26 → v0.27
- **Related Files**: 
  - RIOTPLAN_ANALYSIS.md
- **Priority**: Future (not Phase 1)

## Feedback Given

**Tim's response:**

"Even if we don't build this into an initial version, I do think we need to have the capability to do an NLP search on plan content so that we can identify patterns, prompts, phases, and analysis that have similar contexts.

In general this is the sort of capability that I think we need to build into the CLI tools in that we should have the ability to load and tokenize text such that it can be stored in a local vector database that can be queried to support RAG or alignment with existing content.

Add this to the plan, but I'm not sure we're going to implement this at first glance."

## Discussion

### The Use Case

As plans accumulate, finding relevant past work becomes difficult:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE SEARCH PROBLEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User: "I'm planning a database migration. Have I done         │
│          something similar before?"                              │
│                                                                  │
│   KEYWORD SEARCH (current):                                      │
│   $ grep -r "migration" plans/                                   │
│   → Finds plans with word "migration"                            │
│   → Misses plans about "schema changes" or "data transfer"       │
│   → No understanding of context                                  │
│                                                                  │
│   SEMANTIC SEARCH (future):                                      │
│   $ riotplan search "database migration patterns"                │
│   → Finds plans about schema changes                             │
│   → Finds plans about data transfer strategies                   │
│   → Finds feedback discussions about migration risks             │
│   → Understands context, not just keywords                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### What This Enables

| Capability | Description |
|------------|-------------|
| **Pattern discovery** | "Show me plans that dealt with security concerns" |
| **Similar context** | "Find feedback similar to this discussion" |
| **Knowledge reuse** | "What did we learn about API design?" |
| **RAG for creation** | When creating new plan, surface relevant past content |
| **Alignment** | "Does this new plan overlap with existing work?" |

### Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEMANTIC SEARCH ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────┐      ┌──────────────────────────────┐   │
│   │   Plan Content   │      │      Vector Database          │   │
│   │                  │      │      (local, embedded)        │   │
│   │  - SUMMARY.md    │      │                               │   │
│   │  - EXECUTION_PLAN│ ──→  │  ┌─────────────────────────┐  │   │
│   │  - feedback/*.md │      │  │  Embeddings + Metadata  │  │   │
│   │  - evidence/*.md │      │  │  - plan_id              │  │   │
│   │  - plan/*.md     │      │  │  - file_path            │  │   │
│   └──────────────────┘      │  │  - chunk_type           │  │   │
│           │                 │  │  - context              │  │   │
│           │ tokenize +      │  └─────────────────────────┘  │   │
│           │ embed           │              │                │   │
│           ▼                 │              │ query          │   │
│   ┌──────────────────┐      │              ▼                │   │
│   │  Embedding Model │      │  ┌─────────────────────────┐  │   │
│   │  (local or API)  │      │  │   Similarity Search     │  │   │
│   │                  │      │  │   k-nearest neighbors   │  │   │
│   │  - sentence-     │      │  └─────────────────────────┘  │   │
│   │    transformers  │      │                               │   │
│   │  - OpenAI embed  │      └──────────────────────────────┘   │
│   │  - local LLM     │                                         │
│   └──────────────────┘                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Proposed CLI Commands

```bash
# Index plans for semantic search
$ riotplan index

Indexing plans...
  ✓ 47 plans indexed
  ✓ 312 feedback records indexed
  ✓ 89 evidence files indexed
  ✓ 1,247 chunks stored in vector database

Index complete. Ready for semantic search.

# Semantic search
$ riotplan search "database migration strategies"

Found 7 relevant matches:

1. [0.92] plans/db-migration-2024/feedback/003-rollback-strategy.md
   "We discussed using blue-green deployment for the migration..."

2. [0.87] plans/api-v2/EXECUTION_PLAN.md (Phase 2)
   "Schema migration requires careful ordering of changes..."

3. [0.84] plans/data-warehouse/evidence/prior-art.md
   "Previous migrations have used the following patterns..."

# Find similar content
$ riotplan search --similar plans/current/feedback/005-concerns.md

Similar discussions found:
1. [0.91] plans/auth-refactor/feedback/002-same-concern.md
2. [0.88] plans/api-v1/feedback/007-related-issue.md

# RAG context for new plan
$ riotplan plan init db-migration --with-context

Searching for relevant past work...
Found 4 related plans and 12 relevant feedback discussions.

Include as context for plan creation? [Y/n]
```

### Local Vector Database Options

| Option | Pros | Cons |
|--------|------|------|
| **SQLite + sqlite-vss** | Simple, single file, no deps | Limited features |
| **ChromaDB** | Python-native, easy setup | Python dependency |
| **LanceDB** | Rust-based, fast, embedded | Newer, less mature |
| **Qdrant** | Full-featured, local mode | Heavier footprint |

Recommendation: Start with **SQLite + sqlite-vss** or **LanceDB** for minimal dependencies.

### Embedding Options

| Option | Pros | Cons |
|--------|------|------|
| **Local (sentence-transformers)** | No API, works offline | Requires Python/model |
| **OpenAI Embeddings** | High quality, simple API | Requires API key, cost |
| **Ollama + local model** | Offline, good quality | Setup required |

Recommendation: Support **multiple backends** with config:

```yaml
# .riotplan/config.yaml
search:
  embedding:
    provider: local  # or openai, ollama
    model: all-MiniLM-L6-v2  # for local
  database:
    type: sqlite-vss
    path: ~/.riotplan/index.db
```

### Integration with Plan Creation

The real power is using past knowledge when creating new plans:

```bash
$ riotplan plan init security-audit --template security

Searching for relevant past work...

Found related content:
- plans/secure-riotprompt (completed 2026-01)
  "Security hardening for Node.js CLI"
  
- feedback/007-secret-handling.md
  "Discussion about secret detection patterns"

Include this context in plan creation? [Y/n] y

Creating plan with RAG context...
- Referenced 3 past decisions
- Suggested 2 potential concerns from past experience
- Pre-populated evidence/ with relevant links
```

### Why Not Phase 1

1. **Complexity**: Requires embedding pipeline, vector DB, additional dependencies
2. **Value vs. Effort**: Basic keyword search works for small plan collections
3. **User maturity**: Users need plans to search before search is valuable
4. **Focus**: Phase 1 should nail core plan management first

### When to Implement

Consider implementing when:
- Users have 20+ plans
- Keyword search becomes insufficient
- RAG integration becomes priority
- Cross-project pattern discovery is needed

**Suggested Phase**: Phase 4 or 5 (after core, feedback, rendering, VS Code)

### Requirement Definition

**R29: Semantic Search and RAG Support (Future)**
- [ ] Index plan content (all markdown files)
- [ ] Store embeddings in local vector database
- [ ] CLI: `riotplan index` to build/update index
- [ ] CLI: `riotplan search <query>` for semantic search
- [ ] CLI: `riotplan search --similar <file>` for similarity
- [ ] Support multiple embedding backends (local, OpenAI, Ollama)
- [ ] Support multiple vector DB backends (sqlite-vss, LanceDB)
- [ ] RAG integration: surface relevant content during plan creation
- [ ] Configurable via `.riotplan/config.yaml`

## Resolution

1. Document as R29 (future requirement)
2. Place in Phase 4-5, not Phase 1
3. Define architecture for when it's implemented
4. Note connection to pattern discovery and RAG

## Changes Made

1. Add R29: Semantic Search and RAG Support (marked as future)
2. Document technical architecture
3. List CLI commands
4. Note implementation timing

## The One-Liner

> **As plans accumulate, semantic search becomes essential—but keyword search is fine while the collection is small.**

