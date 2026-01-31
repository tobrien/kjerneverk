# Quick Reference Guide

Quick reference for implementing the plan directory configuration feature.

## Four-Tier Resolution

```
1. RIOTPLAN_PLAN_DIRECTORY env var (CardiganTime)
   ↓ if not set
2. Config file (CardiganTime hierarchical discovery)
   ↓ if not found
3. Walk up looking for existing plans/ directory
   ↓ if not found
4. Fallback to ./plans in current directory
```

## Module Structure

```
src/config/
├── index.ts           # Public API
├── types.ts           # TypeScript interfaces
├── schema.ts          # Zod schema
├── loader.ts          # CardiganTime integration
├── walk-up.ts         # Tier 3 walk-up logic
└── resolver.ts        # Four-tier orchestration
```

## Key Functions

### Public API (index.ts)
```typescript
export function resolvePlanDirectory(): string
export function clearResolverCache(): void
export type RiotPlanConfig
```

### CardiganTime Loader (loader.ts)
```typescript
function loadConfig(): RiotPlanConfig | null
```

### Walk-Up (walk-up.ts)
```typescript
function findPlansDirectory(startPath: string): string | null
function clearWalkUpCache(): void
```

### Resolver (resolver.ts)
```typescript
function resolvePlanDirectory(): string
function clearResolverCache(): void
```

## Zod Schema

```typescript
const RiotPlanConfigSchema = z.object({
  planDirectory: z.string().default('./plans'),
  defaultProvider: z.enum(['anthropic', 'openai', 'gemini']).optional(),
  defaultModel: z.string().optional(),
  templateDirectory: z.string().optional(),
});
```

## CardiganTime Configuration

```typescript
import { create } from '@theunwalked/cardigantime';

const cardigantime = create({
  defaults: {
    configDirectory: process.cwd(),
    isRequired: false,
  },
  configShape: RiotPlanConfigSchema.shape,
  features: ['config'],
  hierarchical: {
    mode: 'enabled',  // Walk up directory tree
  },
});
```

## Walk-Up Algorithm

```typescript
function findPlansDirectory(startPath: string): string | null {
  let currentPath = resolve(startPath);
  
  while (currentPath !== '/') {
    const plansPath = join(currentPath, 'plans');
    if (existsSync(plansPath) && statSync(plansPath).isDirectory()) {
      return currentPath;  // Return parent of plans/
    }
    
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) break;  // Reached root
    currentPath = parentPath;
  }
  
  return null;
}
```

## Integration Points

### MCP Server (src/mcp/server.ts line 91)
```typescript
// Before:
const context = {
  workingDirectory: process.cwd(),
  // ...
};

// After:
import { resolvePlanDirectory } from '../config/index.js';

const context = {
  workingDirectory: resolvePlanDirectory(),
  // ...
};
```

### Shared Utilities (src/mcp/tools/shared.ts)
```typescript
export function resolveDirectory(args: any, context: ToolExecutionContext): string {
  if (args.path) {
    return resolve(args.path);  // Explicit path (backward compat)
  }
  if (context.workingDirectory) {
    return context.workingDirectory;  // From resolver
  }
  return process.cwd();  // Final fallback
}
```

## Config File Examples

### YAML (riotplan.config.yaml)
```yaml
planDirectory: ./plans
defaultProvider: anthropic
defaultModel: claude-3-5-sonnet-20241022
```

### JSON (riotplan.config.json)
```json
{
  "$schema": "https://raw.githubusercontent.com/kjerneverk/riotplan/main/schemas/riotplan-config.schema.json",
  "planDirectory": "./plans",
  "defaultProvider": "anthropic"
}
```

### JavaScript (riotplan.config.js)
```javascript
module.exports = {
  planDirectory: process.env.PLANS_DIR || './plans',
  defaultProvider: 'anthropic',
};
```

### TypeScript (riotplan.config.ts)
```typescript
export default {
  planDirectory: './plans',
  defaultProvider: 'anthropic',
} as const;
```

## CLI Commands

### Initialize Config
```bash
riotplan --init-config
```

Creates `riotplan.config.yaml` with defaults.

### Check Config
```bash
riotplan --check-config
```

Shows current configuration resolution.

## Environment Variable

### In .cursor/mcp.json
```json
{
  "mcpServers": {
    "riotplan": {
      "command": "npx",
      "args": ["-y", "@kjerneverk/riotplan"],
      "env": {
        "RIOTPLAN_PLAN_DIRECTORY": "/Users/me/projects/myapp/plans"
      }
    }
  }
}
```

### In Shell
```bash
export RIOTPLAN_PLAN_DIRECTORY=/path/to/plans
riotplan idea create my-idea "Description"
```

## Testing Checklist

### Unit Tests
- [ ] Schema validation
- [ ] Walk-up finds plans/ at various levels
- [ ] Walk-up stops at filesystem root
- [ ] Resolver respects precedence
- [ ] Caching works

### Integration Tests
- [ ] MCP server with env var
- [ ] MCP server with config file
- [ ] MCP server with walk-up
- [ ] MCP server with fallback
- [ ] CLI with various configs
- [ ] Backward compatibility (explicit paths)

### Manual Tests
- [ ] Real MCP server in Cursor/VSCode
- [ ] Real CLI usage in terminal
- [ ] --init-config creates valid file
- [ ] --check-config shows correct info
- [ ] Performance is acceptable

## Common Issues and Solutions

### Issue: Config not found
**Solution**: Run `riotplan --check-config` to see resolution. Verify config file location and naming.

### Issue: Wrong directory used
**Solution**: Check precedence. Env var overrides config overrides walk-up. Use --check-config.

### Issue: Walk-up not finding plans/
**Solution**: Verify plans/ directory exists and is accessible. Check permissions.

### Issue: Performance slow
**Solution**: Verify caching is working. Profile to find bottleneck.

## Key Files to Modify

1. `src/config/` (new directory)
2. `src/mcp/server.ts` (line 91)
3. `src/mcp/tools/shared.ts` (verify resolveDirectory)
4. `schemas/riotplan-config.schema.json` (new file)
5. Documentation files (README.md, guides, etc.)

## Dependencies

- `@theunwalked/cardigantime@^0.0.23` (already in package.json)
- `zod` (already in package.json)
- Node.js `fs`, `path` modules

## Timeline

- Phase 1 (Foundation): 2-3 days
- Phase 2 (Integration): 1-2 days
- Phase 3 (Testing): 2-3 days
- Phase 4 (Documentation): 1-2 days
- Phase 5 (Validation): 1-2 days

**Total**: 7-12 days

---

*Quick reference for implementation. See individual step files for detailed instructions.*
