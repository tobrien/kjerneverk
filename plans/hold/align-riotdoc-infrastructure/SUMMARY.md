# align-riotdoc-infrastructure

## Overview

Align RiotDoc with RiotPlan's infrastructure patterns, specifically adding CardiganTime configuration support for managing document workspace paths and configuration files. RiotDoc currently doesn't use CardiganTime but should follow the same patterns as RiotPlan and RiotPrompt for consistency across the Kjerneverk ecosystem.

Key objectives:
1. Add CardiganTime dependency and configuration loader
2. Create configuration schema with path resolution for document workspace directories
3. Update CLI to use CardiganTime for config management
4. Ensure MCP integration follows the same patterns
5. Add tests for configuration loading and path resolution

This will provide RiotDoc users with the same powerful configuration experience (YAML/JSON/JS/TS support, hierarchical configs, path resolution) that RiotPlan and RiotPrompt users enjoy.

## Goals

1. Goal 1
2. Goal 2
3. Goal 3

## Scope

### In Scope

- Item 1
- Item 2

### Out of Scope

- Item 1

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

---

*Plan created: 2026-01-31*
