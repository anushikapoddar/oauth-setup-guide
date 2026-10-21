import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLink } from "@/components/copy-link";
import { getSavedResearch } from "@/lib/research-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const saved = await getSavedResearch((await params).id);
  return saved ? { title: `${saved.result.provider.name} OAuth research`, description: saved.result.nextAction } : {};
}

export default async function ResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const saved = await getSavedResearch((await params).id);
  if (!saved) notFound();
  const { result } = saved;
  const findings = [
    ["Setup", result.setup],
    ["Scopes", result.scopeFindings],
    ["Test and launch", result.testAndLaunch],
    ["Review", result.review],
    ["Support", result.support],
  ] as const;
  return (
    <main className="guide-page">
      <div className="guide-breadcrumb"><Link href="/#generate">← Research another app</Link><CopyLink /></div>
      <section className="guide-hero">
        <div className="guide-title-row"><span className="provider-icon large blue" aria-hidden="true">{result.provider.name.slice(0, 2).toUpperCase()}</span><div><p className="eyebrow">Generated OAuth research</p><h1>{result.provider.name}</h1><p>{result.provider.canonicalWebsite}</p></div></div>
        <div className="guide-meta"><span>{result.status.replace("_", " ")}</span><span>Generated {new Date(saved.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span><span>Shareable research URL</span></div>
      </section>
      <section className="readiness-panel" aria-labelledby="research-summary"><div className="readiness-main"><p className="eyebrow light">Next action</p><h2 id="research-summary">{result.oauthSupport.replace("_", " ")}</h2><p>{result.provider.identityReason}</p><div className="next-action"><span>Do this next</span><strong>{result.nextAction}</strong></div></div><dl><div><dt>Managed OAuth</dt><dd>{result.managedOption.availability}</dd></div><div><dt>Source count</dt><dd>{result.sources.length} official or primary sources</dd></div><div><dt>Open questions</dt><dd>{result.uncertainties.length || "None recorded"}</dd></div></dl></section>
      <div className="guide-layout"><aside className="guide-toc" aria-label="On this page"><strong>On this page</strong>{findings.map(([title]) => <a href={`#${title.toLowerCase().replaceAll(" ", "-")}`} key={title}>{title}</a>)}<a href="#sources">Sources and limits</a></aside><article className="guide-content">
        <section id="managed-oauth"><p className="section-number">01</p><h2>Choose managed or custom</h2><div className="managed-box"><div><span>{result.managedOption.availability}</span><small>Research finding</small></div><p>{result.managedOption.details}</p>{result.managedOption.sourceUrl && <a href={result.managedOption.sourceUrl} target="_blank" rel="noreferrer">Open supporting source ↗</a>}</div></section>
        {findings.map(([title, items], index) => <section id={title.toLowerCase().replaceAll(" ", "-")} key={title}><p className="section-number">{String(index + 2).padStart(2, "0")}</p><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
        <section id="sources"><p className="section-number">07</p><h2>Sources and limits</h2><div className="source-list">{result.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{source.title}</strong><small>{source.publisher} · {source.whyItMatters}</small></p><b>↗</b></a>)}</div>{result.uncertainties.length > 0 && <div className="limitations"><strong>Still uncertain</strong><ul>{result.uncertainties.map((item) => <li key={item}>{item}</li>)}</ul></div>}</section>
      </article></div>
    </main>
  );
}
