import Link from "next/link";
import { Library } from "@/components/library";
import { ResearchForm } from "@/components/research-form";
import { guides } from "@/lib/guides";
import { validateLibrary } from "@/lib/guide-validator";

const library = validateLibrary(guides);

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> OAuth launch intelligence</p>
          <h1>Know the path<br />before you build.</h1>
          <p className="hero-lede">Source-backed guides for setting up provider OAuth apps—what to do, how long it may take, and what can block approval.</p>
          <div className="hero-actions">
            <Link className="button primary" href="#library">Browse launch guides</Link>
            <Link className="text-link" href="#generate">Research another app <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Example launch path summary">
          <div className="route-card main-route-card">
            <div className="route-head">
              <span className="provider-icon blue">GC</span>
              <div><small>Example path</small><strong>Google Calendar</strong></div>
              <span className="difficulty high">High</span>
            </div>
            <div className="route-line">
              <span className="route-node complete">✓</span><div><b>Choose narrow scopes</b><small>Agent can prepare</small></div>
            </div>
            <div className="route-line">
              <span className="route-node active">2</span><div><b>Configure OAuth client</b><small>Developer action</small></div>
            </div>
            <div className="route-line">
              <span className="route-node">3</span><div><b>Submit verification</b><small>Provider decision · typically 3–5 days*</small></div>
            </div>
            <div className="route-next"><small>Your next action</small><strong>Decide: event details or free/busy only?</strong></div>
          </div>
          <div className="floating-chip chip-sources"><span>4</span> official sources</div>
          <div className="floating-chip chip-owner"><span>→</span> Clear handoffs</div>
          <p className="visual-note">*Conditional published review estimate, not a guarantee.</p>
        </div>
      </section>

      <section className="trust-strip" aria-label="Product principles">
        <p><strong>Built for honest decisions</strong> before credentials, code, and review submissions.</p>
        <div><span>Official sources</span><span>Explicit unknowns</span><span>Agent + human handoffs</span></div>
      </section>

      <Library guides={library} />

      <section className="how-section section" aria-labelledby="how-title">
        <div className="section-heading centered">
          <p className="eyebrow">From idea to launch</p>
          <h2 id="how-title">One guide. Every decision.</h2>
          <p>The setup form is only one part of readiness. We keep work, waiting, and ownership visible.</p>
        </div>
        <div className="how-grid">
          <article><span>01</span><h3>Choose the path</h3><p>Compare managed OAuth, a provider-owned app, and the exact permissions your feature needs.</p></article>
          <article><span>02</span><h3>Prepare and test</h3><p>Collect prerequisites, configure redirect URLs, and test the smallest real user connection.</p></article>
          <article><span>03</span><h3>Clear the gates</h3><p>See review evidence, admin dependencies, likely blockers, and who has to act next.</p></article>
        </div>
      </section>

      <ResearchForm />
    </main>
  );
}
