import { randomUUID } from "node:crypto";
import { researchResultSchema, isResearchResult } from "@/lib/research-contract";
import { saveResearch } from "@/lib/research-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_INPUT_LENGTH = 160;
const REQUEST_TIMEOUT_MS = 75_000;
const DEFAULT_MODEL = "gpt-4.1-mini";
const DEFAULT_GEMINI_MODEL = "gemini-3-flash-preview";
const DEFAULT_ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const DUPLICATE_WINDOW_MS = 30_000;
const recentRequests = new Map<string, number>();

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function normalizeInput(value: unknown) {
  if (typeof value !== "string") return { error: "Enter an app name or website." };
  const input = value.trim();
  if (!input) return { error: "Enter an app name or website." };
  if (input.length > MAX_INPUT_LENGTH) return { error: `Keep the app name or website under ${MAX_INPUT_LENGTH} characters.` };
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      if (!url.hostname || ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname)) return { error: "Use a public provider website." };
      return { input, identityHint: url.hostname };
    } catch {
      return { error: "That website address is not valid." };
    }
  }
  return { input, identityHint: input };
}

const researchInstructions = `You are an OAuth launch research agent. Investigate one provider for a developer building a multi-user AI agent integration.

Research order and evidence rules:
1. Resolve the provider identity from the submitted name or website. If multiple products plausibly match, return status "ambiguous" and explain what the developer must clarify.
2. Find and read current official provider documentation first. Prefer the provider's developer documentation, OAuth/API reference, app registration, scopes, testing/sandbox, publication/distribution, review/verification, and support pages. Search snippets are not evidence. Use third-party sources only to identify a missing official page, never as the basis for a consequential requirement.
3. Determine whether the provider supports OAuth for the stated integration and identify the exact registration path.
4. Investigate: registration fields and redirect rules; scopes in plain language; test mode/test users; public production/distribution; review or verification; customer/admin approval; and official support or recovery paths.
5. Check whether Composio documents a managed OAuth option for this provider. Treat exact method/scope coverage as unconfirmed unless an official Composio page supports it.
6. Keep provider facts separate from estimates. If a wait time is not published for the exact condition, say unknown. Do not claim that a registration or approval was completed.

Return only JSON matching the supplied schema. Use short actionable sentences. Prefix every finding with "Confirmed:", "Estimate:", or "Unknown:" so facts, planning estimates, and unanswered questions stay separate. Include at least three official provider sources when available. Every source URL must be a real HTTPS URL you actually read. Put unresolved questions in uncertainties and finish with one concrete nextAction.`;

function hasValidSourceUrls(value: ResearchResultLike) {
  return value.sources.every((source) => /^https:\/\//i.test(source.url))
    && (!value.managedOption.sourceUrl || /^https:\/\//i.test(value.managedOption.sourceUrl));
}

type ResearchResultLike = { sources: Array<{ url: string }>; managedOption: { sourceUrl: string } };

function geminiResponseSchema() {
  // Gemini's responseSchema accepts the shared JSON Schema vocabulary but does
  // not need JSON Schema's validation-only keywords.
  const schema = JSON.parse(JSON.stringify(researchResultSchema)) as Record<string, unknown>;
  function strip(value: unknown) {
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    delete object.additionalProperties;
    delete object.minItems;
    for (const child of Object.values(object)) strip(child);
  }
  strip(schema);
  return schema;
}

async function runAnthropic(input: string, identityHint: string, apiKey: string, signal: AbortSignal) {
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    signal,
    body: JSON.stringify({
      model,
      max_tokens: 3500,
      system: researchInstructions + "\n\nReturn strictly valid JSON adhering to this schema:\n" + JSON.stringify(researchResultSchema),
      messages: [
        { role: "user", content: `Investigate this app/provider input: ${input}\nIdentity hint: ${identityHint}\nReturn JSON only.` },
      ],
    }),
  });
  const payload = await response.json() as { content?: Array<{ text?: string }>; error?: { message?: string } };
  let text = payload.content?.[0]?.text || "";
  text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  return { response, payload, text, model };
}

async function runOpenAI(input: string, identityHint: string, apiKey: string, signal: AbortSignal) {
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    signal,
    body: JSON.stringify({
      model,
      store: false,
      tools: [{ type: "web_search_preview", search_context_size: "high" }],
      input: [
        { role: "system", content: researchInstructions },
        { role: "user", content: `Investigate this app/provider input: ${input}\nIdentity hint: ${identityHint}` },
      ],
      text: { format: { type: "json_schema", name: "oauth_research_result", strict: true, schema: researchResultSchema } },
    }),
  });
  const payload = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }>; error?: { message?: string } };
  const text = payload.output_text || payload.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("") || "";
  return { response, payload, text, model };
}

async function runGemini(input: string, identityHint: string, apiKey: string, signal: AbortSignal) {
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: researchInstructions }] },
      contents: [{ role: "user", parts: [{ text: `Investigate this app/provider input: ${input}\nIdentity hint: ${identityHint}` }] }],
      tools: [{ google_search: {} }],
      generationConfig: { responseMimeType: "application/json", responseSchema: geminiResponseSchema() },
    }),
  });
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  return { response, payload, text, model };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { input?: unknown } | null;
  const normalized = normalizeInput(body?.input);
  if ("error" in normalized) return json({ error: normalized.error }, 400);

  const requestKey = normalized.input.toLowerCase();
  const previousRequest = recentRequests.get(requestKey);
  if (previousRequest && Date.now() - previousRequest < DUPLICATE_WINDOW_MS) {
    return json({ error: "That app is already being researched. Wait 30 seconds before retrying." }, 429);
  }
  recentRequests.set(requestKey, Date.now());
  for (const [key, timestamp] of recentRequests) if (Date.now() - timestamp >= DUPLICATE_WINDOW_MS) recentRequests.delete(key);

  const provider = process.env.RESEARCH_PROVIDER || (
    process.env.ANTHROPIC_API_KEY
      ? "anthropic"
      : process.env.GEMINI_API_KEY
      ? "gemini"
      : "openai"
  );
  const apiKey = provider === "anthropic"
    ? process.env.ANTHROPIC_API_KEY
    : provider === "gemini"
    ? process.env.GEMINI_API_KEY
    : process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({
      error: "Live research is not configured yet.",
      detail: "Add ANTHROPIC_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY to the server environment. The key is never accepted from the browser.",
      code: "missing_server_configuration",
    }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const runId = randomUUID();
  try {
    const adapterResult = provider === "gemini"
      ? await runGemini(normalized.input, normalized.identityHint, apiKey, controller.signal)
      : provider === "anthropic"
      ? await runAnthropic(normalized.input, normalized.identityHint, apiKey, controller.signal)
      : await runOpenAI(normalized.input, normalized.identityHint, apiKey, controller.signal);
    const { response, payload, text, model } = adapterResult;
    if (!response.ok) return json({ error: "The research provider returned an error.", detail: payload.error?.message || "No further detail was returned.", runId }, 502);
    let parsedResult: unknown;
    try { parsedResult = JSON.parse(text); } catch { return json({ error: "The research agent returned invalid structured output.", runId }, 502); }
    if (!isResearchResult(parsedResult) || !hasValidSourceUrls(parsedResult)) return json({ error: "The research agent returned incomplete or unsupported evidence.", runId }, 502);
    const shareId = `${parsedResult.provider.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "provider"}-${randomUUID().slice(0, 8)}`;
    await saveResearch({ id: shareId, input: normalized.input, result: parsedResult });
    return json({ runId, input: normalized.input, provider, model, shareId, result: parsedResult });
  } catch (error) {
    const message = error instanceof DOMException && error.name === "AbortError" ? "Research timed out after 75 seconds." : "Could not reach the research provider.";
    return json({ error: message, runId }, 504);
  } finally {
    clearTimeout(timeout);
  }
}
