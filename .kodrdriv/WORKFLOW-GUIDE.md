# Kjerneverk Monorepo Workflow Guide

## Branch Strategy

- **`main`**: Production releases only. Protected branch requiring PRs.
- **`working`**: Active development branch. All work happens here.

## Development Workflow

### Starting Development

After a release, transition to development mode:

```bash
cd /path/to/package
kodrdriv development --target-version patch
```

This will:
1. Switch to `working` branch
2. Sync with `main`
3. Bump version to next dev version (e.g., `1.0.3-dev.0`)
4. Commit and push changes

### Publishing Workflow

When ready to publish:

```bash
# For single package
cd /path/to/package
kodrdriv publish

# For entire monorepo
cd /Users/tobrien/gitw/kjerneverk
kodrdriv tree_publish
```

This will:
1. Create a PR from `working` to `main`
2. Wait for CI checks to pass
3. Merge PR to `main`
4. Create a release tag
5. Trigger npm publish workflow

## Avoiding Merge Conflicts

### Key Rules

1. **Always work on `working` branch** - Never commit directly to `main`
2. **Keep branches in sync** - Regularly pull from `origin/working`
3. **Use kodrdriv commands** - They handle version management automatically
4. **Don't manually edit versions** - Let kodrdriv manage version numbers

### Common Issues and Solutions

#### Issue: "Working directory has uncommitted changes"

**Cause**: Modified files (usually `package.json` with version changes)

**Solution**:
```bash
# Check what changed
git status

# If it's just version changes from a previous publish attempt
git restore package.json

# Or commit if they're intentional changes
git add .
git commit -m "description"
```

#### Issue: "Target branch not synchronized with remote"

**Cause**: Local `main` branch is out of sync with remote

**Solution**:
```bash
git checkout main
git pull origin main
git checkout working
```

#### Issue: Branch protection prevents direct push to main

**Cause**: Repository requires PRs for main branch

**Solution**: This is expected! The `kodrdriv publish` workflow creates PRs automatically. Just wait for them to merge.

### Tree Publish Recovery

If `tree_publish` fails partway through:

1. **Check which packages succeeded**: Look at the error message to see which package failed
2. **Fix the issue**: Address the specific error (build failure, test failure, etc.)
3. **Commit and push fixes**: Make sure all changes are committed
4. **Resume with continue**: Run `kodrdriv tree_publish --continue` to resume from checkpoint

**Important**: Always use `tree_publish` with `--continue` when resuming. Don't switch to single-package `publish` commands as this breaks version coordination.

## Post-Publish Checklist

After a successful publish:

1. ✅ All packages are on `main` with release versions
2. ✅ All packages are back on `working` with dev versions (e.g., `x.y.z-dev.0`)
3. ✅ All changes are pushed to remote
4. ✅ npm packages are published with correct tags (`latest` for releases, `dev` for prereleases)

## Version Management

### Version Format

- **Release**: `1.0.0`, `1.0.1`, `1.1.0`, `2.0.0`
- **Development**: `1.0.1-dev.0`, `1.0.1-dev.1`, etc.

### Version Increment Rules

- **patch**: Bug fixes and minor changes (1.0.0 → 1.0.1)
- **minor**: New features, backward compatible (1.0.0 → 1.1.0)
- **major**: Breaking changes (1.0.0 → 2.0.0)

### npm Tag Strategy

- **`latest`**: Production releases (default for `npm install`)
- **`dev`**: Development versions (must specify: `npm install @pkg/name@dev`)

This is handled automatically by the npm publish workflow based on version format.

## Troubleshooting

### Check Development Readiness

```bash
kodrdriv check-development
```

Verifies:
- Not on main/master branch
- Up to date with remote
- Has dev version
- Local dependencies are linked (for monorepos)

### Manual Sync (if needed)

```bash
# Sync working with main
git checkout working
git merge main --no-edit
git push origin working
```

## Emergency Recovery

If things get really messed up:

1. **Backup your work**: Create a temporary branch
   ```bash
   git checkout -b backup-$(date +%Y%m%d)
   git push origin backup-$(date +%Y%m%d)
   ```

2. **Reset working to match main**:
   ```bash
   git checkout working
   git reset --hard origin/main
   git push origin working --force
   ```

3. **Re-run development workflow**:
   ```bash
   kodrdriv development --target-version patch
   ```

4. **Cherry-pick your work** from the backup branch if needed

## Contact

For issues with the workflow, check:
- kodrdriv documentation
- GitHub Actions logs for failed workflows
- This guide for common solutions
