import { cache } from "react";
import {
  buildEpmNavigationItems,
  createTuturuuuClient,
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
import type { YoolaArchiveData, YoolaNavigationItem } from "@/lib/archive-data.types";

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

const DEFAULT_TUTURUUU_BASE_URL =
  process.env.TUTURUUU_API_BASE_URL ??
  process.env.NEXT_PUBLIC_TUTURUUU_API_BASE_URL ??
  "https://tuturuuu.com/api/v1";

const DELIVERY_REVALIDATE_SECONDS = 60;

export const defaultNavigationItems: YoolaNavigationItem[] = [
  { name: "INDEX", path: "/" },
  { name: "ARCHIVE", path: "/gallery" },
  { name: "LORE", path: "/writing" },
  { name: "ABOUT", path: "/about" },
];

function getYoolaWorkspaceId() {
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
  const baseUrl = DEFAULT_TUTURUUU_BASE_URL;

  try {
    const client = await createClient(baseUrl);
    const delivery = await client.externalProjects.getDelivery(workspaceId);

    if (!delivery.loadingData || delivery.loadingData.adapter !== "yoola") {
      throw new Error(
        `[yoola] Workspace ${workspaceId} is not bound to an external project using the yoola adapter.`,
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
    ) as YoolaArchiveData["sections"];

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
      featuredArtwork: loadingData.featuredArtwork
        ? normalizeArtwork(loadingData.featuredArtwork)
        : (archiveArtworks[0] ?? null),
      loreCapsules,
      navigationItems: navigationItems.length > 2 ? navigationItems : defaultNavigationItems,
      profile,
      sections,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown EPM delivery failure";

    throw new Error(
      `[yoola] Failed to load EPM delivery from ${baseUrl} for workspace ${workspaceId}: ${message}`,
    );
  }
});

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
