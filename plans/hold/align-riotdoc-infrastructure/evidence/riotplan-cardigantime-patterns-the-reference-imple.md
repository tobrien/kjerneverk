# Evidence: RiotPlan CardiganTime patterns - the reference implementation

**Source**: codebase analysis
**Original Query**: How does RiotPlan use CardiganTime for configuration management?
**Added**: 2026-02-08T16:46:59.835Z
**Gathering Method**: model-assisted
**Relevance Score**: 1

---

## RiotPlan CardiganTime Integration (Reference Pattern)

### Instance Creation
```typescript
const cardigantime = create({
    defaults: {
        configDirectory: process.cwd(),
        isRequired: false,
        pathResolution: { pathFields: ['planDirectory', 'templateDirectory'] },
    },
    configShape: RiotPlanConfigSchema.shape,
    features: ['config'],
});
```

### Config Schema
```typescript
export const RiotPlanConfigSchema = z.object({
    planDirectory: z.string().default('./plans'),
    defaultProvider: z.enum(['anthropic', 'openai', 'gemini']).optional(),
    defaultModel: z.string().optional(),
    templateDirectory: z.string().optional(),
});
```

### Four-Tier Resolution
1. Environment variable: `RIOTPLAN_PLAN_DIRECTORY`
2. Config file: `riotplan.config.*`, `.riotplan/config.*`
3. Walk-up detection: Custom logic walks up directory tree to find `plans/`
4. Fallback: `./plans` in current directory

### MCP Integration
- Uses CardiganTime via `resolvePlanDirectory()`
- Suppresses stdout to prevent protocol corruption from CardiganTime output

### File Organization
```
src/config/
├── index.ts      # Re-exports
├── loader.ts     # CardiganTime instance and loadConfig()
├── schema.ts     # Zod schema
├── resolver.ts   # Four-tier resolution
└── walk-up.ts    # Walk-up detection logic
```

### CLI Commands
- `--init-config`: Creates config file with defaults
- `check-config`: Shows resolution and validation results

### Tests
- Schema validation, resolution tiers, walk-up, CLI integration