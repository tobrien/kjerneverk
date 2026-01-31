# Step 05: Testing & Documentation

## Objective

Comprehensive testing of all three tools and update documentation to explain the new workflow. Ensure the bug is fixed and workflow is smooth.

## Background

After implementation, we need to:
1. Test all scenarios (the original bug case)
2. Test edge cases
3. Update documentation
4. Verify backward compatibility

## Tasks

### 1. Test Original Bug Scenario

The exact scenario that failed:
- Start in idea directory (`global-riotplan-rules`)
- Move to shaping
- Select approach
- Call "create plan" → should now detect and suggest `build` instead
- Call `riotplan_build` → should create plan files in same directory

### 2. Test All Transition Paths

- idea → shaping → built (forward)
- built → shaping → idea (backward)
- idea → built (skip shaping, if allowed)
- Test with and without explicit paths

### 3. Test Create Tool Detection

- Create in idea directory → should detect
- Create in shaping directory → should detect  
- Create in built directory → should detect
- Create in empty directory → should work normally
- Create with explicit path → should detect if path is idea/shaping

### 4. Test Build Tool

- Build from idea → verify files created, stage = built
- Build from shaping → verify files created, stage = built
- Build from built → should error (already built)
- Build from regular directory → should error with helpful message
- Verify existing files preserved

### 5. Update Documentation

Update relevant docs:
- `README.md` - Mention new tools
- `guide/` - Add workflow guide explaining lifecycle
- `docs/public/mcp-tools.md` - Document new tools
- Add examples of correct workflow

### 6. Add Examples

Create example workflows:
- Idea → Shaping → Build (correct workflow)
- Using transition tool to go backward
- What happens if you try to create in existing directory

## Acceptance Criteria

- [ ] Original bug scenario works correctly
- [ ] All transition paths work
- [ ] Create tool detection works
- [ ] Build tool works correctly
- [ ] Documentation updated
- [ ] Examples provided
- [ ] No regressions

## Testing

- Run through original bug scenario → should work smoothly now
- Test all edge cases
- Verify error messages are helpful
- Test with real directories

## Files Changed

- `README.md`
- `guide/` files (workflow guide)
- `docs/public/mcp-tools.md`
- Example files (if created)

## Notes

- Focus on user experience - workflow should feel natural
- Error messages should guide users to correct tool
- Documentation should be clear about when to use which tool
