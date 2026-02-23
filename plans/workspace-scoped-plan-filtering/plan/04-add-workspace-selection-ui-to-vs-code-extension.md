# Step 04: Add Workspace Selection UI to VS Code Extension

## Objective

Create workspace/organization selection UI in VS Code extension with visual feedback

## Background

Need to provide users a way to select their workspace/organization identifier through VS Code UI, following the approach pattern of storing preferences per workspace.

## Tasks

### 1. 04.1

Add workspace configuration to riotplan-vscode/package.json:

```json
"configuration": {
  "title": "RiotPlan",
  "properties": {
    "riotplan.serverUrl": {
      "type": "string",
      "default": "http://127.0.0.1:3002",
      "description": "RiotPlan HTTP MCP server URL"
    },
    "riotplan.defaultWorkspace": {
      "type": "string",
      "default": "",
      "description": "Default workspace/organization identifier for plan filtering"
    }
  }
}
```

### 2. 04.2

Add workspace selection command to package.json:

```json
"commands": [
  {
    "command": "riotplan.selectWorkspace",
    "title": "Select Organization",
    "icon": "$(organization)"
  },
  {
    "command": "riotplan.clearWorkspace", 
    "title": "Show All Plans (No Organization Filter)",
    "icon": "$(clear-all)"
  }
]
```

### 3. 04.3

Add workspace selection UI to view/title menu:

```json
"menus": {
  "view/title": [
    {
      "command": "riotplan.selectWorkspace",
      "when": "view == riotplan-plans",
      "group": "navigation@1"
    },
    {
      "command": "riotplan.clearWorkspace", 
      "when": "view == riotplan-plans",
      "group": "navigation@2"
    }
  ]
}
```

## Acceptance Criteria

- [ ] VS Code commands registered for workspace selection
- [ ] UI buttons appear in plans view toolbar
- [ ] Configuration schema includes workspace identifier field

## Testing

Verify commands appear in command palette and view toolbar, test configuration schema validation

## Files Changed

- `riotplan-vscode/package.json`

## Notes

Use 'Organization' terminology in UI while storing as workspaceId internally
