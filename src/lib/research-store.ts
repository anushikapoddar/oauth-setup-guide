import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResearchResult } from "@/lib/research-contract";

export type SavedResearch = { id: string; input: string; createdAt: string; result: ResearchResult };

// In serverless environments like Vercel, process.cwd() is read-only at runtime; /tmp is writable.
const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
const directory = isServerless
  ? path.join("/tmp", ".data", "research")
  : path.join(process.cwd(), ".data", "research");

// In-memory fallback map for active serverless instances
const memoryStore = new Map<string, SavedResearch>();

export async function saveResearch(value: Omit<SavedResearch, "createdAt">) {
  const saved = { ...value, createdAt: new Date().toISOString() } satisfies SavedResearch;
  memoryStore.set(saved.id, saved);
  try {
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${saved.id}.json`), JSON.stringify(saved, null, 2), "utf8");
  } catch (err) {
    console.warn("Filesystem write skipped or failed, saved in memory:", err);
  }
  return saved;
}

export async function getSavedResearch(id: string) {
  if (!/^[a-z0-9-]{8,80}$/.test(id)) return undefined;
  if (memoryStore.has(id)) return memoryStore.get(id);

  // Try writable directory first
  try {
    return JSON.parse(await readFile(path.join(directory, `${id}.json`), "utf8")) as SavedResearch;
  } catch {
    // If running in serverless, try reading from repo root fallback (pre-bundled)
    if (isServerless) {
      try {
        return JSON.parse(await readFile(path.join(process.cwd(), ".data", "research", `${id}.json`), "utf8")) as SavedResearch;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
