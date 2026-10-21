"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { ResearchResult } from "@/lib/research-contract";

type State =
  | { kind: "idle" }
  | { kind: "error"; message: string; title?: string }
  | { kind: "known"; name: string; id: string }
  | { kind: "ambiguous" }
  | { kind: "researching"; input: string }
  | { kind: "result"; input: string; result: ResearchResult; shareId?: string };

const known = [
  { match: ["github", "github.com"], name: "GitHub", id: "github-repository-agent" },
  { match: ["google calendar", "calendar.google.com"], name: "Google Calendar", id: "google-calendar-event-reader" },
  { match: ["slack", "slack.com"], name: "Slack", id: "slack-cross-workspace-poster" },
  { match: ["discord", "discord.com"], name: "Discord", id: "discord-bot-agent" },
  { match: ["linear", "linear.app"], name: "Linear", id: "linear-issue-tracker-agent" },
  { match: ["notion", "notion.so"], name: "Notion", id: "notion-workspace-agent" },
];

export function ResearchForm() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return setState({ kind: "error", message: "Enter an app name or website first." });
    if (value.length > 160) return setState({ kind: "error", message: "Keep the app name or website under 160 characters." });
    if (/^https?:\/\//i.test(value)) {
      try { new URL(value); } catch { return setState({ kind: "error", message: "That website address is not valid." }); }
    }
    const normalized = value.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (normalized === "google" || normalized === "microsoft") return setState({ kind: "ambiguous" });
    const guide = known.find((item) => item.match.includes(normalized));
    if (guide) return setState({ kind: "known", name: guide.name, id: guide.id });
    setState({ kind: "researching", input: value });
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });
      const payload = await response.json() as { result?: ResearchResult; shareId?: string; error?: string; detail?: string };
      if (!response.ok || !payload.result) {
        setState({ kind: "error", title: response.status === 503 ? "Research needs server setup." : "Research could not complete.", message: payload.error || payload.detail || "Try again." });
        return;
      }
      setState({ kind: "result", input: value, result: payload.result, shareId: payload.shareId });
    } catch {
      setState({ kind: "error", message: "The research request could not reach the server. Try again." });
    }
  }

  return (
    <section className="research-panel" id="generate" aria-labelledby="generate-title">
      <div className="research-copy">
        <p className="eyebrow light">Outside the library</p>
        <h2 id="generate-title">Bring an unfamiliar app.</h2>
        <p>Enter a provider name or website. We&apos;ll first resolve what you mean, then research official OAuth sources.</p>
        <div className="agent-steps" aria-label="Research process">
          <span><b>01</b> Identify</span><i aria-hidden="true" />
          <span><b>02</b> Investigate</span><i aria-hidden="true" />
          <span><b>03</b> Build guide</span>
        </div>
      </div>
      <div className="research-form-wrap">
        <form onSubmit={submit} noValidate>
          <label htmlFor="provider-input">App name or website</label>
          <div className="research-input-row">
            <input id="provider-input" value={input} onChange={(event) => { setInput(event.target.value); setState({ kind: "idle" }); }} placeholder="e.g. Figma or figma.com" />
            <button type="submit">Research app <span aria-hidden="true">→</span></button>
          </div>
          <p className="form-note">Use public provider information only. Never enter client secrets or access tokens.</p>
        </form>
        <div className="form-result" aria-live="polite">
          {state.kind === "error" && <p className="result error"><strong>{state.title || "Check the input."}</strong> {state.message}</p>}
          {state.kind === "known" && <p className="result known"><strong>{state.name} is already researched.</strong> <Link href={`/guides/${state.id}`}>Open its guide →</Link></p>}
          {state.kind === "ambiguous" && (
            <div className="result ambiguous">
              <strong>Which product do you mean?</strong>
              <p>A company name can map to several OAuth providers. Choose a product or enter its exact website.</p>
              <button type="button" onClick={() => { setInput("Google Calendar"); setState({ kind: "idle" }); }}>Google Calendar</button>
              <button type="button" onClick={() => { setInput("Google Drive"); setState({ kind: "idle" }); }}>Google Drive</button>
            </div>
          )}
          {state.kind === "researching" && (
            <div className="result researching"><strong>Researching {state.input}</strong><span className="research-spinner" aria-hidden="true" /><p>Resolving the provider, reading official OAuth pages, and checking managed options.</p></div>
          )}
          {state.kind === "result" && (
            <div className="result research-result">
              <div className="result-heading"><div><strong>{state.result.provider.name}</strong><small>{state.result.provider.canonicalWebsite}</small></div><span className={`result-status ${state.result.status}`}>{state.result.status.replace("_", " ")}</span></div>
              <p>{state.result.provider.identityReason}</p>
              <div className="research-result-columns"><div><b>Next action</b><span>{state.result.nextAction}</span></div><div><b>Managed OAuth</b><span>{state.result.managedOption.availability}: {state.result.managedOption.details}</span></div></div>
              <details><summary>Show research findings <span>+</span></summary><div className="finding-group"><b>Setup</b><ul>{state.result.setup.map((item) => <li key={item}>{item}</li>)}</ul><b>Scopes</b><ul>{state.result.scopeFindings.map((item) => <li key={item}>{item}</li>)}</ul><b>Test, launch, and review</b><ul>{[...state.result.testAndLaunch, ...state.result.review].map((item) => <li key={item}>{item}</li>)}</ul><b>Support</b><ul>{state.result.support.map((item) => <li key={item}>{item}</li>)}</ul></div></details>
              <div className="result-sources"><b>Official sources read</b>{state.result.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title} ↗</a>)}</div>
              {state.shareId && (
                <div style={{ marginTop: "16px", marginBottom: "14px" }}>
                  <Link className="button primary" href={`/research/${state.shareId}`} style={{ display: "block", textAlign: "center", padding: "14px 20px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                    Open complete end-to-end guide →
                  </Link>
                </div>
              )}
              {state.result.uncertainties.length > 0 && <p className="result-uncertainties"><b>Still uncertain:</b> {state.result.uncertainties.join(" ")}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
