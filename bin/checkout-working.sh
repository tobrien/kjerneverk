#!/bin/bash

# Script to checkout the working branch for all kjerneverk projects
# Usage: ./bin/checkout-working.sh

set -e  # Exit on error

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KJERNEVERK_ROOT="$(dirname "$SCRIPT_DIR")"

# Define the projects
PROJECTS=(
    "riotdoc"
    "riotplan"
    "riotprompt"
    "agentic"
    "execution"
    "execution-anthropic"
    "execution-gemini"
    "execution-openai"
    "kjerneverk.github.io"
)

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Checking out 'working' branch for all kjerneverk projects..."
echo ""

# Track success/failure
SUCCESS_COUNT=0
FAIL_COUNT=0

for project in "${PROJECTS[@]}"; do
    PROJECT_DIR="$KJERNEVERK_ROOT/$project"
    
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${RED}✗${NC} $project: Directory not found at $PROJECT_DIR"
        ((FAIL_COUNT++))
        continue
    fi
    
    if [ ! -d "$PROJECT_DIR/.git" ]; then
        echo -e "${RED}✗${NC} $project: Not a git repository"
        ((FAIL_COUNT++))
        continue
    fi
    
    echo -n "Processing $project... "
    
    cd "$PROJECT_DIR"
    
    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    if [ "$CURRENT_BRANCH" = "working" ]; then
        echo -e "${YELLOW}⊙${NC} Already on 'working' branch"
        ((SUCCESS_COUNT++))
    else
        # Check if there are uncommitted changes
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            echo -e "${RED}✗${NC} Has uncommitted changes (currently on '$CURRENT_BRANCH')"
            ((FAIL_COUNT++))
        else
            # Checkout working branch
            if git checkout working 2>/dev/null; then
                echo -e "${GREEN}✓${NC} Switched from '$CURRENT_BRANCH' to 'working'"
                ((SUCCESS_COUNT++))
            else
                echo -e "${RED}✗${NC} Failed to checkout 'working' branch"
                ((FAIL_COUNT++))
            fi
        fi
    fi
done

echo ""
echo "Summary: ${GREEN}$SUCCESS_COUNT${NC} successful, ${RED}$FAIL_COUNT${NC} failed"

# Exit with error if any failed
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
fi
