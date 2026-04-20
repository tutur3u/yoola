import type {
  ExternalProjectDeliveryEntry,
  YoolaExternalProjectArtworkLoadingItem,
  YoolaExternalProjectLoreCapsuleLoadingItem,
  YoolaExternalProjectSectionLoadingItem,
} from '@/lib/tuturuuu-sdk';
import type {
  ArchiveArtwork,
  ArtworkOrientation,
  LoreCapsule,
  YoolaPageSection,
  YoolaProfile,
  YoolaProfileMarker,
  YoolaProfileStat,
  YoolaSocialLink,
} from '@/lib/archive-data.types';

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

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

export function getRenderableMarkdown(value: unknown): string | null {
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
        const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 1;
        return `${'#'.repeat(level)} ${(node.content ?? []).map((child) => visit(child as any, depth)).join('')}\n`;
      }

      if (node.type === 'bulletList' || node.type === 'taskList') {
        return `${(node.content ?? []).map((child) => visit(child as any, depth)).join('')}\n`;
      }

      if (node.type === 'orderedList') {
        let counter = typeof node.attrs?.start === 'number' ? node.attrs.start : 1;
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

function normalizeOrientation(
  orientation: string | null,
  width: number,
  height: number
): ArtworkOrientation {
  if (
    orientation === 'portrait' ||
    orientation === 'landscape' ||
    orientation === 'square'
  ) {
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
      if (!block.content || typeof block.content !== 'object') {
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

export function normalizeArtwork(
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

export function normalizeLoreCapsule(
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
    profileData: toRecord(item.profileData),
    metadata: toRecord(item.metadata),
  };
}

export function normalizeSection(
  slug: string,
  section: YoolaExternalProjectSectionLoadingItem
): YoolaPageSection {
  return {
    bodyMarkdown: section.bodyMarkdown?.trim() || null,
    metadata: toRecord(section.metadata),
    profileData: toRecord(section.profileData),
    slug,
    subtitle: section.subtitle?.trim() || null,
    summary: getRenderableMarkdown(section.summary),
    title: section.title?.trim() || slug,
  };
}

export function createFallbackSection(
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
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }

      const link = item as Record<string, unknown>;
      const hrefFromHref =
        typeof link.href === 'string' && link.href.trim().length > 0
          ? link.href.trim()
          : null;
      const hrefFromUrl =
        typeof link.url === 'string' && link.url.trim().length > 0
          ? link.url.trim()
          : null;
      const href = hrefFromHref ?? hrefFromUrl;

      if (!href) {
        return null;
      }

      const icon =
        typeof link.icon === 'string' && link.icon.trim().length > 0
          ? link.icon.trim()
          : typeof link.platform === 'string' && link.platform.trim().length > 0
            ? link.platform.trim()
            : typeof link.label === 'string' && link.label.trim().length > 0
              ? link.label.trim()
              : 'link';

      const label =
        typeof link.label === 'string' && link.label.trim().length > 0
          ? link.label.trim()
          : 'Link';

      return {
        href,
        icon,
        label,
      } satisfies YoolaSocialLink;
    })
    .filter((item): item is YoolaSocialLink => Boolean(item));
}

function normalizeProfileStats(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultProfileStats;
  }

  const stats = value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }

      const stat = item as Record<string, unknown>;
      const label =
        typeof stat.label === 'string' && stat.label.trim().length > 0
          ? stat.label.trim().toUpperCase()
          : null;
      const rawValue = stat.value;

      if (!label || (typeof rawValue !== 'number' && typeof rawValue !== 'string')) {
        return null;
      }

      const max =
        typeof stat.max === 'number' && Number.isFinite(stat.max) ? stat.max : null;

      return {
        label,
        max,
        value: rawValue,
      } satisfies YoolaProfileStat;
    })
    .filter((item): item is YoolaProfileStat => Boolean(item));

  return stats.length > 0 ? stats : defaultProfileStats;
}

function normalizeProfileMarkers(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultProfileMarkers;
  }

  const markers = value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }

      const marker = item as Record<string, unknown>;
      const label =
        typeof marker.label === 'string' && marker.label.trim().length > 0
          ? marker.label.trim()
          : null;
      const markerValue =
        typeof marker.value === 'string' && marker.value.trim().length > 0
          ? marker.value.trim()
          : null;

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

export function normalizeProfile(
  baseProfileData: Record<string, unknown>,
  aboutProfileData: Record<string, unknown>
): YoolaProfile {
  const mergedProfileData = {
    ...baseProfileData,
    ...aboutProfileData,
  };

  const brand =
    typeof mergedProfileData.brand === 'string' && mergedProfileData.brand.trim().length > 0
      ? mergedProfileData.brand.trim()
      : 'YOOLA';
  const entityId =
    typeof mergedProfileData.entityId === 'string' &&
    mergedProfileData.entityId.trim().length > 0
      ? mergedProfileData.entityId.trim()
      : null;
  const name =
    typeof mergedProfileData.name === 'string' && mergedProfileData.name.trim().length > 0
      ? mergedProfileData.name.trim()
      : 'Yol Yoola';
  const rank =
    typeof mergedProfileData.rank === 'string' && mergedProfileData.rank.trim().length > 0
      ? mergedProfileData.rank.trim()
      : null;
  const role =
    typeof mergedProfileData.role === 'string' && mergedProfileData.role.trim().length > 0
      ? mergedProfileData.role.trim()
      : 'Creator // Artist';
  const statusLabel =
    typeof mergedProfileData.statusLabel === 'string' &&
    mergedProfileData.statusLabel.trim().length > 0
      ? mergedProfileData.statusLabel.trim()
      : typeof mergedProfileData.status === 'string' &&
          mergedProfileData.status.trim().length > 0
        ? mergedProfileData.status.trim()
        : null;

  return {
    brand,
    entityId,
    markers: normalizeProfileMarkers(mergedProfileData.markers),
    name,
    rank,
    role,
    socialLinks: normalizeSocialLinks(
      mergedProfileData.socialLinks ?? mergedProfileData.socials
    ),
    stats: normalizeProfileStats(mergedProfileData.stats),
    statusLabel,
  };
}

export function resolveCollectionPath(
  slug: string,
  title: string,
  href: string | null
) {
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

export function toProfileDataRecord(value: unknown): Record<string, unknown> {
  return toRecord(value);
}
