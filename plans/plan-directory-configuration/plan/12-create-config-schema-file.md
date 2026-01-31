# Step 12: Create JSON Schema for IDE Support

## Goal

Create a JSON Schema file that provides autocomplete and validation in IDEs for config files.

## Tasks

- [ ] Create `schemas/riotplan-config.schema.json`
- [ ] Define schema for all config options
- [ ] Add descriptions for each field
- [ ] Add examples
- [ ] Publish schema to a URL (or include in package)
- [ ] Update config file examples to reference schema

## Schema Structure

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://raw.githubusercontent.com/kjerneverk/riotplan/main/schemas/riotplan-config.schema.json",
  "title": "RiotPlan Configuration",
  "description": "Configuration file for RiotPlan",
  "type": "object",
  "properties": {
    "planDirectory": {
      "type": "string",
      "description": "Path to the directory where plans are stored",
      "default": "./plans",
      "examples": ["./plans", "../shared-plans", "/absolute/path/to/plans"]
    },
    "defaultProvider": {
      "type": "string",
      "enum": ["anthropic", "openai", "gemini"],
      "description": "Default AI provider for plan generation"
    },
    "defaultModel": {
      "type": "string",
      "description": "Default model to use for plan generation",
      "examples": ["claude-3-5-sonnet-20241022", "gpt-4", "gemini-pro"]
    },
    "templateDirectory": {
      "type": "string",
      "description": "Path to custom plan templates",
      "examples": ["./templates", "./.riotplan/templates"]
    }
  },
  "additionalProperties": false
}
```

## Config File with Schema Reference

```json
{
  "$schema": "https://raw.githubusercontent.com/kjerneverk/riotplan/main/schemas/riotplan-config.schema.json",
  "planDirectory": "./plans"
}
```

## Acceptance Criteria

- [ ] Schema file is valid JSON Schema
- [ ] All config options are documented
- [ ] Examples are provided
- [ ] IDEs provide autocomplete when schema is referenced
- [ ] Schema is accessible (published or bundled)

## Notes

This provides a great developer experience in VSCode, Cursor, and other IDEs.
