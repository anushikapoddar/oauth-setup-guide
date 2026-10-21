import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "OAuth Ready", template: "%s · OAuth Ready" },
  description:
    "Source-backed guides for registering, testing, and launching provider OAuth apps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="OAuth Ready home">
            <span className="brand-mark" aria-hidden="true">OR</span>
            <span>OAuth Ready</span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/#library">Guide library</Link>
            <Link className="nav-cta" href="/#generate">Research an app</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <span className="brand-mark small" aria-hidden="true">OR</span>
            <strong>OAuth Ready</strong>
          </div>
          <p>Research-backed launch guidance. Provider approval is always the provider&apos;s decision.</p>
        </footer>
      </body>
    </html>
  );
}
