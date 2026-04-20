export type ArtworkOrientation = 'portrait' | 'landscape' | 'square';

export type ArchiveArtwork = {
  id: string;
  src: string | null;
  title: string;
  slug: string;
  label: string;
  category: string;
  rarity: string;
  width: number;
  height: number;
  orientation: ArtworkOrientation;
  year: string;
  note: string;
  caption: string | null;
  alt: string | null;
};

export type LoreCapsule = {
  slug: string;
  title: string;
  subtitle: string | null;
  channel: string;
  status: string;
  date: string;
  excerptMarkdown: string;
  teaser: string;
  tags: string[];
  artworkId: string | null;
  bodyMarkdown: string | null;
  profileData: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

export type YoolaNavigationItem = {
  name: string;
  path: string;
};

export type YoolaSocialLink = {
  href: string;
  icon: string;
  label: string;
};

export type YoolaProfileStat = {
  label: string;
  max: number | null;
  value: number | string;
};

export type YoolaProfileMarker = {
  label: string;
  value: string;
};

export type YoolaPageSection = {
  bodyMarkdown: string | null;
  metadata: Record<string, unknown>;
  profileData: Record<string, unknown>;
  slug: string;
  subtitle: string | null;
  summary: string | null;
  title: string;
};

export type YoolaProfile = {
  brand: string;
  entityId: string | null;
  markers: YoolaProfileMarker[];
  name: string;
  rank: string | null;
  role: string;
  socialLinks: YoolaSocialLink[];
  stats: YoolaProfileStat[];
  statusLabel: string | null;
};

export type YoolaArchiveData = {
  archiveArtworks: ArchiveArtwork[];
  artworkCategories: string[];
  featuredArtwork: ArchiveArtwork | null;
  loreCapsules: LoreCapsule[];
  navigationItems: YoolaNavigationItem[];
  profile: YoolaProfile;
  sections: Record<string, YoolaPageSection>;
};
