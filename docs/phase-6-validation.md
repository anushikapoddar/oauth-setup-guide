# Phase 6 validation record

**Checked:** 21 October 2026
**Scope:** GitHub OAuth app, Google Calendar OAuth client, Slack cross-workspace app, and Linear unfamiliar-app live generation.

## What was checked

The validation pass opened official registration, scope, distribution, and review pages linked by both curated and live-generated guides. The pages resolved and their current content was compared with the claims shown in the app.

| Provider | Official pages opened | Result | Hands-on status |
| --- | --- | --- | --- |
| GitHub | [Create an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app), [OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps), [Organization approval](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization) | Claims confirmed; GitHub still recommends considering a GitHub App for fine-grained permissions. | Documentation verified; provider credentials not used. |
| Google Calendar | [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [Sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) | Claims confirmed; event reading is sensitive, least-privilege scopes are required, and Google publishes a typical 3–5 business-day sensitive-scope review. | Documentation verified; Cloud project submission not used. |
| Slack | [OAuth installation](https://docs.slack.dev/authentication/installing-with-oauth/), [Distribution](https://docs.slack.dev/app-management/distribution/), [Marketplace review](https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/) | Claims confirmed; redirects must use HTTPS, the redirect value must match during authorize/access, and Marketplace review has separate preliminary and functional stages. | Documentation verified; Slack development workspace not used. |
| Linear (Live Research) | [Linear OAuth Documentation](https://developers.linear.app/docs/oauth), [Linear Application Settings](https://linear.app/settings/api/applications), [GraphQL Explorer](https://linear.app/graphql/explorer) | Live research generated valid structured launch plan; confirmed space-separated scopes (`read`, `write`, `admin`), workspace admin prerequisite, and HTTPS redirect rules. | Generated live via Anthropic Claude adapter; share URL verified. |

## Corrections and clarifications

- **Slack**: Marketplace prerequisite is explicit: the app must have been installed on **10 or more active workspaces** before submission.
- **GitHub**: Confirmed up to 10 callback URLs can be entered, and GitHub explicitly recommends comparing OAuth Apps with GitHub Apps for granular permissions.
- **Google Calendar**: Reading event content is an explicit Sensitive Scope requiring privacy policy, YouTube consent flow demonstration, and typical 3–5 business-day review.
- **Linear**: OAuth registration requires workspace admin credentials; authorization code flow uses standard endpoints with strict HTTPS redirect matching.

## Evidence boundary

Per the assignment guidelines, this phase verified official documentation, API schemas, and live research output. It did **not** create live production apps with payment or submit review requests requiring manual human audits, as those require provider accounts and credentials that are intentionally kept out of the submission. The guides clearly label those steps as human responsibilities.

## Phase 6 verification outcomes

- [x] Tested unfamiliar app (**Linear**) through the complete live generation flow.
- [x] Checked that generated guide links resolve and cited official pages support the claims.
- [x] Verified that difficulty, hands-on effort, and approval wait are explicitly explained rather than merely asserted.
- [x] Verified that a developer can identify their next action and likely blocker from every guide.
- [x] Verified that the share URL opens the same guide in a fresh browser session.
- [x] Documented remaining uncertainties and human-in-the-loop review boundaries.
