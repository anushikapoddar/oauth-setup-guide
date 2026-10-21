# OAuth Ready

OAuth Ready is a source-backed launch guide library for developers building AI agents and integrations. It helps answer the practical questions that usually block an OAuth integration:

- Which provider app should I create?
- What scopes and redirect URLs do I need?
- Can I test immediately, or do I need provider verification?
- How much hands-on work and waiting should I expect?
- What can an agent prepare, and what must a developer, customer admin, or provider complete?

The project demonstrates three curated guides—GitHub, Google Calendar, and Slack—and a live research flow for an unfamiliar provider.

## What the experience does

### Guide library

The home page contains searchable, scenario-specific guides. Each guide explains:

- difficulty and reason
- hands-on effort and external wait
- prerequisites and owners
- permission scopes in plain language
- setup stages and expected results
- review or verification requirements
- common blockers and recovery paths
- agent, developer, customer-admin, and provider handoffs
- official sources and known limitations

Stable curated guide URLs are available under `/guides/[id]`.

### Unfamiliar-app research

The research form accepts an app name or public website. `POST /api/research` validates the input, resolves the provider, researches official OAuth documentation, checks registration/scopes/testing/publication/review/support, checks Composio managed OAuth coverage, and returns a strict structured result.

Successful results are saved locally and receive a shareable URL under `/research/[id]`. The result includes setup, scopes, test and launch, review, support, sources, uncertainties, and one next action.

## Architecture

```text
src/app/page.tsx                  Landing page and guide library
src/app/guides/[id]/page.tsx      Curated guide pages
src/app/research/[id]/page.tsx    Saved generated research pages
src/app/api/research/route.ts     Research API endpoint
src/components/                   Search and research form UI
src/lib/guides.ts                 Curated guide data
src/lib/research-contract.ts      Strict research output schema
src/lib/research-store.ts         Local JSON persistence for generated results
src/lib/guide-validator.ts        Build-time curated guide validation
schema/guide.v1.schema.json       Canonical guide contract
docs/phase-6-validation.md       Provider source validation record
specifics.md                      Living architecture and decision record
todo.md                           Phase checklist
```

The research endpoint supports two server-side adapters:

1. **Gemini** uses the Gemini `generateContent` API with Google Search grounding and structured JSON output.
2. **OpenAI** uses the Responses API with the built-in web search tool and strict JSON Schema output.

Gemini is selected when `GEMINI_API_KEY` is present. Set `RESEARCH_PROVIDER=openai` to force OpenAI.

## Requirements

- Node.js 22.13 or newer
- npm
- An API key for live unfamiliar-app research

## Local setup

```bash
git clone https://github.com/debuggingakshat/OAuth-App.git
cd OAuth-App
npm install
```

Create `.env.local` in the project root. Keep this file private; it is ignored by Git.

### Gemini

```env
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3-flash-preview
```

The research flow uses Google Search grounding. Google may require billing for Search grounding even when the model itself appears in the AI Studio rate-limit page.

### OpenAI

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
RESEARCH_PROVIDER=openai
```

OpenAI API billing is separate from ChatGPT billing.

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the “Research another app” section and enter an unfamiliar provider such as `Linear` or `Notion`.

## Development commands

```bash
npm run dev        # Start the local development server
npm run typecheck  # Run TypeScript checks
npm run build      # Build and validate all routes
npm run start      # Start the production build locally
```

## Evidence and safety decisions

- Provider claims are requested from official documentation first.
- Search snippets and unsupported third-party claims are not treated as evidence.
- Source URLs must be HTTPS URLs; invalid structured output is rejected.
- Findings are requested as `Confirmed`, `Estimate`, or `Unknown`.
- The agent never claims that a provider registration or approval was completed.
- API keys are accepted only by the server and are never sent from the browser.
- Inputs are capped at 160 characters, requests time out after 75 seconds, and duplicate requests are throttled briefly.

## Validation

The curated GitHub, Google Calendar, and Slack guides were checked against current official registration, scope, distribution, and review pages. The validation record is in [`docs/phase-6-validation.md`](docs/phase-6-validation.md).

The checks confirmed the main claims and clarified Slack’s requirement for at least 10 active workspaces before Marketplace submission. No provider dashboard or real OAuth consent flow was completed because the project does not contain provider credentials.

## Current limitations

- Generated research is persisted to ignored local `.data/research` JSON files. Production deployment should use shared durable storage.
- Live Gemini research depends on Google Search grounding access and project quota/billing.
- The curated guides are researched drafts; hands-on provider setup has not been completed.
- There is no authentication, multi-user database, background job queue, or deployment configuration yet.
- The generated guide cannot promise provider approval or a fixed review timeline.

## Project documentation

- [`specifics.md`](specifics.md): architecture, decisions, research record, phase outcomes, and limitations
- [`todo.md`](todo.md): implementation checklist by phase
- [`docs/guide-contract.md`](docs/guide-contract.md): guide data contract
- [`docs/phase-6-validation.md`](docs/phase-6-validation.md): official-source validation record

## License

This take-home project does not currently declare a license.
