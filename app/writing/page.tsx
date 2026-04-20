import WritingPageClient from "@/components/WritingPageClient";
import { getYoolaArchiveData } from "@/lib/archive-data";

export default async function WritingPage() {
  const { archiveArtworks, loreCapsules, sections } = await getYoolaArchiveData();

  return (
    <WritingPageClient
      artworks={archiveArtworks}
      loreCapsules={loreCapsules}
      section={sections.writing ?? null}
    />
  );
}
