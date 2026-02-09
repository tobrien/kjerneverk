# Step 01: Scaffold @kjerneverk/riotplan-catalyst package

## Phase
Phase 1: Catalyst Engine (Local Directory Support)

## Objective
Create a new package `@kjerneverk/riotplan-catalyst` in the kjerneverk ecosystem following the same patterns as existing packages (execution, riotprompt, agentic).

## Tasks

### 1.1 Create the package directory and repository
- Create `riotplan-catalyst/` directory at `/Users/tobrien/gitw/kjerneverk/riotplan-catalyst`
- Initialize git repository
- Add to VS Code workspace file (`kjerneverk.code-workspace`)

### 1.2 Initialize package.json
- Package name: `@kjerneverk/riotplan-catalyst`
- Follow conventions from sibling packages (TypeScript, ESM, similar scripts)
- Key dependencies: `zod` (schema validation), `yaml` (YAML parsing)
- Dev dependencies: `vitest`, `typescript`, `tsup` (or whatever build tool siblings use)

### 1.3 Set up TypeScript and build configuration
- `tsconfig.json` matching sibling package patterns
- Build configuration (tsup or similar)
- Source in `src/`, output to `dist/`

### 1.4 Create initial source structure
```
src/
  index.ts          # Public API exports
  schema/           # Zod schemas for catalyst.yml and plan.yaml
  loader/           # Catalyst loading from directories
  merger/           # Facet merging logic
  types.ts          # TypeScript interfaces
```

### 1.5 Set up testing
- Vitest configuration
- Test fixtures directory with sample catalyst directories

## Definition of Done
- [ ] Package builds successfully with `npm run build`
- [ ] Tests run with `npm test` (even if just a placeholder test)
- [ ] Package follows same conventions as `@kjerneverk/execution` and siblings
- [ ] Source structure is in place for subsequent steps
