# Step 14: Create Documentation and Examples

## Objective

Write comprehensive documentation for execution-sampling package and RiotPlan's sampling support, with examples for other tool authors.

## Context

**Why this step**: Enable other projects to use execution-sampling. Help users understand sampling support. Provide reference for community.

**From IDEA.md**:
> "execution-sampling should be reusable across multiple projects, not RiotPlan-specific."

**Why now**: Implementation complete. Ready to document for others.

## Tasks

- [ ] Write execution-sampling README.md:
  - Overview and benefits
  - Installation instructions
  - Quick start example
  - API reference
  - Error handling guide
  - Contributing guidelines
- [ ] Create examples/:
  - Basic usage example
  - With error handling
  - With custom configuration
  - Integration with existing tool
- [ ] Write RiotPlan sampling guide:
  - How sampling works in RiotPlan
  - Supported clients
  - Troubleshooting
  - FAQ
- [ ] Create API documentation:
  - SamplingProvider class
  - SessionContext interface
  - Error classes
- [ ] Add migration guide:
  - For tool authors wanting to add sampling
  - Step-by-step process
  - Common pitfalls
- [ ] Publish to docs site

## Acceptance Criteria

- [ ] execution-sampling README is comprehensive
- [ ] Examples are clear and runnable
- [ ] RiotPlan guide explains sampling support
- [ ] API documentation is complete
- [ ] Migration guide helps other tool authors
- [ ] Documentation published and accessible
- [ ] All code examples tested

## Constraints

**From IDEA.md**:
- Must be reusable by other projects
- Must explain clearly for non-experts

## Dependencies

**Requires**: 
- Steps 1-12 (Complete implementation)

**Blocks**: 
- None (completes Phase 5)

## Evidence

**Reusability Goal** (from timeline event 50):
> "execution-sampling should be a separate npm package that other projects can use. Part of @kjerneverk ecosystem."

**Documentation Needs**:
1. Package README
2. API reference
3. Usage examples
4. Integration guide
5. Troubleshooting
6. Migration guide for tool authors

## Estimated Effort

**8 hours**

- 3h: execution-sampling README and API docs
- 2h: Examples
- 2h: RiotPlan sampling guide
- 1h: Migration guide

## Notes

- Use clear, simple language
- Include diagrams where helpful
- Test all code examples
- Link to blog posts
- Add to package.json keywords for discoverability
- Consider video tutorial

## Documentation Structure

### execution-sampling README.md

```markdown
# @kjerneverk/execution-sampling

MCP sampling provider for AI generation - no API keys needed!

## Overview
[What it does, why it's useful]

## Installation
[npm install instructions]

## Quick Start
[Minimal example]

## Usage
[Detailed usage with SamplingProvider]

## API Reference
[Class and method documentation]

## Error Handling
[Error scenarios and recovery]

## Examples
[Link to examples/]

## Contributing
[How to contribute]

## License
[MIT]
```

### RiotPlan Sampling Guide

```markdown
# MCP Sampling in RiotPlan

## Overview
[How sampling works in RiotPlan]

## Supported Clients
- FastMCP (Python) ✅
- GitHub Copilot ✅
- Cursor ⏳ (coming soon)
- Claude Desktop ⏳ (coming soon)

## How It Works
[Automatic detection, provider selection]

## Troubleshooting
[Common issues and solutions]

## FAQ
[Frequently asked questions]
```

## Related Files

- `execution-sampling/README.md` - Package documentation
- `execution-sampling/examples/` - Code examples
- `docs/sampling.md` - RiotPlan guide
- `docs/migration-guide.md` - For tool authors
