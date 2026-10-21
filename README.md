# OAuth Ready — Launch Guide Library & Live Research Agent

> **Product Manager Assignment for Composio**  
> **Live Application:** [https://oauth.anushika.space](https://oauth.anushika.space)  
> **Repository:** [https://github.com/anushikapoddar/oauth-setup-guide](https://github.com/anushikapoddar/oauth-setup-guide)  
> **Author:** Anushika Poddar  

OAuth Ready is a source-backed launch intelligence application built for developers and agent builders integrating 3rd-party services into AI agents. It eliminates the guesswork, scattered documentation, and surprise review delays that routinely block agent integrations.

---

## 1. Executive Summary & Problem Understanding

When a developer builds a multi-user AI agent (e.g., an automated scheduling assistant, a GitHub issue triage agent, or a Slack workflow agent), their users must connect their own accounts. To launch this, the developer typically must register an OAuth application with the upstream provider and navigate complex verification policies.

### The Developer Problem
Today, developers face four core blindspots:
1. **Managed Auth vs. Custom App Confusion**: Developers often don't know whether they can use **Composio Managed Auth** (launching in minutes without custom credentials) or if their scenario demands a custom provider registration (e.g., enterprise branding, restricted scopes, or unmanaged toolkits).
2. **Effort vs. External Waiting**: A form that takes 15 minutes to fill out might require 2 to 3 weeks of manual provider verification before external users can connect.
3. **Hidden Traps & Blockers**: Subtle requirements like Google's Sensitive Scope YouTube demo video walkthrough, Slack's 10-active-workspace requirement before Marketplace submission, or strict HTTPS redirect URI matching.
4. **Agent vs. Human Boundary**: What can an AI agent prepare or scaffold vs. where must a human take over (paying developer fees, logging into consoles, granting workspace admin approvals).

OAuth Ready solves this by providing:
- **A Searchable Curated Library** covering 6 contrasting real-world archetypes (GitHub, Google Calendar, Slack, Discord, Linear, Notion).
- **A Real-Time Investigation Agent** that inspects unfamiliar apps (e.g., Figma, Asana, Jira) live and generates a complete, shareable 9-section launch plan.

---

## 2. Core PM Design Framework

### The Three-Actor Model
```text
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│     Provider App      │       │ Developer Integration │       │  End-User Connection  │
│ (Client ID, Secret,   │  ───▶ │  (Agent orchestration,│  ───▶ │   (OAuth consent for  │
│  Redirect URI, Scopes)│       │   API tool execution) │       │   individual account) │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```
1. **Provider OAuth App**: The registration with the 3rd-party platform (e.g., Google Cloud, Slack API) defining credentials, allowed callbacks, and requested scopes.
2. **Developer's Integration**: The agent backend that uses these credentials to initiate OAuth flows and execute API tools.
3. **End-User Connection**: The permission grant given by each user authorizing the agent to access their specific data. App approval is a prerequisite to user connection.

### The Unified 9-Section Launch Plan Contract
Every guide in the system (both curated and live-generated) follows the exact same 9-section structure:

1. **At-a-Glance Readiness**: Difficulty rating (`Low`, `Moderate`, `High`), Hands-on effort, External wait time, Biggest blocker, and prominent Next Action.
2. **Scenario Covered**: Target audience, registration path, and developer assumptions.
3. **Choose Managed or Custom**: When to use Composio Managed Auth vs. when to register a custom app.
4. **Before You Start (Prerequisites)**: Checklist with clear owner badges (*Developer*, *Workspace Admin*, *Security Team*).
5. **Permissions in Plain Language**: Scope name, plain-English explanation, necessity rationale, and Sensitivity badge (*Standard*, *Sensitive*, *Restricted*).
6. **Your Setup Path**: Numbered stages with specific actions, expected results, and direct links to provider consoles.
7. **Review & Waiting**: Provider review conditions, decision owner, expected wait, and evidence checklist.
8. **When You Get Blocked**: Interactive accordions mapping Symptoms ➔ Likely Causes ➔ Recovery Steps.
9. **Who Does What (Handoffs)**: Clear division of labor between AI Agent, Developer, and Provider.

---

## 3. Curated Archetypes & Real-World Validation

| Provider | Archetype / Setup Challenge | Difficulty | Hands-on Effort | External Wait | Key Nuance / Blocker |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GitHub** | *Developer-friendly & Self-service* | **Moderate** | 10–20 mins | Instant / None | Recommends GitHub Apps over OAuth Apps for fine-grained repo permissions; organization approval is conditional. |
| **Google Calendar** | *Sensitive Scope & Audit Gatekeeper* | **High** | 1–2 hours | 3–5 business days | Event access (`calendar.events`) is classified as Sensitive; requires privacy policy URL, domain verification, and YouTube demo video. |
| **Slack** | *Enterprise & Distribution Threshold* | **High** | 1–2 hours | 2–3 weeks | Unlisted distribution is fast, but Slack Marketplace listing requires the app to be installed on **10 or more active workspaces** before submission. |
| **Discord** | *Bot-Scoped & Self-service with Scale Gate* | **Low** | 10–20 mins | Instant (verification at 100+ servers) | No review needed for small bots; at 100+ servers Discord requires verification with privileged intent justification. |
| **Linear** | *Simple Self-service, Admin-Gated Registration* | **Low** | 15–30 mins | Instant / Self-service | Granular scopes (`read`, `write`, `issues:create`); requires Linear Workspace Admin privileges to register OAuth applications. |
| **Notion** | *Page-Picker Permission Model* | **Moderate** | 20–40 mins | Instant for self-service | No traditional string scopes — users select specific pages and databases to share via a page picker during authorization. |

---

## 4. Live Unfamiliar-App Research Agent Architecture

When a developer inputs an unfamiliar app (by name or website):
1. **Input Validation & Disambiguation**: Bounded to 160 characters. Ambiguous queries (e.g. typing "Google") prompt the developer to choose the specific service (Google Calendar, Drive, etc.).
2. **Multi-Provider AI Adapters**:
   - **Anthropic Claude** (via Messages API): Evaluates OAuth endpoints, scope definitions, and provider requirements into structured JSON.
   - **Google Gemini** (via `generateContent` with Google Search grounding).
   - **OpenAI** (via Responses API with web search tool).
3. **Strict Source & Evidence Rules**: Every claim is classified as `Confirmed:`, `Estimate:`, or `Unknown:`. Non-HTTPS source URLs are rejected.
4. **Local Persistence & Shareable URLs**: Successful guides are persisted locally and given durable shareable URLs under `/research/[id]`.

---

## 5. Local Setup & Running Instructions

### Prerequisites
- Node.js `v22.13.0` or higher
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/anushikapoddar/oauth-setup-guide.git
cd oauth-setup-guide

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env.local` file in the project root (this file is gitignored and will never be committed):

```env
# Choose your preferred research provider: anthropic, gemini, or openai
RESEARCH_PROVIDER=anthropic

# Anthropic Configuration (recommended)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-haiku-4-5-20251001

# Or Google Gemini Configuration
# GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-3-flash-preview

# Or OpenAI Configuration
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-4o-mini
```

### Running Locally
```bash
# Start the Next.js development server
npm run dev

# Open in your browser:
# http://localhost:3000
```

### Build & Verification Commands
```bash
npm run typecheck    # Run TypeScript checks (0 errors)
npm run build        # Compile production bundle and validate all static & dynamic routes
```

---

## 6. Product Decisions, Limitations & Evidence Boundary

### Key Product Decisions
- **Honest Evidence Boundaries**: The application never fakes a completed registration or promises an approval timeline that isn't published by the provider. Unanswered questions are transparently listed under *"What remains uncertain"*.
- **Agent vs. Human Division of Labor**: An agent should prepare and validate everything it can (scope strings, redirect URL formats, parameter construction), but clearly tell the developer where human credentials, billing, and identity verification are required.
- **Durable Shareability**: Every guide has a dedicated URL with a one-click "Copy link" button, enabling developers to share launch plans with teammates in Slack or Notion.

### Limitations & Next Steps (Toward 100 Guides)
- **Persistence**: For this take-home slice, generated guides are saved to local `.data/research` JSON files. Production deployment will migrate to a shared PostgreSQL/Supabase database.
- **Provider Account Access**: In accordance with the take-home budget and constraints, no paid accounts, provider credentials, or completed manual reviews were executed.
- **Continuous Freshness**: As providers update their developer consoles and pricing tiers, adding a scheduled cron job to re-verify official source links will ensure the 100-guide library stays fresh.

---

## 7. Submission Checklist & Artifacts

- [x] **Live Application**: Deployed on Vercel with custom domain at [https://oauth.anushika.space](https://oauth.anushika.space) (fallback: [https://oauth-setup-guide.vercel.app](https://oauth-setup-guide.vercel.app)).
- [x] **Local Execution**: Runs cleanly via `npm run dev` at `http://localhost:3000`.
- [x] **Source Repository**: Clean Git history pushed to [https://github.com/anushikapoddar/oauth-setup-guide](https://github.com/anushikapoddar/oauth-setup-guide).
- [x] **Living Documentation**:
  - [`specifics.md`](specifics.md): Comprehensive project journal, architecture, and decision log.
  - [`todo.md`](todo.md): Phased execution record (Phases 1–8 complete).
  - [`docs/phase-6-validation.md`](docs/phase-6-validation.md): Official source and setup validation record.
  - [`schema/guide.v1.schema.json`](schema/guide.v1.schema.json): Canonical JSON schema for launch guides.
