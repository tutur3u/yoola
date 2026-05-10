import { yoolaArtworkCatalog } from "@/lib/yoola-artworks";

export type YoolaSyncField = {
  description?: string | null;
  key: string;
  label: string;
  options?: string[];
  required?: boolean;
  type:
    | "boolean"
    | "date"
    | "datetime"
    | "json"
    | "markdown"
    | "number"
    | "string"
    | "string-array";
};

export type YoolaSyncCollectionSchema = {
  assetTypes?: string[];
  blockTypes?: string[];
  collection_type: string;
  description?: string | null;
  metadataFields?: YoolaSyncField[];
  profileFields?: YoolaSyncField[];
  slug: string;
  title: string;
};

export type YoolaExternalProjectManifest = {
  adapter: "yoola";
  content: {
    entries: Array<{
      assets?: Array<{
        altText?: string | null;
        assetType: string;
        metadata?: Record<string, unknown>;
        sortOrder?: number;
        stableSourceId: string;
        storagePath?: string | null;
      }>;
      blocks?: Array<{
        blockType: string;
        content: Record<string, unknown>;
        sortOrder?: number;
        stableSourceId: string;
        title?: string | null;
      }>;
      collectionSlug: string;
      metadata?: Record<string, unknown>;
      profileData?: Record<string, unknown>;
      slug: string;
      stableSourceId: string;
      status?: "draft" | "scheduled" | "published" | "archived";
      subtitle?: string | null;
      summary?: string | null;
      title: string;
    }>;
  };
  schema: {
    collections: YoolaSyncCollectionSchema[];
    metadataFields?: YoolaSyncField[];
    profileFields?: YoolaSyncField[];
  };
  version: 1;
};

const artworkProfileFields = [
  { key: "year", label: "Year", type: "string" },
  { key: "label", label: "Archive label", type: "string" },
  { key: "category", label: "Category", type: "string" },
  {
    key: "rarity",
    label: "Rarity",
    options: ["R", "SR", "SSR", "UR"],
    type: "string",
  },
  {
    key: "orientation",
    label: "Orientation",
    options: ["portrait", "landscape", "square"],
    type: "string",
  },
  { key: "width", label: "Width", type: "number" },
  { key: "height", label: "Height", type: "number" },
  { key: "note", label: "Archive note", type: "string" },
  { key: "localAssetPath", label: "Local public asset path", type: "string" },
] satisfies YoolaSyncField[];

const loreProfileFields = [
  { key: "channel", label: "Channel", type: "string" },
  { key: "status", label: "Capsule status", type: "string" },
  { key: "date", label: "Display date", type: "string" },
  { key: "tags", label: "Tags", type: "string-array" },
  { key: "teaser", label: "Teaser", type: "string" },
  { key: "artworkSlug", label: "Related artwork slug", type: "string" },
] satisfies YoolaSyncField[];

const sectionProfileFields = [
  { key: "eyebrow", label: "Eyebrow", type: "string" },
  { key: "ctaLabel", label: "CTA label", type: "string" },
  { key: "ctaHref", label: "CTA link", type: "string" },
  { key: "featuredArtworkSlugs", label: "Featured artwork slugs", type: "string-array" },
  { key: "featuredLoreSlugs", label: "Featured lore slugs", type: "string-array" },
  { key: "categoryOptions", label: "Visible categories", type: "string-array" },
] satisfies YoolaSyncField[];

const PUBLISHED_STATUS = "published" as const;

export const yoolaExternalProjectManifest = {
  adapter: "yoola",
  content: {
    entries: [
      ...yoolaArtworkCatalog.map((artwork) => ({
        assets: [
          {
            altText: `${artwork.title} artwork`,
            assetType: "image",
            metadata: {
              caption: artwork.title,
              publicPath: artwork.publicPath,
            },
            sortOrder: 0,
            stableSourceId: `yoola:art:${artwork.slug}:image`,
            storagePath: `external-projects/yoola/artworks/${artwork.filename}`,
          },
        ],
        blocks: [],
        collectionSlug: "artworks",
        profileData: {
          category: artwork.category,
          height: artwork.height,
          label: artwork.label,
          localAssetPath: artwork.publicPath,
          note: artwork.note,
          orientation: artwork.orientation,
          rarity: artwork.rarity,
          width: artwork.width,
          year: artwork.year,
        },
        slug: artwork.slug,
        stableSourceId: `yoola:art:${artwork.slug}`,
        status: PUBLISHED_STATUS,
        summary: artwork.note,
        title: artwork.title,
      })),
      {
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown: "The violet glow stayed after the last lap went quiet.",
            },
            sortOrder: 0,
            stableSourceId: "yoola:lore:violet-horizon:body",
          },
        ],
        collectionSlug: "lore-capsules",
        profileData: {
          artworkSlug: "violet-draft",
          channel: "Main Transmission",
          date: "2026.04.12",
          status: "IN TRANSIT",
          tags: ["MAIN_STORY"],
          teaser: "A post-race scene file.",
        },
        slug: "violet-horizon",
        stableSourceId: "yoola:lore:violet-horizon",
        status: PUBLISHED_STATUS,
        summary: "Post-race silence.",
        title: "The Violet Horizon",
      },
      {
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown: "Strategy notes from a midnight garage session.",
            },
            sortOrder: 0,
            stableSourceId: "yoola:lore:midnight-strategy:body",
          },
        ],
        collectionSlug: "lore-capsules",
        profileData: {
          artworkSlug: "pitline-static",
          channel: "Garage Log",
          date: "2026.04.18",
          status: "DECODED",
          tags: ["GARAGE", "TACTICS"],
          teaser: "A setup note before the next signal.",
        },
        slug: "midnight-strategy",
        stableSourceId: "yoola:lore:midnight-strategy",
        status: PUBLISHED_STATUS,
        summary: "A quiet planning capsule.",
        title: "Midnight Strategy",
      },
      {
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown: "Crowd noise becomes a telemetry layer when the archive listens closely.",
            },
            sortOrder: 0,
            stableSourceId: "yoola:lore:crowd-noise-protocol:body",
          },
        ],
        collectionSlug: "lore-capsules",
        profileData: {
          artworkSlug: "crowd-transmission",
          channel: "Signal Study",
          date: "2026.04.25",
          status: "LIVE",
          tags: ["SIGNAL", "ARCHIVE"],
          teaser: "A crowd telemetry fragment.",
        },
        slug: "crowd-noise-protocol",
        stableSourceId: "yoola:lore:crowd-noise-protocol",
        status: PUBLISHED_STATUS,
        summary: "A crowd signal capsule.",
        title: "Crowd Noise Protocol",
      },
      {
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown:
                "Yoola is a high-contrast visual archive of racing idols, signals, and neon fragments.",
            },
            sortOrder: 0,
            stableSourceId: "yoola:singleton:home-hero:body",
          },
        ],
        collectionSlug: "singleton-sections",
        profileData: {
          ctaHref: "/artwork",
          ctaLabel: "Enter archive",
          featuredArtworkSlugs: ["starter-signal", "trackside-idol", "violet-draft"],
        },
        slug: "home-hero",
        stableSourceId: "yoola:singleton:home-hero",
        status: PUBLISHED_STATUS,
        title: "Home Hero",
      },
      {
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown: "Browse the visual frames by signal class.",
            },
            sortOrder: 0,
            stableSourceId: "yoola:singleton:gallery:body",
          },
        ],
        collectionSlug: "singleton-sections",
        profileData: {
          categoryOptions: ["PORTRAIT", "MOOD", "ARMOR", "STUDY", "MASK", "SKETCH"],
        },
        slug: "gallery",
        stableSourceId: "yoola:singleton:gallery",
        status: PUBLISHED_STATUS,
        title: "Gallery",
      },
      {
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown: "Read the capsule logs that hold the archive together.",
            },
            sortOrder: 0,
            stableSourceId: "yoola:singleton:writing:body",
          },
        ],
        collectionSlug: "singleton-sections",
        profileData: {
          featuredLoreSlugs: ["violet-horizon", "midnight-strategy", "crowd-noise-protocol"],
        },
        slug: "writing",
        stableSourceId: "yoola:singleton:writing",
        status: PUBLISHED_STATUS,
        title: "Writing",
      },
    ],
  },
  schema: {
    collections: [
      {
        assetTypes: ["image"],
        blockTypes: ["markdown"],
        collection_type: "artworks",
        description: "Yoola artwork archive frames.",
        profileFields: artworkProfileFields,
        slug: "artworks",
        title: "Artworks",
      },
      {
        blockTypes: ["markdown"],
        collection_type: "lore-capsules",
        description: "Narrative capsules and archive writing.",
        profileFields: loreProfileFields,
        slug: "lore-capsules",
        title: "Lore Capsules",
      },
      {
        blockTypes: ["markdown"],
        collection_type: "singleton-sections",
        description: "Reusable website page sections.",
        profileFields: sectionProfileFields,
        slug: "singleton-sections",
        title: "Singleton Sections",
      },
    ],
    profileFields: [
      { key: "brand", label: "Brand", type: "string" },
      { key: "tagline", label: "Tagline", type: "string" },
    ],
  },
  version: 1,
} satisfies YoolaExternalProjectManifest;

export function getYoolaManifestCollectionSchema(collectionSlug: string | null | undefined) {
  return (
    yoolaExternalProjectManifest.schema.collections.find(
      (collection) => collection.slug === collectionSlug,
    ) ?? null
  );
}
