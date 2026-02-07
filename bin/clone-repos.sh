#!/bin/bash
#
# clone-repos.sh - Clone all repositories for the kjerneverk project
#
# Usage: ./bin/clone-repos.sh [target_directory]
#
# This script clones all repositories listed in repos.txt or defined in the REPOS array.
# Run this script from the kjerneverk directory.
#

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Target directory for cloning repos (default to current directory)
TARGET_DIR="${1:-$PROJECT_ROOT}"

# Configuration file containing repository URLs (one per line)
REPOS_FILE="$PROJECT_ROOT/repos.txt"

# Default repositories (used if repos.txt doesn't exist)
# Add your repository URLs here
REPOS=(
    # Example:
    # "https://github.com/username/repo1.git"
    # "https://github.com/username/repo2.git"
)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Repository Cloning Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Project root: ${PROJECT_ROOT}"
echo -e "Target directory: ${TARGET_DIR}"
echo ""

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# Function to clone a repository
clone_repo() {
    local repo_url="$1"
    local repo_name
    
    # Extract repository name from URL
    repo_name=$(basename "$repo_url" .git)
    
    echo -e "${YELLOW}Processing: ${repo_name}${NC}"
    
    # Check if directory already exists
    if [ -d "$repo_name" ]; then
        echo -e "${GREEN}✓ Repository already exists: ${repo_name}${NC}"
        echo -e "  Pulling latest changes..."
        (cd "$repo_name" && git pull) || echo -e "${RED}  Failed to pull changes${NC}"
    else
        echo -e "  Cloning ${repo_url}..."
        if git clone "$repo_url"; then
            echo -e "${GREEN}✓ Successfully cloned: ${repo_name}${NC}"
        else
            echo -e "${RED}✗ Failed to clone: ${repo_name}${NC}"
            return 1
        fi
    fi
    echo ""
}

# Read repositories from file or use default array
repos_to_clone=()

if [ -f "$REPOS_FILE" ]; then
    echo -e "${BLUE}Reading repositories from: ${REPOS_FILE}${NC}"
    echo ""
    
    # Read repos from file, ignoring empty lines and comments
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and comments
        if [[ -n "$line" ]] && [[ ! "$line" =~ ^[[:space:]]*# ]]; then
            repos_to_clone+=("$line")
        fi
    done < "$REPOS_FILE"
else
    echo -e "${YELLOW}Warning: ${REPOS_FILE} not found${NC}"
    echo -e "${YELLOW}Using default repository list${NC}"
    echo ""
    repos_to_clone=("${REPOS[@]}")
fi

# Check if we have any repositories to clone
if [ ${#repos_to_clone[@]} -eq 0 ]; then
    echo -e "${RED}Error: No repositories configured${NC}"
    echo -e "${YELLOW}Please create a ${REPOS_FILE} file with repository URLs (one per line)${NC}"
    echo -e "${YELLOW}Or edit this script to add repositories to the REPOS array${NC}"
    exit 1
fi

echo -e "${BLUE}Found ${#repos_to_clone[@]} repository(ies) to clone${NC}"
echo ""

# Clone all repositories
success_count=0
fail_count=0

for repo in "${repos_to_clone[@]}"; do
    if clone_repo "$repo"; then
        ((success_count++)) || true
    else
        ((fail_count++)) || true
    fi
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Successful: ${success_count}${NC}"
if [ $fail_count -gt 0 ]; then
    echo -e "${RED}Failed: ${fail_count}${NC}"
fi
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}All repositories processed successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}Some repositories failed to process${NC}"
    exit 1
fi
