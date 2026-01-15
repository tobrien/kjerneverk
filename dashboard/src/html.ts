/**
 * Dashboard HTML Templates
 *
 * Generates HTML pages for the dashboard UI.
 */

import {
    type PlanRegistry,
    type RegisteredPlan,
    getRegistryStats,
    searchPlans,
} from "@riotprompt/riotplan";

/**
 * Status emoji mapping
 */
const STATUS_EMOJI: Record<string, string> = {
    pending: "⬜",
    in_progress: "🔄",
    completed: "✅",
    failed: "❌",
    blocked: "⏸️",
    skipped: "⏭️",
};

/**
 * Status color classes
 */
const STATUS_COLORS: Record<string, string> = {
    pending: "#6b7280",
    in_progress: "#3b82f6",
    completed: "#10b981",
    failed: "#ef4444",
    blocked: "#f59e0b",
    skipped: "#8b5cf6",
};

/**
 * Generate the main dashboard HTML page
 */
export function generateDashboardHTML(registry: PlanRegistry): string {
    const stats = getRegistryStats(registry);
    const { plans } = searchPlans(registry, { sortBy: "name", sortDir: "asc" });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RiotPlan Dashboard</title>
    <style>
        ${getStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🗂️ RiotPlan Dashboard</h1>
            <p class="subtitle">Manage and visualize your plans</p>
        </header>

        <section class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.totalPlans}</div>
                <div class="stat-label">Total Plans</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.averageProgress}%</div>
                <div class="stat-label">Average Progress</div>
            </div>
            <div class="stat-card status-completed">
                <div class="stat-value">${stats.byStatus.completed}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card status-in-progress">
                <div class="stat-value">${stats.byStatus.in_progress}</div>
                <div class="stat-label">In Progress</div>
            </div>
            <div class="stat-card status-pending">
                <div class="stat-value">${stats.byStatus.pending}</div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card status-blocked">
                <div class="stat-value">${stats.byStatus.blocked}</div>
                <div class="stat-label">Blocked</div>
            </div>
        </section>

        <section class="toolbar">
            <input type="text" id="search" placeholder="Search plans..." class="search-input">
            <select id="status-filter" class="filter-select">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="blocked">Blocked</option>
            </select>
            <button onclick="refreshAll()" class="btn btn-secondary">🔄 Refresh</button>
        </section>

        <section class="plans-list">
            <h2>Plans</h2>
            ${plans.length === 0 ? '<p class="empty-state">No plans found. Add search paths to discover plans.</p>' : ''}
            <div class="plan-grid">
                ${plans.map(plan => generatePlanCard(plan)).join('\n')}
            </div>
        </section>

        <footer>
            <p>RiotPlan Dashboard v0.0.1 • ${stats.searchPathCount} search path(s) configured</p>
        </footer>
    </div>

    <script>
        ${getScript()}
    </script>
</body>
</html>`;
}

/**
 * Generate a plan card HTML
 */
function generatePlanCard(plan: RegisteredPlan): string {
    const statusEmoji = STATUS_EMOJI[plan.status] || "❓";
    const statusColor = STATUS_COLORS[plan.status] || "#6b7280";
    const encodedPath = encodeURIComponent(plan.path);

    return `
        <div class="plan-card" data-status="${plan.status}" data-code="${plan.code}" data-name="${plan.name.toLowerCase()}">
            <div class="plan-header">
                <span class="status-indicator" style="color: ${statusColor}">${statusEmoji}</span>
                <h3><a href="/plan/${encodedPath}">${escapeHtml(plan.name)}</a></h3>
            </div>
            <div class="plan-code">${escapeHtml(plan.code)}</div>
            <div class="plan-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${plan.progress}%; background-color: ${statusColor}"></div>
                </div>
                <span class="progress-text">${plan.progress}%</span>
            </div>
            <div class="plan-steps">${plan.completedSteps}/${plan.stepCount} steps</div>
            ${plan.description ? `<p class="plan-description">${escapeHtml(plan.description.slice(0, 100))}${plan.description.length > 100 ? '...' : ''}</p>` : ''}
            ${plan.tags && plan.tags.length > 0 ? `<div class="plan-tags">${plan.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        </div>
    `;
}

/**
 * Generate plan detail page HTML
 */
export function generatePlanDetailHTML(plan: RegisteredPlan, _registry: PlanRegistry): string {
    const statusEmoji = STATUS_EMOJI[plan.status] || "❓";
    const statusColor = STATUS_COLORS[plan.status] || "#6b7280";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(plan.name)} - RiotPlan Dashboard</title>
    <style>
        ${getStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <a href="/" class="back-link">← Back to Dashboard</a>
            <h1><span style="color: ${statusColor}">${statusEmoji}</span> ${escapeHtml(plan.name)}</h1>
            <p class="subtitle">${escapeHtml(plan.code)}</p>
        </header>

        <section class="plan-detail">
            <div class="detail-grid">
                <div class="detail-card">
                    <h3>Status</h3>
                    <p class="detail-value" style="color: ${statusColor}">${plan.status.replace('_', ' ')}</p>
                </div>
                <div class="detail-card">
                    <h3>Progress</h3>
                    <div class="progress-bar large">
                        <div class="progress-fill" style="width: ${plan.progress}%; background-color: ${statusColor}"></div>
                    </div>
                    <p class="detail-value">${plan.progress}%</p>
                </div>
                <div class="detail-card">
                    <h3>Steps</h3>
                    <p class="detail-value">${plan.completedSteps} / ${plan.stepCount}</p>
                </div>
                <div class="detail-card">
                    <h3>Registered</h3>
                    <p class="detail-value">${formatDate(plan.registeredAt)}</p>
                </div>
            </div>

            ${plan.description ? `
            <div class="description-section">
                <h3>Description</h3>
                <p>${escapeHtml(plan.description)}</p>
            </div>
            ` : ''}

            ${plan.tags && plan.tags.length > 0 ? `
            <div class="tags-section">
                <h3>Tags</h3>
                <div class="plan-tags">${plan.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
            </div>
            ` : ''}

            <div class="path-section">
                <h3>Path</h3>
                <code>${escapeHtml(plan.path)}</code>
            </div>

            <div class="actions">
                <button onclick="refreshPlan('${encodeURIComponent(plan.path)}')" class="btn btn-primary">🔄 Refresh</button>
            </div>
        </section>

        <footer>
            <p>Last scanned: ${formatDate(plan.lastScannedAt)}</p>
        </footer>
    </div>

    <script>
        async function refreshPlan(path) {
            try {
                const response = await fetch('/api/refresh/' + path, { method: 'POST' });
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Failed to refresh plan');
                }
            } catch (error) {
                alert('Error refreshing plan: ' + error.message);
            }
        }
    </script>
</body>
</html>`;
}

/**
 * Generate 404 page HTML
 */
export function generate404HTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Not Found - RiotPlan Dashboard</title>
    <style>
        ${getStyles()}
    </style>
</head>
<body>
    <div class="container error-page">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/" class="btn btn-primary">← Back to Dashboard</a>
    </div>
</body>
</html>`;
}

/**
 * Generate error page HTML
 */
export function generateErrorHTML(message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - RiotPlan Dashboard</title>
    <style>
        ${getStyles()}
    </style>
</head>
<body>
    <div class="container error-page">
        <h1>Error</h1>
        <p>${escapeHtml(message)}</p>
        <a href="/" class="btn btn-primary">← Back to Dashboard</a>
    </div>
</body>
</html>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Format a date for display
 */
function formatDate(date: Date): string {
    return new Date(date).toLocaleString();
}

/**
 * Get CSS styles
 */
function getStyles(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #e4e4e7;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        header {
            text-align: center;
            margin-bottom: 3rem;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(90deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            color: #9ca3af;
            font-size: 1.1rem;
        }

        .back-link {
            display: inline-block;
            color: #60a5fa;
            text-decoration: none;
            margin-bottom: 1rem;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
        }

        .stat-label {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }

        .status-completed .stat-value { color: #10b981; }
        .status-in-progress .stat-value { color: #3b82f6; }
        .status-pending .stat-value { color: #6b7280; }
        .status-blocked .stat-value { color: #f59e0b; }

        .toolbar {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .search-input, .filter-select {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-size: 1rem;
        }

        .search-input {
            flex: 1;
            min-width: 200px;
        }

        .search-input::placeholder {
            color: #9ca3af;
        }

        .filter-select {
            min-width: 150px;
        }

        .filter-select option {
            background: #1a1a2e;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            color: white;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .plans-list h2 {
            margin-bottom: 1.5rem;
            color: #fff;
        }

        .plan-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }

        .plan-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s;
        }

        .plan-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .plan-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
        }

        .status-indicator {
            font-size: 1.5rem;
        }

        .plan-header h3 {
            font-size: 1.1rem;
            font-weight: 600;
        }

        .plan-header a {
            color: #fff;
            text-decoration: none;
        }

        .plan-header a:hover {
            color: #60a5fa;
        }

        .plan-code {
            color: #9ca3af;
            font-size: 0.9rem;
            font-family: 'SF Mono', 'Consolas', monospace;
            margin-bottom: 1rem;
        }

        .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            flex: 1;
        }

        .progress-bar.large {
            height: 12px;
        }

        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s;
        }

        .plan-progress {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
        }

        .progress-text {
            font-size: 0.9rem;
            color: #9ca3af;
            min-width: 3rem;
            text-align: right;
        }

        .plan-steps {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
        }

        .plan-description {
            color: #9ca3af;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 0.75rem;
        }

        .plan-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .tag {
            background: rgba(139, 92, 246, 0.2);
            color: #a78bfa;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.8rem;
        }

        .empty-state {
            text-align: center;
            color: #9ca3af;
            padding: 3rem;
        }

        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .detail-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-card h3 {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .detail-value {
            font-size: 1.5rem;
            font-weight: 600;
            text-transform: capitalize;
        }

        .description-section, .tags-section, .path-section, .actions {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 1.5rem;
        }

        .description-section h3, .tags-section h3, .path-section h3 {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .path-section code {
            display: block;
            background: rgba(0, 0, 0, 0.2);
            padding: 0.75rem;
            border-radius: 6px;
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        .error-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            text-align: center;
        }

        .error-page h1 {
            font-size: 6rem;
            margin-bottom: 1rem;
        }

        .error-page p {
            font-size: 1.5rem;
            color: #9ca3af;
            margin-bottom: 2rem;
        }

        footer {
            text-align: center;
            color: #6b7280;
            padding: 2rem 0;
            margin-top: 2rem;
        }
    `;
}

/**
 * Get JavaScript code
 */
function getScript(): string {
    return `
        const searchInput = document.getElementById('search');
        const statusFilter = document.getElementById('status-filter');
        const planCards = document.querySelectorAll('.plan-card');

        function filterPlans() {
            const searchTerm = searchInput.value.toLowerCase();
            const statusValue = statusFilter.value;

            planCards.forEach(card => {
                const code = card.dataset.code || '';
                const name = card.dataset.name || '';
                const status = card.dataset.status || '';

                const matchesSearch = code.includes(searchTerm) || name.includes(searchTerm);
                const matchesStatus = !statusValue || status === statusValue;

                card.style.display = matchesSearch && matchesStatus ? 'block' : 'none';
            });
        }

        searchInput?.addEventListener('input', filterPlans);
        statusFilter?.addEventListener('change', filterPlans);

        async function refreshAll() {
            try {
                const response = await fetch('/api/refresh', { method: 'POST' });
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Failed to refresh plans');
                }
            } catch (error) {
                alert('Error refreshing plans: ' + error.message);
            }
        }
    `;
}

