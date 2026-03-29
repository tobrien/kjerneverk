# Agent Instructions

## Monorepo Structure

This is a **multi-package monorepo** containing related packages for the kjerneverk ecosystem:

| Package | Description |
|---------|-------------|
| `riotplan` | Core planning and project management |
| `riotplan-core` | Core data models and operations |
| `riotplan-render` | Rendering utilities |
| `riotplan-verify` | Verification and validation |
| `riotplan-catalyst` | Catalyst-based enhancements |
| `riotplan-format` | Formatting utilities |
| `riotplan-templates` | Starter templates |
| `riotplan-commands-*` | Command implementations |
| `commands-*` | Various command packages |
| `history` | History tracking |
| `renderer` | Rendering components |

## Repository Management

### Cloning All Repos

```bash
# repos.txt contains list of all repositories
# bin/clone-repos.sh clones them all
bin/clone-repos.sh
```

### Pulling Latest Changes

```bash
# Pulls latest from origin/working in all repos
kodrdriv tree pull
```

## Tree Commands

KodrDriv provides `tree` commands to operate across all packages in dependency order.

### `kodrdriv tree --cmd 'npm install'`

Runs `npm install` in each package. Packages are processed in topological order based on their dependencies.

**Usage:**
```bash
kodrdriv tree --cmd 'npm install'
```

This ensures all dependencies are installed before moving to dependent packages.

### `kodrdriv tree precommit`

Runs precommit checks (lint → build → test) in each package in topological order.

**Usage:**
```bash
kodrdriv tree precommit
```

**Options:**
- `--continue` - Resume from last failed package
- `--verbose` - Show detailed output

**Process:**
1. Runs linting (ESLint)
2. Builds TypeScript (tsc + vite)
3. Runs tests (Vitest)

### `kodrdriv tree commit`

Generates commit messages using AI and commits changes in each package.

**Usage:**
```bash
kodrdriv tree commit --add
```

**Options:**
- `--add` - Stage all changes before committing
- `--sendit` - Auto-accept generated messages (if supported)
- `--dry-run` - Preview without committing
- `--context-files [files...]` - Add context to commit generation
- `--self-reflection` - Generate reflection report

### `kodrdriv tree publish`

Publishes packages to npm in topological order.

**Usage:**
```bash
kodrdriv tree publish
```

**Options:**
- `--parallel` - Publish packages in parallel (where safe)
- `--dry-run` - Preview without publishing
- `--context-files [files...]` - Add context to release notes

**Notes:**
- Uses `dev` tag for development versions
- Uses `latest` tag for stable releases
- Respects `publish.ignorePatterns` to skip certain changes

## Workflow

### Typical Development Flow

```bash
# 1. Pull latest changes
kodrdriv tree pull

# 2. Make changes to code

# 3. Run precommit checks
kodrdriv tree precommit

# 4. If checks pass, commit
kodrdriv tree commit --add

# 5. Publish when ready
kodrdriv tree publish
```

### Workspace Configuration

The workspace-level KodrDriv config is at `/workspace/gitw/.kodrdriv/config.yaml` and applies to all projects in `/workspace/gitw/`.

Package-specific settings are in `.kodrdriv/config.yaml` within each repo.

## Package Dependencies

Packages have dependencies on each other managed through npm. The `link` and `unlink` commands manage local vs registry dependencies:

```bash
# Link for local development
kodrdriv tree link

# Restore registry dependencies
kodrdriv tree unlink
```
