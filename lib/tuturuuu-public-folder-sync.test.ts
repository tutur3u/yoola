import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { linkPublicFolderAssets, syncPublicFolderAssets } from "./tuturuuu-public-folder-sync";

function createManifest() {
  return {
    adapter: "yoola",
    content: {
      entries: [
        {
          assets: [
            {
              assetType: "image",
              metadata: {
                caption: "Starter Signal",
                publicPath: "/artworks/starter-signal.png",
              },
              stableSourceId: "yoola:art:starter-signal:image",
            },
          ],
          collectionSlug: "artworks",
          slug: "starter-signal",
          stableSourceId: "yoola:art:starter-signal",
          title: "Starter Signal",
        },
      ],
    },
    schema: {
      collections: [],
    },
    version: 1 as const,
  };
}

describe("Tuturuuu public folder sync", () => {
  test("links public assets to deterministic Tuturuuu Drive storage paths", () => {
    const manifest = createManifest();
    const linked = linkPublicFolderAssets(manifest);

    expect(manifest.content.entries[0]?.assets?.[0]?.storagePath).toBeUndefined();
    expect(linked.content.entries[0]?.assets?.[0]?.sourceUrl).toBeNull();
    expect(linked.content.entries[0]?.assets?.[0]?.storagePath).toBe(
      "external-projects/yoola/artworks/starter-signal/starter-signal.png",
    );
  });

  test("uploads linked public assets before returning the manifest", async () => {
    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    const publicDir = await mkdtemp(join(tmpdir(), "yoola-public-assets-"));
    await mkdir(join(publicDir, "artworks"));
    await writeFile(join(publicDir, "artworks", "starter-signal.png"), "png bytes");

    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({ init, input });
      if (calls.length === 1) {
        return Response.json({
          fullPath: "ws_123/external-projects/yoola/artworks/starter-signal/starter-signal.png",
          path: "external-projects/yoola/artworks/starter-signal/starter-signal.png",
          signedUrl: "https://upload.example.com/object",
          token: "upload_token",
        });
      }

      return new Response(null, { status: 200 });
    };

    try {
      const result = await syncPublicFolderAssets({
        accessToken: "admin_token",
        apiBaseUrl: "https://platform.example.com/api/v1",
        fetch: fetchImpl,
        manifest: createManifest(),
        publicDir,
        tokenType: "Bearer",
        workspaceId: "ws_123",
      });

      expect(result.skipped).toEqual([]);
      expect(result.uploaded[0]?.storagePath).toBe(
        "external-projects/yoola/artworks/starter-signal/starter-signal.png",
      );
      expect(calls[0]?.input).toBe(
        "https://platform.example.com/api/v1/workspaces/ws_123/external-projects/assets/upload-url",
      );
      expect(JSON.parse(calls[0]?.init?.body as string)).toEqual({
        collectionType: "artworks",
        entrySlug: "starter-signal",
        filename: "starter-signal.png",
        upsert: true,
      });
      expect(new Headers(calls[1]?.init?.headers).get("Authorization")).toBe("Bearer upload_token");
    } finally {
      await rm(publicDir, { force: true, recursive: true });
    }
  });
});
