#!/usr/bin/env node
/**
 * RiotPlan Dashboard CLI
 *
 * Start the dashboard web server.
 */

import { createServer } from "./server.js";
import { DEFAULT_PORT } from "./index.js";

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    // Parse arguments
    let port = DEFAULT_PORT;
    let host = "localhost";
    const searchPaths: string[] = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === "--port" || arg === "-p") {
            port = parseInt(args[++i]) || DEFAULT_PORT;
        } else if (arg === "--host" || arg === "-h") {
            host = args[++i] || "localhost";
        } else if (arg === "--help") {
            printHelp();
            process.exit(0);
        } else if (!arg.startsWith("-")) {
            // Assume it's a search path
            searchPaths.push(arg);
        }
    }

    // Use current directory if no search paths provided
    if (searchPaths.length === 0) {
        searchPaths.push(process.cwd());
    }

    console.log("🚀 Starting RiotPlan Dashboard...");
    console.log(`📂 Search paths: ${searchPaths.join(", ")}`);

    try {
        const server = await createServer({
            port,
            host,
            searchPaths,
        });

        await server.start();

        console.log(`✅ Dashboard running at ${server.getUrl()}`);
        console.log(`📊 ${server.registry.plans.size} plan(s) discovered`);
        console.log("");
        console.log("Press Ctrl+C to stop");

        // Handle shutdown
        process.on("SIGINT", async () => {
            console.log("\n👋 Shutting down...");
            await server.stop();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            await server.stop();
            process.exit(0);
        });
    } catch (error) {
        console.error("❌ Failed to start dashboard:", error);
        process.exit(1);
    }
}

function printHelp(): void {
    console.log(`
RiotPlan Dashboard

Usage: riotplan-dashboard [options] [search-paths...]

Options:
  -p, --port <port>    Port to listen on (default: ${DEFAULT_PORT})
  -h, --host <host>    Host to bind to (default: localhost)
  --help               Show this help message

Examples:
  riotplan-dashboard                         # Scan current directory
  riotplan-dashboard ./plans                 # Scan ./plans directory
  riotplan-dashboard -p 3000 ./plans         # Use port 3000
  riotplan-dashboard ./plans ../other-plans  # Scan multiple directories
`);
}

main().catch(console.error);

