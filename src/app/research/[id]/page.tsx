import type { Metadata } from "next";
import { getSavedResearch } from "@/lib/research-store";
import { ResearchGuideView } from "@/components/research-guide-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const saved = await getSavedResearch(id);
  return saved
    ? { title: `${saved.result.provider.name} OAuth launch guide`, description: saved.result.nextAction }
    : { title: "OAuth launch guide" };
}

export default async function ResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const saved = await getSavedResearch(id);

  return <ResearchGuideView id={id} initialSaved={saved} />;
}
