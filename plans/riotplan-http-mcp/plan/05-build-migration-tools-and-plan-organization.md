# Step 05: Build Migration Tools and Plan Organization

## Objective

Create migration utilities to convert existing directory-based plans to UUID format and implement done/hold directory organization

## Background

Need to migrate existing plans to new UUID-based format and implement the constraint requirement for done/hold subdirectories for plan lifecycle management.

## Tasks

### 1. 05.1

Create migration command in riotplan/src/cli/commands/migrate-to-http.ts:

```typescript
import { Command } from 'commander';
import { DefaultStorageProviderFactory, generatePlanUuid, formatPlanFilename } from '@kjerneverk/riotplan-format';
import { loadPlan } from '../../plan/loader.js';

export interface MigrationOptions {
  sourceDir: string;
  targetDir: string;
  dryRun?: boolean;
  createSlug?: boolean;
}

export async function migrateToHttpFormat(options: MigrationOptions) {
  const factory = new DefaultStorageProviderFactory();
  
  // Scan source directory for existing plans
  const planDirs = await findPlanDirectories(options.sourceDir);
  
  for (const planDir of planDirs) {
    const plan = await loadPlan(planDir);
    
    // Generate UUID and create filename
    const uuid = generatePlanUuid();
    const slug = options.createSlug ? 
      generateSlugFromPath(planDir) : 
      plan.metadata.code;
    const filename = formatPlanFilename(uuid, slug);
    
    // Create new .plan file in target directory
    const targetPath = path.join(options.targetDir, filename);
    const provider = factory.createProvider(targetPath);
    
    await migratePlan(plan, provider, uuid);
  }
}
```

### 2. 05.2

Implement plan lifecycle directory management in HTTP server:

```typescript
// In server-hono.ts
export class PlanLifecycleManager {
  constructor(
    private plansDir: string,
    private storageFactory: DefaultStorageProviderFactory
  ) {
    this.ensureDirectories();
  }
  
  private ensureDirectories() {
    fs.mkdirSync(path.join(this.plansDir, 'done'), { recursive: true });
    fs.mkdirSync(path.join(this.plansDir, 'hold'), { recursive: true });
  }
  
  async movePlan(planUuid: string, targetStage: 'active' | 'done' | 'hold') {
    const currentPath = await this.findPlanFile(planUuid);
    const filename = path.basename(currentPath);
    
    const targetDir = targetStage === 'active' ? 
      this.plansDir : 
      path.join(this.plansDir, targetStage);
    
    const targetPath = path.join(targetDir, filename);
    await fs.promises.rename(currentPath, targetPath);
    
    // Update plan metadata
    const provider = this.storageFactory.createProvider(targetPath);
    await provider.updateMetadata({ stage: this.mapStageToLifecycle(targetStage) });
  }
}
```

### 3. 05.3

Add CLI command registration and help for migration:

```typescript
// In riotplan/src/cli/cli.ts
import { migrateToHttpCommand } from './commands/migrate-to-http.js';

export function createCLI(): Command {
  const program = new Command();
  
  // Existing commands...
  
  program
    .command('migrate-http')
    .description('Migrate existing plans to HTTP server format')
    .requiredOption('--source <dir>', 'Source directory containing existing plans')
    .requiredOption('--target <dir>', 'Target plans directory for HTTP server')
    .option('--dry-run', 'Show what would be migrated without making changes')
    .option('--create-slug', 'Generate slug from directory name if plan code not suitable')
    .action(migrateToHttpCommand);
  
  return program;
}
```

### 4. 05.4

Create plan discovery and slug generation utilities:

```typescript
// In migration utilities
export async function findPlanDirectories(rootDir: string): Promise<string[]> {
  const plans: string[] = [];
  
  for (const entry of await fs.promises.readdir(rootDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const planDir = path.join(rootDir, entry.name);
      if (await isPlanDirectory(planDir)) {
        plans.push(planDir);
      }
    }
  }
  
  return plans;
}

export function generateSlugFromPath(planPath: string): string {
  const dirName = path.basename(planPath);
  return dirName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50); // Reasonable length limit
}
```

## Acceptance Criteria

- [ ] Migration command converts directory-based plans to UUID .plan files
- [ ] Server maintains done/ and hold/ subdirectories
- [ ] Plan lifecycle transitions move files between directories
- [ ] Slug generation creates human-readable identifiers from directory names
- [ ] Migration supports dry-run mode for safety

## Testing

Create test plans, run migration command, verify UUID generation and file naming, test plan lifecycle transitions between directories

## Files Changed

- `riotplan/src/cli/commands/migrate-to-http.ts`
- `riotplan/src/cli/cli.ts`
- `riotplan/src/mcp/server-hono.ts`

## Notes

Migration enables transition from scattered plan directories to centralized server-managed storage while preserving plan data and adding UUID identification.
