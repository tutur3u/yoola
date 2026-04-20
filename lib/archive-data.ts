import { cache } from "react";
import {
  buildEpmNavigationItems,
  createTuturuuuClient,
  type ExternalProjectDeliveryPayload,
  type YoolaExternalProjectLoadingData,
} from "@/lib/tuturuuu-sdk";
import {
  createFallbackSection,
  normalizeArtwork,
  normalizeLoreCapsule,
  normalizeProfile,
  normalizeSection,
  resolveCollectionPath,
  toProfileDataRecord,
} from "@/lib/archive-data.normalizers";
import type {
  YoolaArchiveData,
  YoolaNavigationItem,
  YoolaPageSection,
} from "@/lib/archive-data.types";

export type {
  ArchiveArtwork,
  ArtworkOrientation,
  LoreCapsule,
  YoolaArchiveData,
  YoolaNavigationItem,
  YoolaPageSection,
  YoolaProfile,
  YoolaProfileMarker,
  YoolaProfileStat,
  YoolaSocialLink,
} from "@/lib/archive-data.types";

const DELIVERY_REVALIDATE_SECONDS = 60;

export const defaultNavigationItems: YoolaNavigationItem[] = [
  { name: "INDEX", path: "/" },
  { name: "ARCHIVE", path: "/gallery" },
  { name: "LORE", path: "/writing" },
  { name: "ABOUT", path: "/about" },
];

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];
}

function selectFeaturedItems<T extends { id?: string; slug: string }>({
  items,
  limit = 8,
  slugs,
}: {
  items: T[];
  slugs: string[];
  limit?: number;
}) {
  if (slugs.length === 0) {
    return [];
  }

  const deduped = new Map<string, T>();

  for (const slug of slugs) {
    const item = items.find((candidate) => candidate.slug === slug);
    if (item) {
      deduped.set(item.id ?? item.slug, item);
    }
  }

  return [...deduped.values()].slice(0, limit);
}

function getFeaturedArtworkSlugs(section: YoolaPageSection | null) {
  const profileData = asRecord(section?.profileData);
  return [
    ...asStringArray(profileData.featuredArtworkSlugs),
    ...asStringArray(profileData.carouselArtworkSlugs),
    ...asStringArray(profileData.featuredSlugs),
  ];
}

function getFeaturedLoreSlugs(section: YoolaPageSection | null) {
  const profileData = asRecord(section?.profileData);
  return [
    ...asStringArray(profileData.featuredEntrySlugs),
    ...asStringArray(profileData.featuredLoreSlugs),
    ...asStringArray(profileData.carouselEntrySlugs),
    ...asStringArray(profileData.carouselLoreSlugs),
    ...asStringArray(profileData.featuredSlugs),
  ];
}

export function getYoolaApiBaseUrl() {
  return (
    process.env.TUTURUUU_API_BASE_URL ??
    process.env.NEXT_PUBLIC_TUTURUUU_API_BASE_URL ??
    "https://tuturuuu.com/api/v1"
  );
}

export function getYoolaWorkspaceId() {
  const workspaceId =
    process.env.TUTURUUU_YOOLA_WORKSPACE_ID ?? process.env.NEXT_PUBLIC_TUTURUUU_YOOLA_WORKSPACE_ID;

  if (!workspaceId?.trim()) {
    throw new Error(
      "[yoola] Missing TUTURUUU_YOOLA_WORKSPACE_ID. Copy .env.example to .env.local and point it at the EPM workspace that uses the yoola adapter.",
    );
  }

  return workspaceId.trim();
}

function toUpperLabel(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim().toUpperCase()
    : fallback;
}

async function createClient(baseUrl: string) {
  return createTuturuuuClient({
    baseUrl,
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        cache: "force-cache",
        next: { revalidate: DELIVERY_REVALIDATE_SECONDS },
      }),
  });
}

const getYoolaArchiveDataInternal = cache(async (): Promise<YoolaArchiveData> => {
  const workspaceId = getYoolaWorkspaceId();
  const baseUrl = getYoolaApiBaseUrl();

  try {
    const client = await createClient(baseUrl);
    const delivery = await client.externalProjects.getDelivery(workspaceId);
    return buildYoolaArchiveData(delivery);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown EPM delivery failure";

    throw new Error(
      `[yoola] Failed to load EPM delivery from ${baseUrl} for workspace ${workspaceId}: ${message}`,
    );
  }
});

export function buildYoolaArchiveData(delivery: ExternalProjectDeliveryPayload): YoolaArchiveData {
  if (!delivery.loadingData || delivery.loadingData.adapter !== "yoola") {
    throw new Error(
      `[yoola] Workspace ${delivery.workspaceId} is not bound to an external project using the yoola adapter.`,
    );
  }

  const loadingData = delivery.loadingData as YoolaExternalProjectLoadingData;
  const archiveArtworks = loadingData.artworks.map(normalizeArtwork);
  const entriesBySlug = new Map(
    delivery.collections.flatMap((collection) =>
      collection.entries.map((entry) => [entry.slug, entry] as const),
    ),
  );
  const loreCapsules = loadingData.loreCapsules.map((item) =>
    normalizeLoreCapsule(item, entriesBySlug.get(item.slug) ?? null),
  );

  const collectionBySlug = new Map(
    delivery.collections.map((collection) => [collection.slug, collection] as const),
  );

  const sections = Object.fromEntries(
    Object.entries(loadingData.singletonSections).map(([slug, section]) => [
      slug,
      normalizeSection(slug, section),
    ]),
  ) as Record<string, YoolaPageSection>;

  sections.gallery ??= createFallbackSection(
    "gallery",
    "[ Archive ]",
    collectionBySlug.get("artworks")?.description ?? null,
  );
  sections.writing ??= createFallbackSection(
    "writing",
    "[ Lore ]",
    collectionBySlug.get("lore-capsules")?.description ?? null,
  );
  sections.about ??= createFallbackSection("about", "Profile Dossier", null);
  const featuredArtworks = selectFeaturedItems({
    items: archiveArtworks,
    slugs: getFeaturedArtworkSlugs(sections.gallery ?? null),
  });
  const featuredArtwork = featuredArtworks[0] ?? null;
  const featuredLoreCapsules = selectFeaturedItems({
    items: loreCapsules,
    limit: 6,
    slugs: getFeaturedLoreSlugs(sections.writing ?? null),
  });

  const profile = normalizeProfile(
    toProfileDataRecord(delivery.profileData),
    sections.about.profileData,
  );

  const resolvedNavigationItems = buildEpmNavigationItems(delivery.collections)
    .map((item) => {
      const path = resolveCollectionPath(item.slug, item.title, item.href);
      if (!path) {
        return null;
      }

      return {
        name: item.title.trim().toUpperCase(),
        path,
      } satisfies YoolaNavigationItem;
    })
    .filter((item): item is YoolaNavigationItem => Boolean(item));

  const homeNavigationLabel = toUpperLabel(sections.home?.profileData.navLabel, "INDEX");
  const aboutNavigationLabel = toUpperLabel(
    sections.about.profileData.navLabel ?? sections.about.title,
    "ABOUT",
  );

  const seenPaths = new Set<string>(["/", "/about"]);
  const navigationItems = [
    { name: homeNavigationLabel, path: "/" },
    ...resolvedNavigationItems.filter((item) => {
      if (seenPaths.has(item.path)) {
        return false;
      }

      seenPaths.add(item.path);
      return true;
    }),
    { name: aboutNavigationLabel, path: "/about" },
  ];

  return {
    archiveArtworks,
    artworkCategories: loadingData.artworkCategories.map((category) => category.toUpperCase()),
    featuredArtwork,
    featuredArtworks,
    featuredLoreCapsules,
    loreCapsules,
    navigationItems: navigationItems.length > 2 ? navigationItems : defaultNavigationItems,
    profile,
    sections,
  };
}

export async function getYoolaArchiveData() {
  return getYoolaArchiveDataInternal();
}

export async function getArchiveArtworks() {
  const data = await getYoolaArchiveDataInternal();
  return data.archiveArtworks;
}

export async function getLoreCapsules() {
  const data = await getYoolaArchiveDataInternal();
  return data.loreCapsules;
}

export async function getNavigationItems() {
  const data = await getYoolaArchiveDataInternal();
  return data.navigationItems;
}

export async function getYoolaProfile() {
  const data = await getYoolaArchiveDataInternal();
  return data.profile;
}

export async function getYoolaSection(slug: string) {
  const data = await getYoolaArchiveDataInternal();
  return data.sections[slug] ?? null;
}

export async function getArtworkById(id: string) {
  const artworks = await getArchiveArtworks();
  return artworks.find((artwork) => artwork.id === id) ?? null;
}

export async function getLoreCapsule(slug: string) {
  const loreCapsules = await getLoreCapsules();
  return loreCapsules.find((capsule) => capsule.slug === slug) ?? null;
}
