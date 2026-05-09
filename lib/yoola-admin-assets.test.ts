import { describe, expect, test } from "bun:test";
import {
  getYoolaAdminAssetProxyPath,
  getYoolaAdminAssetSources,
  type YoolaAdminImageAsset,
} from "./yoola-admin-assets";

const imageAsset = {
  asset_url: "https://platform.example.com/api/v1/workspaces/ws-1/external-projects/assets/asset-1",
  id: "asset-1",
  preview_url: "/api/v1/workspaces/ws-1/external-projects/assets/asset-1?width=1600",
  source_url: null,
  storage_path: "external-projects/yoola/artworks/bandaged-violet-closeup.png",
} satisfies YoolaAdminImageAsset;

describe("yoola admin assets", () => {
  test("builds authenticated local proxy paths for admin images", () => {
    expect(
      getYoolaAdminAssetProxyPath(imageAsset, {
        height: 900,
        quality: 82,
        resize: "cover",
        width: 900,
      }),
    ).toBe("/api/admin/assets/asset-1?width=900&height=900&resize=cover&quality=82");
  });

  test("prefers the local proxy source before platform fallbacks", () => {
    expect(getYoolaAdminAssetSources(imageAsset)[0]).toBe(
      "/api/admin/assets/asset-1?width=1600&height=1600&resize=cover&quality=82",
    );
    expect(getYoolaAdminAssetSources(imageAsset)).toContain(imageAsset.preview_url);
    expect(getYoolaAdminAssetSources(imageAsset)).toContain(imageAsset.asset_url);
  });

  test("dedupes empty and repeated image sources", () => {
    const sources = getYoolaAdminAssetSources({
      ...imageAsset,
      asset_url: imageAsset.preview_url,
      source_url: "",
    });

    expect(sources).toEqual([
      "/api/admin/assets/asset-1?width=1600&height=1600&resize=cover&quality=82",
      imageAsset.preview_url,
    ]);
  });
});
