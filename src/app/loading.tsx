export default function Loading() {
  return (
    <main className="loading-page" aria-busy="true" aria-label="Loading guide experience">
      <div className="loading-line short" />
      <div className="loading-line title" />
      <div className="loading-line title second" />
      <div className="loading-line body" />
      <div className="loading-panel" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}
