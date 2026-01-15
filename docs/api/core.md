# Core API Reference

## Types

### Plan

The main plan structure:

```typescript
interface Plan {
    metadata: PlanMetadata;
    files: PlanFiles;
    steps: PlanStep[];
    phases?: PlanPhase[];
    state: PlanState;
    feedback?: FeedbackRecord[];
    evidence?: EvidenceRecord[];
    history?: PlanHistory;
    context?: ContextId;
    relationships?: PlanRelationship[];
}
```

### PlanMetadata

```typescript
interface PlanMetadata {
    code: string;          // Plan identifier
    name: string;          // Display name
    description?: string;  // Plan description
    version?: string;      // Version string
    author?: string;       // Author name
    tags?: string[];       // Categorization tags
    createdAt?: Date;      // Creation date
    path: string;          // Directory path
}
```

### PlanStep

```typescript
interface PlanStep {
    number: number;           // Step number
    code: string;            // Step code/slug
    filename: string;        // Filename
    title: string;           // Display title
    description?: string;    // Description
    status: TaskStatus;      // Current status
    dependencies?: number[]; // Dependent step numbers
    startedAt?: Date;        // When started
    completedAt?: Date;      // When completed
    duration?: number;       // Duration in ms
    notes?: string;          // Notes
    filePath: string;        // Full path
}
```

### TaskStatus

```typescript
type TaskStatus =
    | "pending"
    | "not_started"
    | "in_progress"
    | "completed"
    | "blocked"
    | "skipped"
    | "cancelled";
```

### PlanState

```typescript
interface PlanState {
    status: TaskStatus;
    currentStep?: number;
    lastCompletedStep?: number;
    startedAt?: Date;
    lastUpdatedAt: Date;
    completedAt?: Date;
    blockers: Blocker[];
    issues: Issue[];
    progress: number; // 0-100
}
```

## Functions

### createPlan

Create a new plan directory structure.

```typescript
async function createPlan(config: CreatePlanConfig): Promise<CreatePlanResult>
```

**Parameters:**

- `config.code` - Plan identifier
- `config.name` - Display name
- `config.basePath` - Base directory
- `config.description` - Optional description
- `config.steps` - Optional initial steps
- `config.author` - Optional author

**Returns:** `CreatePlanResult` with `plan`, `path`, and `filesCreated`

### loadPlan

Load an existing plan.

```typescript
async function loadPlan(
    path: string,
    options?: LoadPlanOptions
): Promise<Plan>
```

### validatePlan

Validate plan structure and content.

```typescript
async function validatePlan(
    plan: Plan,
    options?: ValidateOptions
): Promise<ValidationResult>
```

**Returns:** `ValidationResult` with `valid`, `errors`, `warnings`, `info`

## Step Operations

### startStep

```typescript
async function startStep(plan: Plan, stepNumber: number): Promise<Plan>
```

### completeStep

```typescript
async function completeStep(plan: Plan, stepNumber: number): Promise<Plan>
```

### blockStep

```typescript
async function blockStep(
    plan: Plan,
    stepNumber: number,
    reason: string
): Promise<Plan>
```

### unblockStep

```typescript
async function unblockStep(plan: Plan, stepNumber: number): Promise<Plan>
```

### skipStep

```typescript
async function skipStep(plan: Plan, stepNumber: number): Promise<Plan>
```

## Status Operations

### generateStatus

```typescript
function generateStatus(plan: Plan, options?: GenerateStatusOptions): string
```

### updateStatus

```typescript
async function updateStatus(
    plan: Plan,
    options?: UpdateStatusOptions
): Promise<void>
```

### parseStatus

```typescript
function parseStatus(
    content: string,
    options?: ParseStatusOptions
): ParseStatusResult
```

