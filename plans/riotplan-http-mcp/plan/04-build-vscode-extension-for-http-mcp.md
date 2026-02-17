# Step 04: Build VSCode Extension for HTTP MCP

## Objective

Create VSCode extension that connects to HTTP MCP server instead of stdio MCP, providing plan management UI

## Background

Using the Protokoll VSCode extension architecture as reference, build extension that uses HTTP client with JSON-RPC 2.0 over HTTP POST to connect to RiotPlan HTTP MCP server.

## Tasks

### 1. 04.1

Create new VSCode extension package at riotplan-vscode/ with package.json:

```json
{
  "name": "riotplan-vscode",
  "displayName": "RiotPlan",
  "description": "Plan management for RiotPlan HTTP server",
  "version": "1.0.0",
  "engines": { "vscode": "^1.60.0" },
  "activationEvents": ["onStartupFinished"],
  "main": "./dist/extension.js",
  "contributes": {
    "configuration": {
      "title": "RiotPlan",
      "properties": {
        "riotplan.serverUrl": {
          "type": "string",
          "default": "http://127.0.0.1:3002",
          "description": "RiotPlan HTTP MCP server URL"
        }
      }
    },
    "views": {
      "explorer": [
        {
          "id": "riotplan-plans",
          "name": "Plans",
          "when": "riotplan.connected"
        }
      ]
    }
  }
}
```

### 2. 04.2

Implement HTTP MCP client in src/mcp-client.ts:

```typescript
import * as http from 'http';
import * as https from 'https';

interface McpRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export class HttpMcpClient {
  private sessionId?: string;
  
  constructor(private serverUrl: string) {}
  
  async sendRequest(method: string, params?: any): Promise<any> {
    const request: McpRequest = {
      jsonrpc: '2.0',
      id: Math.random().toString(36),
      method,
      params
    };
    
    const response = await this.httpPost('/mcp', request);
    this.updateSessionId(response.headers);
    return response.data;
  }
  
  async listPlans() {
    return await this.sendRequest('tools/call', {
      name: 'riotplan_plans_list',
      arguments: {}
    });
  }
}
```

### 3. 04.3

Create plan tree view provider in src/tree-providers/plans-provider.ts:

```typescript
import * as vscode from 'vscode';
import { HttpMcpClient } from '../mcp-client';

export class PlansTreeProvider implements vscode.TreeDataProvider<PlanItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<PlanItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  
  constructor(private mcpClient: HttpMcpClient) {}
  
  async getChildren(element?: PlanItem): Promise<PlanItem[]> {
    if (!element) {
      // Root level - fetch all plans
      const response = await this.mcpClient.listPlans();
      return response.content[0].text.plans.map(plan => new PlanItem(
        plan.name,
        plan.uuid,
        vscode.TreeItemCollapsibleState.Collapsed
      ));
    }
    // Plan children - show steps, status, etc.
    return this.getPlanChildren(element);
  }
}
```

### 4. 04.4

Implement main extension activation in src/extension.ts:

```typescript
export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('riotplan');
  const serverUrl = config.get<string>('serverUrl', 'http://127.0.0.1:3002');
  
  const mcpClient = new HttpMcpClient(serverUrl);
  
  // Health check
  try {
    await mcpClient.healthCheck();
    vscode.commands.executeCommand('setContext', 'riotplan.connected', true);
  } catch (error) {
    vscode.window.showWarningMessage(`RiotPlan server not available at ${serverUrl}`);
    return; // Graceful degradation
  }
  
  // Register tree providers
  const plansProvider = new PlansTreeProvider(mcpClient);
  vscode.window.createTreeView('riotplan-plans', { treeDataProvider: plansProvider });
  
  // Register commands
  registerCommands(context, mcpClient);
}
```

## Acceptance Criteria

- [ ] VSCode extension connects to HTTP MCP server successfully
- [ ] Extension displays plan list in sidebar tree view
- [ ] Plan details can be viewed in webview panels
- [ ] Extension handles server unavailable gracefully
- [ ] Configuration allows changing server URL

## Testing

Start RiotPlan HTTP server, install and activate VSCode extension, verify connection, test plan listing and viewing

## Files Changed

- `riotplan-vscode/package.json`
- `riotplan-vscode/src/extension.ts`
- `riotplan-vscode/src/mcp-client.ts`
- `riotplan-vscode/src/tree-providers/plans-provider.ts`

## Notes

Extension provides rich UI for plan management while connecting to centralized HTTP server, eliminating need to know plan storage locations.
