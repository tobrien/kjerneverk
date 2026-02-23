# Step 05: Implement Workspace State Persistence

## Objective

Use VS Code workspaceState API to persist and restore selected workspace identifier per workspace

## Background

Following Protokoll's pattern, need to store user's workspace selection in VS Code workspaceState so it persists across sessions and is scoped to the current workspace folder.

## Tasks

### 1. 05.1

Add workspace state management to riotplan-vscode/src/extension.ts:

```typescript
let currentWorkspaceId: string | undefined;
const WORKSPACE_ID_KEY = 'riotplan.selectedWorkspaceId';

export async function activate(context: vscode.ExtensionContext) {
    // ... existing code ...
    
    // Restore workspace selection from workspaceState
    currentWorkspaceId = context.workspaceState.get(WORKSPACE_ID_KEY);
    
    // Update tree view title to show current workspace filter
    updateTreeViewTitle();
    
    // ... rest of existing activate code ...
}

function updateTreeViewTitle(): void {
    const title = currentWorkspaceId 
        ? `Plans (${currentWorkspaceId})`
        : 'Plans';
    // Note: VS Code doesn't support dynamic tree view titles,
    // but we can show this in status or description
}
```

### 2. 05.2

Implement workspace selection command handler:

```typescript
context.subscriptions.push(
    vscode.commands.registerCommand('riotplan.selectWorkspace', async () => {
        const input = await vscode.window.showInputBox({
            title: 'Select Organization',
            prompt: 'Enter your organization/workspace identifier',
            value: currentWorkspaceId || '',
            placeHolder: 'e.g., acme-corp, team-alpha',
            validateInput: (value) => {
                const trimmed = value.trim();
                if (!trimmed) {
                    return 'Organization identifier cannot be empty';
                }
                if (!/^[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(trimmed)) {
                    return 'Invalid identifier. Use letters, numbers, hyphens, underscores only.';
                }
                return null;
            },
        });
        
        if (input !== undefined) {
            const workspaceId = input.trim() || undefined;
            currentWorkspaceId = workspaceId;
            
            // Persist to workspace state
            await context.workspaceState.update(WORKSPACE_ID_KEY, workspaceId);
            
            // Refresh plans with new filter
            plansProvider.refresh();
            updateTreeViewTitle();
            
            const message = workspaceId 
                ? `Filtering plans for organization: ${workspaceId}`
                : 'Showing all plans';
            vscode.window.showInformationMessage(message);
        }
    })
);
```

### 3. 05.3

Implement clear workspace command handler:

```typescript
context.subscriptions.push(
    vscode.commands.registerCommand('riotplan.clearWorkspace', async () => {
        currentWorkspaceId = undefined;
        await context.workspaceState.update(WORKSPACE_ID_KEY, undefined);
        
        plansProvider.refresh();
        updateTreeViewTitle();
        
        vscode.window.showInformationMessage('Now showing all plans (no organization filter)');
    })
);
```

### 4. 05.4

Update PlansTreeProvider to use workspace filter in getChildren():

```typescript
async getChildren(element?: PlanItem): Promise<PlanItem[]> {
    if (!element) {
        // Root level - show categories with workspace indicator
        const wsIndicator = currentWorkspaceId ? ` (${currentWorkspaceId})` : '';
        return [
            new PlanItem(`Active${wsIndicator}`, vscode.TreeItemCollapsibleState.Expanded),
            new PlanItem(`Done${wsIndicator}`, vscode.TreeItemCollapsibleState.Collapsed),
            new PlanItem(`Hold${wsIndicator}`, vscode.TreeItemCollapsibleState.Collapsed),
        ];
    }
    
    // Category level - show plans with workspace filter
    const category = element.label.toLowerCase().split('(')[0].trim();
    const filter = category === 'active' ? 'active' : category === 'done' ? 'done' : 'hold';
    
    try {
        // Pass workspace filter to MCP client
        const response = await this.mcpClient.listPlans(filter, currentWorkspaceId);
        // ... rest of existing code ...
    }
}
```

## Acceptance Criteria

- [ ] Workspace selection persisted in VS Code workspaceState
- [ ] Selected workspace restored on extension activation
- [ ] Clear workspace functionality removes filter and updates state

## Testing

Select workspace, restart VS Code, verify selection persists; test clear workspace functionality

## Files Changed

- `riotplan-vscode/src/extension.ts`
- `riotplan-vscode/src/plans-provider.ts`

## Notes

Use workspaceState.get/update to follow VS Code patterns for workspace-scoped preferences
