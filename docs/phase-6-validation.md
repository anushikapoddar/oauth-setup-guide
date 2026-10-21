# Phase 6 validation record

**Checked:** 21 October 2026
**Scope:** GitHub OAuth app, Google Calendar OAuth client, and Slack cross-workspace app.

## What was checked

The validation pass opened the official registration, scope, distribution, and review pages linked by each curated guide. The pages resolved and their current content was compared with the claims shown in the app.

| Provider | Official pages opened | Result | Hands-on status |
| --- | --- | --- | --- |
| GitHub | [Create an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app), [OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps), [Organization approval](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization) | Claims confirmed; GitHub still recommends considering a GitHub App for fine-grained permissions. | Not attempted; no provider account was used. |
| Google Calendar | [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [Sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) | Claims confirmed; event reading is sensitive, least-privilege scopes are required, and Google publishes a typical 3–5 business-day sensitive-scope review. | Not attempted; no Cloud project or verification submission was used. |
| Slack | [OAuth installation](https://docs.slack.dev/authentication/installing-with-oauth/), [Distribution](https://docs.slack.dev/app-management/distribution/), [Marketplace review](https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/) | Claims confirmed; redirects must use HTTPS, the redirect value must match during authorize/access, and Marketplace review has separate preliminary and functional stages. | Not attempted; no Slack development workspace was used. |

## Corrections and clarifications

- Slack’s Marketplace prerequisite is now explicit: the app must have been installed on **10 or more active workspaces** before submission. The guide previously described this only as an active-workspace prerequisite.
- GitHub’s current creation guide confirms that up to 10 callback URLs can be entered and that GitHub recommends comparing an OAuth app with a GitHub App before registration. The existing guide’s app-model warning remains accurate.
- Google’s current verification page confirms that reading Calendar events is a sensitive-data example, that the narrowest scope should be requested, and that sensitive-scope verification typically takes 3–5 business days. This is a published estimate, not a guarantee.

## Evidence boundary

This phase verified documentation and links. It did **not** create provider apps, submit review requests, authorize a test user, or exchange a real authorization code. Those actions require provider accounts and credentials that were intentionally not added to the project. The guides continue to label those steps as unobserved.

## Remaining Phase 6 work

- Attempt provider dashboard setup where the developer has an appropriate test account.
- Run at least one real OAuth consent flow and record the redirect/code exchange.
- Re-run a successful unfamiliar-app generation after Gemini Search grounding access is available.
- Test a generated share URL in a fresh browser session.
