# Step 08: Path Security Guard

## Objective

Implement path validation to prevent directory traversal attacks in file operations.

## Background

**Vulnerability Addressed:** Path Traversal in File Operations (🟠 High)

The storage utility and loader accept arbitrary paths without validation. An attacker could:
- Read sensitive files like `/etc/passwd` or `~/.ssh/id_rsa`
- Escape the intended working directory
- Access system configuration files

## Tasks

### 8.1 Create PathGuard Class

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/path-guard.ts`:

```typescript
import path from 'path';
import { PathSecurityConfig } from './types';
import { getAuditLogger, SecurityAuditLogger } from './audit-logger';

export interface PathValidationResult {
  valid: boolean;
  normalizedPath?: string;
  error?: string;
  violation?: string;
}

export class PathGuard {
  private config: PathSecurityConfig;
  private auditLogger: SecurityAuditLogger;
  private basePaths: string[];

  constructor(config: Partial<PathSecurityConfig> = {}, auditLogger?: SecurityAuditLogger) {
    this.config = {
      enabled: true,
      basePaths: [],
      allowAbsolute: false,
      allowSymlinks: false,
      denyPatterns: [
        '\\.\\.',        // Parent directory
        '~',             // Home directory
        '\\$\\{',        // Variable expansion
        '\\$\\(',        // Command substitution
      ],
      ...config,
    };
    
    // Normalize base paths
    this.basePaths = this.config.basePaths.map(p => path.resolve(p));
    this.auditLogger = auditLogger || getAuditLogger();
  }

  /**
   * Validate and normalize a file path
   */
  validate(inputPath: string, operation: string = 'access'): PathValidationResult {
    if (!this.config.enabled) {
      return { valid: true, normalizedPath: inputPath };
    }

    // Check for denied patterns
    for (const pattern of this.config.denyPatterns) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(inputPath)) {
        this.auditLogger.pathTraversalBlocked(inputPath, `Matched deny pattern: ${pattern}`);
        return {
          valid: false,
          error: 'Path contains forbidden pattern',
          violation: pattern,
        };
      }
    }

    // Check for null bytes (path truncation attack)
    if (inputPath.includes('\0')) {
      this.auditLogger.pathTraversalBlocked(inputPath, 'Null byte detected');
      return {
        valid: false,
        error: 'Path contains invalid characters',
        violation: 'null_byte',
      };
    }

    // Check absolute path handling
    const isAbsolute = path.isAbsolute(inputPath);
    if (isAbsolute && !this.config.allowAbsolute) {
      this.auditLogger.pathTraversalBlocked(inputPath, 'Absolute paths not allowed');
      return {
        valid: false,
        error: 'Absolute paths are not allowed',
        violation: 'absolute_path',
      };
    }

    // Normalize the path
    let normalizedPath: string;
    try {
      if (isAbsolute) {
        normalizedPath = path.normalize(inputPath);
      } else if (this.basePaths.length > 0) {
        // Resolve relative to first base path
        normalizedPath = path.resolve(this.basePaths[0], inputPath);
      } else {
        normalizedPath = path.resolve(inputPath);
      }
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid path format',
      };
    }

    // Verify path is within allowed base paths
    if (this.basePaths.length > 0) {
      const isWithinBase = this.basePaths.some(basePath => 
        normalizedPath.startsWith(basePath + path.sep) || normalizedPath === basePath
      );

      if (!isWithinBase) {
        this.auditLogger.pathTraversalBlocked(inputPath, 'Path escapes allowed directories');
        return {
          valid: false,
          error: 'Path is outside allowed directories',
          violation: 'directory_escape',
        };
      }
    }

    // Check for path traversal after normalization
    const relativePath = this.basePaths.length > 0
      ? path.relative(this.basePaths[0], normalizedPath)
      : normalizedPath;
    
    if (relativePath.startsWith('..')) {
      this.auditLogger.pathTraversalBlocked(inputPath, 'Path traversal after normalization');
      return {
        valid: false,
        error: 'Path traversal detected',
        violation: 'traversal',
      };
    }

    return {
      valid: true,
      normalizedPath,
    };
  }

  /**
   * Validate and return the path, throwing on failure
   */
  validateOrThrow(inputPath: string, operation: string = 'access'): string {
    const result = this.validate(inputPath, operation);
    if (!result.valid) {
      throw new Error(`Path validation failed: ${result.error}`);
    }
    return result.normalizedPath!;
  }

  /**
   * Add a base path at runtime
   */
  addBasePath(basePath: string): void {
    const normalized = path.resolve(basePath);
    if (!this.basePaths.includes(normalized)) {
      this.basePaths.push(normalized);
    }
  }

  /**
   * Check if a path is within allowed directories
   */
  isWithinAllowed(testPath: string): boolean {
    if (this.basePaths.length === 0) return true;
    
    const normalizedTest = path.resolve(testPath);
    return this.basePaths.some(basePath =>
      normalizedTest.startsWith(basePath + path.sep) || normalizedTest === basePath
    );
  }

  /**
   * Get the first base path (for relative resolution)
   */
  getBasePath(): string | undefined {
    return this.basePaths[0];
  }
}

// Global instance
let globalPathGuard: PathGuard | null = null;

export function getPathGuard(): PathGuard {
  if (!globalPathGuard) {
    globalPathGuard = new PathGuard();
  }
  return globalPathGuard;
}

export function configurePathGuard(config: Partial<PathSecurityConfig>): void {
  globalPathGuard = new PathGuard(config);
}
```

### 8.2 Integrate with Storage Utility

Modify `/Users/tobrien/gitw/kjerneverk/riotprompt/src/util/storage.ts`:

```typescript
import { getPathGuard, PathGuard } from '../security/path-guard';

export interface UtilityOptions {
  log?: (message: string, ...args: any[]) => void;
  pathGuard?: PathGuard;
}

export const create = (params: UtilityOptions = {}): Utility => {
  const log = params.log || console.log;
  const pathGuard = params.pathGuard || getPathGuard();

  const readFile = async (inputPath: string, encoding: string): Promise<string> => {
    const safePath = pathGuard.validateOrThrow(inputPath, 'read');
    return await fs.promises.readFile(safePath, { encoding: encoding as BufferEncoding });
  };

  const writeFile = async (inputPath: string, data: string | Buffer, encoding: string): Promise<void> => {
    const safePath = pathGuard.validateOrThrow(inputPath, 'write');
    await fs.promises.writeFile(safePath, data, { encoding: encoding as BufferEncoding });
  };

  // ... similar updates to other methods
};
```

### 8.3 Integrate with Loader

Update the loader to use PathGuard for context directory validation.

### 8.4 Integrate with CLI

Add path validation to CLI commands that accept file paths.

## Acceptance Criteria

- [ ] PathGuard class implemented
- [ ] Path traversal patterns detected and blocked
- [ ] Base path restriction enforcement
- [ ] Integration with storage utility
- [ ] Integration with loader
- [ ] Integration with CLI
- [ ] Audit logging of blocked paths
- [ ] Unit tests with attack vectors
- [ ] Security tests pass

## Testing

```typescript
import { PATH_TRAVERSAL_VECTORS } from '../fixtures/attack-vectors';

describe('PathGuard', () => {
  it('should block path traversal attempts', () => {
    const guard = new PathGuard({ basePaths: ['/app/data'] });
    
    for (const vector of PATH_TRAVERSAL_VECTORS) {
      const result = guard.validate(vector);
      expect(result.valid).toBe(false);
    }
  });

  it('should allow paths within base directory', () => {
    const guard = new PathGuard({ basePaths: ['/app/data'] });
    const result = guard.validate('subdir/file.txt');
    expect(result.valid).toBe(true);
    expect(result.normalizedPath).toBe('/app/data/subdir/file.txt');
  });

  it('should block absolute paths when not allowed', () => {
    const guard = new PathGuard({ allowAbsolute: false });
    const result = guard.validate('/etc/passwd');
    expect(result.valid).toBe(false);
  });
});
```

## Files Changed

- `riotprompt/src/security/path-guard.ts` (new)
- `riotprompt/src/util/storage.ts` (modified)
- `riotprompt/src/loader.ts` (modified)
- `riotprompt/src/cli.ts` (modified)
- `riotprompt/src/security/index.ts` (modified)

## Notes

The PathGuard is designed to be strict by default:
- No absolute paths
- No parent directory access (`..`)
- Must stay within configured base paths

For development or trusted environments, these can be relaxed via configuration.

