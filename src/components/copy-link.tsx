"use client";

import { useState } from "react";

export function CopyLink({ url }: { url?: string } = {}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    const targetUrl = url || window.location.href;
    await navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <button className="copy-button" type="button" onClick={copy}>{copied ? "Link copied" : "Copy guide link"}</button>;
}
