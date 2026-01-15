/**
 * RiotPlan Dashboard
 *
 * A web-based dashboard for visualizing and managing RiotPlan plans.
 * Runs on port 8090 by default.
 */

export { createServer, type ServerConfig, type DashboardServer } from "./server.js";
export { generateDashboardHTML, generatePlanDetailHTML } from "./html.js";
export { handleApiRequest, type ApiResponse } from "./api.js";

/** Default port for the dashboard */
export const DEFAULT_PORT = 8090;

/** Version */
export const VERSION = "0.0.1";

