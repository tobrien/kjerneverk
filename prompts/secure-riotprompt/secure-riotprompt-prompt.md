# Secure RiotPrompt - Security as a First-Class Feature

## Overview

RiotPrompt isn't just about making better prompts—it's about making **secure** execution environments for AI agents. This plan addresses a comprehensive security review that identified critical vulnerabilities across the kjerneverk projects (riotprompt, agentic, execution-*, riotplan).

## The Security Challenge

Modern LLM orchestration frameworks face unique security challenges:

1. **Tool Execution**: AI agents call user-defined or system tools with parameters that come from LLM outputs (untrusted)
2. **Path Traversal**: Prompts and context are loaded from file systems, creating file access risks
3. **Credential Exposure**: API keys must be managed carefully through configuration, logging, and errors
4. **Prompt Injection**: LLM outputs can influence subsequent tool calls and execution flow
5. **Resource Exhaustion**: Unbounded iteration loops, missing timeouts, and ReDoS patterns

## Industry Context

Similar frameworks have faced these challenges:

- **LangChain**: CVE-2023-29374 (arbitrary code execution via tool arguments), CVE-2023-36189 (SSRF via web tools)
- **LlamaIndex**: Path traversal in file loaders, arbitrary code execution in function tools
- **OWASP LLM Top 10**: LLM01 (Prompt Injection), LLM02 (Insecure Output Handling), LLM06 (Sensitive Information Disclosure)

## Goals

1. **Security as a Feature**: Position RiotPrompt as a security-conscious framework
2. **Configurable Protection**: Security measures that can be tuned to use-case
3. **Defense in Depth**: Multiple layers of protection
4. **Documentation**: Clear guidance on secure usage patterns
5. **Testing**: Security-focused test suites

## What This Plan Does NOT Do

- Does not change existing interfaces (additive only)
- Does not break backward compatibility
- Does not impose mandatory security overhead (opt-in by default for most features)

## Plan Structure

The plan is organized into phases:

1. **Phase 1 - Foundation** (Steps 01-03): Security infrastructure and tooling
2. **Phase 2 - Critical Issues** (Steps 04-07): Address critical vulnerabilities
3. **Phase 3 - High Priority** (Steps 08-11): Address high-priority issues
4. **Phase 4 - Medium/Low** (Steps 12-14): Address remaining issues
5. **Phase 5 - Documentation & Release** (Steps 15-17): Documentation and integration

## Success Criteria

1. All critical vulnerabilities have documented mitigations
2. Security features are configurable and documented
3. New security test suites pass
4. No breaking changes to existing APIs
5. Clear "secure by default" configuration guide
6. Integration with existing tools (zod, etc.)

## Review Before Execution

**IMPORTANT**: This plan is designed for human review before execution. Each step should be:
- Reviewed for approach
- Potentially modified based on feedback
- Executed only when approved

The STATUS.md file tracks progress and can be updated to reflect changes to the plan.

