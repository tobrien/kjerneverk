# Evidence: Project indexer tool - capabilities and API

**Source**: codebase analysis
**Original Query**: Analyze project indexer capabilities for injection into rp_build
**Added**: 2026-02-12T16:55:07.329Z
**Gathering Method**: model-assisted

---

## Project Indexer (riotplan/src/cli/tools/environment/project-index.ts)

### What it does:
- Scans a project directory recursively (ignoring node_modules, .git, dist, etc.)
- Builds an in-memory index of: files (path, name, ext, size, exports), packages (name, version, deps)
- Cached via `indexCache` Map - subsequent calls are instant
- Takes ~244ms for the kjerneverk monorepo (~500ms budget)

### Two tools:
1. `index_project` - Build/refresh the index
   - params: path (required), refresh (bool), maxDepth (number), ignorePatterns (string[])
   - Returns summary: total files, packages found, analyzable files count
   - cost: 'cheap'

2. `query_index` - Query the cached index
   - params: path (required), query (required), type (optional: 'packages'|'files'|'exports'|'search')
   - Query types:
     - 'packages' → list all packages with deps
     - 'files' → find files matching pattern  
     - 'exports' → find exported symbols
     - 'search' → general search across all categories
   - Returns formatted text results
   - cost: 'cheap'

### Key interfaces:
```typescript
interface ProjectIndex {
    rootPath: string;
    files: FileEntry[];
    packages: PackageEntry[];
    totalFiles: number;
    totalDirectories: number;
    analyzedFiles: number;
    buildTime: number;
}

interface FileEntry {
    path: string;       // Relative path
    name: string;       // Filename
    ext: string;        // Extension
    size: number;       // Bytes
    isDirectory: boolean;
    exports?: string[];  // For JS/TS files
    description?: string;
}
```

### How to use for rp_build:
1. Before generation, call `indexProjectImpl()` to build the index
2. Extract key context: package list, key interfaces, file structure
3. Inject this as a "== CODEBASE CONTEXT ==" section in the generation prompt
4. OR: give the agent `query_index` as a tool so it can explore interactively