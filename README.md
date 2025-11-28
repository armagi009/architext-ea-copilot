# Architext — EA Copilot

[cloudflarebutton]

Architext is an AI-native Enterprise Architecture (EA) Copilot that transforms McKinsey-grade EA consulting workflows into an intelligent, edge-deployed assistant. Built on Cloudflare Workers and Durable Objects, it guides users through the four core EA lifecycle phases: **Discover & Align**, **Design & Simulate**, **Plan & Orchestrate**, and **Operate & Learn**. 

Architext emphasizes explainability, traceability, and human-in-the-loop (HITL) governance, with every recommendation backed by evidence links, confidence scores, and provenance tracking. It supports multi-modal ingestion (documents, diagrams, telemetry), generates canonical models (business capabilities, app inventories, infra topologies), simulates architectural options, orchestrates roadmaps with IaC scaffolding, and enables continuous learning from production incidents.

## Key Features

- **Discover & Align**: AI-powered intake via chat and drag-drop uploads, with multi-modal ingestion agents extracting org charts, contracts, and dependencies. Outputs include one-page engagement briefs, stakeholder RACI drafts, and confidence-scored "unknowns" lists.
- **Design & Simulate**: Multi-option architecture generator with what-if simulations for cost, latency, compliance, and risk. Includes decision matrices, policy-as-code scanning, and ADR (Architecture Decision Record) drafts.
- **Plan & Orchestrate**: Roadmap optimizer for phased transformations, auto-generated project charters, epics/stories, and scaffolded IaC/CI templates. Supports GitOps integration and continuous risk monitoring.
- **Operate & Learn**: Incident console with runbook assistance, RCA synthesis, drift detection, and closed-loop improvements. Builds a searchable EA knowledge base from post-mortems and telemetry.
- **Cross-Cutting Capabilities**: Persistent agents for source systems (Confluence, Jira, Cloud APIs), simulations as a service, automated ADRs, composable outputs (boards, PRs, runbooks), and security/privacy by design.
- **UI Excellence**: Visually stunning, responsive interface with shadcn/ui components, interactive canvas (React Flow for graphs), simulation knobs, and evidence panels. Mobile-first design with smooth animations via Framer Motion.

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v3, shadcn/ui (Radix primitives), Framer Motion (animations), Recharts (charts), React Flow (graph visualization), @tanstack/react-query (data fetching), Zustand (state management), Lucide React (icons), Sonner (toasts).
- **Backend**: Cloudflare Workers, Durable Objects (session persistence), Hono (routing), OpenAI SDK (LLM integration), Model Context Protocol (MCP) for tool execution.
- **AI & Tools**: Cloudflare AI Gateway, OpenAI-compatible models (Gemini series), MCP servers for D1/R2/Workers integration, SerpAPI (web search), custom tools (weather, web fetch).
- **Utilities**: clsx/tailwind-merge (styling), date-fns (dates), react-dropzone (uploads), react-hotkeys-hook (shortcuts), Zod (validation).
- **Build & Deploy**: Bun (package manager), Wrangler (Cloudflare CLI), ESLint/Prettier (linting), PostCSS/Autoprefixer (CSS).

## Quick Start

### Prerequisites

- Bun 1.0+ installed (https://bun.sh/)
- Cloudflare account with Workers enabled
- API keys: Cloudflare AI Gateway (CF_AI_BASE_URL, CF_AI_API_KEY), optional SerpAPI key for web search

### Installation

1. Clone the repository and navigate to the project directory:
   ```
   git clone <repository-url>
   cd architext-ea-copilot
   ```

2. Install dependencies using Bun:
   ```
   bun install
   ```

3. Configure environment variables in `wrangler.jsonc` (or `.dev.vars` for local dev):
   - Set `CF_AI_BASE_URL` to your Cloudflare AI Gateway URL (e.g., `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai`).
   - Set `CF_AI_API_KEY` to your API token.
   - Optional: Add `SERPAPI_KEY` for enhanced web search tools.

4. Generate TypeScript types from Wrangler bindings:
   ```
   bun run cf-typegen
   ```

## Usage

### Local Development

Start the development server:
```
bun run dev
```

The app runs at `http://localhost:3000`. It includes a chat-based interface for testing AI interactions via the `/api/chat/:sessionId/*` endpoints. Sessions are persisted using Durable Objects.

Key endpoints (auto-wired):
- `/api/chat/:sessionId/chat` (POST): Send messages to the AI agent (supports streaming).
- `/api/chat/:sessionId/messages` (GET): Retrieve conversation history.
- `/api/sessions` (GET/POST/DELETE): Manage chat sessions.
- `/api/sessions/stats` (GET): Get session count.

Example: Test the intake workflow by uploading artifacts and prompting "Intake: SAP renewal in India, contract ends June 30...".

### AI Limitations

This project integrates with Cloudflare AI Gateway, which has rate limits across all user applications. Monitor usage to avoid throttling. For production, implement exponential backoff and caching.

## Development Instructions

- **Frontend Customization**: Edit `src/pages/HomePage.tsx` to override the entry point. Use shadcn/ui components from `@/components/ui/*`. Ensure all pages wrap content in the root layout: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` with inner `py-8 md:py-10 lg:py-12`.
- **State Management**: Use Zustand with primitive selectors (e.g., `useStore(s => s.value)`) to avoid re-render loops. Follow the provided guidelines in the codebase.
- **AI Extensions**: Extend the `ChatAgent` class in `worker/agent.ts` for custom tools. Add MCP servers in `worker/mcp-client.ts`. Update tool definitions in `worker/tools.ts`.
- **UI Polish**: Adhere to visual standards: responsive grids, hover effects, micro-interactions (Framer Motion), and accessibility (contrast ratios, ARIA labels).
- **Linting & TypeScript**: Run `bun run lint` for checks. Strict mode is enabled; fix errors before committing.
- **Testing Locally**: Use `wrangler dev` for full stack simulation (requires Wrangler CLI: `bun add -D wrangler` if needed).

Phased Development (from Blueprint):
1. **Phase 1**: Visual foundation & intake (chat, uploads, mocked graph).
2. **Phase 2**: Graph storage & simulations (integrate MCP tools).
3. **Phase 3**: Orchestration & monitoring (IaC scaffolding, telemetry).

## Deployment

Deploy to Cloudflare Workers for edge execution:

1. Ensure `wrangler.jsonc` is configured with your account ID and bindings.
2. Build the assets:
   ```
   bun run build
   ```
3. Deploy:
   ```
   bun run deploy
   ```
   Or use Wrangler directly: `npx wrangler deploy`.

The app will be available at your Worker URL (e.g., `https://architext-ea-copilot.your-subdomain.workers.dev`). Assets are served via single-page application mode.

For custom domains or advanced configs, edit `wrangler.jsonc` (migrations for Durable Objects are pre-configured).

[cloudflarebutton]

## Contributing

Contributions are welcome! Please:
- Fork the repo and create a feature branch.
- Ensure code follows the UI non-negotiables and infinite loop prevention rules in the codebase.
- Add tests for new features (if applicable).
- Submit a PR with a clear description.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues, open a GitHub issue. For Cloudflare-specific help, refer to the [Workers documentation](https://developers.cloudflare.com/workers/). Note the AI request limits mentioned in Usage.