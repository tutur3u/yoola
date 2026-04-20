import { cache } from 'react';
import {
  buildEpmNavigationItems,
  createTuturuuuClient,
  type ExternalProjectDeliveryEntry,
  type YoolaExternalProjectArtworkLoadingItem,
  type YoolaExternalProjectLoadingData,
  type YoolaExternalProjectLoreCapsuleLoadingItem,
  type YoolaExternalProjectSectionLoadingItem,
} from '@/lib/tuturuuu-sdk';

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

const DEFAULT_TUTURUUU_BASE_URL =
  process.env.TUTURUUU_API_BASE_URL ??
  process.env.NEXT_PUBLIC_TUTURUUU_API_BASE_URL ??
  'https://tuturuuu.com/api/v1';

const DELIVERY_REVALIDATE_SECONDS = 60;

const defaultProfileStats: YoolaProfileStat[] = [
  { label: 'SPEED', value: 1200, max: 1200 },
  { label: 'STAMINA', value: 850, max: 1200 },
  { label: 'POWER', value: 1050, max: 1200 },
  { label: 'GUTS', value: 600, max: 1200 },
  { label: 'WISDOM', value: 950, max: 1200 },
];

const defaultProfileMarkers: YoolaProfileMarker[] = [
  { label: 'Primary lane', value: 'Visual archive' },
  { label: 'Current phase', value: 'World building' },
  { label: 'Signal style', value: 'Brutalist neon' },
];

export const defaultNavigationItems: YoolaNavigationItem[] = [
  { name: 'INDEX', path: '/' },
  { name: 'ARCHIVE', path: '/gallery' },
  { name: 'LORE', path: '/writing' },
  { name: 'ABOUT', path: '/about' },
];

type YoolaArchiveData = {
  archiveArtworks: ArchiveArtwork[];
  artworkCategories: string[];
  featuredArtwork: ArchiveArtwork | null;
  loreCapsules: LoreCapsule[];
  navigationItems: YoolaNavigationItem[];
  profile: YoolaProfile;
  sections: Record<string, YoolaPageSection>;
};

function getYoolaWorkspaceId() {
  const workspaceId =
    process.env.TUTURUUU_YOOLA_WORKSPACE_ID ??
    process.env.NEXT_PUBLIC_TUTURUUU_YOOLA_WORKSPACE_ID;

  if (!workspaceId?.trim()) {
    throw new Error(
      '[yoola] Missing TUTURUUU_YOOLA_WORKSPACE_ID. Copy .env.example to .env.local and point it at the EPM workspace that uses the yoola adapter.'
    );
  }

  return workspaceId.trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function asNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function getRenderableMarkdown(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as {
      type?: string;
      text?: string;
      attrs?: Record<string, unknown>;
      content?: unknown[];
    };

    const visit = (
      node:
        | {
            type?: string;
            text?: string;
            attrs?: Record<string, unknown>;
            content?: unknown[];
          }
        | undefined,
      depth = 0,
      listCounter?: number
    ): string => {
      if (!node || typeof node !== 'object') {
        return '';
      }

      if (node.type === 'text') {
        return node.text ?? '';
      }

      if (node.type === 'hardBreak') {
        return '\n';
      }

      if (node.type === 'paragraph') {
        return `${(node.content ?? []).map((child) => visit(child as any, depth)).join('')}\n`;
      }

      if (node.type === 'heading') {
        const level =
          typeof node.attrs?.level === 'number' ? node.attrs.level : 1;
        return `${'#'.repeat(level)} ${(node.content ?? []).map((child) => visit(child as any, depth)).join('')}\n`;
      }

      if (node.type === 'bulletList' || node.type === 'taskList') {
        return `${(node.content ?? []).map((child) => visit(child as any, depth)).join('')}\n`;
      }

      if (node.type === 'orderedList') {
        let counter =
          typeof node.attrs?.start === 'number' ? node.attrs.start : 1;
        return `${(node.content ?? [])
          .map((child) => {
            const text = visit(child as any, depth, counter);
            counter += 1;
            return text;
          })
          .join('')}\n`;
      }

      if (node.type === 'listItem' || node.type === 'taskItem') {
        const text = (node.content ?? [])
          .map((child) => visit(child as any, depth + 1))
          .join('')
          .trim();
        const indent = '  '.repeat(depth);
        if (node.type === 'taskItem') {
          return `${indent}${node.attrs?.checked ? '[x]' : '[ ]'} ${text}\n`;
        }
        return `${indent}${typeof listCounter === 'number' ? `${listCounter}.` : '•'} ${text}\n`;
      }

      if (node.type === 'blockquote') {
        const text = (node.content ?? [])
          .map((child) => visit(child as any, depth + 1))
          .join('');
        return `${text
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => `> ${line}`)
          .join('\n')}\n`;
      }

      if (node.type === 'codeBlock') {
        return `\`\`\`\n${(node.content ?? []).map((child) => visit(child as any, depth)).join('')}\n\`\`\`\n`;
      }

      if (Array.isArray(node.content)) {
        return node.content.map((child) => visit(child as any, depth)).join('');
      }

      return '';
    };

    const markdown = visit(parsed).trim().replace(/\n{3,}/g, '\n\n');
    return markdown || value.trim();
  } catch {
    return value.trim();
  }
}

function toUpperLabel(value: string | null | undefined, fallback: string) {
  return value?.trim().toUpperCase() || fallback;
}

function normalizeOrientation(
  orientation: string | null,
  width: number,
  height: number
): ArtworkOrientation {
  if (orientation === 'portrait' || orientation === 'landscape' || orientation === 'square') {
    return orientation;
  }

  if (width === height) {
    return 'square';
  }

  return width > height ? 'landscape' : 'portrait';
}

function extractMarkdownFromEntry(entry: ExternalProjectDeliveryEntry | null) {
  if (!entry) {
    return null;
  }

  const markdown = entry.blocks
    .filter((block) => block.block_type === 'markdown')
    .map((block) => {
      if (typeof block.content !== 'object' || block.content === null) {
        return '';
      }

      const rawMarkdown = (block.content as { markdown?: unknown }).markdown;
      return typeof rawMarkdown === 'string' ? rawMarkdown.trim() : '';
    })
    .filter((value) => value.length > 0)
    .join('\n\n')
    .trim();

  return markdown || null;
}

function normalizeArtwork(
  item: YoolaExternalProjectArtworkLoadingItem
): ArchiveArtwork {
  const width = item.width ?? 1200;
  const height = item.height ?? 1600;

  return {
    id: item.entryId,
    src: item.assetUrl,
    title: item.title,
    slug: item.slug,
    label: item.label?.trim() || item.slug.toUpperCase(),
    category: item.category?.trim().toUpperCase() || 'UNFILED',
    rarity: item.rarity?.trim().toUpperCase() || 'R',
    width,
    height,
    orientation: normalizeOrientation(item.orientation, width, height),
    year: item.year?.trim() || '0000',
    note:
      item.note?.trim() ||
      item.summary?.trim() ||
      'No archive notes are attached to this entry yet.',
    caption: item.caption?.trim() || null,
    alt: item.altText?.trim() || item.title,
  };
}

function normalizeLoreCapsule(
  item: YoolaExternalProjectLoreCapsuleLoadingItem,
  entry: ExternalProjectDeliveryEntry | null
): LoreCapsule {
  const excerptMarkdown =
    getRenderableMarkdown(item.summary) ||
    getRenderableMarkdown(item.excerptMarkdown) ||
    'No excerpt is available for this capsule yet.';

  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle?.trim() || null,
    channel: item.channel?.trim() || 'Draft Capsule',
    status: item.status?.trim() || 'STAGING',
    date: item.date?.trim() || 'TBD',
    excerptMarkdown,
    teaser:
      item.teaser?.trim() ||
      excerptMarkdown
        .replace(/^#+\s+/gm, '')
        .replace(/\n+/g, ' ')
        .trim() ||
      'This capsule is staged in the archive and ready for expansion.',
    tags: item.tags,
    artworkId: item.artworkEntryId,
    bodyMarkdown: item.bodyMarkdown?.trim() || extractMarkdownFromEntry(entry),
    profileData: asRecord(item.profileData),
    metadata: asRecord(item.metadata),
  };
}

function normalizeSection(
  slug: string,
  section: YoolaExternalProjectSectionLoadingItem
): YoolaPageSection {
  return {
    bodyMarkdown: section.bodyMarkdown?.trim() || null,
    metadata: asRecord(section.metadata),
    profileData: asRecord(section.profileData),
    slug,
    subtitle: section.subtitle?.trim() || null,
    summary: getRenderableMarkdown(section.summary),
    title: section.title?.trim() || slug,
  };
}

function createFallbackSection(
  slug: string,
  title: string,
  summary: string | null
): YoolaPageSection {
  return {
    bodyMarkdown: null,
    metadata: {},
    profileData: {},
    slug,
    subtitle: null,
    summary,
    title,
  };
}

function normalizeSocialLinks(value: unknown): YoolaSocialLink[] {
  return asArray(value)
    .map((item) => asRecord(item))
    .map((item) => {
      const href = asString(item.href) ?? asString(item.url);
      if (!href) {
        return null;
      }

      return {
        href,
        icon:
          asString(item.icon) ??
          asString(item.platform) ??
          asString(item.label) ??
          'link',
        label: asString(item.label) ?? 'Link',
      } satisfies YoolaSocialLink;
    })
    .filter((item): item is YoolaSocialLink => Boolean(item));
}

function normalizeProfileStats(value: unknown) {
  const stats = asArray(value)
    .map((item) => asRecord(item))
    .map((item) => {
      const label = asString(item.label);
      const rawValue = item.value;
      if (!label || (typeof rawValue !== 'number' && typeof rawValue !== 'string')) {
        return null;
      }

      return {
        label: label.toUpperCase(),
        max: asNumber(item.max),
        value: rawValue,
      } satisfies YoolaProfileStat;
    })
    .filter((item): item is YoolaProfileStat => Boolean(item));

  return stats.length > 0 ? stats : defaultProfileStats;
}

function normalizeProfileMarkers(value: unknown) {
  const markers = asArray(value)
    .map((item) => asRecord(item))
    .map((item) => {
      const label = asString(item.label);
      const markerValue = asString(item.value);
      if (!label || !markerValue) {
        return null;
      }

      return {
        label,
        value: markerValue,
      } satisfies YoolaProfileMarker;
    })
    .filter((item): item is YoolaProfileMarker => Boolean(item));

  return markers.length > 0 ? markers : defaultProfileMarkers;
}

function normalizeProfile(
  baseProfileData: Record<string, unknown>,
  aboutProfileData: Record<string, unknown>
): YoolaProfile {
  const mergedProfileData = {
    ...baseProfileData,
    ...aboutProfileData,
  };

  return {
    brand: asString(mergedProfileData.brand) ?? 'YOOLA',
    entityId: asString(mergedProfileData.entityId),
    markers: normalizeProfileMarkers(mergedProfileData.markers),
    name: asString(mergedProfileData.name) ?? 'Yol Yoola',
    rank: asString(mergedProfileData.rank),
    role: asString(mergedProfileData.role) ?? 'Creator // Artist',
    socialLinks: normalizeSocialLinks(
      mergedProfileData.socialLinks ?? mergedProfileData.socials
    ),
    stats: normalizeProfileStats(mergedProfileData.stats),
    statusLabel:
      asString(mergedProfileData.statusLabel) ??
      asString(mergedProfileData.status),
  };
}

function resolveCollectionPath(slug: string, title: string, href: string | null) {
  if (href) {
    return href;
  }

  const normalizedSlug = slug.trim().toLowerCase();
  if (normalizedSlug === 'artworks' || normalizedSlug === 'artwork') {
    return '/gallery';
  }

  if (
    normalizedSlug === 'lore-capsules' ||
    normalizedSlug === 'lore_capsules' ||
    normalizedSlug === 'lore' ||
    normalizedSlug === 'writing'
  ) {
    return '/writing';
  }

  const normalizedTitle = title.trim().toLowerCase();
  if (normalizedTitle.includes('art')) {
    return '/gallery';
  }

  if (normalizedTitle.includes('lore') || normalizedTitle.includes('writing')) {
    return '/writing';
  }

  return null;
}

async function createClient(baseUrl: string) {
  return createTuturuuuClient({
    baseUrl,
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        cache: 'force-cache',
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

    if (!delivery.loadingData || delivery.loadingData.adapter !== 'yoola') {
      throw new Error(
        `[yoola] Workspace ${workspaceId} is not bound to an external project using the yoola adapter.`
      );
    }

    const loadingData = delivery.loadingData as YoolaExternalProjectLoadingData;
    const archiveArtworks = loadingData.artworks.map(normalizeArtwork);
    const entriesBySlug = new Map(
      delivery.collections.flatMap((collection) =>
        collection.entries.map((entry) => [entry.slug, entry] as const)
      )
    );
    const loreCapsules = loadingData.loreCapsules.map((item) =>
      normalizeLoreCapsule(item, entriesBySlug.get(item.slug) ?? null)
    );

    const collectionBySlug = new Map(
      delivery.collections.map((collection) => [collection.slug, collection] as const)
    );

    const sections = Object.fromEntries(
      Object.entries(loadingData.singletonSections).map(([slug, section]) => [
        slug,
        normalizeSection(slug, section),
      ])
    ) as Record<string, YoolaPageSection>;

    sections.gallery ??= createFallbackSection(
      'gallery',
      '[ Archive ]',
      collectionBySlug.get('artworks')?.description ?? null
    );
    sections.writing ??= createFallbackSection(
      'writing',
      '[ Lore ]',
      collectionBySlug.get('lore-capsules')?.description ?? null
    );
    sections.about ??= createFallbackSection(
      'about',
      'Profile Dossier',
      null
    );

    const profile = normalizeProfile(
      asRecord(delivery.profileData),
      sections.about.profileData
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

    const homeNavigationLabel =
      toUpperLabel(asString(sections.home?.profileData.navLabel), 'INDEX');
    const aboutNavigationLabel = toUpperLabel(
      asString(sections.about.profileData.navLabel) ?? sections.about.title,
      'ABOUT'
    );

    const seenPaths = new Set<string>(['/', '/about']);
    const navigationItems = [
      { name: homeNavigationLabel, path: '/' },
      ...resolvedNavigationItems.filter((item) => {
        if (seenPaths.has(item.path)) {
          return false;
        }

        seenPaths.add(item.path);
        return true;
      }),
      { name: aboutNavigationLabel, path: '/about' },
    ];

    return {
      archiveArtworks,
      artworkCategories: loadingData.artworkCategories.map((category) =>
        category.toUpperCase()
      ),
      featuredArtwork: loadingData.featuredArtwork
        ? normalizeArtwork(loadingData.featuredArtwork)
        : archiveArtworks[0] ?? null,
      loreCapsules,
      navigationItems:
        navigationItems.length > 2 ? navigationItems : defaultNavigationItems,
      profile,
      sections,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown EPM delivery failure';

    throw new Error(
      `[yoola] Failed to load EPM delivery from ${baseUrl} for workspace ${workspaceId}: ${message}`
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
