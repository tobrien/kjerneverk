# Step 11: Release

## Objective

Coordinate release of all new packages to npm.

## Release Order

Due to dependencies, packages must be released in order:

```
1. execution           # No dependencies
2. execution-openai    # Depends on execution
3. execution-anthropic # Depends on execution
4. execution-gemini    # Depends on execution
5. agentic             # Depends on execution
6. riotprompt          # Depends on execution, agentic
7. riotprompt-cli      # Depends on all above
8. riotplan            # Stub, depends on execution, agentic
9. riotplan-cli        # Stub, depends on riotplan
```

## Tasks

### 11.1 Pre-Release Checklist

For each package:

- [ ] Tests pass
- [ ] Build succeeds
- [ ] README is accurate
- [ ] package.json version is correct
- [ ] License file exists
- [ ] No uncommitted changes

### 11.2 Version Strategy

Initial versions:

| Package | Version | Notes |
|---------|---------|-------|
| execution | 0.1.0 | First release |
| execution-openai | 0.1.0 | First release |
| execution-anthropic | 0.1.0 | First release |
| execution-gemini | 0.1.0 | First release |
| agentic | 0.1.0 | First release |
| riotprompt | 1.0.0 | Major version (architecture change) |
| riotprompt-cli | 1.0.0 | Major version |
| riotplan | 0.0.1-alpha.0 | Stub |
| riotplan-cli | 0.0.1-alpha.0 | Stub |

### 11.3 npm Configuration

Each package needs:

```json
{
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 11.4 Publish Sequence

```bash
# 1. execution
cd /Users/tobrien/gitw/kjerneverk/execution
npm publish

# 2. execution providers
cd /Users/tobrien/gitw/kjerneverk/execution-openai
npm publish

cd /Users/tobrien/gitw/kjerneverk/execution-anthropic
npm publish

cd /Users/tobrien/gitw/kjerneverk/execution-gemini
npm publish

# 3. agentic
cd /Users/tobrien/gitw/kjerneverk/agentic
npm publish

# 4. riotprompt
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm publish

# 5. riotprompt-cli
cd /Users/tobrien/gitw/kjerneverk/riotprompt-cli
npm publish

# 6. riotplan (stub)
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm publish --tag alpha

# 7. riotplan-cli (stub)
cd /Users/tobrien/gitw/kjerneverk/riotplan-cli
npm publish --tag alpha
```

### 11.5 Verify Publications

```bash
npm view execution
npm view execution-openai
npm view execution-anthropic
npm view execution-gemini
npm view agentic
npm view riotprompt
npm view riotprompt-cli
npm view riotplan
npm view riotplan-cli
```

### 11.6 Test Fresh Installation

```bash
mkdir /tmp/release-test
cd /tmp/release-test
npm init -y

# Test individual packages
npm install execution
npm install execution-openai
npm install agentic

# Test riotprompt (should pull dependencies)
npm install riotprompt

# Test CLI
npm install -g riotprompt-cli
riotprompt --version
```

### 11.7 Create Release Notes

```markdown
# Release Notes: Kjerneverk Ecosystem v1.0

## Overview

We've restructured the riotprompt codebase into a modular ecosystem of packages.

## New Packages

- **execution** - Provider interfaces and model configuration
- **execution-openai** - OpenAI provider (GPT-4, etc.)
- **execution-anthropic** - Anthropic provider (Claude)
- **execution-gemini** - Gemini provider
- **agentic** - Agentic AI framework
- **riotprompt-cli** - Command-line interface
- **riotplan** (alpha) - Long-lived workflows

## Benefits

1. **Smaller bundles** - Install only what you need
2. **Clear boundaries** - Each package has one job
3. **Independent versioning** - Packages evolve independently
4. **Better reusability** - agentic/execution work with any prompt library

## Migration

No breaking changes! All existing riotprompt imports continue to work.

See MIGRATION.md for optimization tips.

## What's Next

- riotplan development
- Additional execution providers
- Performance improvements
```

### 11.8 Update STATUS.md

Mark all steps as complete in `/Users/tobrien/gitw/kjerneverk/prompts/big-splitup/STATUS.md`.

## Post-Release

### Announce

- Update documentation site
- Social media announcement
- GitHub release

### Monitor

- Watch for issues
- Respond to questions
- Collect feedback

### Plan Next

- riotplan development
- Feature requests
- Bug fixes

## Completion

🎉 **Congratulations!** The RiotPrompt split-up is complete!

All packages are now:
- Independent projects in `/Users/tobrien/gitw/kjerneverk/`
- Published to npm
- Documented
- Ready for use

## Final Directory Structure

```
/Users/tobrien/gitw/kjerneverk/
├── riotprompt/           ✅ Published 1.0.0
├── riotprompt-cli/       ✅ Published 1.0.0
├── agentic/              ✅ Published 0.1.0
├── execution/            ✅ Published 0.1.0
├── execution-openai/     ✅ Published 0.1.0
├── execution-anthropic/  ✅ Published 0.1.0
├── execution-gemini/     ✅ Published 0.1.0
├── riotplan/             ✅ Published 0.0.1-alpha.0
├── riotplan-cli/         ✅ Published 0.0.1-alpha.0
├── prompts/              (Plan files)
└── ECOSYSTEM.md          (Overview doc)
```
