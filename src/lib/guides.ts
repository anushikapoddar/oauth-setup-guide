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
  {
    schemaVersion: "1.0",
    id: "discord-bot-agent",
    status: "Researched draft",
    provider: { name: "Discord", website: "https://discord.com", initials: "DC", tone: "indigo", checkedAt },
    scenario: {
      capability: "Let an agent post messages and respond to commands in customer Discord servers",
      audience: "External Discord server administrators",
      registrationPath: "Custom Discord application with bot user and OAuth2",
      assumptions: ["The agent needs to join servers and send messages as a bot", "Server administrators must authorize the bot installation"],
    },
    summary: {
      difficulty: "Low",
      reason: "Registration is instant and self-service. No provider review is required unless you want to be listed in the App Directory or your bot reaches 100+ servers.",
      handsOnEffort: "10–20 mins",
      approvalWait: "Instant for fewer than 100 servers; verification required at 100+ servers",
      biggestBlocker: "Bots in 100+ servers must be verified by Discord, requiring a description of how you use privileged intents.",
      nextAction: "Create a Discord application in the Developer Portal and add a bot user.",
    },
    managedOption: {
      availability: "Available through Composio",
      details: "Composio lists Discord as a managed OAuth2 toolkit. Exact managed scopes were not verified in this research pass.",
      customWhen: "Use your own registration when you need custom bot branding, specific privileged intents, or plan to apply for the App Directory.",
      evidence: "Estimated",
    },
    prerequisites: [
      { requirement: "A Discord account", owner: "Developer", condition: "Always" },
      { requirement: "A Discord server where you can test the bot", owner: "Developer", condition: "Always" },
      { requirement: "Manage Server permission on target servers", owner: "Server administrator", condition: "When inviting the bot to external servers" },
    ],
    scopes: [
      { name: "bot", access: "Adds the bot user to a server with selected permissions", why: "Required for any bot that needs to operate inside a Discord server.", sensitivity: "Standard", sourceId: "dc-oauth" },
      { name: "applications.commands", access: "Register and manage Slash Commands", why: "Needed for interactive / commands in servers and DMs.", sensitivity: "Standard", sourceId: "dc-oauth" },
      { name: "identify", access: "Read user profile information (username, avatar)", why: "Useful when using Login with Discord to identify the authorizing user.", sensitivity: "Standard", sourceId: "dc-oauth" },
      { name: "guilds", access: "List servers the authorizing user belongs to", why: "Needed to let a user pick which of their servers to configure.", sensitivity: "Standard", sourceId: "dc-oauth" },
    ],
    stages: [
      { id: "register", title: "Create a Discord application", owner: "Developer", goal: "Get a client ID and bot token from the Developer Portal.", steps: [{ action: "Go to discord.com/developers/applications, click New Application, name it, and accept the Terms of Service.", result: "An application with a client ID on the General Information page.", url: "https://discord.com/developers/applications", sourceId: "dc-portal" }] },
      { id: "bot", title: "Add a bot user and configure intents", owner: "Developer", goal: "Enable the bot to join servers and respond to events.", steps: [{ action: "Navigate to the Bot tab, click Add Bot, copy the token, and enable any Privileged Gateway Intents you need (Presence, Server Members, Message Content).", result: "A bot token stored securely in your environment variables.", url: "https://discord.com/developers/docs/events/gateway#privileged-intents", sourceId: "dc-oauth" }] },
      { id: "invite", title: "Generate the OAuth2 invite URL", owner: "Developer", goal: "Construct the URL that server admins will use to install the bot.", steps: [{ action: "In the OAuth2 > URL Generator tab, select the bot and applications.commands scopes, then choose the specific bot permissions your agent needs.", result: "A shareable URL that installs the bot with the correct permissions.", url: "https://discord.com/developers/applications", sourceId: "dc-oauth" }] },
      { id: "test", title: "Test in a development server", owner: "Developer", goal: "Verify the bot joins, responds to commands, and handles messages.", steps: [{ action: "Open the generated URL, select your test server, authorize, then exercise the agent's core actions.", result: "A working bot responding to commands in your test server.", sourceId: "dc-oauth" }] },
      { id: "verify", title: "Apply for verification (if 100+ servers)", owner: "Developer → Discord", goal: "Unlock growth beyond the 100-server limit.", steps: [{ action: "In the Developer Portal, submit a verification request describing your bot, its privileged intent usage, and Terms of Service / Privacy Policy URLs.", result: "Discord reviews and approves verification, typically within a few business days.", url: "https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-to-Get-Your-App-Verified", sourceId: "dc-verify" }] },
    ],
    review: { requirement: "Conditional at 100+ servers", condition: "Bots in 100 or more servers must apply for verification to continue growing.", decisionOwner: "Discord", evidence: ["Description of privileged intent usage", "Terms of Service URL", "Privacy Policy URL"], wait: "Typically a few business days according to developer community reports; not officially guaranteed" },
    blockers: [
      { symptom: "The bot cannot join any more servers.", cause: "Unverified bots are capped at 100 servers.", recovery: "Apply for verification through the Developer Portal.", url: "https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-to-Get-Your-App-Verified" },
      { symptom: "The bot cannot read message content.", cause: "Message Content is a privileged intent that must be explicitly enabled.", recovery: "Enable the Message Content Intent in the Bot settings and justify its use during verification if needed.", url: "https://discord.com/developers/docs/events/gateway#privileged-intents" },
    ],
    handoffs: { agent: ["Map agent actions to Discord bot permissions and scopes", "Generate the OAuth2 invite URL", "Draft slash command registration"], developer: ["Create the application and bot", "Secure the bot token", "Apply for verification if scaling past 100 servers"], provider: ["Server administrators authorize the bot installation", "Discord reviews verification applications"] },
    sources: [
      { id: "dc-oauth", title: "Discord OAuth2 documentation", url: "https://discord.com/developers/docs/topics/oauth2", publisher: "Discord", accessedAt: checkedAt },
      { id: "dc-portal", title: "Discord Developer Portal", url: "https://discord.com/developers/applications", publisher: "Discord", accessedAt: checkedAt },
      { id: "dc-verify", title: "How to Get Your App Verified", url: "https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-to-Get-Your-App-Verified", publisher: "Discord", accessedAt: checkedAt },
    ],
    limitations: ["No Discord application, bot, or verification was completed by this project.", "The 100-server verification threshold is based on Discord documentation; exact review times are community-reported."],
  },
  {
    schemaVersion: "1.0",
    id: "linear-issue-tracker-agent",
    status: "Researched draft",
    provider: { name: "Linear", website: "https://linear.app", initials: "LN", tone: "violet", checkedAt },
    scenario: {
      capability: "Let an agent create, read, and manage issues in a customer's Linear workspace",
      audience: "External Linear workspaces via OAuth",
      registrationPath: "Custom OAuth application registered in Linear workspace settings",
      assumptions: ["The agent needs programmatic issue access via GraphQL API", "The developer's Linear workspace is used to register the OAuth app, but end users are in their own workspaces"],
    },
    summary: {
      difficulty: "Low",
      reason: "Registration is self-service, scopes are simple and granular, and there is no provider review or approval wait.",
      handsOnEffort: "15–30 mins",
      approvalWait: "Instant / Self-service",
      biggestBlocker: "You must be a Workspace Admin in Linear to register OAuth applications, and the app must be toggled to Public to allow external workspaces.",
      nextAction: "Open Linear Settings > API > OAuth applications and create a new application.",
    },
    managedOption: {
      availability: "Available through Composio",
      details: "Composio lists Linear as a managed OAuth2 toolkit. Exact managed scopes were not verified in this research pass.",
      customWhen: "Use a custom registration when you need specific scopes, custom branding, or workspace-level actor tokens.",
      evidence: "Estimated",
    },
    prerequisites: [
      { requirement: "A Linear workspace where you have Admin privileges", owner: "Developer", condition: "Always" },
      { requirement: "A callback / redirect URI for your application", owner: "Developer", condition: "Always" },
    ],
    scopes: [
      { name: "read", access: "Read access for the user's account data", why: "Always included by default; needed for any data retrieval.", sensitivity: "Standard", sourceId: "ln-auth" },
      { name: "write", access: "General write access to the user's account", why: "Needed if the agent updates issues, labels, or project settings.", sensitivity: "Broad", sourceId: "ln-auth" },
      { name: "issues:create", access: "Create new issues and attachments only", why: "A narrower alternative to full write access when the agent only files new issues.", sensitivity: "Narrow write", sourceId: "ln-auth" },
      { name: "comments:create", access: "Create new issue comments", why: "Useful for agents that add context or updates to existing issues without broader write access.", sensitivity: "Narrow write", sourceId: "ln-auth" },
    ],
    stages: [
      { id: "register", title: "Create the OAuth application", owner: "Developer (Workspace Admin)", goal: "Register a new app with correct callback URI.", steps: [{ action: "In Linear, go to Settings > API > OAuth applications, click the + icon, fill in the app name, developer URL, and callback URI.", result: "A Client ID and Client Secret for your application.", url: "https://linear.app/settings/api/applications", sourceId: "ln-auth" }] },
      { id: "configure", title: "Enable public access and refresh tokens", owner: "Developer", goal: "Allow external workspaces to install the app.", steps: [{ action: "Toggle the Public switch to ON so other workspaces can authorize your app. Enable refresh token support for token rotation.", result: "The app is publicly installable and supports long-lived sessions.", sourceId: "ln-auth" }] },
      { id: "authorize", title: "Implement the OAuth flow", owner: "Developer", goal: "Direct users to Linear's authorize endpoint and exchange the code for tokens.", steps: [{ action: "Redirect users to https://linear.app/oauth/authorize with your client_id, redirect_uri, response_type=code, and comma-separated scopes. Exchange the returned code at https://api.linear.app/oauth/token.", result: "An access_token and refresh_token pair for GraphQL API access.", url: "https://developers.linear.app/docs/oauth/authentication", sourceId: "ln-auth" }] },
      { id: "test", title: "Test against the GraphQL API", owner: "Developer", goal: "Verify the agent can read and create issues.", steps: [{ action: "Use the access token in an Authorization: Bearer header against https://api.linear.app/graphql to run a test query.", result: "A successful GraphQL response confirming issue access.", url: "https://developers.linear.app/docs/graphql/working-with-the-graphql-api", sourceId: "ln-api" }] },
    ],
    review: { requirement: "None", condition: "Linear does not require provider review for OAuth applications. Any workspace can install a public app immediately.", decisionOwner: "End user / workspace admin", evidence: [], wait: "Instant" },
    blockers: [
      { symptom: "Cannot find the OAuth applications section in Settings.", cause: "You may not have Workspace Admin privileges in your Linear workspace.", recovery: "Ask a Workspace Admin to grant you admin access, or create a dedicated developer workspace.", url: "https://linear.app/settings/api/applications" },
      { symptom: "External workspaces cannot see or authorize the app.", cause: "The Public toggle may not be enabled on the OAuth application.", recovery: "Edit the app in Settings > API > OAuth applications and toggle Public to ON." },
    ],
    handoffs: { agent: ["Map agent actions to the narrowest Linear scopes", "Construct the OAuth authorize URL", "Draft GraphQL queries for issue operations"], developer: ["Register the OAuth app with Workspace Admin access", "Secure client credentials", "Implement token exchange and refresh"], provider: ["Each user or workspace admin decides whether to authorize the app"] },
    sources: [
      { id: "ln-auth", title: "Linear OAuth authentication", url: "https://developers.linear.app/docs/oauth/authentication", publisher: "Linear", accessedAt: checkedAt },
      { id: "ln-api", title: "Working with the GraphQL API", url: "https://developers.linear.app/docs/graphql/working-with-the-graphql-api", publisher: "Linear", accessedAt: checkedAt },
    ],
    limitations: ["No Linear OAuth application was registered or tested by this project.", "Linear's scoping model uses comma-separated values, not space-separated as noted in some earlier documentation."],
  },
  {
    schemaVersion: "1.0",
    id: "notion-workspace-agent",
    status: "Researched draft",
    provider: { name: "Notion", website: "https://notion.so", initials: "NT", tone: "charcoal", checkedAt },
    scenario: {
      capability: "Let an agent read and write pages and databases in a customer's Notion workspace",
      audience: "External Notion users via public integration",
      registrationPath: "Public integration created in the Notion Integrations portal",
      assumptions: ["The agent needs to access pages and databases the user explicitly shares", "The developer wants external users (not just their own workspace) to authorize the integration"],
    },
    summary: {
      difficulty: "Moderate",
      reason: "Registration is self-service, but Notion's unique page-picker permission model replaces traditional OAuth scopes. The developer must handle dynamic access where users choose exactly which pages to share during authorization.",
      handsOnEffort: "20–40 mins",
      approvalWait: "Instant for self-service; Notion Marketplace listing requires separate review",
      biggestBlocker: "Notion does not use traditional string scopes — users control access via a page picker during authorization. Your app can only access explicitly shared pages.",
      nextAction: "Create a public integration at notion.so/profile/integrations.",
    },
    managedOption: {
      availability: "Available through Composio",
      details: "Composio lists Notion as a managed OAuth2 toolkit. Exact managed capabilities were not verified in this research pass.",
      customWhen: "Use a custom public integration when you need your own app branding, specific capabilities, or full control over the authorization flow.",
      evidence: "Estimated",
    },
    prerequisites: [
      { requirement: "A Notion account with access to the Integrations portal", owner: "Developer", condition: "Always" },
      { requirement: "An HTTPS redirect URI for the OAuth callback", owner: "Developer", condition: "Always" },
      { requirement: "Users must share specific pages with the integration during authorization", owner: "End user", condition: "Always — the page picker is mandatory" },
    ],
    scopes: [
      { name: "(page picker)", access: "Read and write access to user-selected pages and databases", why: "Notion replaces traditional scopes with a page picker modal. The user selects exactly which pages and databases to share during authorization.", sensitivity: "User-controlled", sourceId: "nt-auth" },
      { name: "Read user information (capability)", access: "Access the authorizing user's name and email", why: "Optional capability enabled in the integration settings for social login or user identification.", sensitivity: "Standard", sourceId: "nt-auth" },
    ],
    stages: [
      { id: "register", title: "Create a public integration", owner: "Developer", goal: "Register a public integration to get OAuth credentials.", steps: [{ action: "Go to notion.so/profile/integrations, click New integration, choose Public integration, set the name, logo, redirect URIs, and installation scope.", result: "A Client ID and Client Secret for your public integration.", url: "https://www.notion.so/profile/integrations", sourceId: "nt-auth" }] },
      { id: "configure", title: "Set capabilities and installation scope", owner: "Developer", goal: "Choose whether any workspace can install or only selected workspaces.", steps: [{ action: "In the integration settings, configure capabilities (e.g., read user info) and set the installation scope. Note: installation scope cannot be changed after creation.", result: "The integration is configured with the correct capabilities.", sourceId: "nt-auth" }] },
      { id: "authorize", title: "Implement the OAuth flow", owner: "Developer", goal: "Direct users to Notion's authorization endpoint and exchange the code for tokens.", steps: [{ action: "Redirect users to https://api.notion.com/v1/oauth/authorize with client_id, response_type=code, owner=user, and redirect_uri. Exchange the returned code at https://api.notion.com/v1/oauth/token using Basic auth (Base64 of client_id:client_secret).", result: "An access_token scoped to the pages the user selected in the page picker.", url: "https://developers.notion.com/docs/authorization", sourceId: "nt-auth" }] },
      { id: "test", title: "Test API access with selected pages", owner: "Developer", goal: "Verify the agent can read and write the user-shared pages.", steps: [{ action: "Use the access token with Authorization: Bearer and Notion-Version: 2022-06-28 headers to search or retrieve pages via the Notion API.", result: "Successful API responses for the pages the user shared.", url: "https://developers.notion.com/reference/intro", sourceId: "nt-api" }] },
    ],
    review: { requirement: "None for self-service distribution", condition: "Public integrations can be installed by any workspace without Notion review. Marketplace listing is a separate, optional submission process.", decisionOwner: "End user / workspace member", evidence: [], wait: "Instant for self-service" },
    blockers: [
      { symptom: "The integration cannot see any pages or databases.", cause: "Users must explicitly select pages to share in the page picker during authorization. If no pages are selected, the integration has no access.", recovery: "Guide users to select the relevant pages and databases during the OAuth consent step. Users can also share pages later from the Notion sharing menu.", url: "https://developers.notion.com/docs/authorization" },
      { symptom: "Installation scope cannot be changed.", cause: "Notion locks the installation scope (any workspace vs. selected workspaces) at creation time.", recovery: "Create a new integration with the desired installation scope.", url: "https://www.notion.so/profile/integrations" },
    ],
    handoffs: { agent: ["Map agent actions to Notion API endpoints", "Construct the OAuth authorize URL", "Draft API calls for page and database operations"], developer: ["Create and configure the public integration", "Secure client credentials", "Implement token exchange", "Guide users to share relevant pages"], provider: ["Each user decides which pages to share via the page picker", "Notion reviews Marketplace listings separately"] },
    sources: [
      { id: "nt-auth", title: "Notion Authorization guide", url: "https://developers.notion.com/docs/authorization", publisher: "Notion", accessedAt: checkedAt },
      { id: "nt-api", title: "Notion API Reference", url: "https://developers.notion.com/reference/intro", publisher: "Notion", accessedAt: checkedAt },
    ],
    limitations: ["No Notion integration was created or tested by this project.", "The page-picker model means traditional scope comparisons do not directly apply.", "Marketplace listing was not investigated."],
  },
];

export function getGuide(id: string) {
  return guides.find((guide) => guide.id === id);
}

export function getSource(guide: Guide, id: string) {
  return guide.sources.find((source) => source.id === id);
}
