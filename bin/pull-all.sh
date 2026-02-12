#!/bin/bash

# Script to pull from origin for all kjerneverk projects
# Usage: ./bin/pull-all.sh

set -e  # Exit on error

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KJERNEVERK_ROOT="$(dirname "$SCRIPT_DIR")"

# Define the projects
PROJECTS=(
    "riotdoc"
    "riotplan"
    "riotplan-catalyst"
    "riotprompt"
    "agentic"
    "execution"
    "execution-anthropic"
    "execution-gemini"
    "execution-openai"
    "execution-sampling"
    "kjerneverk.github.io"
)

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Pulling from origin for all kjerneverk projects..."
echo ""

# Track success/failure
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

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
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "${YELLOW}⊙${NC} Skipped: Has uncommitted changes (on '$CURRENT_BRANCH')"
        ((SKIP_COUNT++))
        continue
    fi
    
    # Check if there are untracked files that would be overwritten
    if [ -n "$(git ls-files --others --exclude-standard)" ]; then
        echo -e "${YELLOW}⊙${NC} Skipped: Has untracked files (on '$CURRENT_BRANCH')"
        ((SKIP_COUNT++))
        continue
    fi
    
    # Pull from origin
    if git pull origin "$CURRENT_BRANCH" 2>&1 | grep -q "Already up to date"; then
        echo -e "${BLUE}→${NC} Already up to date (on '$CURRENT_BRANCH')"
        ((SUCCESS_COUNT++))
    elif git pull origin "$CURRENT_BRANCH" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Pulled successfully (on '$CURRENT_BRANCH')"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}✗${NC} Failed to pull (on '$CURRENT_BRANCH')"
        ((FAIL_COUNT++))
    fi
done

echo ""
echo "Summary: ${GREEN}$SUCCESS_COUNT${NC} successful, ${YELLOW}$SKIP_COUNT${NC} skipped, ${RED}$FAIL_COUNT${NC} failed"

# Exit with error if any failed
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
fi
