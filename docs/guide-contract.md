# Guide contract — version 1

**Status:** Phase 3 design, 21 October 2026. This is the content and page contract for both researched library guides and live-generated guides. `schema/guide.v1.schema.json` is its machine-readable counterpart. A guide is a decision aid for a **provider + capability + audience + registration path**, not a general verdict about an entire provider.

## The question the page must answer first

> For the stated use case, what can I do now, what must happen before my users can connect, who owns each action, and what might delay launch?

The page must work at its permanent `/guides/{id}` URL with no chat history, login, or verbal introduction. Place the provider name, exact scenario, last evidence check, readiness summary, and first action above the detailed steps. Every major section must have a stable heading for sharing.

## Page order and field rules

| Order | Section | Required content and behavior |
| --- | --- | --- |
| 1 | Identity and scenario | Provider name and canonical website; OAuth support `supported`, `unsupported`, or `unconfirmed`; capability, audience, managed/custom/undecided path; explicit assumptions; last checked date; guide status |
| 2 | At a glance | Difficulty with reasons; hands-on setup effort; provider/customer wait; biggest blocker; one immediate next action. Effort and wait are separate labels even when unknown |
| 3 | Choose your path | Managed availability for this method, what is known about coverage, when a custom client is needed, and a specific decision action; do not imply managed auth bypasses customer consent or provider policy |
| 4 | Before you start | Prerequisites in dependency order: account/role, domain/assets, product decisions, test users or workspace, and any plan constraint supported by evidence. Each states who provides it |
| 5 | Permissions | Plain-language feature-to-scope mapping, exact scope names where verified, whether sensitivity is known, and how broader scopes affect review. Mark unverified scope classification unknown |
| 6 | Setup journey | Numbered stages and steps. Each step states action, owner, condition, official link when available, expected result, and next action. Show registration, testing, submission, and launch as separate states |
| 7 | Review and waiting | Whether review is required for this exact audience/scope/path; condition, submission assets, official submission route, published timing only if sourced, and who decides. Separate provider review from customer admin approval |
| 8 | When blocked | Symptom, likely cause only if supported, recovery step, official help or submission link when available, and owner. Avoid a generic “contact support” with no route |
| 9 | Agent and human handoffs | What the agent can research/draft/check; what developer/customer must do in an authenticated account; what the provider alone decides |
| 10 | Evidence and limits | Claim labels, direct sources and dates, attempted steps, unknowns, conflicts, and a visible “what we did not verify” note |

If OAuth support is unconfirmed, the guide is **partial**: present the evidence gap and next investigation action rather than inventing registration instructions. If documentation establishes OAuth is unsupported, say so and offer the documented alternative only when evidenced. A failed research run is not a complete guide.

## Difficulty and time rubric

Difficulty describes the **path to the stated launch audience**, including actual gates, rather than the length of the registration form.

| Rating | Use when | Display requirement |
| --- | --- | --- |
| Low | Self-service setup and testing are documented, with no known mandatory external review for this scenario | State the scope/audience/path assumptions and any customer-specific approval that could change the result |
| Moderate | One conditional gate, significant prerequisite, or admin dependency is known | Name the gate and the exact condition that triggers it |
| High | A mandatory external review, restricted access process, or several material dependencies apply to the stated launch | Name the required review and assets; do not imply approval is guaranteed |
| Unknown | Evidence is too thin or conflicting to judge | Name the missing evidence and the next investigation action |

**Hands-on effort** is developer/agent work time. Use a numeric range only after a documented dry run or a transparent, task-by-task estimate. Record the basis and assumptions (for example, project and domain already owned). Otherwise display **“Not measured”**. Do not silently convert an approval wait into effort.

**Wait** is elapsed time controlled by a provider or customer admin. Use `published` only with a source, precise condition, and the provider's wording/range. Use `estimated` only with an explained basis and label it as our estimate. Use **“Unknown”** when no defensible number exists; use **“Not applicable for this scenario”** only when the conditional review analysis supports that conclusion. Never display zero for unknown.

An at-a-glance rating is a synthesis, so its reason must point to underlying claims and say what would change the rating. A provider can have a Low pilot path and a High Marketplace path in separate guides or clearly labeled branches.

## Evidence contract

Every consequential factual assertion (scope, field, prerequisite, review condition, duration, managed availability, or policy) is a **claim** with one of four labels:

| Label | Meaning | Minimum record |
| --- | --- | --- |
| `observed` | We attempted the stated step and recorded the result | Date, action, outcome, sanitized attempt reference; observation supports only what the attempt showed |
| `official_source` | An official provider or relevant managed-platform page directly supports the statement | Source title, final URL, publisher, retrieval date, and a specific supporting note/section |
| `estimated` | Our synthesis or effort estimate, not a provider promise | Method/assumptions and source claim references where relevant |
| `not_verified` | Important point remains unresolved | What is missing and the next verification action |

One claim may be conditional: preserve the audience, scope, account type, product path, or plan that makes it true. Source citations must be attached near the claim in the rendered page, not hidden in a bibliography. Do not promote an official documentation statement to `observed`. Do not let the model create an `observed` claim unless a matching attempt record exists. If sources conflict, show both with dates, mark the decision unresolved, and avoid a confident readiness result.

Claim IDs referenced from guide sections must resolve to records in the same guide; source IDs referenced by claims must resolve to source records. A validator should reject broken references and an `observed` claim without an attempt. Schema validation checks shape; the Phase 6 sample review checks whether source passages actually support the claims.

## Stage and next-action rules

The standard journey is **decide → prepare → register → test → submit → launch**, but a guide may omit a stage only with an explained scenario reason. The current stage has one prominent next action. Each stage states its entry condition, exit result, owner, and action to take if blocked. A step never asks the user to paste a client secret or access token into this product.

Use direct official URLs for registration, consent/client settings, distribution, review, and help where published. When no direct dashboard URL is verified, link the official instructions and label the dashboard location as documentation-based. A source link is not a substitute for an instruction such as “create a web client and add your exact redirect URI.”

## Worked page outline: Google Calendar event reader

This is a **research-backed outline**, not a completed OAuth registration. It illustrates the page structure; the curated guide and actual app arrive in Phase 4.

- **Scenario:** an external meeting assistant reads a customer's event details with a developer-owned web OAuth client. For free/busy only, reassess the scope first.
- **Difficulty:** High for external production with event-content access, because sensitive-scope verification may apply. For a test-user-only experiment, the path differs. This rating is an inference from Google's documented conditions. [Google scope guide](https://developers.google.com/workspace/calendar/api/auth), [verification guide](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification)
- **Hands-on effort:** Not measured. **Provider wait:** Google says sensitive-scope review typically takes 3–5 business days, conditional on a complete applicable submission; total launch time is unknown. [Verification guide](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification)
- **First action:** decide whether the assistant needs event details or only availability, then choose the narrowest corresponding scope. [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth)
- **Prerequisites:** Cloud project and appropriate owner access; product identity and domain/policy assets before external production verification; test users for testing mode. [Consent setup](https://developers.google.com/workspace/guides/configure-oauth-consent), [policy compliance](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance)
- **Permissions:** `calendar.events.readonly` reads event details for this example; verify that the exact API operations need it before implementation. `calendar.freebusy` is a narrower alternative for availability. [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth)

1. **Decide:** select event details versus availability and whether a managed registration meets the product's identity and scope requirements. Agent can prepare the comparison; developer chooses. [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [Composio Calendar toolkit](https://docs.composio.dev/toolkits/googlecalendar)
2. **Prepare:** create/select a Google Cloud project and configure branding, audience, and data access. Developer signs in; agent can draft copy and inventory assets. [Consent setup](https://developers.google.com/workspace/guides/configure-oauth-consent)
3. **Register:** create a web OAuth client and add the exact redirect URI. Decide the documented AI-powered agent designation before creating the client because it cannot later be changed. Developer performs this in Google Cloud. [Create credentials](https://developers.google.com/workspace/guides/create-credentials)
4. **Test:** add applicable test users, perform the consent flow, and confirm the intended Calendar API operation with a test account. This has **not yet been attempted by us**. [Consent setup](https://developers.google.com/workspace/guides/configure-oauth-consent)
5. **Submit if required:** assemble domain/identity evidence, privacy policy, scope justification, and demonstration video; submit through Google's verification flow for the applicable external production scope. Google decides. [Verification guide](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification)
6. **Launch:** enable the intended audience only after the applicable provider requirements are met and a real connection test succeeds. This launch outcome is **not verified**.

**If blocked:** if domain or privacy policy prerequisites are missing, publish/verify those assets before submission and use Google's [policy compliance guide](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance). If a test user cannot authorize, check audience and test-user settings in the [consent setup guide](https://developers.google.com/workspace/guides/configure-oauth-consent). Actual error messages and recovery steps require Phase 6 testing.

**Agent / human / provider:** the agent researches scopes and drafts copy/checklists; the developer owns the Cloud project, credentials, accurate policy pages, testing, and submission; Google decides verification. No dashboard or consent step in this outline has been observed by this project.

## Implementation boundary

The schema is a contract for content, not proof that a guide is correct. Phase 4 will implement rendering and reference validation; Phase 5 will make the research agent produce this shape; Phase 6 will sample factual claims and setup steps. Content that cannot satisfy the contract must be saved as a visibly **partial** guide or returned as a research failure.
