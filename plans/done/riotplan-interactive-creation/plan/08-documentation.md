# Step 08: Documentation

## Objective

Document the interactive creation workflow in the RiotPlan guide.

## Background

Users need to understand:
- When to use `create` vs `init`
- How the analysis/elaborate flow works
- How the amend flow works
- Available flags and options

## Tasks

### 8.1 Update guide/usage.md

Add a new section to `/Users/tobrien/gitw/kjerneverk/riotplan/guide/usage.md`:

```markdown
## Interactive Plan Creation

For guided plan creation, use the `create` command instead of `init`.

### Basic Usage

```bash
# Start interactive creation
riotplan create my-feature

# Skip analysis, generate directly
riotplan create my-feature --direct

# Force analysis phase
riotplan create my-feature --analyze
```

### The Create Flow

The `create` command guides you through plan creation:

1. **Name & Description**: Provide a name and describe what you want to accomplish
2. **Mode Selection**: Choose analysis-first or direct generation
3. **Elaboration** (if analysis mode): Refine requirements iteratively
4. **Generation**: Create plan files from analysis or prompt
5. **Amendment**: Review and provide feedback on the generated plan

### Analysis Mode

Analysis mode is recommended for complex plans:

```bash
riotplan create complex-feature --analyze
```

This creates an `analysis/` directory with:
- `REQUIREMENTS.md` - Elaborated requirements
- `prompts/` - Saved elaboration feedback

Use `riotplan elaborate` to add feedback:

```bash
riotplan elaborate ./complex-feature
riotplan elaborate ./complex-feature -m "Quick feedback"
```

When ready, mark analysis complete and generate:

```bash
riotplan analysis ready ./complex-feature
riotplan generate ./complex-feature
```

### Direct Mode

For straightforward plans, skip analysis:

```bash
riotplan create simple-fix --direct
```

This generates the plan immediately from your description.

### Amending Plans

After generation, use `amend` for structural feedback:

```bash
riotplan amend ./my-feature
riotplan amend ./my-feature -m "Step 03 should come before 02"
riotplan amend ./my-feature -s 02 -m "Add more detail"
```

Amendments are saved to `amendments/` for reference.

### Create vs Init

| Command | Use Case |
|---------|----------|
| `riotplan create` | Guided, interactive creation with analysis |
| `riotplan init` | Quick scaffolding for programmatic use |

### Prompt Preservation

All inputs are saved for recovery:
- Initial prompt → `<name>-prompt.md`
- Elaborations → `analysis/prompts/XXX-feedback.md`
- Amendments → `amendments/XXX-feedback.md`

If interrupted, you can resume where you left off.
```

### 8.2 Add Command Reference

Add to guide or create `guide/commands.md`:

```markdown
## Command Reference

### riotplan create

Create a new plan interactively.

```bash
riotplan create [name] [options]
```

**Arguments:**
- `name` - Plan name (kebab-case). Prompted if not provided.

**Options:**
- `-d, --direct` - Skip analysis, generate plan directly
- `-a, --analyze` - Force analysis phase
- `-p, --path <path>` - Output directory (default: current)

### riotplan elaborate

Add elaboration feedback to analysis.

```bash
riotplan elaborate [path] [options]
```

**Options:**
- `-m, --message <message>` - Feedback message (skip editor)

### riotplan amend

Provide amendment feedback on a plan.

```bash
riotplan amend [path] [options]
```

**Options:**
- `-m, --message <message>` - Amendment message (skip editor)
- `-s, --step <number>` - Specific step to amend

### riotplan generate

Generate plan files from analysis or prompt.

```bash
riotplan generate [path] [options]
```

**Options:**
- `-s, --steps <number>` - Number of steps (default: 5)
- `-f, --force` - Overwrite existing plan files

### riotplan analysis

Analysis management commands.

```bash
riotplan analysis show [path]   # Display current analysis
riotplan analysis ready [path]  # Mark analysis as ready
```

### riotplan amendments

Amendment management commands.

```bash
riotplan amendments list [path] # List all amendments
```
```

### 8.3 Update README

Add a quick start section to `/Users/tobrien/gitw/kjerneverk/riotplan/README.md`:

```markdown
## Quick Start

### Interactive Creation (Recommended)

```bash
# Create a plan with guided workflow
npx riotplan create my-feature

# You'll be prompted for:
# 1. Description of what you want to accomplish
# 2. Whether to analyze first or generate directly
# 3. Optional elaboration and amendment feedback
```

### Programmatic Creation

```bash
# Quick scaffolding
npx riotplan init my-feature --description "My feature"
```
```

## Acceptance Criteria

- [ ] guide/usage.md updated with create flow documentation
- [ ] All new commands documented with options
- [ ] Create vs Init comparison explained
- [ ] Prompt preservation documented
- [ ] README quick start updated
- [ ] Examples are accurate and tested

## Testing

```bash
# Verify documentation accuracy by running examples
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build

# Test documented commands
./dist/cli/bin.js create doc-test --direct
./dist/cli/bin.js elaborate ./doc-test -m "Test"
./dist/cli/bin.js amend ./doc-test -m "Test"
./dist/cli/bin.js analysis show ./doc-test
./dist/cli/bin.js amendments list ./doc-test
```

## Files Changed

- `riotplan/guide/usage.md` (update)
- `riotplan/guide/commands.md` (new, optional)
- `riotplan/README.md` (update)

## Notes

Documentation should be practical and example-driven. Users should be able to get started by copying examples directly.
