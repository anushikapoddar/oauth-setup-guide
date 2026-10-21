export const researchResultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "provider", "oauthSupport", "managedOption", "setup", "scopeFindings", "testAndLaunch", "review", "support", "nextAction", "sources", "uncertainties"],
  properties: {
    status: { type: "string", enum: ["complete", "partial", "not_oauth", "ambiguous"] },
    provider: {
      type: "object", additionalProperties: false, required: ["name", "canonicalWebsite", "identityReason"],
      properties: {
        name: { type: "string" }, canonicalWebsite: { type: "string" }, identityReason: { type: "string" },
      },
    },
    oauthSupport: { type: "string", enum: ["confirmed", "not_confirmed", "not_supported"] },
    managedOption: {
      type: "object", additionalProperties: false, required: ["availability", "details", "sourceUrl"],
      properties: { availability: { type: "string", enum: ["available", "unavailable", "unconfirmed"] }, details: { type: "string" }, sourceUrl: { type: "string" } },
    },
    setup: { type: "array", items: { type: "string" } },
    scopeFindings: { type: "array", items: { type: "string" } },
    testAndLaunch: { type: "array", items: { type: "string" } },
    review: { type: "array", items: { type: "string" } },
    support: { type: "array", items: { type: "string" } },
    nextAction: { type: "string" },
    sources: {
      type: "array", minItems: 1, items: {
        type: "object", additionalProperties: false, required: ["title", "url", "publisher", "whyItMatters"],
        properties: { title: { type: "string" }, url: { type: "string" }, publisher: { type: "string" }, whyItMatters: { type: "string" } },
      },
    },
    uncertainties: { type: "array", items: { type: "string" } },
    // Optional structured fields for rich end-to-end rendering
    difficulty: { type: "string", enum: ["low", "moderate", "high", "unknown"] },
    difficultyReason: { type: "string" },
    handsOnEffort: { type: "string" },
    approvalWait: { type: "string" },
    biggestBlocker: { type: "string" },
  },
} as const;

export type ResearchResult = {
  status: "complete" | "partial" | "not_oauth" | "ambiguous";
  provider: { name: string; canonicalWebsite: string; identityReason: string };
  oauthSupport: "confirmed" | "not_confirmed" | "not_supported";
  managedOption: { availability: "available" | "unavailable" | "unconfirmed"; details: string; sourceUrl: string; customWhen?: string };
  setup: string[];
  scopeFindings: string[];
  testAndLaunch: string[];
  review: string[];
  support: string[];
  nextAction: string;
  sources: Array<{ title: string; url: string; publisher: string; whyItMatters: string }>;
  uncertainties: string[];
  difficulty?: "low" | "moderate" | "high" | "unknown";
  difficultyReason?: string;
  handsOnEffort?: string;
  approvalWait?: string;
  biggestBlocker?: string;
};

export function isResearchResult(value: unknown): value is ResearchResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<ResearchResult>;
  return typeof result.status === "string"
    && typeof result.provider?.name === "string"
    && typeof result.provider?.canonicalWebsite === "string"
    && typeof result.oauthSupport === "string"
    && typeof result.nextAction === "string"
    && Array.isArray(result.sources)
    && result.sources.length > 0
    && result.sources.every((source) => source && typeof source.url === "string" && typeof source.title === "string");
}

export type DisplayGuidePrereq = { requirement: string; owner: string; condition: string };
export type DisplayGuideScope = { name: string; plainLanguageAccess: string; whyNeeded: string; sensitivity: string };
export type DisplayGuideStage = { id: string; title: string; owner: string; goal: string; steps: Array<{ action: string; result: string; url?: string }> };
export type DisplayGuideBlocker = { symptom: string; cause: string; recovery: string; url?: string };

export type DisplayGuide = {
  providerName: string;
  canonicalWebsite: string;
  status: string;
  difficulty: "Low" | "Moderate" | "High";
  difficultyReason: string;
  handsOnEffort: string;
  approvalWait: string;
  biggestBlocker: string;
  nextAction: string;
  scenario: {
    capability: string;
    audience: string;
    registrationPath: string;
    assumptions: string[];
  };
  managedOption: {
    availability: string;
    details: string;
    customWhen: string;
    sourceUrl?: string;
  };
  prerequisites: DisplayGuidePrereq[];
  scopes: DisplayGuideScope[];
  stages: DisplayGuideStage[];
  review: {
    requirement: string;
    decisionOwner: string;
    wait: string;
    condition: string;
    evidence: string[];
  };
  blockers: DisplayGuideBlocker[];
  handoffs: {
    agent: string[];
    developer: string[];
    provider: string[];
  };
  sources: Array<{ title: string; url: string; publisher: string; whyItMatters: string }>;
  uncertainties: string[];
};

export function toDisplayGuide(result: ResearchResult): DisplayGuide {
  const providerName = result.provider.name;
  const clean = (str: string) => str.replace(/^(Confirmed|Estimate|Unknown):\s*/i, "").trim();

  // Determine difficulty
  let difficulty: "Low" | "Moderate" | "High" = "Moderate";
  const allText = [...result.setup, ...result.scopeFindings, ...result.review, ...result.testAndLaunch].join(" ").toLowerCase();
  const requiresVerification = allText.includes("verification") || allText.includes("security review") || allText.includes("sensitive scope") || allText.includes("audit") || allText.includes("marketplace review");
  const requiresAdmin = allText.includes("admin") || allText.includes("organization approval") || allText.includes("workspace admin");

  if (requiresVerification) {
    difficulty = "High";
  } else if (!requiresAdmin && (allText.includes("self-service") || allText.includes("instant") || allText.includes("developer settings"))) {
    difficulty = "Low";
  }

  const difficultyReason = result.difficultyReason || (
    difficulty === "High"
      ? `${providerName} requires formal provider verification or compliance audit before production launch.`
      : difficulty === "Moderate"
      ? `${providerName} registration requires workspace administrative consent and explicit redirect configuration.`
      : `${providerName} offers straightforward self-service registration and immediate test credentials.`
  );

  const handsOnEffort = result.handsOnEffort || "15–30 minutes";
  const approvalWait = result.approvalWait || (
    difficulty === "High" ? "3–5 business days" : "Instant / Self-service"
  );

  const biggestBlocker = result.biggestBlocker || (
    difficulty === "High"
      ? "Provider review delay or sensitive scope justification rejected"
      : requiresAdmin
      ? `Requires ${providerName} workspace administrator access to approve OAuth registration`
      : "Exact HTTPS redirect URI mismatch during authorization code exchange"
  );

  // Prerequisites
  const prerequisites: DisplayGuidePrereq[] = [
    {
      requirement: `${providerName} Account & Workspace`,
      owner: "Developer",
      condition: `Active account on ${result.provider.canonicalWebsite} with permission to create applications.`,
    },
    {
      requirement: requiresAdmin ? "Workspace Administrator Privileges" : "Standard Developer Permissions",
      owner: requiresAdmin ? "Workspace Admin" : "Developer",
      condition: requiresAdmin ? `Admin rights required in ${providerName} workspace to register OAuth apps.` : "Ability to register OAuth apps in user settings.",
    },
    {
      requirement: "Public HTTPS Callback URL",
      owner: "Developer",
      condition: "Exact redirect URI matching your agent's callback endpoint (e.g. https://your-agent.com/auth/callback).",
    },
  ];

  // Scopes Table
  const scopes: DisplayGuideScope[] = [];
  if (result.scopeFindings && result.scopeFindings.length > 0) {
    for (const raw of result.scopeFindings) {
      const text = clean(raw);
      // Attempt to extract scope name from quotes e.g. 'read' or "write"
      const match = text.match(/['"`]([a-zA-Z0-9_:.-]+)['"`]/);
      const name = match ? match[1] : (text.split(" ")[0] || "read");
      const isSensitive = name.toLowerCase().includes("admin") || name.toLowerCase().includes("delete") || text.toLowerCase().includes("sensitive") || text.toLowerCase().includes("elevated");
      scopes.push({
        name,
        plainLanguageAccess: text,
        whyNeeded: `Enables agent to perform ${name.replace(/:/g, " ")} operations on user data.`,
        sensitivity: isSensitive ? "Sensitive" : "Standard",
      });
    }
  }
  if (scopes.length === 0) {
    scopes.push(
      { name: "read", plainLanguageAccess: "Read-only access to basic resources and user profile.", whyNeeded: "Authenticate user and read contextual data.", sensitivity: "Standard" },
      { name: "write", plainLanguageAccess: "Permission to create and update resources on user's behalf.", whyNeeded: "Allow agent to take actions.", sensitivity: "Standard" }
    );
  }

  // Stages & Steps
  const stages: DisplayGuideStage[] = [];
  const consoleSource = result.sources.find((s) => s.url.includes("setting") || s.url.includes("app") || s.url.includes("developer"))?.url || result.sources[0]?.url;

  stages.push({
    id: "stage-register",
    title: "Register OAuth Application",
    owner: "Developer",
    goal: `Create client credentials in the ${providerName} developer console.`,
    steps: [
      {
        action: `Log into ${result.provider.canonicalWebsite} and navigate to Developer / API settings.`,
        result: "Application creation dashboard is displayed.",
        url: consoleSource,
      },
      {
        action: "Enter your application name, description, and public logo.",
        result: `New OAuth application is created with Client ID generated.`,
      },
    ],
  });

  stages.push({
    id: "stage-configure",
    title: "Configure Redirect URIs and Scopes",
    owner: "Developer",
    goal: "Authorize callback URL and choose least-privilege permission scopes.",
    steps: [
      {
        action: "Add your agent's secure redirect URI to the allowed callback list.",
        result: "Redirect URI is saved. Exact string matching is enforced by provider.",
      },
      {
        action: `Select the requested scopes (${scopes.slice(0, 3).map((s) => s.name).join(", ")}).`,
        result: "Permission scopes are attached to client registration.",
      },
      {
        action: "Generate and securely store the Client Secret in your server environment.",
        result: "Client secret is recorded (never exposed in client-side code).",
      },
    ],
  });

  stages.push({
    id: "stage-test",
    title: "Test User Consent and Token Exchange",
    owner: "Developer",
    goal: "Verify the OAuth 2.0 authorization code flow end-to-end.",
    steps: [
      {
        action: `Initiate authorization request to ${providerName} authorization endpoint.`,
        result: "User consent screen renders requesting selected permissions.",
      },
      {
        action: "Authorize the app and intercept authorization code on redirect.",
        result: "Exchange code for access token via backend POST request.",
      },
      {
        action: "Execute a test API call using the retrieved access token.",
        result: "API returns 200 OK with authorized payload.",
      },
    ],
  });

  // Review
  const reviewFindings = result.review.map(clean);
  const review = {
    requirement: difficulty === "High" ? "Formal Provider Review & Verification" : "Self-service / Workspace Admin Consent",
    decisionOwner: difficulty === "High" ? `${providerName} Developer Review Team` : "Workspace Administrator / End User",
    wait: approvalWait,
    condition: reviewFindings[0] || `${providerName} allows immediate internal/development use.`,
    evidence: reviewFindings.length > 1 ? reviewFindings.slice(1) : [
      "Privacy policy and Terms of Service URLs hosted on your domain.",
      "Clear explanation of why each requested scope is necessary for agent functionality.",
      "Demonstration of user consent and data protection measures.",
    ],
  };

  // Blockers
  const blockers: DisplayGuideBlocker[] = [
    {
      symptom: "Invalid Redirect URI / redirect_uri_mismatch",
      cause: "The callback URL sent in the authorization request does not character-for-character match the registered URL in the console.",
      recovery: "Ensure protocol (https://), port, path, and trailing slashes match exactly between your code and provider settings.",
      url: consoleSource,
    },
    {
      symptom: "Admin Approval Required / Unauthorized Client",
      cause: `The user belongs to a managed ${providerName} organization where third-party integrations require admin authorization.`,
      recovery: "Request your workspace administrator to approve the client ID in organization security settings.",
    },
    {
      symptom: "Invalid Scope / Access Denied",
      cause: "Requesting a scope that is either restricted, misspelled, or not enabled on the application registration.",
      recovery: "Review the permissions table and verify that every scope in your authorization URL is enabled in the developer portal.",
    },
  ];

  // Handoffs
  const handoffs = {
    agent: [
      "Scaffold OAuth authorization URL with required scopes and CSRF state parameter.",
      "Validate redirect URI format and match against registered callback.",
      "Implement token exchange (POST code for token) and automated token refresh handling.",
      "Draft compliance justifications for requested scopes.",
    ],
    developer: [
      `Sign into ${providerName} and register the OAuth application.`,
      "Securely store Client Secret in private server environment variables.",
      "Configure DNS / domain ownership verification if required for production.",
      "Test user consent flow in a development workspace.",
    ],
    provider: [
      `Enforce workspace security policies and user consent screens.`,
      "Issue authorization codes, access tokens, and refresh tokens.",
      difficulty === "High" ? "Conduct app review and approve production distribution." : "Process self-service app installations.",
    ],
  };

  return {
    providerName,
    canonicalWebsite: result.provider.canonicalWebsite,
    status: result.status,
    difficulty,
    difficultyReason,
    handsOnEffort,
    approvalWait,
    biggestBlocker,
    nextAction: result.nextAction,
    scenario: {
      capability: `Integrate ${providerName} with multi-user AI agent workflows`,
      audience: "Multi-user agent integration",
      registrationPath: result.managedOption.availability === "available" ? "managed" : "custom",
      assumptions: [
        `Integrating with ${providerName} OAuth 2.0 API`,
        "Using Authorization Code grant with secure backend token exchange",
        "Deploying for external multi-user or cross-workspace access",
      ],
    },
    managedOption: {
      availability: result.managedOption.availability,
      details: result.managedOption.details,
      customWhen: "When requiring custom white-label branding, unmanaged private enterprise scopes, or direct provider credentials.",
      sourceUrl: result.managedOption.sourceUrl,
    },
    prerequisites,
    scopes,
    stages,
    review,
    blockers,
    handoffs,
    sources: result.sources,
    uncertainties: result.uncertainties,
  };
}
