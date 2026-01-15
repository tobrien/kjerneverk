/**
 * Tests for the Dashboard module
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
    createServer,
    generateDashboardHTML,
    generatePlanDetailHTML,
    handleApiRequest,
} from "../src/index.js";
import { createRegistry, registerPlan, type PlanRegistry } from "@riotprompt/riotplan";
import type { IncomingMessage } from "node:http";

describe("Dashboard", () => {
    describe("createServer", () => {
        let testDir: string;

        beforeEach(async () => {
            testDir = join(tmpdir(), `riotplan-dashboard-test-${Date.now()}`);
            await mkdir(testDir, { recursive: true });
        });

        afterEach(async () => {
            try {
                await rm(testDir, { recursive: true });
            } catch {
                // Ignore
            }
        });

        it("should create a server with default config", async () => {
            const server = await createServer();
            expect(server).toBeDefined();
            expect(server.server).toBeDefined();
            expect(server.registry).toBeDefined();
            expect(server.getUrl()).toBe("http://localhost:8090");
        });

        it("should create a server with custom port", async () => {
            const server = await createServer({ port: 9000 });
            expect(server.getUrl()).toBe("http://localhost:9000");
        });

        it("should scan search paths on creation", async () => {
            // Create a test plan
            const planPath = join(testDir, "test-plan");
            await mkdir(join(planPath, "plan"), { recursive: true });
            await writeFile(
                join(planPath, "SUMMARY.md"),
                "# Test Plan\n\nA test plan."
            );
            await writeFile(
                join(planPath, "plan", "01-step.md"),
                "# Step 01: Test\n\n## Objective\n\nTest."
            );

            const server = await createServer({
                searchPaths: [testDir],
            });

            expect(server.registry.plans.size).toBe(1);
        });

        it("should start and stop", async () => {
            const server = await createServer({ port: 19090 }); // Use high port
            await server.start();
            await server.stop();
        });
    });

    describe("generateDashboardHTML", () => {
        let registry: PlanRegistry;

        beforeEach(() => {
            registry = createRegistry();
            registerPlan(registry, {
                code: "test-plan",
                name: "Test Plan",
                path: "/test/path",
                status: "in_progress",
                progress: 50,
                stepCount: 4,
                completedSteps: 2,
                registeredAt: new Date(),
                lastScannedAt: new Date(),
                tags: ["important"],
                description: "A test plan for testing",
            });
        });

        it("should generate valid HTML", () => {
            const html = generateDashboardHTML(registry);
            expect(html).toContain("<!DOCTYPE html>");
            expect(html).toContain("RiotPlan Dashboard");
            expect(html).toContain("Test Plan");
            expect(html).toContain("test-plan");
            expect(html).toContain("50%");
        });

        it("should include statistics", () => {
            const html = generateDashboardHTML(registry);
            expect(html).toContain("Total Plans");
            expect(html).toContain("Average Progress");
        });

        it("should include plan cards", () => {
            const html = generateDashboardHTML(registry);
            expect(html).toContain("plan-card");
            expect(html).toContain("important"); // tag
        });

        it("should handle empty registry", () => {
            const emptyRegistry = createRegistry();
            const html = generateDashboardHTML(emptyRegistry);
            expect(html).toContain("No plans found");
        });
    });

    describe("generatePlanDetailHTML", () => {
        let registry: PlanRegistry;

        beforeEach(() => {
            registry = createRegistry();
        });

        it("should generate plan detail page", () => {
            const plan = {
                code: "test-plan",
                name: "Test Plan",
                path: "/test/path",
                status: "completed" as const,
                progress: 100,
                stepCount: 5,
                completedSteps: 5,
                registeredAt: new Date(),
                lastScannedAt: new Date(),
                description: "A completed test plan",
            };

            const html = generatePlanDetailHTML(plan, registry);
            expect(html).toContain("Test Plan");
            expect(html).toContain("100%");
            expect(html).toContain("5 / 5");
            expect(html).toContain("A completed test plan");
            expect(html).toContain("/test/path");
        });
    });

    describe("handleApiRequest", () => {
        let registry: PlanRegistry;

        beforeEach(() => {
            registry = createRegistry();
            registerPlan(registry, {
                code: "plan-a",
                name: "Plan A",
                path: "/plans/a",
                status: "completed",
                progress: 100,
                stepCount: 3,
                completedSteps: 3,
                registeredAt: new Date(),
                lastScannedAt: new Date(),
            });
            registerPlan(registry, {
                code: "plan-b",
                name: "Plan B",
                path: "/plans/b",
                status: "in_progress",
                progress: 50,
                stepCount: 4,
                completedSteps: 2,
                registeredAt: new Date(),
                lastScannedAt: new Date(),
            });
        });

        function createMockRequest(url: string, method: string = "GET"): IncomingMessage {
            return {
                url,
                method,
                headers: { host: "localhost:8090" },
                on: (event: string, callback: () => void) => {
                    if (event === "end") callback();
                },
            } as unknown as IncomingMessage;
        }

        it("should list plans", async () => {
            const req = createMockRequest("/api/plans");
            const response = await handleApiRequest(req, registry);

            expect(response.status).toBe(200);
            const data = response.data as { plans: unknown[]; total: number };
            expect(data.plans).toHaveLength(2);
            expect(data.total).toBe(2);
        });

        it("should get plan by path", async () => {
            const req = createMockRequest("/api/plans/" + encodeURIComponent("/plans/a"));
            const response = await handleApiRequest(req, registry);

            expect(response.status).toBe(200);
            const data = response.data as { code: string };
            expect(data.code).toBe("plan-a");
        });

        it("should return 404 for unknown plan", async () => {
            const req = createMockRequest("/api/plans/" + encodeURIComponent("/unknown"));
            const response = await handleApiRequest(req, registry);

            expect(response.status).toBe(404);
        });

        it("should get stats", async () => {
            const req = createMockRequest("/api/stats");
            const response = await handleApiRequest(req, registry);

            expect(response.status).toBe(200);
            const data = response.data as { totalPlans: number };
            expect(data.totalPlans).toBe(2);
        });

        it("should search plans", async () => {
            const req = createMockRequest("/api/search?status=completed");
            const response = await handleApiRequest(req, registry);

            expect(response.status).toBe(200);
            const data = response.data as { plans: unknown[]; total: number };
            expect(data.plans).toHaveLength(1);
        });

        it("should return 404 for unknown API path", async () => {
            const req = createMockRequest("/api/unknown");
            const response = await handleApiRequest(req, registry);

            expect(response.status).toBe(404);
        });
    });
});

