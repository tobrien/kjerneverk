# Kjerneverk Workspace Scripts

This directory contains scripts to help manage the kjerneverk multi-repository workspace.

## Prerequisites

- Git must be installed
- You must have access to all repositories listed in `repos.txt`

## Scripts

### `clone-repos.sh`

Clones all repositories listed in `../repos.txt` into the kjerneverk workspace.

**Usage:**

```bash
# Clone all repos into the kjerneverk directory
cd /path/to/kjerneverk
./bin/clone-repos.sh

# Or specify a different target directory
./bin/clone-repos.sh /path/to/target
```

**Features:**
- Automatically pulls latest changes if a repository already exists
- Colored output for easy reading
- Summary of successful and failed operations
- Skips empty lines and comments in repos.txt

### `checkout-working.sh`

Checks out the `working` branch across all kjerneverk projects.

**Usage:**

```bash
cd /path/to/kjerneverk
./bin/checkout-working.sh
```

**Features:**
- Checks all projects listed in the script
- Skips repositories with uncommitted changes
- Shows status with colored indicators:
  - ✓ (green) - Successfully switched branches
  - ⊙ (yellow) - Already on working branch
  - ✗ (red) - Failed or has uncommitted changes
- Summary of successful and failed operations

### `pull-all.sh`

Pulls from origin for all kjerneverk projects on their current branches.

**Usage:**

```bash
cd /path/to/kjerneverk
./bin/pull-all.sh
```

**Features:**
- Pulls from origin for each project's current branch
- Skips repositories with uncommitted changes or untracked files
- Shows status with colored indicators:
  - ✓ (green) - Successfully pulled changes
  - → (blue) - Already up to date
  - ⊙ (yellow) - Skipped due to uncommitted changes or untracked files
  - ✗ (red) - Failed to pull
- Summary of successful, skipped, and failed operations

## Initial Setup

1. Clone the kjerneverk repository:
   ```bash
   cd ~/gitw
   git clone https://github.com/kjerneverk/kjerneverk.git
   cd kjerneverk
   ```

2. Clone all related repositories:
   ```bash
   ./bin/clone-repos.sh
   ```

3. (Optional) Check out the working branch in all repos:
   ```bash
   ./bin/checkout-working.sh
   ```

4. Open the workspace in your editor:
   ```bash
   code kjerneverk.code-workspace
   ```

## Configuration

### repos.txt

The `repos.txt` file in the kjerneverk root directory contains the list of repositories to clone. Each line should contain one repository URL:

```
https://github.com/kjerneverk/riotdoc.git
https://github.com/kjerneverk/riotplan.git
# ... more repos
```

Lines starting with `#` are treated as comments and ignored.

### Adding New Repositories

1. Add the repository URL to `repos.txt`
2. Run `./bin/clone-repos.sh` to clone the new repository
3. Add the repository to `kjerneverk.code-workspace` if desired
4. Add the repository name to the `PROJECTS` array in `checkout-working.sh` if you want it included in branch operations
