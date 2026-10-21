"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyLink } from "@/components/copy-link";
import { toDisplayGuide } from "@/lib/research-contract";
import type { SavedResearch } from "@/lib/research-store";

export function ResearchGuideView({
  id,
  initialSaved,
}: {
  id: string;
  initialSaved?: SavedResearch;
}) {
  const [saved, setSaved] = useState<SavedResearch | undefined>(initialSaved);
  const [loading, setLoading] = useState(!initialSaved);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (initialSaved) return;

    // 1. Check if guide payload is passed directly in URL query param
    const searchParams = new URLSearchParams(window.location.search);
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        const item: SavedResearch = {
          id,
          input: parsed.provider?.name || id,
          createdAt: new Date().toISOString(),
          result: parsed,
        };
        setSaved(item);
        try {
          localStorage.setItem(`oauth_research_${id}`, JSON.stringify(item));
        } catch {}
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Could not parse data param:", err);
      }
    }

    // 2. Check browser localStorage
    try {
      const stored = localStorage.getItem(`oauth_research_${id}`);
      if (stored) {
        const item = JSON.parse(stored) as SavedResearch;
        setSaved(item);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Could not read from localStorage:", err);
    }

    setNotFound(true);
    setLoading(false);
  }, [id, initialSaved]);

  if (loading) {
    return (
      <main className="guide-page">
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <span className="research-spinner" style={{ margin: "0 auto 16px" }} aria-hidden="true" />
          <p style={{ color: "var(--color-text-muted)", fontSize: "16px" }}>Loading generated launch guide...</p>
        </div>
      </main>
    );
  }

  if (notFound || !saved) {
    return (
      <main className="guide-page" style={{ textAlign: "center", padding: "100px 20px" }}>
        <p className="eyebrow">Guide not found</p>
        <h1 style={{ fontSize: "36px", margin: "16px 0 24px" }}>That guide isn&apos;t in the library yet.</h1>
        <p style={{ maxWidth: "480px", margin: "0 auto 36px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          Return to the library or enter a provider name in the research tool to generate an official 9-section launch plan.
        </p>
        <Link href="/#generate" className="button primary" style={{ display: "inline-block", padding: "14px 28px", textDecoration: "none" }}>
          Research an app →
        </Link>
      </main>
    );
  }

  const guide = toDisplayGuide(saved.result);
  const initials = guide.providerName.slice(0, 2).toUpperCase();

  // If this guide is saved in client localStorage (serverless fallback), ensure copied share link includes the data
  const isClientOnly = !initialSaved;
  const shareUrl = typeof window !== "undefined" && isClientOnly
    ? `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(JSON.stringify(saved.result))}`
    : undefined;

  return (
    <main className="guide-page">
      <div className="guide-breadcrumb">
        <Link href="/#generate">← Research another app</Link>
        <CopyLink url={shareUrl} />
      </div>

      <section className="guide-hero">
        <div className="guide-title-row">
          <span className="provider-icon large blue" aria-hidden="true">{initials}</span>
          <div>
            <p className="eyebrow">Generated OAuth launch guide</p>
            <h1>{guide.providerName}</h1>
            <p>{guide.scenario.capability}</p>
          </div>
        </div>
        <div className="guide-meta">
          <span>{guide.status.replace("_", " ")}</span>
          <span>Generated {new Date(saved.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
          <a href={guide.canonicalWebsite} target="_blank" rel="noreferrer">Provider website ↗</a>
        </div>
      </section>

      <section className="readiness-panel" aria-labelledby="readiness-title">
        <div className="readiness-main">
          <p className="eyebrow light">At a glance</p>
          <h2 id="readiness-title">{guide.difficulty} difficulty</h2>
          <p>{guide.difficultyReason}</p>
          <div className="next-action">
            <span>Start here</span>
            <strong>{guide.nextAction}</strong>
          </div>
        </div>
        <dl>
          <div>
            <dt>Hands-on effort</dt>
            <dd>{guide.handsOnEffort}</dd>
          </div>
          <div>
            <dt>External wait</dt>
            <dd>{guide.approvalWait}</dd>
          </div>
          <div>
            <dt>Main blocker</dt>
            <dd>{guide.biggestBlocker}</dd>
          </div>
        </dl>
      </section>

      <div className="guide-layout">
        <aside className="guide-toc" aria-label="On this page">
          <strong>On this page</strong>
          <a href="#scenario">Scenario</a>
          <a href="#path">Choose a path</a>
          <a href="#prerequisites">Prerequisites</a>
          <a href="#permissions">Permissions</a>
          <a href="#steps">Setup steps</a>
          <a href="#review">Review</a>
          <a href="#blockers">Blockers</a>
          <a href="#handoffs">Handoffs</a>
          <a href="#evidence">Evidence</a>
        </aside>

        <article className="guide-content">
          <section id="scenario">
            <p className="section-number">01</p>
            <h2>Scenario this guide covers</h2>
            <div className="scenario-box">
              <p><strong>Audience</strong>{guide.scenario.audience}</p>
              <p><strong>Registration path</strong>{guide.scenario.registrationPath}</p>
            </div>
            <ul>
              {guide.scenario.assumptions.map((item, index) => (
                <li key={`assumption-${index}`}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="path">
            <p className="section-number">02</p>
            <h2>Choose managed or custom</h2>
            <div className="managed-box">
              <div>
                <span>{guide.managedOption.availability}</span>
                <small>Research status</small>
              </div>
              <p>{guide.managedOption.details}</p>
              <p><strong>Choose custom when:</strong> {guide.managedOption.customWhen}</p>
              {guide.managedOption.sourceUrl && (
                <a href={guide.managedOption.sourceUrl} target="_blank" rel="noreferrer">
                  Open supporting documentation ↗
                </a>
              )}
            </div>
          </section>

          <section id="prerequisites">
            <p className="section-number">03</p>
            <h2>Before you start</h2>
            <div className="prereq-list">
              {guide.prerequisites.map((item, index) => (
                <div key={`prereq-${item.requirement}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <strong>{item.requirement}</strong>
                    <small>{item.condition}</small>
                  </p>
                  <em>{item.owner}</em>
                </div>
              ))}
            </div>
          </section>

          <section id="permissions">
            <p className="section-number">04</p>
            <h2>Permissions in plain language</h2>
            <div className="scope-table" role="table" aria-label="OAuth scopes">
              {guide.scopes.map((scope, index) => (
                <div role="row" key={`scope-${scope.name}-${index}`}>
                  <code>{scope.name}</code>
                  <p>
                    <strong>{scope.plainLanguageAccess}</strong>
                    {scope.whyNeeded}
                  </p>
                  <span>{scope.sensitivity}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="steps">
            <p className="section-number">05</p>
            <h2>Your setup path</h2>
            <div className="stage-list">
              {guide.stages.map((stage, index) => (
                <div className="stage" key={`stage-${stage.id}-${index}`}>
                  <div className="stage-marker">{index + 1}</div>
                  <div>
                    <div className="stage-heading">
                      <div>
                        <small>{stage.owner}</small>
                        <h3>{stage.title}</h3>
                      </div>
                      <span>{stage.goal}</span>
                    </div>
                    {stage.steps.map((step, stepIndex) => (
                      <div className="stage-step" key={`step-${stepIndex}`}>
                        <p>{step.action}</p>
                        <small>Expected result: {step.result}</small>
                        {step.url && (
                          <a href={step.url} target="_blank" rel="noreferrer">
                            Open official console ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="review">
            <p className="section-number">06</p>
            <h2>Review and waiting</h2>
            <div className="review-box">
              <div>
                <span>Requirement</span>
                <strong>{guide.review.requirement}</strong>
              </div>
              <div>
                <span>Decision owner</span>
                <strong>{guide.review.decisionOwner}</strong>
              </div>
              <div>
                <span>Expected wait</span>
                <strong>{guide.review.wait}</strong>
              </div>
              <p>{guide.review.condition}</p>
              <h3>Prepare this evidence</h3>
              <ul>
                {guide.review.evidence.map((item, index) => (
                  <li key={`evidence-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="blockers">
            <p className="section-number">07</p>
            <h2>When you get blocked</h2>
            <div className="blocker-list">
              {guide.blockers.map((blocker, index) => (
                <details key={`blocker-${index}`}>
                  <summary>
                    {blocker.symptom}
                    <span>+</span>
                  </summary>
                  <p><strong>Likely cause:</strong> {blocker.cause}</p>
                  <p><strong>Recovery:</strong> {blocker.recovery}</p>
                  {blocker.url && (
                    <a href={blocker.url} target="_blank" rel="noreferrer">
                      Official portal ↗
                    </a>
                  )}
                </details>
              ))}
            </div>
          </section>

          <section id="handoffs">
            <p className="section-number">08</p>
            <h2>Who does what</h2>
            <div className="handoff-grid">
              <div>
                <span>Agent</span>
                <h3>Can prepare</h3>
                <ul>
                  {guide.handoffs.agent.map((item, index) => (
                    <li key={`agent-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>You</span>
                <h3>Must complete</h3>
                <ul>
                  {guide.handoffs.developer.map((item, index) => (
                    <li key={`dev-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>Provider</span>
                <h3>Decides</h3>
                <ul>
                  {guide.handoffs.provider.map((item, index) => (
                    <li key={`prov-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="evidence">
            <p className="section-number">09</p>
            <h2>Sources and limits</h2>
            <div className="source-list">
              {guide.sources.map((source, index) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={`source-${source.url}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <strong>{source.title}</strong>
                    <small>{source.publisher} · {source.whyItMatters}</small>
                  </p>
                  <b>↗</b>
                </a>
              ))}
            </div>
            {guide.uncertainties.length > 0 && (
              <div className="limitations">
                <strong>What remains uncertain</strong>
                <ul>
                  {guide.uncertainties.map((item, index) => (
                    <li key={`uncert-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </article>
      </div>
    </main>
  );
}
