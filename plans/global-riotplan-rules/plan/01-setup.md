# Step 01: Extend Config Schema

## Objective

Add `planRules` and `validationRules` properties to the RiotPlan configuration schema. These are optional arrays of strings (freeform markdown) that define project-specific rules.

## Background

The config schema (`src/config/schema.ts`) currently defines `planDirectory`, `defaultProvider`, `defaultModel`, and `templateDirectory`. We need to add two new optional properties for rules. Since rules are optional, this maintains backward compatibility.

## Tasks

### 1. Update Config Schema

Edit `src/config/schema.ts`:
- Add `planRules?: z.array(z.string()).optional()` to schema
- Add `validationRules?: z.array(z.string()).optional()` to schema
- Update TypeScript type export (automatically inferred from Zod schema)

### 2. Update Config Schema JSON

If there's a JSON schema file (`schemas/riotplan-config.schema.json`), update it to include the new properties:
- `planRules`: array of strings, optional
- `validationRules`: array of strings, optional

### 3. Verify Config Loading

Ensure that when `loadConfig()` is called, the new properties are available:
- Test with config file containing rules
- Test with config file without rules (should work as before)
- Verify rules are accessible via `config.planRules` and `config.validationRules`

## Acceptance Criteria

- [ ] Config schema includes `planRules` and `validationRules` as optional arrays
- [ ] TypeScript types are updated correctly
- [ ] Config loader successfully loads rules when present
- [ ] Config loader works normally when rules are absent
- [ ] JSON schema updated (if applicable)

## Testing

- Create test config file with rules
- Load config and verify rules are present
- Create test config file without rules
- Load config and verify it works (undefined/null for rules is fine)

## Files Changed

- `src/config/schema.ts`
- `schemas/riotplan-config.schema.json` (if exists)

## Notes

- Rules are optional - always use optional chaining or default to empty array
- Rules are arrays of strings - no validation of content format
- Rules are project-specific - loaded via existing config resolution
