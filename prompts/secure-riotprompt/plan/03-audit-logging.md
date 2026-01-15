# Step 03: Audit Logging Infrastructure

## Objective

Create the audit logging infrastructure for security events, enabling detection, monitoring, and forensic analysis of security-relevant activities.

## Background

Security audit logging serves multiple purposes:
- **Detection**: Identify security incidents in real-time
- **Investigation**: Provide forensic data after incidents
- **Compliance**: Meet audit requirements
- **Monitoring**: Track security metrics over time

## Tasks

### 3.1 Create Security Audit Logger

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/audit-logger.ts`:

```typescript
import { SecurityEvent, SecurityEventType } from './events';
import { Logger, DEFAULT_LOGGER, wrapLogger } from '../logger';

export interface AuditLoggerConfig {
  enabled: boolean;
  logLevel: 'all' | 'warning' | 'error' | 'critical';
  includeContext: boolean;
  maxContextSize: number;
  onEvent?: (event: SecurityEvent) => void;
}

const DEFAULT_CONFIG: AuditLoggerConfig = {
  enabled: true,
  logLevel: 'warning',
  includeContext: true,
  maxContextSize: 1000,
};

export class SecurityAuditLogger {
  private config: AuditLoggerConfig;
  private logger: Logger;
  private eventCount: Map<SecurityEventType, number> = new Map();

  constructor(config: Partial<AuditLoggerConfig> = {}, logger?: Logger) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.logger = wrapLogger(logger || DEFAULT_LOGGER, 'SecurityAudit');
  }

  /**
   * Log a security event
   */
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    if (!this.config.enabled) return;

    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
      context: this.sanitizeContext(event.context),
    };

    // Track event counts
    const count = this.eventCount.get(event.type) || 0;
    this.eventCount.set(event.type, count + 1);

    // Check log level
    if (!this.shouldLog(event.severity)) return;

    // Log the event
    const logMessage = this.formatEvent(fullEvent);
    
    switch (event.severity) {
      case 'critical':
        this.logger.error(`[CRITICAL] ${logMessage}`);
        break;
      case 'error':
        this.logger.error(logMessage);
        break;
      case 'warning':
        this.logger.warn(logMessage);
        break;
      case 'info':
        this.logger.info(logMessage);
        break;
    }

    // Call event handler if configured
    this.config.onEvent?.(fullEvent);
  }

  /**
   * Convenience methods for common events
   */
  pathTraversalBlocked(path: string, reason: string): void {
    this.log({
      type: 'path_traversal_blocked',
      severity: 'warning',
      message: `Path traversal attempt blocked: ${reason}`,
      context: { attemptedPath: this.sanitizePath(path) },
    });
  }

  toolValidationFailed(toolName: string, reason: string): void {
    this.log({
      type: 'tool_validation_failed',
      severity: 'warning',
      message: `Tool parameter validation failed for "${toolName}": ${reason}`,
      context: { toolName },
    });
  }

  toolExecutionBlocked(toolName: string, reason: string): void {
    this.log({
      type: 'tool_execution_blocked',
      severity: 'error',
      message: `Tool execution blocked for "${toolName}": ${reason}`,
      context: { toolName },
    });
  }

  secretRedacted(source: string): void {
    this.log({
      type: 'secret_redacted',
      severity: 'info',
      message: `Sensitive data redacted from ${source}`,
      context: { source },
    });
  }

  requestTimeout(operation: string, timeoutMs: number): void {
    this.log({
      type: 'request_timeout',
      severity: 'warning',
      message: `Operation "${operation}" timed out after ${timeoutMs}ms`,
      context: { operation, timeoutMs },
    });
  }

  /**
   * Get event statistics
   */
  getStats(): Map<SecurityEventType, number> {
    return new Map(this.eventCount);
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.eventCount.clear();
  }

  private shouldLog(severity: SecurityEvent['severity']): boolean {
    const levels = ['info', 'warning', 'error', 'critical'];
    const configLevel = levels.indexOf(this.config.logLevel === 'all' ? 'info' : this.config.logLevel);
    const eventLevel = levels.indexOf(severity);
    return eventLevel >= configLevel;
  }

  private formatEvent(event: SecurityEvent): string {
    let message = `[${event.type}] ${event.message}`;
    if (this.config.includeContext && event.context) {
      message += ` | Context: ${JSON.stringify(event.context)}`;
    }
    return message;
  }

  private sanitizeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!context || !this.config.includeContext) return undefined;

    const sanitized: Record<string, unknown> = {};
    let size = 0;

    for (const [key, value] of Object.entries(context)) {
      const stringValue = String(value);
      if (size + stringValue.length > this.config.maxContextSize) break;
      
      // Never log sensitive-looking values
      if (this.looksLikeSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
      size += stringValue.length;
    }

    return sanitized;
  }

  private sanitizePath(path: string): string {
    // Only show last component and length
    const parts = path.split(/[/\\]/);
    const lastPart = parts[parts.length - 1];
    return `.../${lastPart} (${path.length} chars)`;
  }

  private looksLikeSensitiveKey(key: string): boolean {
    const sensitivePatterns = [
      /key/i, /secret/i, /password/i, /token/i, /auth/i, /credential/i
    ];
    return sensitivePatterns.some(p => p.test(key));
  }
}

// Global instance for convenience
let globalAuditLogger: SecurityAuditLogger | null = null;

export function getAuditLogger(): SecurityAuditLogger {
  if (!globalAuditLogger) {
    globalAuditLogger = new SecurityAuditLogger();
  }
  return globalAuditLogger;
}

export function configureAuditLogger(config: Partial<AuditLoggerConfig>, logger?: Logger): void {
  globalAuditLogger = new SecurityAuditLogger(config, logger);
}
```

### 3.2 Integrate with Existing Logger

Ensure security audit logging integrates cleanly with the existing Logger interface.

### 3.3 Add Export to Security Index

Update `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/index.ts` to export audit logger.

## Acceptance Criteria

- [ ] SecurityAuditLogger class implemented
- [ ] Convenience methods for common event types
- [ ] Event statistics tracking
- [ ] Context sanitization (never log sensitive values)
- [ ] Configurable log levels
- [ ] Global instance management
- [ ] Integration with existing Logger interface
- [ ] Unit tests pass

## Testing

```typescript
describe('SecurityAuditLogger', () => {
  it('should log path traversal events', () => {
    const events: SecurityEvent[] = [];
    const logger = new SecurityAuditLogger({ onEvent: e => events.push(e) });
    
    logger.pathTraversalBlocked('../etc/passwd', 'parent directory access');
    
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('path_traversal_blocked');
  });

  it('should redact sensitive context keys', () => {
    const events: SecurityEvent[] = [];
    const logger = new SecurityAuditLogger({ onEvent: e => events.push(e) });
    
    logger.log({
      type: 'api_key_used',
      severity: 'info',
      message: 'API key accessed',
      context: { apiKey: 'sk-secret', operation: 'execute' },
    });
    
    expect(events[0].context?.apiKey).toBe('[REDACTED]');
    expect(events[0].context?.operation).toBe('execute');
  });
});
```

## Files Changed

- `riotprompt/src/security/audit-logger.ts` (new)
- `riotprompt/src/security/index.ts` (modified)

## Notes

The audit logger is designed to be lightweight and non-blocking. It should never slow down the main execution path. The `onEvent` callback allows external systems (monitoring, SIEM) to consume events.

