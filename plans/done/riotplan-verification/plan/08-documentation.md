# Step 08: Documentation

## Objective

Document the verification system in the RiotPlan guide.

## Tasks

### 8.1 Add Verification Section to guide/usage.md

Add to `/Users/tobrien/gitw/kjerneverk/riotplan/guide/usage.md`:

```markdown
## Plan Verification

RiotPlan includes verification to catch common planning and execution gaps.

### The Verification Problem

Without verification:
- Plans may miss requirements from the analysis
- Execution may skip steps or complete them partially
- "I forgot" - the AI gets halfway and misses things

### Verification Commands

```bash
# Full verification (recommended)
riotplan verify ./my-plan

# Check plan covers analysis requirements
riotplan verify ./my-plan --analysis

# Check execution is complete
riotplan verify ./my-plan --execution

# Show all verification criteria
riotplan verify ./my-plan --criteria

# JSON output for scripting
riotplan verify ./my-plan --json
```

### Setting Up Verification Criteria

Add a "Verification Criteria" section to your `analysis/REQUIREMENTS.md`:

```markdown
## Verification Criteria

### Must Have (Plan Fails Without)
- [ ] User authentication endpoint exists
- [ ] Session tokens have 24hr expiry
- [ ] Passwords are hashed with bcrypt

### Should Have (Plan Incomplete Without)
- [ ] Rate limiting on auth endpoints
- [ ] Login audit logging

### Could Have (Nice to Have)
- [ ] Remember me functionality
```

Criteria are weighted by priority:
- **Must Have**: 100% weight (critical)
- **Should Have**: 70% weight (important)
- **Could Have**: 30% weight (nice to have)

### Understanding Verification Output

#### Coverage Report (Analysis → Plan)

```
Verification: Analysis → Plan Alignment

✅ COVERED (5):
   • Authentication flow requirements → Steps 01-03
   
⚠️  PARTIAL (2):
   • Logging requirements → Step 04 (only error logging)
   
❌ MISSING (1):
   • Rate limiting requirement → Not found

Alignment Score: 78%
```

#### Completion Report (Plan → Execution)

```
Verification: Plan → Execution Alignment

✅ Step 01 - Analysis
⚠️  Step 02 - Implementation
   ❌ API endpoints not tested
❌ Step 03 - Testing
   ⚠️  Marked as Complete but criteria not met

Execution Completeness: 45%
```

### When to Verify

Run verification at key points:
1. **After generating a plan**: Catch missing requirements early
2. **Before execution**: Confirm plan is ready
3. **During execution**: Track progress
4. **After completion**: Confirm everything was done

### Verification vs Validation

| Command | Purpose |
|---------|---------|
| `riotplan validate` | Check plan structure is correct |
| `riotplan verify` | Check plan content addresses requirements |

### Tips for Effective Verification

1. **Be specific in criteria**: "API returns 200 on success" is better than "API works"
2. **Use priority levels**: Focus on Must Have first
3. **Check acceptance criteria in steps**: These become verification targets
4. **Run verification often**: Catch drift early
```

### 8.2 Update Command Help

Ensure the verify command has good help text:

```typescript
.description("Verify plan alignment and completion")
.option("-a, --analysis", "Verify plan covers analysis requirements")
.option("-e, --execution", "Verify execution is complete")
.option("-c, --criteria", "Show all verification criteria")
.option("--json", "Output as JSON")
```

## Acceptance Criteria

- [ ] Verification section added to guide/usage.md
- [ ] Verification criteria format documented
- [ ] Output formats explained
- [ ] When to verify guidance provided
- [ ] Verify vs validate explained
- [ ] Command help text is clear

## Files Changed

- `riotplan/guide/usage.md` (update)

## Notes

Documentation should help users understand both how to use verification and why it matters.
