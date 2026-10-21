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
  },
} as const;

export type ResearchResult = {
  status: "complete" | "partial" | "not_oauth" | "ambiguous";
  provider: { name: string; canonicalWebsite: string; identityReason: string };
  oauthSupport: "confirmed" | "not_confirmed" | "not_supported";
  managedOption: { availability: "available" | "unavailable" | "unconfirmed"; details: string; sourceUrl: string };
  setup: string[];
  scopeFindings: string[];
  testAndLaunch: string[];
  review: string[];
  support: string[];
  nextAction: string;
  sources: Array<{ title: string; url: string; publisher: string; whyItMatters: string }>;
  uncertainties: string[];
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
