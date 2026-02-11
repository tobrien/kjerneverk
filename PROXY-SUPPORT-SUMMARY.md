# HTTP Proxy Support Implementation Summary

## Overview

This document summarizes the HTTP proxy support implementation across the kjerneverk monorepo packages. Proxy support allows API calls to Anthropic, OpenAI, and Gemini to route through corporate firewalls using the `HTTPS_PROXY` or `https_proxy` environment variables.

## Affected Packages

### ✅ Already Completed (Standalone Execution Packages)

1. **`execution-anthropic`** (`/Users/tobrien/gitw/kjerneverk/execution-anthropic`)
   - Added `src/proxy.ts`
   - Modified `src/index.ts` to use proxy support
   - Uses `undici.ProxyAgent` with Anthropic SDK's custom `fetch` option

2. **`execution-openai`** (`/Users/tobrien/gitw/kjerneverk/execution-openai`)
   - Added `src/proxy.ts`
   - Modified `src/index.ts` to use proxy support
   - Uses `undici.ProxyAgent` with OpenAI SDK's custom `fetch` option

3. **`execution-gemini`** (`/Users/tobrien/gitw/kjerneverk/execution-gemini`)
   - Added `src/proxy.ts`
   - Modified `src/index.ts` to use proxy support
   - Uses `withProxyFetch()` wrapper due to Gemini SDK's lack of custom fetch option
   - Temporarily replaces `globalThis.fetch` during API calls

### ✅ Newly Fixed (RiotPrompt Internal Execution Module)

4. **`riotprompt`** (`/Users/tobrien/gitw/kjerneverk/riotprompt`)
   - **Problem**: Contains its own internal execution module (`src/execution/`) with duplicate provider implementations
   - **Files Modified**:
     - `package.json` - Added `undici` dependency
     - `src/execution/proxy-anthropic.ts` - New proxy support module
     - `src/execution/proxy-openai.ts` - New proxy support module
     - `src/execution/proxy-gemini.ts` - New proxy support module
     - `src/execution/anthropic.ts` - Updated to use proxy
     - `src/execution/openai.ts` - Updated to use proxy
     - `src/execution/gemini.ts` - Updated to use proxy with `withProxyFetch()` wrapper

### ✅ Verified Clean (No Direct SDK Usage)

5. **`riotplan`** - No direct SDK instantiation found
6. **`riotdoc`** - No direct SDK instantiation found
7. **`agentic`** - No direct SDK instantiation found
8. **`execution`** - Interface-only package, no implementation

## Technical Implementation

### Pattern for Anthropic and OpenAI

```typescript
import { getProxyUrl, createProxyFetch } from './proxy-{provider}';

const clientOptions: ConstructorParameters<typeof SDK>[0] = { apiKey };
const proxyUrl = getProxyUrl();
if (proxyUrl) {
    clientOptions.fetch = createProxyFetch(proxyUrl);
}
const client = new SDK(clientOptions);
```

### Pattern for Gemini

```typescript
import { getProxyUrl, withProxyFetch } from './proxy-gemini';

const proxyUrl = getProxyUrl();

const runWithGenAI = async () => {
    const genAI = new GoogleGenerativeAI(apiKey);
    // ... rest of implementation
    return result;
};

return proxyUrl ? withProxyFetch(proxyUrl, runWithGenAI) : runWithGenAI();
```

### Environment Variables

The proxy support respects standard HTTP proxy environment variables:

- `https_proxy` (lowercase, preferred)
- `HTTPS_PROXY` (uppercase, fallback)

Example:
```bash
export https_proxy=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

## Dependencies

All packages using proxy support now depend on:

- `undici` (^7.3.0 or compatible)

## Testing

To verify proxy support is working:

1. Set the proxy environment variable:
   ```bash
   export https_proxy=http://your-proxy:port
   ```

2. Run any tool that makes API calls:
   ```bash
   npx @kjerneverk/riotprompt execute --model claude-3-opus-20240229
   ```

3. Monitor network traffic to confirm requests route through the proxy

## Architecture Notes

### Why RiotPrompt Has Duplicate Providers

The `riotprompt` package maintains its own execution module (`src/execution/`) for backward compatibility. This duplicates the functionality available in the standalone `execution-*` packages. Both implementations now support proxy configuration.

### Future Consolidation

Consider migrating `riotprompt` to use the standalone `execution-*` packages exclusively, removing the duplicate internal implementation. This would eliminate the need to maintain proxy support in multiple locations.

## Build Status

All packages build successfully:

- ✅ `execution-anthropic` - builds cleanly
- ✅ `execution-openai` - builds cleanly
- ✅ `execution-gemini` - builds cleanly
- ✅ `riotprompt` - builds cleanly with new proxy support

## Commit Message Suggestion

```
feat: add HTTP proxy support for all LLM provider packages

Add HTTPS_PROXY/https_proxy environment variable support to route
API calls through corporate firewalls. Implemented for:

- execution-anthropic: uses SDK's custom fetch option
- execution-openai: uses SDK's custom fetch option
- execution-gemini: uses globalThis.fetch wrapper (SDK limitation)
- riotprompt: internal execution module with all three providers

Uses undici.ProxyAgent for transparent proxy routing. Follows
standard HTTP proxy environment variable conventions.

Fixes connection errors in proxied environments.
```

## Related Files

- `/Users/tobrien/gitw/kjerneverk/execution-anthropic/src/proxy.ts`
- `/Users/tobrien/gitw/kjerneverk/execution-openai/src/proxy.ts`
- `/Users/tobrien/gitw/kjerneverk/execution-gemini/src/proxy.ts`
- `/Users/tobrien/gitw/kjerneverk/riotprompt/src/execution/proxy-anthropic.ts`
- `/Users/tobrien/gitw/kjerneverk/riotprompt/src/execution/proxy-openai.ts`
- `/Users/tobrien/gitw/kjerneverk/riotprompt/src/execution/proxy-gemini.ts`
