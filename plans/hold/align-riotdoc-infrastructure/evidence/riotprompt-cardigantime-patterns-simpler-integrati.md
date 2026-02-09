# Evidence: RiotPrompt CardiganTime patterns - simpler integration approach

**Source**: codebase analysis
**Original Query**: How does RiotPrompt use CardiganTime?
**Added**: 2026-02-08T16:47:06.169Z
**Gathering Method**: model-assisted
**Relevance Score**: 0.9

---

## RiotPrompt CardiganTime Integration

### Instance Creation
```typescript
const configManager = createConfig({
    configShape: ConfigSchema.shape,
    defaults: {
        configDirectory: process.cwd(),
        configFile: 'riotprompt.yaml',
        pathResolution: { pathFields: ['promptsDir', 'outputDir'] },
    }
});
```

### Config Schema
```typescript
export const ConfigSchema = z.object({
    defaultModel: z.string().default('gpt-4'),
    promptsDir: z.string().default('.'),
    outputDir: z.string().optional(),
});
```

### Key Differences from RiotPlan
- Simpler: no custom walk-up logic
- CLI uses `configManager.configure(program)` for Commander integration
- MCP server does NOT use CardiganTime (manual YAML reader instead)
- No explicit caching
- No `--init-config` or `check-config` CLI commands

### Known Gap
- MCP server has a separate manual YAML reader that doesn't use CardiganTime
- This is inconsistent and something RiotDoc should avoid