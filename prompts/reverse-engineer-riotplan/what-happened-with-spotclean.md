# What Happened with Spotclean

## Context

This document captures meta-observations about plan-driven development as it relates to the `RiotPlan` project.

## Observation: Plan Spawning New Projects

**Date:** 2026-01-13  
**Source Plan:** `/Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt`  
**Spawned Project:** `@theunwalked/spotclean` in `/Users/tobrien/gitw/utilarium/spotclean`

### What Happened

During the preparation to execute Step 13 (Error Message Sanitization) of the `secure-riotprompt` security plan, it was determined that the error sanitization functionality should be extracted into a standalone library rather than implemented directly in `riotprompt`.

**Rationale:**
1. **Reusability**: Error message sanitization is a general-purpose security concern, not specific to prompt management
2. **Scope Clarity**: Keeping `riotprompt` focused on prompt-related functionality
3. **Ecosystem Consistency**: Following the established pattern of small, focused libraries in the `utilarium` scope
4. **Independent Versioning**: Allows `spotclean` to evolve independently and be used by other projects
5. **Pattern Precedent**: Similar to how Step 09 spawned `pressurelid` for safe regex handling

### Features Extracted

The following functionality was extracted from the original Step 13 plan:

1. **SecretGuard** - Secret detection and redaction
   - API keys, Bearer tokens, JWTs, AWS credentials
   - Passwords, connection strings, private keys
   - Custom pattern support

2. **PathSanitizer** - File path sanitization
   - Home directory redaction
   - System path patterns
   - Custom base paths

3. **ErrorSanitizer** - Main error sanitization coordinator
   - Environment-aware behavior (dev vs production)
   - Generic error message mapping
   - Correlation ID generation
   - Stack trace removal

4. **Utilities**
   - `withErrorHandling()` - Async function wrapper
   - `sanitizeUnknownError()` - Catch block helper
   - Global configuration functions

### Cross-Project Coordination

This created a dependency chain:
1. `spotclean` must be created and published first
2. `riotprompt` Step 13 cannot complete until `spotclean` is available on npm
3. The `secure-riotprompt` plan's STATUS.md should reflect this blocker
4. Other kjerneverk packages (execution-*) will also depend on spotclean

### Template Source

The new project copied structure from existing `utilarium` projects:
- `/Users/tobrien/gitw/utilarium/cardigantime`
- `/Users/tobrien/gitw/utilarium/dreadcabinet`

This includes:
- `package.json` structure with @theunwalked scope
- Vite build configuration (ESM + CJS outputs)
- Vitest test configuration with coverage
- ESLint rules
- GitHub workflows (test, npm-publish, codeql, dependency-review)
- Apache-2.0 licensing
- Guide directory structure for AI agents

### Plan Documentation Created

A full plan was created for spotclean at:
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/SUMMARY.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/EXECUTION_PLAN.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/STATUS.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/` (10 step files)

## Implications for RiotPlan

### Plan-to-Project Lifecycle

RiotPlan should recognize that plans can:
1. **Spawn new projects** - A step might determine that new artifacts belong elsewhere
2. **Create blockers** - The spawned project becomes a dependency
3. **Fork execution** - The plan partially pauses while the new project is created
4. **Generate sub-plans** - The spawned project gets its own plan documentation

### Tracking Requirements

RiotPlan needs to track:
- **Project Creation Events**: When a plan decides to create a new project
- **Cross-Repository Dependencies**: Blockers that span different repos/scopes
- **Template Lineage**: Which existing projects inform new project structure
- **Plan Lineage**: Parent plan that triggered project creation

### Suggested Features

1. **"Spawn Project" Action**: A first-class plan step type for creating new projects
2. **Dependency Graph**: Visualize cross-project, cross-plan dependencies
3. **Template Management**: Define and reference project templates
4. **Blocker Propagation**: Automatically mark dependent steps as blocked
5. **Sub-Plan Generation**: Automatically scaffold plan docs for spawned projects

## The Name "Spotclean"

The name evokes the concept of spot-cleaning - removing specific stains (sensitive information) from a surface (error messages) before they can cause problems. Like spot-cleaning a garment before a stain sets, spotclean removes secrets from errors before they can leak. This follows the `utilarium` naming convention of evocative, non-technical names (like `cardigantime`, `dreadcabinet`, `pressurelid`).

## Files Created

### Project Files
- `/Users/tobrien/gitw/utilarium/spotclean/package.json`
- `/Users/tobrien/gitw/utilarium/spotclean/tsconfig.json`
- `/Users/tobrien/gitw/utilarium/spotclean/vite.config.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/vitest.config.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/eslint.config.mjs`
- `/Users/tobrien/gitw/utilarium/spotclean/LICENSE`
- `/Users/tobrien/gitw/utilarium/spotclean/README.md`

### GitHub Workflows
- `/Users/tobrien/gitw/utilarium/spotclean/.github/dependabot.yml`
- `/Users/tobrien/gitw/utilarium/spotclean/.github/workflows/test.yml`
- `/Users/tobrien/gitw/utilarium/spotclean/.github/workflows/npm-publish.yml`
- `/Users/tobrien/gitw/utilarium/spotclean/.github/workflows/codeql.yml`
- `/Users/tobrien/gitw/utilarium/spotclean/.github/workflows/dependency-review.yml`

### Source Files
- `/Users/tobrien/gitw/utilarium/spotclean/src/types.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/src/secret-guard.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/src/path-sanitizer.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/src/sanitizer.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/src/spotclean.ts`

### Test Files
- `/Users/tobrien/gitw/utilarium/spotclean/tests/setup.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/tests/secret-guard.test.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/tests/path-sanitizer.test.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/tests/sanitizer.test.ts`
- `/Users/tobrien/gitw/utilarium/spotclean/tests/spotclean.test.ts`

### Documentation
- `/Users/tobrien/gitw/utilarium/spotclean/guide/index.md`
- `/Users/tobrien/gitw/utilarium/spotclean/guide/architecture.md`

### Plan Documentation
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/SUMMARY.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/EXECUTION_PLAN.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/STATUS.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/01-types.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/02-secret-guard.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/03-path-sanitizer.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/04-error-sanitizer.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/05-utilities.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/06-entry-point.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/07-unit-tests.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/08-integration-tests.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/09-documentation.md`
- `/Users/tobrien/gitw/utilarium/prompts/spotclean/plan/10-release.md`

## Related Documents

- **Parent Plan:** `/Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt/plan/13-error-sanitization.md`
- **Similar Spawn:** `/Users/tobrien/gitw/kjerneverk/prompts/reverse-engineer-riotplan/what-happened-with-pressurelid.md`
- **Spotclean Plan:** `/Users/tobrien/gitw/utilarium/prompts/spotclean/`

---

## Execution Log

### 2026-01-14: Step 10 - Release Preparation Completed

**Executed by:** AI Agent (Claude)  
**Session:** Cursor IDE

#### Actions Taken

1. **npm install** ✅
   - Installed 417 packages successfully
   - 0 vulnerabilities detected

2. **Lint fixes required** ✅
   - `src/secret-guard.ts` line 9: Removed unnecessary escape character `\-` in regex pattern
   - `src/sanitizer.ts` line 260: Removed unused `external` variable from destructuring

3. **Test fix required** ✅
   - `tests/sanitizer.test.ts` line 110: Replaced non-existent `toEndWith` matcher with `endsWith('...').toBe(true)`

4. **npm run build** ✅
   - ESM output: `dist/spotclean.js` (1.48 kB)
   - CJS output: `dist/spotclean.cjs` (22.62 kB)
   - Type declarations generated
   - Source maps created

5. **npm run test** ✅
   - 106 tests across 4 test files
   - All tests passing
   - 98.72% code coverage
   - Coverage by file:
     - `secret-guard.ts`: 100%
     - `spotclean.ts`: 100%
     - `sanitizer.ts`: 98.48%
     - `path-sanitizer.ts`: 97.82%

6. **Plan documentation updated** ✅
   - `STATUS.md` - Updated to "Ready for Release"
   - `EXECUTION_PLAN.md` - Step 10 marked complete
   - `plan/10-release.md` - Acceptance criteria updated

#### Remaining Manual Steps

The following require human action:

- [ ] Initialize git repository for spotclean (or confirm monorepo structure)
- [ ] Create GitHub repository at github.com/utilarium/spotclean
- [ ] Push initial commit
- [x] **Published to npm** - @theunwalked/spotclean@0.0.1 (2026-01-14)
- [ ] Update kjerneverk secure-riotprompt Step 13 to depend on @theunwalked/spotclean

#### Notes

- The `utilarium` workspace does not appear to be a git repository (`fatal: not a git repository`)
- This may be intentional if spotclean is meant to have its own repository
- Alternatively, utilarium may need git init at the workspace level for monorepo structure

#### Test Results Summary

```
 ✓ tests/path-sanitizer.test.ts (25 tests) 6ms
 ✓ tests/secret-guard.test.ts (30 tests) 7ms
 ✓ tests/spotclean.test.ts (17 tests) 7ms
 ✓ tests/sanitizer.test.ts (34 tests) 23ms

 Test Files  4 passed (4)
      Tests  106 passed (106)
   Duration  272ms
```

#### Build Artifacts

```
dist/spotclean.js       1.48 kB │ map:  2.51 kB
dist/path-sanitizer.js  5.45 kB │ map: 10.22 kB
dist/secret-guard.js    6.04 kB │ map: 10.64 kB
dist/sanitizer.js       9.76 kB │ map: 17.68 kB
dist/spotclean.cjs     22.62 kB │ map: 40.57 kB
```

### 2026-01-14: npm Publish Completed

**Package:** `@theunwalked/spotclean@0.0.1`  
**Registry:** https://registry.npmjs.org/

#### Published Package Details

```
npm notice package: @theunwalked/spotclean@0.0.1
npm notice filename: theunwalked-spotclean-0.0.1.tgz
npm notice package size: 32.1 kB
npm notice unpacked size: 156.9 kB
npm notice shasum: ef0b06ae8302f41df615b3ecab201d8db6c222a1
npm notice total files: 18
```

#### Tarball Contents

- `LICENSE` (9.7 kB)
- `README.md` (7.5 kB)
- `package.json` (2.0 kB)
- Type declarations: `*.d.ts` files
- ESM output: `dist/spotclean.js` + individual modules
- CJS output: `dist/spotclean.cjs`
- Source maps for debugging

#### Installation

The package can now be installed:

```bash
npm install @theunwalked/spotclean
```

#### Unblocked Work

With `@theunwalked/spotclean` published, the following can now proceed:

1. **kjerneverk secure-riotprompt Step 13** - Can add spotclean as dependency
2. **Other kjerneverk packages** - Can use spotclean for error sanitization
3. **General use** - Available for any project needing error sanitization

---

## Plan Completion & Integration (2026-01-14)

### Dependencies Fully Resolved

The spotclean project is now complete and integrated into the kjerneverk secure-riotprompt plan:

| Field | Value |
|-------|-------|
| **Package** | `@theunwalked/spotclean` |
| **Version** | 0.0.3 |
| **npm Status** | ✅ Published |
| **kjerneverk Step** | Step 13 (Error Sanitization) - UNBLOCKED |

### Updated Plan Files

The following kjerneverk plan files were updated to consume spotclean:

| File | Change |
|------|--------|
| `secure-riotprompt/plan/13-error-sanitization.md` | Removed BLOCKED status, updated to use spotclean API |
| `secure-riotprompt/STATUS.md` | Marked spotclean dependency as resolved |
| `secure-riotprompt/EXECUTION_PLAN.md` | Updated to reflect spotclean availability |

### How kjerneverk Will Use spotclean

All kjerneverk packages will use spotclean for error handling:

```typescript
import { 
  sanitize, 
  createSafeError, 
  configureErrorSanitizer 
} from '@theunwalked/spotclean';

// Configure at startup
configureErrorSanitizer({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  includeCorrelationId: true,
});

// In catch blocks
try {
  await apiCall();
} catch (error) {
  const { external, internal } = sanitize(error);
  
  // Log full details internally
  console.error('API error', { 
    correlationId: internal.correlationId,
    message: internal.originalMessage,
  });
  
  // Return safe message to user
  throw createSafeError(error);
}
```

### Packages That Will Use spotclean

| Package | Use Case |
|---------|----------|
| `riotprompt` | Loader error handling, config errors |
| `execution-openai` | API error sanitization |
| `execution-anthropic` | API error sanitization |
| `execution-gemini` | API error sanitization |
| `riotprompt-cli` | CLI error display with correlation IDs |
| `riotplan-cli` | CLI error display with correlation IDs |

### The Full Journey

1. **2026-01-13**: Step 13 identified need for error sanitization
2. **2026-01-13**: Decided to extract to separate library (spotclean)
3. **2026-01-13**: Created spotclean plan in utilarium
4. **2026-01-13**: Executed spotclean plan, created all implementation
5. **2026-01-14**: Published to npm as `@theunwalked/spotclean@0.0.1`
6. **2026-01-14**: Updated to v0.0.3 after fixes
7. **2026-01-14**: Updated kjerneverk plans to consume spotclean

### spotclean Features Used by kjerneverk

| Feature | Use Case |
|---------|----------|
| `ErrorSanitizer` | Main sanitization class |
| `SecretGuard` | Detect and redact secrets in errors |
| `PathSanitizer` | Remove file paths from error messages |
| `sanitize()` | Quick error sanitization |
| `createSafeError()` | Create sanitized Error object |
| `withErrorHandling()` | Async function wrapper |
| Correlation IDs | Track errors without exposing details |

### Related Documents

- **spotclean Project**: `/Users/tobrien/gitw/utilarium/spotclean/`
- **spotclean Plan**: `/Users/tobrien/gitw/utilarium/prompts/spotclean/`
- **Consuming Step**: `/Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt/plan/13-error-sanitization.md`
- **RiotPrompt Security Overview**: `/Users/tobrien/gitw/kjerneverk/prompts/reverse-engineer-riotplan/what-happened-in-riotprompt-security.md`

