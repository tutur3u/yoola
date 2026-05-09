import { getYoolaApiBaseUrl, getYoolaWorkspaceId } from "@/lib/archive-data";
import { getYoolaSessionFromCookies, type YoolaAdminSession } from "@/lib/yoola-session";
import { revalidatePath } from "next/cache";

export type JsonObject = Record<string, unknown>;

export type YoolaEntryStatus = "draft" | "scheduled" | "published" | "archived";

export type YoolaAdminCollection = {
  collection_type: string;
  config: JsonObject;
  created_at?: string | null;
  description: string | null;
  id: string;
  is_enabled: boolean;
  slug: string;
  title: string;
  updated_at?: string | null;
};

export type YoolaAdminEntry = {
  collection_id: string;
  created_at?: string | null;
  id: string;
  metadata: JsonObject;
  profile_data: JsonObject;
  published_at: string | null;
  scheduled_for: string | null;
  slug: string;
  status: YoolaEntryStatus;
  subtitle: string | null;
  summary: string | null;
  title: string;
  updated_at?: string | null;
};

export type YoolaAdminBlock = {
  block_type: string;
  content: JsonObject | null;
  entry_id: string;
  id: string;
  sort_order: number;
  title: string | null;
};

export type YoolaAdminAsset = {
  alt_text: string | null;
  asset_type: string;
  asset_url: string | null;
  block_id: string | null;
  entry_id: string | null;
  id: string;
  metadata: JsonObject;
  preview_url: string | null;
  sort_order: number;
  source_url: string | null;
  storage_path: string | null;
};

export type YoolaAdminStudioPayload = {
  assets: YoolaAdminAsset[];
  binding?: {
    adapter: string | null;
    canonical_id: string | null;
    enabled: boolean;
    workspace_id: string;
  };
  blocks: YoolaAdminBlock[];
  collections: YoolaAdminCollection[];
  entries: YoolaAdminEntry[];
  importJobs: unknown[];
  loadingData: unknown;
  publishEvents: unknown[];
};

type YoolaEntryUpdatePayload = Partial<
  Pick<
    YoolaAdminEntry,
    | "metadata"
    | "profile_data"
    | "scheduled_for"
    | "slug"
    | "status"
    | "subtitle"
    | "summary"
    | "title"
  >
>;

type YoolaCollectionUpdatePayload = Partial<
  Pick<
    YoolaAdminCollection,
    "collection_type" | "config" | "description" | "is_enabled" | "slug" | "title"
  >
>;

function normalizeApiBaseUrl(value = getYoolaApiBaseUrl()) {
  return value.replace(/\/+$/, "");
}

function getErrorMessage(value: unknown, fallback: string) {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const message = record.message ?? record.error;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

async function readApiError(response: Response) {
  const fallback = `Tuturuuu API request failed with status ${response.status}`;
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return getErrorMessage(await response.json().catch(() => null), fallback);
  }

  const text = await response.text().catch(() => "");
  return text || fallback;
}

async function fetchTuturuuuApi<T>({
  accessToken,
  body,
  method = "GET",
  path,
}: {
  accessToken: string;
  body?: unknown;
  method?: string;
  path: string;
}) {
  const headers = new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${normalizeApiBaseUrl()}${path}`, {
    body: requestBody,
    cache: "no-store",
    headers,
    method,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getYoolaAdminSession(): Promise<YoolaAdminSession | null> {
  return getYoolaSessionFromCookies();
}

export async function getYoolaAdminStudio(accessToken: string) {
  const workspaceId = getYoolaWorkspaceId();

  return fetchTuturuuuApi<YoolaAdminStudioPayload>({
    accessToken,
    path: `/workspaces/${encodeURIComponent(workspaceId)}/external-projects`,
  });
}

export async function updateYoolaAdminEntry(
  accessToken: string,
  entryId: string,
  payload: YoolaEntryUpdatePayload,
) {
  const workspaceId = getYoolaWorkspaceId();

  return fetchTuturuuuApi<YoolaAdminEntry>({
    accessToken,
    body: payload,
    method: "PATCH",
    path: `/workspaces/${encodeURIComponent(workspaceId)}/external-projects/entries/${encodeURIComponent(entryId)}`,
  });
}

export async function publishYoolaAdminEntry(
  accessToken: string,
  entryId: string,
  eventKind: "preview" | "publish" | "unpublish",
) {
  const workspaceId = getYoolaWorkspaceId();

  return fetchTuturuuuApi<YoolaAdminEntry>({
    accessToken,
    body: { eventKind },
    method: "POST",
    path: `/workspaces/${encodeURIComponent(workspaceId)}/external-projects/entries/${encodeURIComponent(entryId)}/publish`,
  });
}

export async function updateYoolaAdminCollection(
  accessToken: string,
  collectionId: string,
  payload: YoolaCollectionUpdatePayload,
) {
  const workspaceId = getYoolaWorkspaceId();

  return fetchTuturuuuApi<YoolaAdminCollection>({
    accessToken,
    body: payload,
    method: "PATCH",
    path: `/workspaces/${encodeURIComponent(workspaceId)}/external-projects/collections/${encodeURIComponent(collectionId)}`,
  });
}

export function revalidateYoolaContent() {
  revalidatePath("/", "layout");
  revalidatePath("/artwork");
  revalidatePath("/writing");
  revalidatePath("/about");
}
