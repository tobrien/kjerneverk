/**
 * Proof of Concept: Plan Directory Resolution
 * 
 * This demonstrates a three-tier configuration approach:
 * 1. RIOTPLAN_PLAN_DIRECTORY environment variable (highest priority, explicit)
 * 2. riotplan.config.json file with planDirectory setting (project-level config)
 * 3. Auto-detect plans/ directory from workspace root (convenience fallback)
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { homedir } from 'node:os';

/**
 * Configuration file name
 */
const CONFIG_FILE_NAME = 'riotplan.config.json';

/**
 * Workspace markers to look for when auto-detecting
 */
const WORKSPACE_MARKERS = [
    '.code-workspace',  // VSCode/Cursor workspace file
    '.git',             // Git repository root
] as const;

/**
 * Cache for plan directory to avoid repeated filesystem operations
 */
let cachedPlanDirectory: string | null = null;

/**
 * Configuration interface
 */
interface RiotPlanConfig {
    planDirectory?: string;
    [key: string]: any;
}

/**
 * Find config file by walking up the directory tree
 */
function findConfigFile(startPath: string): string | null {
    const homeDir = homedir();
    let currentPath = resolve(startPath);
    
    // Don't traverse above home directory or filesystem root
    const stopPath = homeDir.length > 1 ? homeDir : '/';
    
    while (currentPath !== stopPath && currentPath !== '/') {
        const configPath = join(currentPath, CONFIG_FILE_NAME);
        if (existsSync(configPath)) {
            return configPath;
        }
        
        // Move up one directory
        const parentPath = dirname(currentPath);
        if (parentPath === currentPath) {
            // Reached filesystem root
            break;
        }
        currentPath = parentPath;
    }
    
    return null;
}

/**
 * Load and parse config file
 */
function loadConfig(configPath: string): RiotPlanConfig | null {
    try {
        const content = readFileSync(configPath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Failed to load config from ${configPath}:`, error);
        return null;
    }
}

/**
 * Find workspace root by walking up the directory tree
 */
function findWorkspaceRoot(startPath: string): string | null {
    const homeDir = homedir();
    let currentPath = resolve(startPath);
    
    // Don't traverse above home directory or filesystem root
    const stopPath = homeDir.length > 1 ? homeDir : '/';
    
    while (currentPath !== stopPath && currentPath !== '/') {
        // Check each marker in priority order
        for (const marker of WORKSPACE_MARKERS) {
            const markerPath = join(currentPath, marker);
            if (existsSync(markerPath)) {
                return currentPath;
            }
        }
        
        // Move up one directory
        const parentPath = dirname(currentPath);
        if (parentPath === currentPath) {
            // Reached filesystem root
            break;
        }
        currentPath = parentPath;
    }
    
    return null;
}

/**
 * Get plan directory with three-tier configuration
 * 
 * Priority:
 * 1. RIOTPLAN_PLAN_DIRECTORY env var (highest priority, explicit)
 * 2. riotplan.config.json file with planDirectory setting (project-level config)
 * 3. Auto-detect plans/ directory from workspace root (convenience fallback)
 */
export function getPlanDirectory(): string {
    // Tier 1: Check environment variable first (explicit override)
    const envPlanDirectory = process.env.RIOTPLAN_PLAN_DIRECTORY;
    if (envPlanDirectory && existsSync(envPlanDirectory)) {
        return resolve(envPlanDirectory);
    }
    
    // Use cached value if available
    if (cachedPlanDirectory) {
        return cachedPlanDirectory;
    }
    
    // Tier 2: Look for riotplan.config.json
    const configPath = findConfigFile(process.cwd());
    if (configPath) {
        const config = loadConfig(configPath);
        if (config?.planDirectory) {
            // Resolve relative paths from config file location
            const configDir = dirname(configPath);
            const planDir = resolve(configDir, config.planDirectory);
            if (existsSync(planDir)) {
                cachedPlanDirectory = planDir;
                return planDir;
            }
        }
    }
    
    // Tier 3: Auto-detect from workspace root
    const workspaceRoot = findWorkspaceRoot(process.cwd());
    if (workspaceRoot) {
        const plansDir = join(workspaceRoot, 'plans');
        if (existsSync(plansDir)) {
            cachedPlanDirectory = plansDir;
            return plansDir;
        }
    }
    
    // Final fallback: plans/ in current directory
    return join(process.cwd(), 'plans');
}

/**
 * Clear the cached plan directory (useful for testing)
 */
export function clearPlanDirectoryCache(): void {
    cachedPlanDirectory = null;
}

// Example usage:
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('=== RiotPlan Directory Resolution ===\n');
    console.log('Current working directory:', process.cwd());
    console.log('');
    
    console.log('Configuration sources (in priority order):');
    console.log('  1. RIOTPLAN_PLAN_DIRECTORY env var:', process.env.RIOTPLAN_PLAN_DIRECTORY || '(not set)');
    
    const configPath = findConfigFile(process.cwd());
    if (configPath) {
        console.log('  2. Config file found:', configPath);
        const config = loadConfig(configPath);
        console.log('     planDirectory:', config?.planDirectory || '(not set)');
    } else {
        console.log('  2. Config file: (not found)');
    }
    
    const workspaceRoot = findWorkspaceRoot(process.cwd());
    console.log('  3. Workspace root:', workspaceRoot || '(not detected)');
    if (workspaceRoot) {
        console.log('     plans/ exists:', existsSync(join(workspaceRoot, 'plans')));
    }
    
    console.log('');
    console.log('Resolved plan directory:', getPlanDirectory());
}
