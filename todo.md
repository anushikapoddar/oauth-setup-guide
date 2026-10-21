# OAuth App Guide — Project Checklist

This is the working plan for the APM Integrations take-home assignment. Check an item with `[x]` only when it is done and verified. Check **Phase complete** after every required item in that phase is complete. Before completing any phase, update [specifics.md](specifics.md) with its research, decisions, architecture changes, checks, limitations, and completion journal. That file is the living project reference; the final README will summarize it for reviewers.

**Current status:** Phases 1–4 completed on 21 October 2026. Phase 5 is next. The searchable guide library and three guide pages work locally; live research, persistence, provider setup attempts, and deployment remain.

**Target:** a working, shareable experience with a small library of researched OAuth app setup guides and a live agent-generated guide for an unfamiliar app. The long-term vision is 100 guides; the take-home needs only a few varied examples. Keep the implementation focused enough to finish and verify within the 6–8 hour budget.

## Phase 1 — Understand the problem and choose a focused scope

- [x] Write a one-paragraph explanation of the three actors: provider OAuth app, developer's integration, and end user's connected account.
- [x] Map the full journey: choose provider → register OAuth app → configure redirect URL and scopes → test with a user → meet review requirements → submit for approval → launch.
- [x] Distinguish provider-app approval from the OAuth consent that each end user grants.
- [x] Read the managed OAuth app directory and note when a developer can use a managed app versus when they need their own app.
- [x] Identify the developer's key decisions: whether to use managed OAuth, which scopes to request, whether review is required, and what can block launch.
- [x] Define the primary user and one concrete use case for the demo.
- [x] Choose a narrow first release: a searchable guide library, useful guide pages, and one live generation flow.
- [x] Decide what is intentionally outside the 6–8 hour slice; separate this from the longer-term 100-guide plan.
- [x] Write acceptance criteria for a developer finding a known app and for generating an unfamiliar one.
- [x] Update `specifics.md` with Phase 1 findings, scope, planned architecture, sources, and completion evidence.
- [x] **Phase complete**

## Phase 2 — Research varied real providers

- [x] Pick at least three OAuth providers with meaningfully different setup challenges (for example, straightforward self-service, scope or verification review, and an admin/partner approval path).
- [x] For each provider, locate the official developer setup and OAuth documentation.
- [x] For each provider, locate official scope, test-mode, publication, and app-review requirements where applicable.
- [x] Record the exact source URL and date checked for each claim that may change.
- [x] Investigate the public setup flow; attempt dashboard steps when practical and when access is available. Browser access timed out; no authenticated setup step was observed. Retry in Phase 6.
- [x] Separate directly observed steps from documentation-only claims and from informed estimates.
- [x] Determine whether a managed OAuth option exists, what it covers, and when bringing a custom OAuth app is necessary. Exact managed scopes remain to verify for each scenario.
- [x] Note prerequisites such as domain ownership, privacy policy, business verification, paid plan, admin access, or test users.
- [x] Note provider-specific traps such as exact redirect URL matching, restricted scopes, sandbox limits, or review evidence.
- [x] Identify which steps an agent could perform or prepare and which require developer login, secrets, consent, payment, or provider review.
- [x] Keep uncertain approval times as ranges or unknown; do not present unsupported guarantees.
- [x] Update `specifics.md` with Phase 2 sources, provider selection, findings, attempts, and limitations.
- [x] **Phase complete**

## Phase 3 — Define a guide developers can act on

- [x] Create one consistent guide schema for both library and live-generated guides.
- [x] Include provider name, website, OAuth support, and a clear last-checked date.
- [x] Include an at-a-glance difficulty rating with a short explanation of what drives it.
- [x] Separate hands-on setup effort from waiting for provider approval.
- [x] Show prerequisites before the first setup step.
- [x] Write a numbered setup path with direct links to the relevant provider pages. The worked outline is in `docs/guide-contract.md`; rendered guides arrive in Phase 4.
- [x] Explain scopes in plain language and flag sensitive or restricted scopes.
- [x] Show development/test access versus public/production access.
- [x] Include approval or review requirements, expected evidence, and potential blockers.
- [x] Provide a specific **next action** for the developer at each major stage.
- [x] Add a “What the agent can do / What you must do” section.
- [x] Add a blocker section with recovery steps and official support or submission links where available.
- [x] Label every important claim as observed, supported by an official source, estimated, or not verified.
- [x] Make the guide readable and shareable without this chat or a verbal explanation. The standalone page contract is specified; implementation is Phase 4.
- [x] Update `specifics.md` with the finalized schema, difficulty rubric, evidence rules, and Phase 3 outcomes.
- [x] **Phase complete**

## Phase 4 — Build the initial guide library and product UI

- [x] Select a small, coherent tech stack and write down why it fits the time budget.
- [x] Scaffold the app and add local run/build scripts.
- [x] Build a landing page that explains what the product helps developers decide.
- [x] Add search or browse for the researched guide library.
- [x] Show enough information on each app card to choose a guide: difficulty, likely effort, approval wait, and major blocker.
- [x] Build a guide page using the shared guide schema.
- [x] Make source links, confidence labels, and last-checked dates easy to find.
- [x] Add a clear “Generate a guide” entry point for apps outside the library.
- [x] Support app name or website input and handle ambiguous names with a clear resolution step.
- [x] Make the interface usable on a narrow/mobile screen and with a keyboard. Exact phone-width visual QA remains for Phase 7 because the available browser did not expose viewport overrides.
- [x] Add useful loading, empty, error, and incomplete-research states. Live research progress replaces the honest Phase 5 placeholder next.
- [x] Add a stable URL for each library guide that can be copied and shared.
- [x] Update `specifics.md` with the actual stack, file structure, UI flows, checks, and Phase 4 outcomes.
- [x] **Phase complete**

## Phase 5 — Make unfamiliar-app guide generation real

- [x] Choose and document the research agent's inputs, tools, output schema, and stopping conditions. See `specifics.md` and `src/lib/research-contract.ts`.
- [x] Implement an endpoint or server action that starts generation from an app name or website. `POST /api/research` is implemented.
- [x] Have the agent identify the correct provider and find current official OAuth documentation first. The server prompt enforces this research order and source rule.
- [x] Have the agent investigate registration, scopes, test mode, publication, review, and support paths. These are required sections in the structured output.
- [x] Have the agent check whether a managed OAuth option is available, if that helps the developer decide. Composio managed OAuth is a required research check with an explicit unconfirmed state.
- [x] Require source URLs for consequential claims; reject or flag unsupported claims.
- [x] Have the agent distinguish confirmed facts, estimates, and unanswered questions.
- [x] Produce the same structured guide format as the curated library. Generated guides now use the same scenario, path, findings, sources, and limits pattern.
- [x] Show visible research progress and a useful result or actionable failure during the live demo.
- [x] Save generated guides and give each one a durable shareable URL.
- [x] Handle missing docs, non-OAuth apps, inaccessible pages, and ambiguous providers without inventing steps.
- [x] Keep API keys and credentials in server-side environment variables; never expose them in the browser or repository. Gemini and OpenAI keys are server-only.
- [x] Add reasonable limits for request time, cost, duplicate requests, and malformed input. Requests are bounded to 160-character inputs and 75 seconds; provider quota errors are surfaced without retry loops.
- [x] Update `specifics.md` with the implemented agent, tools, persistence, configuration, measured limits, and Phase 5 outcomes.
- [x] **Phase complete**

## Phase 6 — Attempt setup steps and validate guidance

- [x] Pick a small validation sample that includes more than one kind of provider. GitHub, Google Calendar, and Slack were selected.
- [x] Follow each sampled guide against current official sources and record mismatches in `docs/phase-6-validation.md`.
- [ ] Attempt available provider dashboard steps or a test OAuth setup where practical.
- [ ] Record exactly what was clicked or tested, what was only read, and what could not be accessed.
- [x] Correct outdated, vague, or misleading steps found during validation. Slack’s 10-active-workspace Marketplace prerequisite is now explicit.
- [ ] Test at least one unfamiliar app through the complete live generation flow.
- [ ] Check that the generated guide's links resolve and its cited pages support the claims.
- [ ] Check that difficulty, hands-on effort, and approval wait are explained rather than merely asserted.
- [ ] Verify that a developer can identify their next action and likely blocker from every demo guide.
- [ ] Verify the share URL opens the same guide in a fresh browser session.
- [ ] Document remaining uncertainty and any provider review that could not be completed.
- [ ] Update `specifics.md` with validation results, corrections, setup-attempt evidence, and Phase 6 outcomes.
- [ ] **Phase complete**

## Phase 7 — Test and polish the working experience

- [ ] Run the app locally and check library search, guide navigation, generation, and share links end to end.
- [ ] Check input validation, missing-provider results, source failures, and agent timeouts.
- [ ] Check mobile layout, readable text, keyboard navigation, and basic accessibility labels.
- [ ] Run build/lint/type checks and fix actual errors.
- [ ] Remove test credentials, sample secrets, debug output, and any private account data.
- [ ] Add or update `.gitignore` for dependencies, local environment files, generated output, and secrets.
- [ ] Freeze the demo scope once the core path works; spend remaining time on source accuracy and reliability.
- [ ] Update `specifics.md` with checks performed, fixes, remaining risks, and Phase 7 outcomes.
- [ ] **Phase complete**

## Phase 8 — Deploy and prepare the submission

- [ ] Choose a hosting option that supports the app and live generation endpoint.
- [ ] Deploy the working experience and set required server-side environment variables securely.
- [ ] Test the public URL, including an unfamiliar-app generation and a copied guide link.
- [ ] Write a short README with the problem, chosen scope, setup commands, environment variables, and local run instructions.
- [ ] Explain product decisions: guide structure, provider selection, evidence labels, and how agent/human handoffs work.
- [ ] State limitations: sample size, unverified approval waits, provider account access, research freshness, and production hardening gaps.
- [ ] Add a brief validation log: sources checked, setup steps attempted, corrections made, and unresolved questions.
- [ ] Include the deployed URL and source repository URL in the README.
- [ ] Commit the finished work and push it to the GitHub repository.
- [ ] Recheck that the repository is public or accessible to the reviewers as intended.
- [ ] Prepare a short demo path: open contrasting guides → inspect evidence and next steps → submit an unfamiliar app → open its share link.
- [ ] Submit the working experience link and source repository link.
- [ ] Update `specifics.md` with deployed architecture, setup instructions, final links, limitations, and Phase 8 outcomes.
- [ ] **Phase complete**

## After the take-home: path toward 100 guides

- [ ] Prioritize providers by developer demand and setup difficulty.
- [ ] Add a repeatable research and review pipeline for new guides.
- [ ] Add scheduled source rechecks and stale-guide warnings.
- [ ] Track provider policy changes, broken links, and user-reported corrections.
- [ ] Expand the guide library in batches, using the same evidence and validation standard.
