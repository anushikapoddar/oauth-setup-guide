import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResearchResult } from "@/lib/research-contract";

export type SavedResearch = { id: string; input: string; createdAt: string; result: ResearchResult };

const directory = path.join(process.cwd(), ".data", "research");

export async function saveResearch(value: Omit<SavedResearch, "createdAt">) {
  const saved = { ...value, createdAt: new Date().toISOString() } satisfies SavedResearch;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, `${saved.id}.json`), JSON.stringify(saved, null, 2), "utf8");
  return saved;
}

export async function getSavedResearch(id: string) {
  if (!/^[a-z0-9-]{8,80}$/.test(id)) return undefined;
  try {
    return JSON.parse(await readFile(path.join(directory, `${id}.json`), "utf8")) as SavedResearch;
  } catch {
    return undefined;
  }
}
