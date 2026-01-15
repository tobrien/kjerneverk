/**
 * Dashboard API Handlers
 *
 * REST API for accessing plan data from the dashboard.
 */

import type { IncomingMessage } from "node:http";
import { URL } from "node:url";
import {
    type PlanRegistry,
    searchPlans,
    getPlanByPath,
    getRegistryStats,
    refreshPlan,
    refreshAllPlans,
    scanForPlans,
    type SearchOptions,
} from "@riotprompt/riotplan";

/**
 * API response structure
 */
export interface ApiResponse {
    status: number;
    data: unknown;
}

/**
 * Handle an API request
 */
export async function handleApiRequest(
    req: IncomingMessage,
    registry: PlanRegistry
): Promise<ApiResponse> {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const path = url.pathname.replace(/^\/api/, "");
    const method = req.method || "GET";

    // GET /api/plans - List all plans
    if (path === "/plans" && method === "GET") {
        return handleListPlans(url, registry);
    }

    // GET /api/plans/:path - Get a specific plan
    if (path.startsWith("/plans/") && method === "GET") {
        const planPath = decodeURIComponent(path.slice(7));
        return handleGetPlan(planPath, registry);
    }

    // GET /api/stats - Get registry statistics
    if (path === "/stats" && method === "GET") {
        return handleGetStats(registry);
    }

    // POST /api/refresh - Refresh all plans
    if (path === "/refresh" && method === "POST") {
        return handleRefreshAll(registry);
    }

    // POST /api/refresh/:path - Refresh a specific plan
    if (path.startsWith("/refresh/") && method === "POST") {
        const planPath = decodeURIComponent(path.slice(9));
        return handleRefreshPlan(planPath, registry);
    }

    // POST /api/scan - Scan for new plans
    if (path === "/scan" && method === "POST") {
        return handleScan(req, registry);
    }

    // GET /api/search - Search plans
    if (path === "/search" && method === "GET") {
        return handleSearch(url, registry);
    }

    // 404
    return {
        status: 404,
        data: { error: "Not found", path },
    };
}

/**
 * Handle GET /api/plans
 */
function handleListPlans(url: URL, registry: PlanRegistry): ApiResponse {
    const params = url.searchParams;
    const options: SearchOptions = {};

    // Parse query parameters
    if (params.has("status")) {
        const statusParam = params.get("status")!;
        options.status = statusParam.includes(",")
            ? statusParam.split(",") as SearchOptions["status"]
            : statusParam as SearchOptions["status"];
    }

    if (params.has("sortBy")) {
        options.sortBy = params.get("sortBy") as SearchOptions["sortBy"];
    }

    if (params.has("sortDir")) {
        options.sortDir = params.get("sortDir") as SearchOptions["sortDir"];
    }

    if (params.has("limit")) {
        options.limit = parseInt(params.get("limit")!);
    }

    if (params.has("offset")) {
        options.offset = parseInt(params.get("offset")!);
    }

    const result = searchPlans(registry, options);

    return {
        status: 200,
        data: {
            plans: result.plans,
            total: result.total,
        },
    };
}

/**
 * Handle GET /api/plans/:path
 */
function handleGetPlan(planPath: string, registry: PlanRegistry): ApiResponse {
    const plan = getPlanByPath(registry, planPath);

    if (!plan) {
        return {
            status: 404,
            data: { error: "Plan not found", path: planPath },
        };
    }

    return {
        status: 200,
        data: plan,
    };
}

/**
 * Handle GET /api/stats
 */
function handleGetStats(registry: PlanRegistry): ApiResponse {
    const stats = getRegistryStats(registry);

    return {
        status: 200,
        data: stats,
    };
}

/**
 * Handle POST /api/refresh
 */
async function handleRefreshAll(registry: PlanRegistry): Promise<ApiResponse> {
    const result = await refreshAllPlans(registry);

    return {
        status: 200,
        data: {
            updated: result.updated,
            removed: result.removed,
        },
    };
}

/**
 * Handle POST /api/refresh/:path
 */
async function handleRefreshPlan(planPath: string, registry: PlanRegistry): Promise<ApiResponse> {
    const plan = await refreshPlan(registry, planPath);

    if (!plan) {
        return {
            status: 404,
            data: { error: "Plan not found or could not be refreshed", path: planPath },
        };
    }

    return {
        status: 200,
        data: plan,
    };
}

/**
 * Handle POST /api/scan
 */
async function handleScan(req: IncomingMessage, registry: PlanRegistry): Promise<ApiResponse> {
    // Parse body for search paths
    const body = await readBody(req);
    const searchPaths = body?.searchPaths || registry.searchPaths;

    if (!searchPaths || searchPaths.length === 0) {
        return {
            status: 400,
            data: { error: "No search paths provided" },
        };
    }

    const discovered = await scanForPlans(registry, { searchPaths });

    return {
        status: 200,
        data: {
            discovered,
            total: registry.plans.size,
        },
    };
}

/**
 * Handle GET /api/search
 */
function handleSearch(url: URL, registry: PlanRegistry): ApiResponse {
    const params = url.searchParams;
    const options: SearchOptions = {};

    // Parse all search options
    if (params.has("status")) {
        const statusParam = params.get("status")!;
        options.status = statusParam.includes(",")
            ? statusParam.split(",") as SearchOptions["status"]
            : statusParam as SearchOptions["status"];
    }

    if (params.has("codePattern")) {
        options.codePattern = params.get("codePattern")!;
    }

    if (params.has("namePattern")) {
        options.namePattern = params.get("namePattern")!;
    }

    if (params.has("tags")) {
        options.tags = params.get("tags")!.split(",");
    }

    if (params.has("minProgress")) {
        options.minProgress = parseInt(params.get("minProgress")!);
    }

    if (params.has("maxProgress")) {
        options.maxProgress = parseInt(params.get("maxProgress")!);
    }

    if (params.has("sortBy")) {
        options.sortBy = params.get("sortBy") as SearchOptions["sortBy"];
    }

    if (params.has("sortDir")) {
        options.sortDir = params.get("sortDir") as SearchOptions["sortDir"];
    }

    if (params.has("limit")) {
        options.limit = parseInt(params.get("limit")!);
    }

    if (params.has("offset")) {
        options.offset = parseInt(params.get("offset")!);
    }

    const result = searchPlans(registry, options);

    return {
        status: 200,
        data: {
            plans: result.plans,
            total: result.total,
        },
    };
}

/**
 * Read and parse JSON body from request
 */
async function readBody(req: IncomingMessage): Promise<Record<string, unknown> | null> {
    return new Promise((resolve) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : null);
            } catch {
                resolve(null);
            }
        });
        req.on("error", () => {
            resolve(null);
        });
    });
}

