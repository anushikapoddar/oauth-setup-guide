import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page">
      <p className="eyebrow">Guide not found</p>
      <h1>That guide isn&apos;t in the library yet.</h1>
      <p>Return to the library or request research for a different provider.</p>
      <Link className="button primary" href="/">Browse guides</Link>
    </main>
  );
}
