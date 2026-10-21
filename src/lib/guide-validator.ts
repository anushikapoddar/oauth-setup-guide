import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "../../schema/guide.v1.schema.json";
import type { Guide } from "./guides";

type Owner = "agent" | "developer" | "customer" | "customer_admin" | "provider";

function owner(value: string): Owner {
  const normalized = value.toLowerCase();
  if (normalized.includes("admin")) return "customer_admin";
  if (normalized.includes("provider") || normalized.includes("google") || normalized.includes("slack")) return "provider";
  if (normalized.includes("customer") && !normalized.includes("developer")) return "customer";
  if (normalized.includes("agent") && !normalized.includes("developer")) return "agent";
  return "developer";
}

function claimRef(sourceId: string) {
  return `claim_${sourceId.replaceAll("-", "_")}`;
}

function firstClaim(guide: Guide) {
  return claimRef(guide.sources[0].id);
}

function timeEstimate(display: string, guide: Guide, effort: boolean) {
  const lower = display.toLowerCase();
  const kind = lower.includes("not measured") || lower.startsWith("unknown") ? "unknown" : "published";
  return {
    kind,
    display,
    basis: kind === "published" ? "Provider documentation cited by this guide" : "No completed dry run or defensible published duration",
    condition: effort ? "For the stated scenario and listed prerequisites" : "Only for the review or approval path named in this guide",
    claimRefs: [kind === "unknown" ? "claim_limits" : firstClaim(guide)],
  };
}

function toContractRecord(guide: Guide) {
  const defaultClaim = firstClaim(guide);
  return {
    schemaVersion: guide.schemaVersion,
    id: guide.id,
    status: guide.status === "Researched draft" ? "researched_draft" : guide.status === "Checked guide" ? "checked_guide" : "partial",
    provider: {
      name: guide.provider.name,
      website: guide.provider.website,
      oauthSupport: "supported",
      checkedAt: guide.provider.checkedAt,
      claimRefs: [defaultClaim],
    },
    scenario: {
      capability: guide.scenario.capability,
      audience: guide.scenario.audience,
      registrationPath: guide.scenario.registrationPath.toLowerCase().includes("managed") ? "managed" : guide.scenario.registrationPath.toLowerCase().includes("custom") ? "custom" : "undecided",
      assumptions: guide.scenario.assumptions,
    },
    summary: {
      difficulty: { rating: guide.summary.difficulty.toLowerCase(), reason: guide.summary.reason, claimRefs: [defaultClaim] },
      handsOnEffort: timeEstimate(guide.summary.handsOnEffort, guide, true),
      approvalWait: timeEstimate(guide.summary.approvalWait, guide, false),
      biggestBlocker: guide.summary.biggestBlocker,
      nextAction: { text: guide.summary.nextAction, owner: "developer", url: null },
    },
    managedOption: {
      availability: guide.managedOption.availability.toLowerCase().startsWith("available") ? "available" : "unconfirmed",
      details: guide.managedOption.details,
      customWhen: guide.managedOption.customWhen,
      claimRefs: [defaultClaim],
    },
    prerequisites: guide.prerequisites.map((item, index) => ({
      id: `prerequisite_${index + 1}`,
      requirement: item.requirement,
      owner: owner(item.owner),
      condition: item.condition,
      nextAction: { text: `Prepare: ${item.requirement}`, owner: owner(item.owner), url: null },
      claimRefs: [defaultClaim],
    })),
    scopes: guide.scopes.map((scope) => ({
      name: scope.name,
      plainLanguageAccess: scope.access,
      whyNeeded: scope.why,
      sensitivity: scope.sensitivity.toLowerCase().includes("sensitive") ? "sensitive" : scope.sensitivity.toLowerCase().includes("restricted") ? "restricted" : scope.sensitivity.toLowerCase().includes("unknown") ? "unknown" : "standard",
      claimRefs: [claimRef(scope.sourceId)],
    })),
    stages: guide.stages.map((stage) => ({
      id: stage.id,
      title: stage.title,
      accessState: stage.id === "prepare" || stage.id === "register" || stage.id === "test" || stage.id === "submit" || stage.id === "launch" ? stage.id : "decide",
      entryCondition: `The prior stage is complete for: ${guide.scenario.capability}`,
      exitResult: stage.goal,
      owner: owner(stage.owner),
      nextAction: { text: stage.steps[0].action, owner: owner(stage.owner), url: stage.steps[0].url ?? null },
      steps: stage.steps.map((step, index) => ({
        number: index + 1,
        action: step.action,
        condition: `When completing the ${stage.title.toLowerCase()} stage`,
        owner: owner(stage.owner),
        expectedResult: step.result,
        officialUrl: step.url ?? null,
        claimRefs: [claimRef(step.sourceId)],
      })),
    })),
    review: {
      requirement: guide.review.requirement.toLowerCase().includes("conditional") || guide.review.requirement.toLowerCase().includes("dependent") ? "conditional" : guide.review.requirement.toLowerCase().includes("required") ? "required" : "unknown",
      condition: guide.review.condition,
      decisionOwner: guide.review.decisionOwner,
      evidenceToPrepare: guide.review.evidence,
      submissionUrl: null,
      claimRefs: [defaultClaim],
    },
    blockers: guide.blockers.map((blocker) => ({
      symptom: blocker.symptom,
      possibleCause: blocker.cause,
      recovery: blocker.recovery,
      owner: "developer",
      officialHelpUrl: blocker.url ?? null,
      claimRefs: [defaultClaim],
    })),
    handoffs: {
      agentCanPrepare: guide.handoffs.agent,
      humanMustDo: guide.handoffs.developer,
      providerDecides: guide.handoffs.provider,
    },
    sources: guide.sources.map((source) => ({ ...source, supportingNote: `Supports claims used in the ${guide.provider.name} guide.` })),
    claims: [
      ...guide.sources.map((source) => ({
        id: claimRef(source.id),
        statement: `${source.title} supports the linked provider requirements in this guide.`,
        label: "official_source",
        condition: `For the ${guide.scenario.capability.toLowerCase()} scenario described here`,
        basis: `Official ${source.publisher} documentation checked on ${source.accessedAt}`,
        sourceRefs: [source.id],
        attemptRef: null,
      })),
      {
        id: "claim_limits",
        statement: guide.limitations.join(" "),
        label: "not_verified",
        condition: "Until a matching setup attempt is recorded",
        basis: "The project has no matching authenticated attempt record",
        sourceRefs: [],
        attemptRef: null,
      },
    ],
    attempts: [],
    limitations: guide.limitations,
  };
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

export function validateLibrary(guides: Guide[]) {
  for (const guide of guides) {
    const record = toContractRecord(guide);
    if (!validate(record)) {
      throw new Error(`Guide ${guide.id} failed schema v1.0 validation: ${ajv.errorsText(validate.errors)}`);
    }

    const sourceIds = new Set(record.sources.map((source) => source.id));
    const claimIds = new Set(record.claims.map((claim) => claim.id));
    const attemptIds = new Set<string>();
    for (const claim of record.claims) {
      for (const ref of claim.sourceRefs) if (!sourceIds.has(ref)) throw new Error(`Guide ${guide.id} has unresolved source ${ref}`);
      if (claim.label === "observed" && (!claim.attemptRef || !attemptIds.has(claim.attemptRef))) throw new Error(`Guide ${guide.id} has an observed claim without an attempt`);
    }
    for (const ref of record.provider.claimRefs) if (!claimIds.has(ref)) throw new Error(`Guide ${guide.id} has unresolved claim ${ref}`);
  }
  return guides;
}
