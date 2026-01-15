/**
 * Dashboard HTTP Server
 *
 * A simple HTTP server that serves the dashboard UI and API.
 */

import { createServer as createHttpServer, type Server, type IncomingMessage, type ServerResponse } from "node:http";
import { URL } from "node:url";
import {
    createRegistry,
    loadRegistry,
    scanForPlans,
    type PlanRegistry,
} from "@riotprompt/riotplan";
import { handleApiRequest } from "./api.js";
import { generateDashboardHTML, generatePlanDetailHTML, generate404HTML, generateErrorHTML } from "./html.js";

/**
 * Server configuration
 */
export interface ServerConfig {
    /** Port to listen on (default: 8090) */
    port?: number;

    /** Host to bind to (default: localhost) */
    host?: string;

    /** Paths to scan for plans */
    searchPaths?: string[];

    /** Path to registry file (default: ~/.riotplan-registry.json) */
    registryPath?: string;
}

/**
 * Dashboard server instance
 */
export interface DashboardServer {
    /** The HTTP server */
    server: Server;

    /** The plan registry */
    registry: PlanRegistry;

    /** Start the server */
    start(): Promise<void>;

    /** Stop the server */
    stop(): Promise<void>;

    /** Refresh the registry */
    refresh(): Promise<void>;

    /** Get the server URL */
    getUrl(): string;
}

/**
 * Create a dashboard server
 */
export async function createServer(config: ServerConfig = {}): Promise<DashboardServer> {
    const {
        port = 8090,
        host = "localhost",
        searchPaths = [],
        registryPath,
    } = config;

    // Initialize or load registry
    let registry = await loadRegistry(registryPath);
    if (!registry) {
        registry = createRegistry(searchPaths);
    }

    // Scan for plans if search paths provided
    if (searchPaths.length > 0) {
        await scanForPlans(registry, { searchPaths });
    }

    // Create HTTP server
    const server = createHttpServer(async (req, res) => {
        await handleRequest(req, res, registry);
    });

    const dashboardServer: DashboardServer = {
        server,
        registry,

        start: () => {
            return new Promise((resolve, reject) => {
                server.listen(port, host, () => {
                    resolve();
                });
                server.once("error", reject);
            });
        },

        stop: () => {
            return new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        },

        refresh: async () => {
            if (searchPaths.length > 0) {
                await scanForPlans(registry, { searchPaths });
            }
        },

        getUrl: () => `http://${host}:${port}`,
    };

    return dashboardServer;
}

/**
 * Handle an incoming HTTP request
 */
async function handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    registry: PlanRegistry
): Promise<void> {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const path = url.pathname;

    try {
        // API routes
        if (path.startsWith("/api/")) {
            const apiResponse = await handleApiRequest(req, registry);
            res.writeHead(apiResponse.status, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify(apiResponse.data));
            return;
        }

        // CORS preflight
        if (req.method === "OPTIONS") {
            res.writeHead(204, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            });
            res.end();
            return;
        }

        // HTML routes
        if (path === "/" || path === "/index.html") {
            const html = generateDashboardHTML(registry);
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(html);
            return;
        }

        // Plan detail page
        const planMatch = path.match(/^\/plan\/(.+)$/);
        if (planMatch) {
            const planPath = decodeURIComponent(planMatch[1]);
            const plan = registry.plans.get(planPath);
            if (plan) {
                const html = generatePlanDetailHTML(plan, registry);
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(html);
                return;
            }
        }

        // 404
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(generate404HTML());
    } catch (error) {
        console.error("Error handling request:", error);
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(generateErrorHTML(error instanceof Error ? error.message : "Unknown error"));
    }
}

