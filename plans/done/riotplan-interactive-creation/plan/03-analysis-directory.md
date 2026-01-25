# Step 03: Analysis Directory Structure

## Objective

Define and implement the analysis directory structure for plans that use the analysis-first workflow.

## Background

When users choose the analysis path, we need to:
- Create the `analysis/` directory structure
- Generate initial REQUIREMENTS.md from their prompt
- Provide a place for elaboration feedback

## Tasks

### 3.1 Create Analysis Types

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/analysis/types.ts`:

```typescript
export interface Analysis {
    /** Path to analysis directory */
    path: string;
    
    /** Requirements document content */
    requirements: string;
    
    /** Philosophy/approach document (optional) */
    philosophy?: string;
    
    /** All elaboration prompts */
    elaborations: ElaborationRecord[];
    
    /** Analysis metadata */
    metadata: AnalysisMetadata;
}

export interface ElaborationRecord {
    id: string;
    timestamp: Date;
    content: string;
}

export interface AnalysisMetadata {
    createdAt: Date;
    updatedAt: Date;
    elaborationCount: number;
    status: "draft" | "ready" | "converted";
}
```

### 3.2 Create Analysis Creator

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/analysis/creator.ts`:

```typescript
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface CreateAnalysisOptions {
    planPath: string;
    planName: string;
    initialPrompt: string;
}

/**
 * Create the analysis directory structure
 */
export async function createAnalysisDirectory(
    options: CreateAnalysisOptions
): Promise<string> {
    const { planPath, planName, initialPrompt } = options;
    const analysisPath = join(planPath, "analysis");
    
    // Create directories
    await mkdir(join(analysisPath, "prompts"), { recursive: true });
    
    // Create initial REQUIREMENTS.md
    const requirementsContent = generateRequirementsTemplate(planName, initialPrompt);
    await writeFile(
        join(analysisPath, "REQUIREMENTS.md"),
        requirementsContent,
        "utf-8"
    );
    
    return analysisPath;
}

/**
 * Generate the initial REQUIREMENTS.md template
 */
function generateRequirementsTemplate(planName: string, prompt: string): string {
    return `# ${formatPlanName(planName)} - Requirements Analysis

## Status

| Field | Value |
|-------|-------|
| **Status** | \`draft\` |
| **Created** | ${new Date().toISOString().split("T")[0]} |
| **Last Updated** | ${new Date().toISOString().split("T")[0]} |
| **Elaborations** | 0 |

## Initial Prompt

${prompt}

---

## Requirements

> This section should be elaborated based on the initial prompt.
> Use \`riotplan elaborate\` to provide feedback and refine requirements.

### Functional Requirements

_To be elaborated..._

### Non-Functional Requirements

_To be elaborated..._

### Constraints

_To be elaborated..._

### Assumptions

_To be elaborated..._

---

## Verification Criteria

> These criteria will be used to verify the plan addresses all requirements.

### Must Have

- [ ] _To be defined..._

### Should Have

- [ ] _To be defined..._

### Could Have

- [ ] _To be defined..._

---

## Notes

_Add any additional context or notes here._
`;
}

/**
 * Convert kebab-case to Title Case
 */
function formatPlanName(name: string): string {
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
```

### 3.3 Create Analysis Loader

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/analysis/loader.ts`:

```typescript
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Analysis, AnalysisMetadata, ElaborationRecord } from "./types.js";

/**
 * Load an analysis from disk
 */
export async function loadAnalysis(planPath: string): Promise<Analysis | null> {
    const analysisPath = join(planPath, "analysis");
    
    // Check if analysis exists
    try {
        await stat(analysisPath);
    } catch {
        return null;
    }
    
    // Load requirements
    let requirements = "";
    try {
        requirements = await readFile(
            join(analysisPath, "REQUIREMENTS.md"),
            "utf-8"
        );
    } catch {
        // No requirements file
    }
    
    // Load philosophy (optional)
    let philosophy: string | undefined;
    try {
        philosophy = await readFile(
            join(analysisPath, "PHILOSOPHY.md"),
            "utf-8"
        );
    } catch {
        // No philosophy file
    }
    
    // Load elaborations
    const elaborations = await loadElaborations(analysisPath);
    
    // Build metadata
    const metadata: AnalysisMetadata = {
        createdAt: new Date(), // Could parse from REQUIREMENTS.md
        updatedAt: new Date(),
        elaborationCount: elaborations.length,
        status: parseAnalysisStatus(requirements),
    };
    
    return {
        path: analysisPath,
        requirements,
        philosophy,
        elaborations,
        metadata,
    };
}

/**
 * Load all elaboration records
 */
async function loadElaborations(analysisPath: string): Promise<ElaborationRecord[]> {
    const promptsDir = join(analysisPath, "prompts");
    const records: ElaborationRecord[] = [];
    
    try {
        const files = await readdir(promptsDir);
        const mdFiles = files.filter(f => f.endsWith(".md")).sort();
        
        for (const file of mdFiles) {
            const content = await readFile(join(promptsDir, file), "utf-8");
            const match = file.match(/^(\d+)-/);
            records.push({
                id: match ? match[1] : file,
                timestamp: new Date(), // Could parse from content
                content,
            });
        }
    } catch {
        // No prompts directory
    }
    
    return records;
}

/**
 * Parse analysis status from requirements content
 */
function parseAnalysisStatus(content: string): "draft" | "ready" | "converted" {
    const statusMatch = content.match(/\*\*Status\*\*\s*\|\s*`(\w+)`/);
    if (statusMatch) {
        const status = statusMatch[1];
        if (status === "ready" || status === "converted") {
            return status;
        }
    }
    return "draft";
}

/**
 * Check if a plan has an analysis
 */
export async function hasAnalysis(planPath: string): Promise<boolean> {
    try {
        await stat(join(planPath, "analysis", "REQUIREMENTS.md"));
        return true;
    } catch {
        return false;
    }
}
```

### 3.4 Export Analysis Module

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/analysis/index.ts`:

```typescript
export * from "./types.js";
export * from "./creator.js";
export * from "./loader.js";
```

### 3.5 Integrate with Create Command

Update create command to use analysis creator when mode is "analyze":

```typescript
import { createAnalysisDirectory } from "../../analysis/index.js";

// In action handler:
if (mode === "analyze") {
    const analysisPath = await createAnalysisDirectory({
        planPath,
        planName,
        initialPrompt: description,
    });
    console.log(chalk.green(`Analysis directory created: ${analysisPath}`));
    console.log(chalk.cyan("\nNext: Run 'riotplan elaborate' to refine requirements"));
}
```

## Acceptance Criteria

- [ ] `createAnalysisDirectory` creates proper structure
- [ ] REQUIREMENTS.md template is generated with initial prompt
- [ ] `loadAnalysis` correctly loads existing analysis
- [ ] Analysis status is parsed from content
- [ ] `hasAnalysis` correctly detects analysis presence
- [ ] TypeScript compiles without errors

## Testing

```typescript
describe("Analysis", () => {
    it("should create analysis directory structure", async () => {
        await createAnalysisDirectory({
            planPath: "/tmp/test-plan",
            planName: "test-plan",
            initialPrompt: "Build a thing",
        });
        // Verify structure exists
    });
    
    it("should load existing analysis", async () => {
        const analysis = await loadAnalysis("/tmp/test-plan");
        expect(analysis).not.toBeNull();
        expect(analysis?.requirements).toContain("Build a thing");
    });
});
```

## Files Changed

- `riotplan/src/analysis/types.ts` (new)
- `riotplan/src/analysis/creator.ts` (new)
- `riotplan/src/analysis/loader.ts` (new)
- `riotplan/src/analysis/index.ts` (new)
- `riotplan/src/cli/commands/create.ts` (integrate)

## Notes

The REQUIREMENTS.md template includes a "Verification Criteria" section that will be used by the verification system (Plan 02).
