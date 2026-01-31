# Step 02: Define Comprehensive Zod Schema

## Goal

Create a comprehensive Zod schema that defines all riotplan configuration options, starting with `planDirectory` and including future settings.

## Tasks

- [ ] Define `RiotPlanConfigSchema` in `src/config/schema.ts`
- [ ] Add `planDirectory` field (string, default './plans')
- [ ] Add `defaultProvider` field (enum: 'anthropic' | 'openai' | 'gemini', optional)
- [ ] Add `defaultModel` field (string, optional)
- [ ] Add `templateDirectory` field (string, optional)
- [ ] Export TypeScript type from schema: `export type RiotPlanConfig = z.infer<typeof RiotPlanConfigSchema>`
- [ ] Add detailed JSDoc comments explaining each field

## Example Schema Structure

```typescript
import { z } from 'zod';

export const RiotPlanConfigSchema = z.object({
  planDirectory: z.string().default('./plans'),
  defaultProvider: z.enum(['anthropic', 'openai', 'gemini']).optional(),
  defaultModel: z.string().optional(),
  templateDirectory: z.string().optional(),
});

export type RiotPlanConfig = z.infer<typeof RiotPlanConfigSchema>;
```

## Acceptance Criteria

- [ ] Schema compiles without errors
- [ ] All fields have appropriate validation
- [ ] Default values are set correctly
- [ ] TypeScript type is exported
- [ ] Schema is documented

## Notes

This schema will be used by CardiganTime for validation. Keep it extensible for future config options.
