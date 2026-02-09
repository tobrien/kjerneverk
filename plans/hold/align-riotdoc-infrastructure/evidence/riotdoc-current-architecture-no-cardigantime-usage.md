# Evidence: RiotDoc current architecture - no CardiganTime usage despite dependency

**Source**: codebase analysis
**Original Query**: What is RiotDoc's current architecture and CardiganTime usage?
**Added**: 2026-02-08T16:46:49.149Z
**Gathering Method**: model-assisted
**Relevance Score**: 1

---

## RiotDoc Current State

**Package**: @kjerneverk/riotdoc v1.0.8-dev.0

### CardiganTime Status
- Listed in dependencies (`@utilarium/cardigantime` ^0.0.25) but **NOT actively used**
- No imports or usage of CardiganTime found in the codebase
- Uses direct YAML file reading (`riotdoc.yaml`) instead

### Current Config Approach
- Each document workspace has a `riotdoc.yaml` config file
- Workspace loader reads this directly via js-yaml
- No hierarchical config discovery
- No environment variable support
- No path resolution

### Key Architecture
- CLI via Commander.js with commands: create, outline, draft, revise, cleanup, spellcheck, export, status
- MCP server with tools, resources, and prompts
- Workspace-based file organization (each document is a workspace)
- TypeScript + Vite build + Vitest testing
- Voice/tone and style validation subsystems

### Workspace Structure
```
workspace/
├── riotdoc.yaml              # Main configuration
├── OBJECTIVES.md
├── OUTLINE.md
├── voice/ (tone.md, style-rules.md, glossary.md)
├── evidence/
├── drafts/
├── revisions/
└── export/
```