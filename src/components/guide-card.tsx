import Link from "next/link";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="guide-card">
      <div className="card-topline">
        <span className={`provider-icon ${guide.provider.tone}`} aria-hidden="true">{guide.provider.initials}</span>
        <span className={`difficulty ${guide.summary.difficulty.toLowerCase()}`}>{guide.summary.difficulty}</span>
      </div>
      <div>
        <p className="card-kicker">{guide.scenario.registrationPath}</p>
        <h3>{guide.provider.name}</h3>
        <p className="card-scenario">{guide.scenario.capability}</p>
      </div>
      <dl className="card-facts">
        <div><dt>Hands-on effort</dt><dd>{guide.summary.handsOnEffort}</dd></div>
        <div><dt>External wait</dt><dd>{guide.summary.approvalWait}</dd></div>
      </dl>
      <div className="card-blocker">
        <span aria-hidden="true">!</span>
        <p><strong>Main blocker</strong>{guide.summary.biggestBlocker}</p>
      </div>
      <Link className="card-link" href={`/guides/${guide.id}`}>
        Open launch guide <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
