export type EvidenceLabel = "Official source" | "Estimated" | "Not verified";
export type Difficulty = "Low" | "Moderate" | "High" | "Unknown";

export type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  accessedAt: string;
};

export type Guide = {
  schemaVersion: "1.0";
  id: string;
  status: "Researched draft" | "Checked guide" | "Partial";
  provider: { name: string; website: string; initials: string; tone: string; checkedAt: string };
  scenario: { capability: string; audience: string; registrationPath: string; assumptions: string[] };
  summary: {
    difficulty: Difficulty;
    reason: string;
    handsOnEffort: string;
    approvalWait: string;
    biggestBlocker: string;
    nextAction: string;
  };
  managedOption: { availability: string; details: string; customWhen: string; evidence: EvidenceLabel };
  prerequisites: Array<{ requirement: string; owner: string; condition: string }>;
  scopes: Array<{ name: string; access: string; why: string; sensitivity: string; sourceId: string }>;
  stages: Array<{
    id: string;
    title: string;
    owner: string;
    goal: string;
    steps: Array<{ action: string; result: string; url?: string; sourceId: string }>;
  }>;
  review: { requirement: string; condition: string; decisionOwner: string; evidence: string[]; wait: string };
  blockers: Array<{ symptom: string; cause: string; recovery: string; url?: string }>;
  handoffs: { agent: string[]; developer: string[]; provider: string[] };
  sources: Source[];
  limitations: string[];
};

const checkedAt = "2026-10-21";

export const guides: Guide[] = [
  {
    schemaVersion: "1.0",
    id: "github-repository-agent",
    status: "Researched draft",
    provider: { name: "GitHub", website: "https://github.com", initials: "GH", tone: "ink", checkedAt },
    scenario: {
      capability: "Let an agent work with a customer’s repositories",
      audience: "External users, including organization-owned repositories",
      registrationPath: "Custom OAuth app; compare with a GitHub App first",
      assumptions: ["The agent needs authenticated repository access", "Customer organizations may restrict third-party OAuth apps"],
    },
    summary: {
      difficulty: "Moderate",
      reason: "Registration is direct, but OAuth repository scopes are broad and some organizations require owner approval.",
      handsOnEffort: "Not measured",
      approvalWait: "Unknown — organization owner dependent",
      biggestBlocker: "The repo scope may be broader than the product needs.",
      nextAction: "List the exact repository actions, then compare OAuth app scopes with GitHub App permissions.",
    },
    managedOption: {
      availability: "Available through Composio",
      details: "Composio lists GitHub as a managed OAuth example. Exact managed scopes were not verified in this research pass.",
      customWhen: "Use your own registration when you need your own app identity or configuration, after checking whether a GitHub App is the safer fit.",
      evidence: "Official source",
    },
    prerequisites: [
      { requirement: "A GitHub account or organization where you can register an app", owner: "Developer", condition: "Always" },
      { requirement: "Homepage and exact callback URL", owner: "Developer", condition: "Before registration" },
      { requirement: "Organization-owner cooperation", owner: "Customer admin", condition: "When OAuth access restrictions are enabled" },
    ],
    scopes: [
      { name: "No scope", access: "Public information only", why: "Useful when the feature truly needs only public profile or repository data.", sensitivity: "Lower access", sourceId: "gh-scopes" },
      { name: "repo", access: "Broad public and private repository access", why: "May enable private-repository operations, but is often broader than one feature needs.", sensitivity: "Broad", sourceId: "gh-scopes" },
      { name: "public_repo", access: "Public repositories", why: "Narrower audience than repo, while still allowing public-repository operations.", sensitivity: "Broad for public repos", sourceId: "gh-scopes" },
    ],
    stages: [
      { id: "decide", title: "Choose the app model", owner: "Developer + agent", goal: "Confirm OAuth app versus GitHub App before registering.", steps: [{ action: "Map each intended API operation to the narrowest available permission model.", result: "A documented app-model and permission decision.", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app", sourceId: "gh-create" }] },
      { id: "register", title: "Register and configure", owner: "Developer", goal: "Create the client with the correct public identity and callback.", steps: [{ action: "Open Developer settings, create the OAuth app, and enter its homepage and callback URL.", result: "A client ID and app registration; keep its secret outside this guide.", url: "https://github.com/settings/applications/new", sourceId: "gh-create" }] },
      { id: "test", title: "Test a connection", owner: "Developer", goal: "Prove only the intended API actions work.", steps: [{ action: "Authorize a test account and exercise the smallest representative repository action set.", result: "A recorded consent and API test. This project has not observed it yet.", sourceId: "gh-scopes" }] },
      { id: "launch", title: "Handle customer organizations", owner: "Customer admin", goal: "Resolve organization-specific restrictions.", steps: [{ action: "Ask an organization owner to approve access when their OAuth policy blocks the app.", result: "Access for that organization, if the owner approves it.", url: "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization", sourceId: "gh-org" }] },
    ],
    review: { requirement: "Conditional customer approval", condition: "A customer organization has OAuth app access restrictions enabled.", decisionOwner: "Customer organization owner", evidence: ["App identity", "Requested repository access", "Business justification"], wait: "Unknown" },
    blockers: [
      { symptom: "The app works for a personal repo but not an organization repo.", cause: "The organization may restrict OAuth app access.", recovery: "Ask an organization owner to review and approve the app.", url: "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization" },
      { symptom: "The requested access looks much broader than the feature.", cause: "OAuth app repository scopes are coarse.", recovery: "Reassess the app as a GitHub App with granular permissions.", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app" },
    ],
    handoffs: { agent: ["Map product actions to permission choices", "Draft test and organization-approval checklists"], developer: ["Choose the app model", "Register the app and protect credentials", "Run the consent and API test"], provider: ["GitHub enforces the permission model", "Customer organization owners decide restricted access"] },
    sources: [
      { id: "gh-create", title: "Creating an OAuth app", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app", publisher: "GitHub", accessedAt: checkedAt },
      { id: "gh-scopes", title: "Scopes for OAuth apps", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps", publisher: "GitHub", accessedAt: checkedAt },
      { id: "gh-org", title: "Approving OAuth apps for an organization", url: "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization", publisher: "GitHub", accessedAt: checkedAt },
    ],
    limitations: ["No GitHub registration or consent screen was completed by this project.", "The exact Composio managed scope set is not verified."],
  },
  {
    schemaVersion: "1.0",
    id: "google-calendar-event-reader",
    status: "Researched draft",
    provider: { name: "Google Calendar", website: "https://calendar.google.com", initials: "GC", tone: "blue", checkedAt },
    scenario: {
      capability: "Read customer event details for a meeting assistant",
      audience: "External Google users in production",
      registrationPath: "Developer-owned web OAuth client",
      assumptions: ["The assistant needs event details, not only free/busy availability", "The product will move beyond a test-user-only experiment"],
    },
    summary: {
      difficulty: "High",
      reason: "Event-content access is sensitive for external production and can require Google verification and public product assets.",
      handsOnEffort: "Not measured",
      approvalWait: "Typically 3–5 business days when sensitive-scope verification applies",
      biggestBlocker: "Missing verified domain, privacy policy, or scope justification.",
      nextAction: "Decide whether the assistant needs event details or only free/busy availability.",
    },
    managedOption: {
      availability: "Available through Composio",
      details: "Composio documents a managed Google Calendar OAuth2 toolkit. Confirm its exact supported scopes for this feature.",
      customWhen: "Use a custom client when you need your own consent identity, scopes, or provider submission.",
      evidence: "Official source",
    },
    prerequisites: [
      { requirement: "Google Cloud project and appropriate project access", owner: "Developer", condition: "Always" },
      { requirement: "Product homepage, privacy policy, and verified domain", owner: "Developer", condition: "External production verification" },
      { requirement: "Named test users", owner: "Developer", condition: "While the app is in external testing" },
      { requirement: "Scope explanation and demonstration video", owner: "Developer", condition: "When verification is required" },
    ],
    scopes: [
      { name: "calendar.events.readonly", access: "Read event details", why: "Matches the example assistant that needs titles, times, and other event content.", sensitivity: "Sensitive", sourceId: "gc-scopes" },
      { name: "calendar.freebusy", access: "Read availability windows", why: "A narrower alternative if the feature only schedules around busy times.", sensitivity: "Narrower alternative", sourceId: "gc-scopes" },
    ],
    stages: [
      { id: "decide", title: "Choose the narrowest feature", owner: "Developer + agent", goal: "Avoid event-content access when free/busy is enough.", steps: [{ action: "Write down the exact Calendar data the assistant must use and choose the corresponding scope.", result: "A justified minimal scope set.", url: "https://developers.google.com/workspace/calendar/api/auth", sourceId: "gc-scopes" }] },
      { id: "prepare", title: "Prepare identity and audience", owner: "Developer", goal: "Configure a truthful consent experience and testing audience.", steps: [{ action: "Configure branding, audience, data access, and test users in Google Auth Platform.", result: "A consent configuration ready for a test client.", url: "https://developers.google.com/workspace/guides/configure-oauth-consent", sourceId: "gc-consent" }] },
      { id: "register", title: "Create the web client", owner: "Developer", goal: "Create the correct client once with the exact callback.", steps: [{ action: "Create a web OAuth client, decide the AI-powered agent designation, and add the exact redirect URI.", result: "A client ID; the AI-agent choice cannot be changed later according to the current guide.", url: "https://developers.google.com/workspace/guides/create-credentials", sourceId: "gc-client" }] },
      { id: "test", title: "Test with an allowed user", owner: "Developer", goal: "Verify consent and the representative Calendar call.", steps: [{ action: "Authorize a listed test user and exercise the intended Calendar operation.", result: "A recorded test outcome. This project has not observed it yet.", url: "https://developers.google.com/workspace/guides/configure-oauth-consent", sourceId: "gc-consent" }] },
      { id: "submit", title: "Submit verification", owner: "Developer → Google", goal: "Provide the evidence Google requests for applicable external production access.", steps: [{ action: "Submit domain, policy, scope justification, and demonstration evidence when the scenario requires verification.", result: "A review decision or a request for follow-up from Google.", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification", sourceId: "gc-review" }] },
    ],
    review: { requirement: "Conditional provider verification", condition: "External production use requests sensitive Calendar event-content access and no exception applies.", decisionOwner: "Google", evidence: ["Verified domain and product identity", "Public homepage and privacy policy", "Scope justification", "Demonstration video"], wait: "Typically 3–5 business days according to Google; not guaranteed" },
    blockers: [
      { symptom: "A test user cannot authorize.", cause: "Audience or test-user configuration may not include that account.", recovery: "Check the app audience and test-user list.", url: "https://developers.google.com/workspace/guides/configure-oauth-consent" },
      { symptom: "Verification cannot be submitted or is returned.", cause: "Domain, policy page, or scope evidence may be incomplete.", recovery: "Work through Google’s policy compliance and sensitive-scope checklists.", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance" },
    ],
    handoffs: { agent: ["Compare Calendar scopes", "Draft consent copy, justification, and evidence checklist"], developer: ["Own the Cloud project and domain", "Configure credentials and test consent", "Publish accurate policy pages and submit"], provider: ["Google decides verification", "Each end user decides consent"] },
    sources: [
      { id: "gc-scopes", title: "Choose Google Calendar API scopes", url: "https://developers.google.com/workspace/calendar/api/auth", publisher: "Google", accessedAt: checkedAt },
      { id: "gc-consent", title: "Configure OAuth consent", url: "https://developers.google.com/workspace/guides/configure-oauth-consent", publisher: "Google", accessedAt: checkedAt },
      { id: "gc-client", title: "Create access credentials", url: "https://developers.google.com/workspace/guides/create-credentials", publisher: "Google", accessedAt: checkedAt },
      { id: "gc-review", title: "Sensitive scope verification", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification", publisher: "Google", accessedAt: checkedAt },
    ],
    limitations: ["No Google Cloud client, consent flow, or verification request was completed by this project.", "The published review range is conditional and not a total launch estimate."],
  },
  {
    schemaVersion: "1.0",
    id: "slack-cross-workspace-poster",
    status: "Researched draft",
    provider: { name: "Slack", website: "https://slack.com", initials: "SL", tone: "plum", checkedAt },
    scenario: {
      capability: "Post agent updates in customer workspaces",
      audience: "External customer workspaces",
      registrationPath: "Custom Slack app with OAuth distribution",
      assumptions: ["The app posts as a bot", "The team must choose between an unlisted pilot and Marketplace listing"],
    },
    summary: {
      difficulty: "Moderate",
      reason: "A pilot can use unlisted distribution, while workspace admin controls and Marketplace review add separate gates.",
      handsOnEffort: "Not measured",
      approvalWait: "Unknown for workspace admins; up to 10 weeks for Marketplace functional review",
      biggestBlocker: "Treating an unlisted pilot and Marketplace launch as the same path.",
      nextAction: "Choose single-workspace test, unlisted multi-workspace pilot, or Marketplace listing.",
    },
    managedOption: {
      availability: "Available through Composio",
      details: "Composio documents a managed Slack OAuth2 toolkit. Exact managed scopes and launch fit still need confirmation.",
      customWhen: "Use a custom Slack app for your own identity, requested scopes, distribution, and Marketplace path.",
      evidence: "Official source",
    },
    prerequisites: [
      { requirement: "Slack development workspace and permission to create/install apps", owner: "Developer", condition: "Always" },
      { requirement: "HTTPS redirect URL and install landing path", owner: "Developer", condition: "Multi-workspace OAuth" },
      { requirement: "External-workspace testing and installation on at least 10 active workspaces", owner: "Developer + customers", condition: "Marketplace submission" },
      { requirement: "Install/OAuth/use/uninstall demonstration video", owner: "Developer", condition: "Marketplace submission" },
    ],
    scopes: [
      { name: "chat:write", access: "Post messages as the app’s bot user", why: "Matches the example capability of posting agent updates.", sensitivity: "Bot scope", sourceId: "sl-quickstart" },
    ],
    stages: [
      { id: "decide", title: "Choose the launch path", owner: "Developer", goal: "Set the correct target before preparing distribution evidence.", steps: [{ action: "Choose development workspace, unlisted OAuth distribution, or Marketplace listing.", result: "A launch target with the relevant gates.", url: "https://docs.slack.dev/app-management/distribution/", sourceId: "sl-distribute" }] },
      { id: "register", title: "Create and install the app", owner: "Developer", goal: "Prove the bot can post in a controlled workspace.", steps: [{ action: "Create the Slack app, add chat:write under OAuth & Permissions, and install it in the development workspace.", result: "A bot installation for testing; keep credentials server-side.", url: "https://api.slack.com/apps", sourceId: "sl-quickstart" }] },
      { id: "test", title: "Test the OAuth install", owner: "Developer", goal: "Verify redirect and install behavior outside the original workspace.", steps: [{ action: "Run the OAuth flow in an external test workspace and verify post and uninstall behavior.", result: "A recorded cross-workspace test. This project has not observed it yet.", url: "https://docs.slack.dev/authentication/installing-with-oauth/", sourceId: "sl-oauth" }] },
      { id: "launch", title: "Distribute or submit", owner: "Developer → customer admin / Slack", goal: "Open the chosen path to customers.", steps: [{ action: "Enable distribution for an unlisted pilot, or prepare and submit the Marketplace package when listing is required.", result: "Install access or a Slack review decision, depending on path.", url: "https://docs.slack.dev/app-management/distribution/", sourceId: "sl-distribute" }] },
    ],
    review: { requirement: "Path dependent", condition: "Customer admin approval depends on workspace policy; Marketplace review applies to a listing.", decisionOwner: "Customer admins and/or Slack", evidence: ["External workspace end-to-end test", "Active workspace eligibility for Marketplace", "Install and usage demonstration video"], wait: "Admin wait unknown; Slack documents preliminary feedback up to 10 business days and functional review up to 10 weeks for new Marketplace submissions" },
    blockers: [
      { symptom: "A customer cannot install the app.", cause: "Their workspace may restrict app installation or require admin approval.", recovery: "Ask their workspace admin to review the installation request.", url: "https://docs.slack.dev/app-management/distribution/" },
      { symptom: "The app is not eligible for Marketplace submission.", cause: "The active-workspace or external-testing prerequisite may not be met.", recovery: "Run an unlisted pilot and collect the documented eligibility evidence first.", url: "https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/" },
    ],
    handoffs: { agent: ["Map actions to Slack scopes", "Prepare distribution and review checklists"], developer: ["Create, configure, and test the app", "Collect authentic install evidence and submit"], provider: ["Customer admins decide restricted installs", "Slack decides Marketplace listing"] },
    sources: [
      { id: "sl-quickstart", title: "App settings quickstart", url: "https://docs.slack.dev/app-management/quickstart-app-settings/", publisher: "Slack", accessedAt: checkedAt },
      { id: "sl-oauth", title: "Installing with OAuth", url: "https://docs.slack.dev/authentication/installing-with-oauth/", publisher: "Slack", accessedAt: checkedAt },
      { id: "sl-distribute", title: "Distribute your app", url: "https://docs.slack.dev/app-management/distribution/", publisher: "Slack", accessedAt: checkedAt },
      { id: "sl-review", title: "Slack Marketplace review guide", url: "https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/", publisher: "Slack", accessedAt: checkedAt },
    ],
    limitations: ["No Slack app, install, or Marketplace submission was completed by this project.", "Workspace-admin timing is not published and remains unknown."],
  },
];

export function getGuide(id: string) {
  return guides.find((guide) => guide.id === id);
}

export function getSource(guide: Guide, id: string) {
  return guide.sources.find((source) => source.id === id);
}
