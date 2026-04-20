export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

export type ExternalProjectBlock = {
  id: string;
  block_type: string;
  title: string | null;
  content: Record<string, unknown> | null;
};

export type ExternalProjectDeliveryEntry = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  status: string;
  published_at: string | null;
  profile_data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  blocks: ExternalProjectBlock[];
  assets: Array<{
    id: string;
    entry_id: string | null;
    block_id: string | null;
    asset_type: string;
    storage_path: string | null;
    source_url: string | null;
    alt_text: string | null;
    sort_order: number;
    metadata: Record<string, unknown>;
    assetUrl: string | null;
  }>;
};

export type EpmCollectionNavigationConfig = {
  href?: string | null;
  title?: string | null;
  visible?: boolean | null;
  [key: string]: JsonValue | undefined;
};

export type ExternalProjectCollection = {
  id: string;
  slug: string;
  title: string;
  collection_type: string;
  description: string | null;
  config: Record<string, unknown> | null;
  entries: ExternalProjectDeliveryEntry[];
};

export type YoolaExternalProjectArtworkLoadingItem = {
  entryId: string;
  slug: string;
  title: string;
  summary: string | null;
  caption: string | null;
  label: string | null;
  category: string | null;
  rarity: string | null;
  orientation: string | null;
  year: string | null;
  note: string | null;
  width: number | null;
  height: number | null;
  assetId: string | null;
  assetUrl: string | null;
  altText: string | null;
};

export type YoolaExternalProjectLoreCapsuleLoadingItem = {
  entryId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  teaser: string | null;
  channel: string | null;
  status: string | null;
  date: string | null;
  tags: string[];
  excerptMarkdown: string | null;
  bodyMarkdown: string | null;
  artworkEntryId: string | null;
  artworkAssetUrl: string | null;
  profileData: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

export type YoolaExternalProjectSectionLoadingItem = {
  entryId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  bodyMarkdown: string | null;
  profileData: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

export type YoolaExternalProjectLoadingData = {
  adapter: 'yoola';
  featuredArtwork: YoolaExternalProjectArtworkLoadingItem | null;
  artworks: YoolaExternalProjectArtworkLoadingItem[];
  artworkCategories: string[];
  artworksByCategory: Record<string, YoolaExternalProjectArtworkLoadingItem[]>;
  loreCapsules: YoolaExternalProjectLoreCapsuleLoadingItem[];
  singletonSections: Record<string, YoolaExternalProjectSectionLoadingItem>;
};

export type ExternalProjectDeliveryPayload = {
  workspaceId: string;
  canonicalProjectId: string;
  adapter: string;
  generatedAt: string;
  collections: ExternalProjectCollection[];
  profileData: Record<string, unknown>;
  loadingData:
    | YoolaExternalProjectLoadingData
    | { adapter: string; sections?: Record<string, unknown> }
    | null;
};

type TuturuuuClientConfig = {
  apiKey?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

type TuturuuuClientInstance = {
  externalProjects: {
    getDelivery: (
      workspaceId: string,
      options?: { preview?: boolean }
    ) => Promise<ExternalProjectDeliveryPayload>;
  };
};

type TuturuuuModule = {
  TuturuuuClient: new (config?: TuturuuuClientConfig) => TuturuuuClientInstance;
};

let sdkRuntimePromise: Promise<TuturuuuModule> | null = null;

async function loadSdkRuntime() {
  if (!sdkRuntimePromise) {
    const packageName = 'tuturuuu';
    sdkRuntimePromise = import(packageName) as Promise<TuturuuuModule>;
  }

  return sdkRuntimePromise;
}

export async function createTuturuuuClient(config?: TuturuuuClientConfig) {
  const sdk = await loadSdkRuntime();
  return new sdk.TuturuuuClient(config);
}

export function getEpmCollectionNavigationConfig(
  config: unknown
): EpmCollectionNavigationConfig | null {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return null;
  }

  const navigation = (config as Record<string, unknown>).navigation;
  if (
    !navigation ||
    typeof navigation !== 'object' ||
    Array.isArray(navigation)
  ) {
    return null;
  }

  return navigation as EpmCollectionNavigationConfig;
}

export function getEpmCollectionNavigationTitle(
  collection: Pick<ExternalProjectCollection, 'config' | 'title'>
) {
  const navigation = getEpmCollectionNavigationConfig(collection.config);
  return navigation?.title?.trim() ? navigation.title.trim() : collection.title;
}

export function buildEpmNavigationItems(
  collections: ExternalProjectCollection[]
) {
  return collections
    .map((collection) => {
      const navigation = getEpmCollectionNavigationConfig(collection.config);

      return {
        collectionId: collection.id,
        href: navigation?.href ?? null,
        navigation: navigation ?? null,
        slug: collection.slug,
        title: getEpmCollectionNavigationTitle(collection),
        visible: navigation?.visible !== false,
      };
    })
    .filter((item) => item.visible);
}

function isYoolaLoadingData(
  loadingData: ExternalProjectDeliveryPayload['loadingData']
): loadingData is YoolaExternalProjectLoadingData {
  return (
    !!loadingData &&
    loadingData.adapter === 'yoola' &&
    'singletonSections' in loadingData
  );
}

export function getYoolaSingletonSection(
  loadingData: ExternalProjectDeliveryPayload['loadingData'],
  slug: string
) {
  if (!isYoolaLoadingData(loadingData)) {
    return null;
  }

  return loadingData.singletonSections[slug] ?? null;
}

export function getYoolaSectionMarkdown(
  section: YoolaExternalProjectSectionLoadingItem | null | undefined
) {
  if (!section) {
    return null;
  }

  return section.bodyMarkdown?.trim() || section.summary?.trim() || null;
}
