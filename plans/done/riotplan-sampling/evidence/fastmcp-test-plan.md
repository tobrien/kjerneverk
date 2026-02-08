# FastMCP Unit Test Plan for RiotPlan Sampling

Created: 2026-02-07

## Objective

Create a Python unit test using FastMCP that:
1. Connects to RiotPlan MCP server
2. Provides sampling capability via OpenAI/Anthropic handler
3. Calls `riotplan_generate` tool
4. Verifies RiotPlan uses sampling (not direct API)
5. Confirms plan generation works end-to-end

This proves MCP sampling works and provides concrete example for blog posts.

## Test Structure

### Directory Layout

```
riotplan/
├── tests/
│   └── sampling/
│       ├── README.md
│       ├── requirements.txt
│       ├── test_sampling.py
│       ├── conftest.py
│       └── fixtures/
│           └── test-plan-config.json
```

### requirements.txt

```txt
fastmcp[openai]>=2.14.0
fastmcp[anthropic]>=2.14.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
python-dotenv>=1.0.0
```

### test_sampling.py

```python
"""
Test RiotPlan MCP sampling with FastMCP client.

This test verifies that RiotPlan can use MCP sampling to generate plans
without requiring direct API keys on the server side.
"""

import os
import pytest
import tempfile
import shutil
from pathlib import Path
from fastmcp import Client
from fastmcp.client.sampling.handlers.openai import OpenAISamplingHandler
from fastmcp.client.sampling.handlers.anthropic import AnthropicSamplingHandler


@pytest.fixture
def temp_plan_dir():
    """Create temporary directory for test plans."""
    temp_dir = tempfile.mkdtemp(prefix="riotplan_test_")
    yield temp_dir
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def riotplan_server_path():
    """Path to RiotPlan MCP server."""
    # Adjust based on build output location
    return str(Path(__file__).parent.parent.parent / "dist" / "index.js")


@pytest.fixture(params=["openai", "anthropic"])
def sampling_client(request, riotplan_server_path):
    """
    Create FastMCP client with sampling handler.
    
    Parametrized to test both OpenAI and Anthropic handlers.
    """
    handler_type = request.param
    
    if handler_type == "openai":
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")
        handler = OpenAISamplingHandler(default_model="gpt-4o")
    else:  # anthropic
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        handler = AnthropicSamplingHandler(default_model="claude-sonnet-4-5")
    
    client = Client(
        riotplan_server_path,
        sampling_handler=handler,
    )
    
    yield client, handler_type
    
    # Cleanup
    client.close()


@pytest.mark.asyncio
async def test_sampling_plan_generation(sampling_client, temp_plan_dir):
    """
    Test that RiotPlan uses MCP sampling to generate a plan.
    
    This verifies:
    1. RiotPlan detects client supports sampling
    2. RiotPlan sends sampling request instead of direct API call
    3. FastMCP handler processes the request
    4. Plan is generated successfully
    """
    client, handler_type = sampling_client
    
    plan_path = Path(temp_plan_dir) / "test-web-app"
    
    # Call riotplan_generate tool
    result = await client.call_tool(
        "riotplan_generate",
        {
            "path": str(plan_path),
            "description": "Create a simple web application with user authentication",
            "steps": 3,
            "elaborations": [
                "Use modern web framework",
                "Include database schema",
                "Add basic tests"
            ]
        }
    )
    
    # Verify result
    assert result["success"] is True, f"Plan generation failed: {result.get('error')}"
    assert "message" in result
    
    # Verify plan files were created
    assert plan_path.exists(), "Plan directory not created"
    assert (plan_path / "SUMMARY.md").exists(), "SUMMARY.md not created"
    assert (plan_path / "STATUS.md").exists(), "STATUS.md not created"
    
    # Verify steps were created
    steps_dir = plan_path / "steps"
    assert steps_dir.exists(), "Steps directory not created"
    
    step_files = list(steps_dir.glob("*.md"))
    assert len(step_files) == 3, f"Expected 3 steps, found {len(step_files)}"
    
    # Verify SUMMARY.md has content
    summary_content = (plan_path / "SUMMARY.md").read_text()
    assert "Executive Summary" in summary_content
    assert "Approach" in summary_content
    assert "Success Criteria" in summary_content
    
    print(f"\n✅ Plan generated successfully using {handler_type} sampling handler")
    print(f"   Plan location: {plan_path}")
    print(f"   Steps created: {len(step_files)}")


@pytest.mark.asyncio
async def test_sampling_request_format(sampling_client, temp_plan_dir):
    """
    Test that sampling requests have correct format.
    
    This verifies the sampling request matches MCP spec.
    """
    client, handler_type = sampling_client
    
    # Track sampling requests
    sampling_requests = []
    
    # Wrap the handler to capture requests
    original_handler = client._sampling_handler
    
    async def tracking_handler(messages, params, context):
        sampling_requests.append({
            "messages": messages,
            "params": params,
            "context": context
        })
        return await original_handler(messages, params, context)
    
    client._sampling_handler = tracking_handler
    
    # Generate plan
    plan_path = Path(temp_plan_dir) / "test-format"
    await client.call_tool(
        "riotplan_generate",
        {
            "path": str(plan_path),
            "description": "Simple test plan",
            "steps": 2
        }
    )
    
    # Verify sampling request was made
    assert len(sampling_requests) > 0, "No sampling requests captured"
    
    request = sampling_requests[0]
    
    # Verify request structure
    assert "messages" in request
    assert "params" in request
    
    messages = request["messages"]
    assert len(messages) > 0, "No messages in sampling request"
    
    # Verify message format
    first_message = messages[0]
    assert hasattr(first_message, "role"), "Message missing role"
    assert hasattr(first_message, "content"), "Message missing content"
    assert first_message.role in ["user", "assistant", "system"]
    
    # Verify params
    params = request["params"]
    assert hasattr(params, "maxTokens") or params.maxTokens is not None
    
    print(f"\n✅ Sampling request format validated")
    print(f"   Messages: {len(messages)}")
    print(f"   First message role: {first_message.role}")


@pytest.mark.asyncio
async def test_no_direct_api_keys_needed(sampling_client, temp_plan_dir, monkeypatch):
    """
    Test that RiotPlan doesn't try to use direct API keys when sampling available.
    
    This verifies RiotPlan detects sampling capability and uses it
    instead of looking for ANTHROPIC_API_KEY, etc.
    """
    client, handler_type = sampling_client
    
    # Remove direct API keys from environment
    # (RiotPlan server should still work via sampling)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    
    plan_path = Path(temp_plan_dir) / "test-no-keys"
    
    # This should work via sampling, not direct API
    result = await client.call_tool(
        "riotplan_generate",
        {
            "path": str(plan_path),
            "description": "Test plan without server API keys",
            "steps": 2
        }
    )
    
    assert result["success"] is True
    assert plan_path.exists()
    
    print(f"\n✅ Plan generated via sampling without server-side API keys")


@pytest.mark.asyncio
async def test_sampling_with_tools(sampling_client):
    """
    Test that sampling works with tool use (if supported).
    
    This is a future test for when RiotPlan uses tools during generation.
    """
    client, handler_type = sampling_client
    
    # Check if handler supports tools
    capabilities = client.get_capabilities()
    
    if capabilities.get("sampling", {}).get("tools"):
        print(f"\n✅ {handler_type} handler supports tool use in sampling")
    else:
        pytest.skip(f"{handler_type} handler doesn't support tools in sampling")


def test_fastmcp_installation():
    """Verify FastMCP is installed with correct handlers."""
    try:
        import fastmcp
        from fastmcp.client.sampling.handlers.openai import OpenAISamplingHandler
        from fastmcp.client.sampling.handlers.anthropic import AnthropicSamplingHandler
        print(f"\n✅ FastMCP installed: {fastmcp.__version__}")
    except ImportError as e:
        pytest.fail(f"FastMCP not properly installed: {e}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
```

### conftest.py

```python
"""
Pytest configuration for RiotPlan sampling tests.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure RiotPlan is built
def pytest_configure(config):
    """Check prerequisites before running tests."""
    riotplan_root = Path(__file__).parent.parent.parent
    dist_path = riotplan_root / "dist" / "index.js"
    
    if not dist_path.exists():
        print("\n❌ RiotPlan not built. Run 'npm run build' first.")
        sys.exit(1)
    
    # Check for at least one API key
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_anthropic = bool(os.getenv("ANTHROPIC_API_KEY"))
    
    if not (has_openai or has_anthropic):
        print("\n⚠️  Warning: No API keys found.")
        print("Set OPENAI_API_KEY or ANTHROPIC_API_KEY to run sampling tests.")
        print("Tests will be skipped.")
```

### README.md

```markdown
# RiotPlan MCP Sampling Tests

Tests for MCP sampling functionality using FastMCP client.

## Setup

1. Install Python dependencies:
   ```bash
   cd tests/sampling
   pip install -r requirements.txt
   ```

2. Set API key (choose one):
   ```bash
   export OPENAI_API_KEY="your-key"
   # OR
   export ANTHROPIC_API_KEY="your-key"
   ```

3. Build RiotPlan:
   ```bash
   npm run build
   ```

## Run Tests

```bash
# Run all sampling tests
pytest test_sampling.py -v

# Run specific test
pytest test_sampling.py::test_sampling_plan_generation -v

# Run with output
pytest test_sampling.py -v -s

# Run only OpenAI tests
pytest test_sampling.py -v -k openai

# Run only Anthropic tests
pytest test_sampling.py -v -k anthropic
```

## What These Tests Verify

1. **Sampling Detection**: RiotPlan detects client supports sampling
2. **No Server Keys Needed**: Plan generation works without server-side API keys
3. **Request Format**: Sampling requests match MCP specification
4. **End-to-End**: Complete plan generation via sampling
5. **Multiple Handlers**: Works with both OpenAI and Anthropic

## Expected Output

```
✅ Plan generated successfully using openai sampling handler
   Plan location: /tmp/riotplan_test_xyz/test-web-app
   Steps created: 3

✅ Sampling request format validated
   Messages: 2
   First message role: user

✅ Plan generated via sampling without server-side API keys
```

## Troubleshooting

**"RiotPlan not built"**: Run `npm run build` in project root

**"No API keys found"**: Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

**"Client doesn't support sampling"**: This shouldn't happen with FastMCP

**Tests hang**: Check if RiotPlan server starts correctly
```

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/test-sampling.yml
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
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install Node dependencies
        run: npm ci
      
      - name: Build RiotPlan
        run: npm run build
      
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
      
      - name: Run sampling tests (Anthropic)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          cd tests/sampling
          pytest test_sampling.py -v -k anthropic
```

## Benefits

1. **Proof of Concept**: Demonstrates MCP sampling works
2. **Regression Testing**: Ensures sampling keeps working
3. **Documentation**: Shows others how to use sampling
4. **Blog Material**: Concrete examples for blog posts
5. **Vendor Pressure**: Shows what's possible, encourages adoption

## Next Steps

1. Implement session-based architecture in RiotPlan
2. Create execution-sampling package
3. Run these tests to verify implementation
4. Write blog posts using test results as examples
5. Share with MCP community
