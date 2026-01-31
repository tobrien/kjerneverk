# Bug: Model Doesn't Read Evidence When Creating Implementation Steps

## Summary
When creating implementation steps, the model relies on conversation memory instead of re-reading evidence files that were gathered during idea exploration.

## Expected Behavior
When creating implementation steps, the model should:
1. Read all files in `.evidence/` directory
2. Read `IDEA.md` for complete requirements
3. Read `SHAPING.md` for selected approach
4. Create steps that explicitly reference and incorporate evidence
5. Include specific code examples, requirements, and details from evidence

## Actual Behavior
The model:
1. Creates steps quickly from conversation memory
2. Doesn't make tool calls to read evidence files
3. Creates general steps without specific details from evidence
4. Misses important information documented in evidence

## Evidence

### What Was Gathered
In cardigantime-file-resolution plan:
- `.evidence/proposed-fix-resolve-path-value.md` - 130 lines with:
  - Specific code for `resolvePathValue()` enhancement
  - Before/after examples
  - Implementation locations (line numbers)
  - Testing requirements
  - Backward compatibility analysis
- `IDEA.md` - 88 lines with:
  - All Q&A findings
  - Requirements and constraints
  - Implementation notes
- `.history/timeline.jsonl` - Full conversation history

### What The Model Did
Created 12 steps in seconds without:
- Reading `.evidence/proposed-fix-resolve-path-value.md`
- Reading `IDEA.md` in full
- Referencing specific code examples
- Including line numbers or file locations from evidence

### The Result
Steps are general and superficial:
- "Enhance resolvePathValue() to handle objects"
- Missing: The actual code from evidence
- Missing: Specific line numbers (72-84, 97-109)
- Missing: Test examples from evidence
- Missing: Before/after code comparisons

## Impact

### On Users
- **Wasted effort** - Time spent gathering evidence is wasted
- **Loss of trust** - "Why gather evidence if it's not used?"
- **Incomplete plans** - Steps lack important details
- **Rework required** - User must manually add details from evidence

### On Plan Quality
- **Superficial** - Plans based on memory, not documentation
- **Inaccurate** - Memory may be incomplete or wrong
- **Not reproducible** - Can't regenerate plan from evidence alone
- **Missing context** - Future readers can't understand why decisions were made

## Root Cause

### Model Behavior
The model has conversation memory and uses it to create steps quickly. But:
1. Memory is lossy - details fade
2. Memory is contextual - may not include all evidence
3. Memory isn't persistent - lost after context window

### Missing Workflow
There's no prompt or instruction that says:
> "Before creating implementation steps, read all evidence files in .evidence/ directory and incorporate their specific details into the steps."

## Proposed Fix

### Option 1: Add to Model Instructions
Update system prompt or RiotPlan workflow to include:

```
When creating implementation steps:
1. FIRST: Read all files in .evidence/ directory
2. THEN: Read IDEA.md for complete requirements
3. THEN: Read SHAPING.md for selected approach
4. THEN: Create steps that reference specific evidence
5. Include code examples, line numbers, and details from evidence
```

### Option 2: Tool Enhancement
Create `riotplan_step_generate_from_evidence` tool that:
1. Automatically reads all evidence files
2. Passes them to model with prompt
3. Generates steps based on evidence, not memory

### Option 3: Validation Step
Add `riotplan_validate_steps` tool that:
1. Checks if steps reference evidence
2. Warns if evidence files exist but aren't used
3. Suggests regenerating with evidence

## Testing

### How to Verify Fix
1. Create a plan with evidence files
2. Create implementation steps
3. Check tool calls - should see Read calls for evidence files
4. Check step content - should include specific details from evidence
5. Verify steps reference evidence files

### Success Criteria
- Model reads all `.evidence/*.md` files before creating steps
- Steps include specific code examples from evidence
- Steps reference line numbers and file locations from evidence
- Steps incorporate test requirements from evidence
- Plan is reproducible from evidence alone

## Workaround
User must:
1. Notice steps are superficial
2. Manually read evidence files
3. Update steps with missing details
4. Or ask model to regenerate after reading evidence

## Related Issues
- riotplan-gathering-evidence: Evidence not being captured proactively
- riotplan-losing-focus: Updates not being made to plans
- Pattern: RiotPlan tools and model behavior don't integrate with gathered context

## Priority
**Critical** - This undermines the entire evidence-gathering workflow. If evidence isn't used, why gather it?

## Example

### Bad (Current)
```markdown
## Step 2: Enhance resolvePathValue() for objects
Update resolvePathValue() to handle objects with string values.
```

### Good (With Evidence)
```markdown
## Step 2: Enhance resolvePathValue() for objects

Based on `.evidence/proposed-fix-resolve-path-value.md`:

Update `resolvePathValue()` in two locations:
- `src/util/hierarchical.ts` (lines 72-84)
- `src/read.ts` (lines 97-109)

Add object handling:
\`\`\`typescript
if (value && typeof value === 'object' && !Array.isArray(value)) {
    const resolved: any = {};
    for (const [key, val] of Object.entries(value)) {
        if (typeof val === 'string') {
            resolved[key] = resolveSinglePath(val, configDir);
        } else if (Array.isArray(val)) {
            resolved[key] = val.map(item =>
                typeof item === 'string' ? resolveSinglePath(item, configDir) : item
            );
        } else {
            resolved[key] = val;
        }
    }
    return resolved;
}
\`\`\`

This allows scopeRoots and similar map configs to work with just `pathFields: ['scopeRoots']`.
```
