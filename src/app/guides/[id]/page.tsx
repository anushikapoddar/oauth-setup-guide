import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLink } from "@/components/copy-link";
import { getGuide, getSource, guides } from "@/lib/guides";
import { validateLibrary } from "@/lib/guide-validator";

validateLibrary(guides);

export function generateStaticParams() {
  return guides.map((guide) => ({ id: guide.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).id);
  return guide ? { title: `${guide.provider.name} OAuth guide`, description: guide.scenario.capability } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const guide = getGuide((await params).id);
  if (!guide) notFound();

  return (
    <main className="guide-page">
      <div className="guide-breadcrumb"><Link href="/#library">← Guide library</Link><CopyLink /></div>

      <section className="guide-hero">
        <div className="guide-title-row">
          <span className={`provider-icon large ${guide.provider.tone}`} aria-hidden="true">{guide.provider.initials}</span>
          <div>
            <p className="eyebrow">OAuth launch guide</p>
            <h1>{guide.provider.name}</h1>
            <p>{guide.scenario.capability}</p>
          </div>
        </div>
        <div className="guide-meta">
          <span>{guide.status}</span>
          <span>Checked {new Date(`${guide.provider.checkedAt}T00:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
          <a href={guide.provider.website} target="_blank" rel="noreferrer">Provider website ↗</a>
        </div>
      </section>

      <section className="readiness-panel" aria-labelledby="readiness-title">
        <div className="readiness-main">
          <p className="eyebrow light">At a glance</p>
          <h2 id="readiness-title">{guide.summary.difficulty} difficulty</h2>
          <p>{guide.summary.reason}</p>
          <div className="next-action"><span>Start here</span><strong>{guide.summary.nextAction}</strong></div>
        </div>
        <dl>
          <div><dt>Hands-on effort</dt><dd>{guide.summary.handsOnEffort}</dd></div>
          <div><dt>External wait</dt><dd>{guide.summary.approvalWait}</dd></div>
          <div><dt>Main blocker</dt><dd>{guide.summary.biggestBlocker}</dd></div>
        </dl>
      </section>

      <div className="guide-layout">
        <aside className="guide-toc" aria-label="On this page">
          <strong>On this page</strong>
          <a href="#scenario">Scenario</a><a href="#path">Choose a path</a><a href="#prerequisites">Prerequisites</a><a href="#permissions">Permissions</a><a href="#steps">Setup steps</a><a href="#review">Review</a><a href="#blockers">Blockers</a><a href="#handoffs">Handoffs</a><a href="#evidence">Evidence</a>
        </aside>
        <article className="guide-content">
          <section id="scenario">
            <p className="section-number">01</p><h2>Scenario this guide covers</h2>
            <div className="scenario-box"><p><strong>Audience</strong>{guide.scenario.audience}</p><p><strong>Registration path</strong>{guide.scenario.registrationPath}</p></div>
            <ul>{guide.scenario.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section id="path">
            <p className="section-number">02</p><h2>Choose managed or custom</h2>
            <div className="managed-box"><div><span>{guide.managedOption.availability}</span><small>{guide.managedOption.evidence}</small></div><p>{guide.managedOption.details}</p><p><strong>Choose custom when:</strong> {guide.managedOption.customWhen}</p></div>
          </section>

          <section id="prerequisites">
            <p className="section-number">03</p><h2>Before you start</h2>
            <div className="prereq-list">{guide.prerequisites.map((item, index) => <div key={item.requirement}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{item.requirement}</strong><small>{item.condition}</small></p><em>{item.owner}</em></div>)}</div>
          </section>

          <section id="permissions">
            <p className="section-number">04</p><h2>Permissions in plain language</h2>
            <div className="scope-table" role="table" aria-label="OAuth scopes">
              {guide.scopes.map((scope) => { const source = getSource(guide, scope.sourceId); return <div role="row" key={scope.name}><code>{scope.name}</code><p><strong>{scope.access}</strong>{scope.why}</p><span>{scope.sensitivity}</span>{source && <a href={source.url} target="_blank" rel="noreferrer" aria-label={`Source: ${source.title}`}>Source ↗</a>}</div>; })}
            </div>
          </section>

          <section id="steps">
            <p className="section-number">05</p><h2>Your setup path</h2>
            <div className="stage-list">{guide.stages.map((stage, index) => <div className="stage" key={stage.id}><div className="stage-marker">{index + 1}</div><div><div className="stage-heading"><div><small>{stage.owner}</small><h3>{stage.title}</h3></div><span>{stage.goal}</span></div>{stage.steps.map((step) => { const source = getSource(guide, step.sourceId); return <div className="stage-step" key={step.action}><p>{step.action}</p><small>Expected result: {step.result}</small>{step.url && <a href={step.url} target="_blank" rel="noreferrer">Open official page ↗</a>}{source && <span className="evidence-pill">Official source · {source.publisher}</span>}</div>; })}</div></div>)}</div>
          </section>

          <section id="review">
            <p className="section-number">06</p><h2>Review and waiting</h2>
            <div className="review-box"><div><span>Requirement</span><strong>{guide.review.requirement}</strong></div><div><span>Decision owner</span><strong>{guide.review.decisionOwner}</strong></div><div><span>Published / known wait</span><strong>{guide.review.wait}</strong></div><p>{guide.review.condition}</p><h3>Prepare this evidence</h3><ul>{guide.review.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </section>

          <section id="blockers">
            <p className="section-number">07</p><h2>When you get blocked</h2>
            <div className="blocker-list">{guide.blockers.map((blocker) => <details key={blocker.symptom}><summary>{blocker.symptom}<span>+</span></summary><p><strong>Likely cause:</strong> {blocker.cause}</p><p><strong>Recovery:</strong> {blocker.recovery}</p>{blocker.url && <a href={blocker.url} target="_blank" rel="noreferrer">Official help ↗</a>}</details>)}</div>
          </section>

          <section id="handoffs">
            <p className="section-number">08</p><h2>Who does what</h2>
            <div className="handoff-grid"><div><span>Agent</span><h3>Can prepare</h3><ul>{guide.handoffs.agent.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>You</span><h3>Must complete</h3><ul>{guide.handoffs.developer.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>Provider</span><h3>Decides</h3><ul>{guide.handoffs.provider.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
          </section>

          <section id="evidence">
            <p className="section-number">09</p><h2>Sources and limits</h2>
            <div className="source-list">{guide.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{source.title}</strong><small>{source.publisher} · checked {source.accessedAt}</small></p><b>↗</b></a>)}</div>
            <div className="limitations"><strong>What we did not verify</strong><ul>{guide.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </section>
        </article>
      </div>
    </main>
  );
}
