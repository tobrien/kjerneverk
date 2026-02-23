# Step 08: Enhance VS Code Workspace Selection with Discovery

## Objective

Improve workspace selection UI with auto-discovery of existing workspaces and better UX

## Background

With workspace management tools in place, can now enhance the VS Code UI to discover existing workspaces and provide better selection experience.

## Tasks

### 1. 08.1

Update workspace selection command in riotplan-vscode/src/extension.ts to use workspace discovery:

```typescript
context.subscriptions.push(
    vscode.commands.registerCommand('riotplan.selectWorkspace', async () => {
        try {
            // Get existing workspaces from server
            const workspaces = await mcpClient.getWorkspaces();
            
            let selectedWorkspace: string | undefined;
            
            if (workspaces.length > 0) {
                // Show quick pick with existing workspaces + option to enter new
                const items = [
                    ...workspaces.map(ws => ({ label: ws, description: 'Existing workspace' })),
                    { label: '$(add) Create New Organization...', description: 'Enter a new organization identifier' },
                ];
                
                const selected = await vscode.window.showQuickPick(items, {
                    title: 'Select Organization',
                    placeHolder: currentWorkspaceId 
                        ? `Currently: ${currentWorkspaceId}` 
                        : 'Choose an organization to filter plans',
                });
                
                if (!selected) {
                    return; // Cancelled
                }
                
                if (selected.label.startsWith('$(add)')) {
                    // User wants to create new workspace
                    selectedWorkspace = await promptForNewWorkspace();
                } else {
                    selectedWorkspace = selected.label;
                }
            } else {
                // No existing workspaces, prompt for new one
                selectedWorkspace = await promptForNewWorkspace();
            }
            
            if (selectedWorkspace !== undefined) {
                await setCurrentWorkspace(selectedWorkspace || undefined);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load workspaces: ${error}`);
        }
    })
);

async function promptForNewWorkspace(): Promise<string | undefined> {
    return await vscode.window.showInputBox({
        title: 'Create New Organization',
        prompt: 'Enter organization/workspace identifier',
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
}

async function setCurrentWorkspace(workspaceId: string | undefined): Promise<void> {
    currentWorkspaceId = workspaceId;
    
    // Persist to workspace state
    await context.workspaceState.update(WORKSPACE_ID_KEY, workspaceId);
    
    // Refresh plans with new filter
    plansProvider.refresh();
    updateTreeViewTitle();
    
    const message = workspaceId 
        ? `Now filtering plans for organization: ${workspaceId}`
        : 'Now showing all plans';
    vscode.window.showInformationMessage(message);
}
```

### 2. 08.2

Add context menu for plan workspace assignment in riotplan-vscode/package.json:

```json
"menus": {
  "view/item/context": [
    {
      "command": "riotplan.assignWorkspace",
      "when": "view == riotplan-plans && viewItem == plan",
      "group": "workspace"
    },
    {
      "command": "riotplan.clearPlanWorkspace",
      "when": "view == riotplan-plans && viewItem == plan", 
      "group": "workspace"
    }
  ]
},
"commands": [
  {
    "command": "riotplan.assignWorkspace",
    "title": "Assign to Organization"
  },
  {
    "command": "riotplan.clearPlanWorkspace",
    "title": "Remove from Organization"
  }
]
```

### 3. 08.3

Implement plan workspace assignment commands:

```typescript
context.subscriptions.push(
    vscode.commands.registerCommand('riotplan.assignWorkspace', async (planItem: PlanItem) => {
        try {
            const workspaces = await mcpClient.getWorkspaces();
            
            const items = [
                ...workspaces.map(ws => ({ label: ws, description: 'Existing workspace' })),
                { label: '$(add) Create New Organization...', description: 'Enter a new organization identifier' },
            ];
            
            const selected = await vscode.window.showQuickPick(items, {
                title: 'Assign Plan to Organization',
                placeHolder: `Select organization for plan: ${planItem.label}`,
            });
            
            if (!selected) return;
            
            let workspaceId: string | undefined;
            if (selected.label.startsWith('$(add)')) {
                workspaceId = await promptForNewWorkspace();
            } else {
                workspaceId = selected.label;
            }
            
            if (workspaceId && planItem.uuid) {
                await mcpClient.setPlanWorkspace(planItem.uuid, workspaceId);
                vscode.window.showInformationMessage(
                    `Plan "${planItem.label}" assigned to organization: ${workspaceId}`
                );
                plansProvider.refresh();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to assign workspace: ${error}`);
        }
    })
);

context.subscriptions.push(
    vscode.commands.registerCommand('riotplan.clearPlanWorkspace', async (planItem: PlanItem) => {
        if (planItem.uuid) {
            try {
                await mcpClient.setPlanWorkspace(planItem.uuid, null);
                vscode.window.showInformationMessage(
                    `Plan "${planItem.label}" removed from organization`
                );
                plansProvider.refresh();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to clear workspace: ${error}`);
            }
        }
    })
);
```

## Acceptance Criteria

- [ ] Workspace selection shows existing workspaces in quick pick
- [ ] Users can create new workspaces from selection UI
- [ ] Context menu allows assigning individual plans to workspaces

## Testing

Test workspace discovery and selection, verify context menu appears on plan items, test plan assignment workflow

## Files Changed

- `riotplan-vscode/src/extension.ts`
- `riotplan-vscode/package.json`

## Notes

Provide both global workspace filtering and individual plan workspace assignment
