import HomePageClient from "@/components/HomePageClient";
import { getArchiveArtworks } from "@/lib/archive-data";

export default async function HomePage() {
  const artworks = await getArchiveArtworks();

  return <HomePageClient artworks={artworks} />;
}
