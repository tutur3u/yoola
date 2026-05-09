export type YoolaAdminImageAsset = {
  asset_url?: string | null;
  id?: string | null;
  preview_url?: string | null;
  source_url?: string | null;
  storage_path?: string | null;
};

export type YoolaAdminImageTransform = {
  format?: "origin";
  height?: number;
  quality?: number;
  resize?: "contain" | "cover" | "fill";
  width?: number;
};

const DEFAULT_ADMIN_IMAGE_TRANSFORM = {
  height: 1600,
  quality: 82,
  resize: "cover",
  width: 1600,
} satisfies YoolaAdminImageTransform;

function appendTransformParams(params: URLSearchParams, transform: YoolaAdminImageTransform) {
  if (transform.width !== undefined) {
    params.set("width", transform.width.toString());
  }

  if (transform.height !== undefined) {
    params.set("height", transform.height.toString());
  }

  if (transform.resize) {
    params.set("resize", transform.resize);
  }

  if (transform.quality !== undefined) {
    params.set("quality", transform.quality.toString());
  }

  if (transform.format) {
    params.set("format", transform.format);
  }
}

export function getYoolaAdminAssetProxyPath(
  asset: YoolaAdminImageAsset | null | undefined,
  transform: YoolaAdminImageTransform = DEFAULT_ADMIN_IMAGE_TRANSFORM,
) {
  if (!asset?.id?.trim()) {
    return null;
  }

  const params = new URLSearchParams();
  appendTransformParams(params, transform);

  const query = params.toString();
  return `/api/admin/assets/${encodeURIComponent(asset.id)}${query ? `?${query}` : ""}`;
}

function compactUniqueSources(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const sources: string[] = [];

  for (const value of values) {
    const source = value?.trim();

    if (!source || seen.has(source)) {
      continue;
    }

    seen.add(source);
    sources.push(source);
  }

  return sources;
}

export function getYoolaAdminAssetSources(asset: YoolaAdminImageAsset | null | undefined) {
  return compactUniqueSources([
    getYoolaAdminAssetProxyPath(asset),
    asset?.preview_url,
    asset?.asset_url,
    asset?.source_url,
  ]);
}
