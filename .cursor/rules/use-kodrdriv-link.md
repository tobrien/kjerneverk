# Use kodrdriv Link Commands Instead of npm link

## Rule: Prefer kodrdriv link/tree link for Package Linking

When working with monorepos or packages that need to be linked for local development, **ALWAYS** prefer `kodrdriv link` or `kodrdriv tree link` over `npm link` or `npm install`.

### Required Commands

Use these kodrdriv commands for linking:

1. **For single package**: `kodrdriv link`
2. **For entire workspace/monorepo**: `kodrdriv tree link`

### Why This Matters

The `kodrdriv tree link` command:
- Analyzes the entire dependency graph
- Builds packages in proper dependency order
- Sets up `file:` dependencies correctly for local development
- Handles complex monorepo structures automatically
- Avoids permission issues with symlinks

Traditional `npm link` or `npm install`:
- May not resolve the full dependency chain
- Can have permission/symlink issues
- Doesn't understand monorepo structure
- May leave packages in inconsistent states

### When to Use Each Command

**Use `kodrdriv tree link`**:
- When working in a monorepo (like `/Users/tobrien/gitw/grunnverk` or `/Users/tobrien/gitw/kjerneverk`)
- When multiple packages depend on each other
- After pulling changes that affect dependencies
- When setting up a development environment

**Use `kodrdriv link`**:
- When working in a single package that needs to link to others
- As a targeted alternative to `npm link` for one package

**Use `npm install` only when**:
- Installing external dependencies from npm registry
- The project doesn't use kodrdriv

### Example Scenarios

❌ **WRONG**: Module resolution error occurs → Run `npm install` in affected package

✅ **CORRECT**: Module resolution error occurs → Run `kodrdriv tree link` from workspace root

❌ **WRONG**: Missing dependencies → Run `npm link` for each package manually

✅ **CORRECT**: Missing dependencies → Run `kodrdriv tree link` to link entire dependency graph

❌ **WRONG**: Build fails with "Cannot find module" → Install dependencies individually

✅ **CORRECT**: Build fails with "Cannot find module" → Build packages in order, then run `kodrdriv tree link`

### Troubleshooting Steps

When encountering module resolution errors (`ERR_MODULE_NOT_FOUND`):

1. **First**: Run `kodrdriv tree link` from the workspace root
2. **If that fails**: Build the packages first (`npm run build` in each), then run `kodrdriv tree link`
3. **Last resort**: Check if packages need `npm install` for external dependencies, then re-run `kodrdriv tree link`

### Important Notes

- The `kodrdriv tree link` command requires `required_permissions: ["all"]` in shell commands due to symlink operations
- Always run from the workspace root (e.g., `/Users/tobrien/gitw/grunnverk`)
- The command will analyze and process all packages in dependency order automatically
- May take 1-2 minutes to complete for large monorepos - this is normal

### Rationale

The user has experienced multiple "build fails" and dependency linking issues. The `kodrdriv tree link` command was specifically designed to solve these problems in their monorepo setup and should be the default solution for any linking/dependency issues.
