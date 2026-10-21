"use client";

import { useMemo, useState } from "react";
import type { Guide } from "@/lib/guides";
import { GuideCard } from "./guide-card";

export function Library({ guides }: { guides: Guide[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return guides;
    return guides.filter((guide) =>
      [guide.provider.name, guide.scenario.capability, guide.scenario.registrationPath]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [guides, query]);

  return (
    <section className="section library-section" id="library" aria-labelledby="library-title">
      <div className="section-heading library-heading">
        <div>
          <p className="eyebrow">Curated library · 3 guides</p>
          <h2 id="library-title">Start with a researched path</h2>
          <p>Each guide is tied to a specific capability and launch audience.</p>
        </div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">Search guides</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search providers or use cases"
          />
        </label>
      </div>

      {filtered.length ? (
        <div className="guide-grid" aria-live="polite">
          {filtered.map((guide) => <GuideCard guide={guide} key={guide.id} />)}
        </div>
      ) : (
        <div className="empty-state" aria-live="polite">
          <span aria-hidden="true">⌕</span>
          <h3>No researched guide matches “{query}”</h3>
          <p>Clear the search or ask the research agent to investigate that provider.</p>
          <button type="button" onClick={() => setQuery("")}>Clear search</button>
        </div>
      )}
    </section>
  );
}
