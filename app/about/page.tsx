import AboutPageClient from "@/components/AboutPageClient";
import { getYoolaArchiveData } from "@/lib/archive-data";

export default async function AboutPage() {
  const { archiveArtworks, profile, sections } = await getYoolaArchiveData();

  return (
    <AboutPageClient
      artworks={archiveArtworks}
      profile={profile}
      section={sections.about ?? null}
    />
  );
}
