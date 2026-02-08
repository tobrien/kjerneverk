# Step 12: Add CI/CD Integration

## Objective

Integrate FastMCP tests into CI/CD pipeline to ensure ongoing compatibility and catch regressions.

## Context

**Why this step**: Automated testing ensures sampling support doesn't break. Validates changes before merge.

**From evidence/fastmcp-test-plan.md**:
> "GitHub Actions workflow for CI/CD integration."

**Why now**: Tests from Step 11 are complete and reliable. Ready for automation.

## Tasks

- [ ] Create `.github/workflows/test-sampling.yml`
- [ ] Configure workflow:
  - Trigger on push to main/working
  - Trigger on pull requests
  - Run on ubuntu-latest
- [ ] Set up Node.js and Python environments
- [ ] Build RiotPlan before tests
- [ ] Run FastMCP tests with both handlers
- [ ] Configure secrets for API keys:
  - OPENAI_API_KEY
  - ANTHROPIC_API_KEY
- [ ] Integrate Python tests into release workflow
- [ ] Add Python test step to existing GitHub Actions workflows
- [ ] Add status badge to README
- [ ] Document CI/CD setup in contributing guide

## Acceptance Criteria

- [ ] Workflow runs on push and PR
- [ ] Tests run with both OpenAI and Anthropic
- [ ] API keys securely stored in secrets
- [ ] Workflow fails on test failure
- [ ] Status badge shows in README
- [ ] Documentation explains CI/CD setup

## Constraints

**Technical**:
- Must not expose API keys in logs
- Must be cost-effective (API usage)
- Should complete in reasonable time (<10 min)

## Dependencies

**Requires**: 
- Step 11 (End-to-end tests)

**Blocks**: 
- None (completes Phase 4)

## Evidence

**Workflow Example** (evidence/fastmcp-test-plan.md):
```yaml
name: Test MCP Sampling

on:
  push:
    branches: [main, working]
  pull_request:
    branches: [main]

jobs:
  test-sampling:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Build RiotPlan
        run: npm ci && npm run build
      
      - name: Install Python dependencies
        run: |
          cd tests/sampling
          pip install -r requirements.txt
      
      - name: Run sampling tests (OpenAI)
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          cd tests/sampling
          pytest test_sampling.py -v -k openai
```

## Estimated Effort

**4 hours**

- 2h: Create workflow file
- 1h: Configure secrets and test
- 1h: Documentation

## Notes

- Consider caching dependencies for faster runs
- Add timeout to prevent hung tests
- Consider running tests on schedule (nightly)
- Monitor API costs from CI runs
- Add workflow status to project dashboard
- Integrate with existing release workflow (kodrdriv)
- Python tests should run on release branches

## Related Files

- `.github/workflows/test-sampling.yml` - Workflow file
- `README.md` - Status badge
- `CONTRIBUTING.md` - CI/CD documentation
