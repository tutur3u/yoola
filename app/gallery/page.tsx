import GalleryPageClient from '@/components/GalleryPageClient';
import { getYoolaArchiveData } from '@/lib/archive-data';

export default async function GalleryPage() {
  const { archiveArtworks, artworkCategories, sections } =
    await getYoolaArchiveData();

  return (
    <GalleryPageClient
      artworks={archiveArtworks}
      categories={artworkCategories}
      section={sections.gallery ?? null}
    />
  );
}
