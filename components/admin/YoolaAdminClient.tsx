"use client";

import type {
  JsonObject,
  YoolaAdminAsset,
  YoolaAdminCollection,
  YoolaAdminEntry,
  YoolaAdminStudioPayload,
  YoolaEntryStatus,
} from "@/lib/yoola-admin-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Check,
  Eye,
  FileText,
  ImageIcon,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Save,
  Send,
  Settings2,
  Undo2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type AdminLink = {
  actionLabel: string;
  cmsHref: string;
  description: string;
  key: string;
  label: string;
  loginHref: string;
};

type EntryDraft = {
  metadataText: string;
  profileDataText: string;
  scheduledFor: string;
  slug: string;
  status: YoolaEntryStatus;
  subtitle: string;
  summary: string;
  title: string;
};

type CollectionDraft = {
  configText: string;
  description: string;
  isEnabled: boolean;
  slug: string;
  title: string;
};

const STUDIO_QUERY_KEY = ["yoola", "admin", "studio"] as const;
const ENTRY_STATUSES: YoolaEntryStatus[] = ["draft", "scheduled", "published", "archived"];

function mergeEntry(studio: YoolaAdminStudioPayload, entry: YoolaAdminEntry) {
  return {
    ...studio,
    entries: studio.entries.map((item) => (item.id === entry.id ? entry : item)),
  };
}

function mergeCollection(studio: YoolaAdminStudioPayload, collection: YoolaAdminCollection) {
  return {
    ...studio,
    collections: studio.collections.map((item) => (item.id === collection.id ? collection : item)),
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "None";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function stringifyJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

function parseJsonObject(value: string, label: string): JsonObject {
  const parsed = JSON.parse(value) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return parsed as JsonObject;
}

function toDatetimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value.trim()) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function readAdminError(response: Response) {
  const fallback = `Request failed with status ${response.status}`;
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim() ? data.error : fallback;
}

async function fetchAdminJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readAdminError(response));
  }

  return (await response.json()) as T;
}

function getEntryDraft(entry: YoolaAdminEntry): EntryDraft {
  return {
    metadataText: stringifyJson(entry.metadata),
    profileDataText: stringifyJson(entry.profile_data),
    scheduledFor: toDatetimeLocal(entry.scheduled_for),
    slug: entry.slug,
    status: entry.status,
    subtitle: entry.subtitle ?? "",
    summary: entry.summary ?? "",
    title: entry.title,
  };
}

function getCollectionDraft(collection: YoolaAdminCollection): CollectionDraft {
  return {
    configText: stringifyJson(collection.config),
    description: collection.description ?? "",
    isEnabled: collection.is_enabled,
    slug: collection.slug,
    title: collection.title,
  };
}

function getStatusClass(status: YoolaEntryStatus) {
  if (status === "published") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "scheduled") {
    return "border-cyan-300/25 bg-cyan-400/10 text-cyan-100";
  }

  if (status === "archived") {
    return "border-white/10 bg-white/[0.05] text-white/44";
  }

  return "border-amber-300/25 bg-amber-400/10 text-amber-100";
}

function getCollectionTitle(collections: YoolaAdminCollection[], collectionId: string) {
  return collections.find((collection) => collection.id === collectionId)?.title ?? "Unsorted";
}

function getPrimaryAsset(entry: YoolaAdminEntry, assets: YoolaAdminAsset[]) {
  return assets
    .filter((asset) => asset.entry_id === entry.id)
    .sort((a, b) => a.sort_order - b.sort_order)[0];
}

function AdminButton({
  children,
  disabled,
  onClick,
  tone = "secondary",
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  tone?: "danger" | "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const toneClass =
    tone === "primary"
      ? "border-white bg-white text-[#08080a] hover:bg-[#ff8edb]"
      : tone === "danger"
        ? "border-red-300/25 bg-red-500/12 text-red-100 hover:border-red-200/45"
        : "border-white/12 bg-white/[0.045] text-white/78 hover:border-white/26 hover:text-white";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 border px-3.5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${toneClass}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-white/54">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <input
      className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/26 focus:border-[#5eead4]/50"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  );
}

function TextArea({
  minRows = 4,
  onChange,
  value,
}: {
  minRows?: number;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <textarea
      className="min-h-[7rem] resize-y border border-white/10 bg-black/24 px-3 py-2.5 font-mono text-xs leading-5 text-white outline-none transition placeholder:text-white/26 focus:border-[#5eead4]/50"
      onChange={(event) => onChange(event.target.value)}
      rows={minRows}
      value={value}
    />
  );
}

function EntryEditor({
  assets,
  collectionTitle,
  entry,
  isPublishing,
  isSaving,
  onPublish,
  onSave,
}: {
  assets: YoolaAdminAsset[];
  collectionTitle: string;
  entry: YoolaAdminEntry;
  isPublishing: boolean;
  isSaving: boolean;
  onPublish: (entryId: string, eventKind: "publish" | "unpublish") => void;
  onSave: (entryId: string, payload: Record<string, unknown>) => void;
}) {
  const [draft, setDraft] = useState(() => getEntryDraft(entry));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const primaryAsset = getPrimaryAsset(entry, assets);

  useEffect(() => {
    setDraft(getEntryDraft(entry));
    setJsonError(null);
  }, [entry]);

  const setDraftValue = (key: keyof EntryDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveEntry = () => {
    try {
      setJsonError(null);
      const payload = {
        metadata: parseJsonObject(draft.metadataText, "Metadata"),
        profile_data: parseJsonObject(draft.profileDataText, "Profile data"),
        scheduled_for: fromDatetimeLocal(draft.scheduledFor),
        slug: draft.slug.trim(),
        status: draft.status,
        subtitle: draft.subtitle.trim() || null,
        summary: draft.summary.trim() || null,
        title: draft.title.trim(),
      };

      onSave(entry.id, payload);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON payload.");
    }
  };

  return (
    <section className="grid min-h-[44rem] border border-white/10 bg-white/[0.035] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="border-b border-white/10 p-5 lg:border-r lg:border-b-0">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-white/10 bg-black/28">
          {primaryAsset?.preview_url || primaryAsset?.asset_url ? (
            <Image
              alt={primaryAsset.alt_text ?? entry.title}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 88vw, 32vw"
              src={primaryAsset.preview_url ?? primaryAsset.asset_url ?? ""}
            />
          ) : (
            <ImageIcon className="size-10 text-white/22" />
          )}
        </div>
        <div className="mt-5 space-y-3 text-sm text-white/58">
          <div className="flex items-center justify-between gap-3">
            <span>Collection</span>
            <span className="text-right font-bold text-white/82">{collectionTitle}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Published</span>
            <span className="text-right text-white/76">{formatDate(entry.published_at)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Updated</span>
            <span className="text-right text-white/76">{formatDate(entry.updated_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <span
                className={`inline-flex w-fit items-center border px-2.5 py-1 text-xs font-bold ${getStatusClass(entry.status)}`}
              >
                {entry.status}
              </span>
              <h2 className="mt-3 font-display text-3xl font-black text-white">{entry.title}</h2>
              <p className="mt-2 break-all font-mono text-xs text-white/42">{entry.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminButton disabled={isSaving} onClick={saveEntry} tone="primary">
                {isSaving ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save
              </AdminButton>
              {entry.status === "published" ? (
                <AdminButton
                  disabled={isPublishing}
                  onClick={() => onPublish(entry.id, "unpublish")}
                  tone="danger"
                >
                  {isPublishing ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Undo2 className="size-4" />
                  )}
                  Unpublish
                </AdminButton>
              ) : (
                <AdminButton
                  disabled={isPublishing}
                  onClick={() => onPublish(entry.id, "publish")}
                  tone="secondary"
                >
                  {isPublishing ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Publish
                </AdminButton>
              )}
            </div>
          </div>
          {jsonError ? (
            <div className="mt-4 border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {jsonError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Title">
            <TextInput onChange={(value) => setDraftValue("title", value)} value={draft.title} />
          </Field>
          <Field label="Slug">
            <TextInput onChange={(value) => setDraftValue("slug", value)} value={draft.slug} />
          </Field>
          <Field label="Subtitle">
            <TextInput
              onChange={(value) => setDraftValue("subtitle", value)}
              value={draft.subtitle}
            />
          </Field>
          <Field label="Status">
            <select
              className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5eead4]/50"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as YoolaEntryStatus,
                }))
              }
              value={draft.status}
            >
              {ENTRY_STATUSES.map((status) => (
                <option className="bg-[#111115]" key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Scheduled for">
            <input
              className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5eead4]/50"
              onChange={(event) => setDraftValue("scheduledFor", event.target.value)}
              type="datetime-local"
              value={draft.scheduledFor}
            />
          </Field>
          <Field label="Summary">
            <textarea
              className="min-h-[6rem] resize-y border border-white/10 bg-black/24 px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/26 focus:border-[#5eead4]/50"
              onChange={(event) => setDraftValue("summary", event.target.value)}
              value={draft.summary}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Profile data">
              <TextArea
                minRows={8}
                onChange={(value) => setDraftValue("profileDataText", value)}
                value={draft.profileDataText}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Metadata">
              <TextArea
                minRows={6}
                onChange={(value) => setDraftValue("metadataText", value)}
                value={draft.metadataText}
              />
            </Field>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionEditor({
  collection,
  isSaving,
  onSave,
}: {
  collection: YoolaAdminCollection;
  isSaving: boolean;
  onSave: (collectionId: string, payload: Record<string, unknown>) => void;
}) {
  const [draft, setDraft] = useState(() => getCollectionDraft(collection));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(getCollectionDraft(collection));
    setJsonError(null);
  }, [collection]);

  const saveCollection = () => {
    try {
      setJsonError(null);
      onSave(collection.id, {
        config: parseJsonObject(draft.configText, "Collection config"),
        description: draft.description.trim() || null,
        is_enabled: draft.isEnabled,
        slug: draft.slug.trim(),
        title: draft.title.trim(),
      });
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid collection JSON.");
    }
  };

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/72">
            <Settings2 className="size-4" />
            <h2 className="font-display text-xl font-black text-white">Collection settings</h2>
          </div>
          <p className="mt-1 font-mono text-xs text-white/38">{collection.collection_type}</p>
        </div>
        <AdminButton disabled={isSaving} onClick={saveCollection}>
          {isSaving ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save collection
        </AdminButton>
      </div>
      {jsonError ? (
        <div className="mt-4 border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {jsonError}
        </div>
      ) : null}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <TextInput
            onChange={(value) => setDraft((current) => ({ ...current, title: value }))}
            value={draft.title}
          />
        </Field>
        <Field label="Slug">
          <TextInput
            onChange={(value) => setDraft((current) => ({ ...current, slug: value }))}
            value={draft.slug}
          />
        </Field>
        <Field label="Description">
          <textarea
            className="min-h-[6rem] resize-y border border-white/10 bg-black/24 px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/26 focus:border-[#5eead4]/50"
            onChange={(event) =>
              setDraft((current) => ({ ...current, description: event.target.value }))
            }
            value={draft.description}
          />
        </Field>
        <div className="grid content-start gap-2">
          <span className="text-xs font-bold text-white/54">Visibility</span>
          <button
            className={`inline-flex w-fit items-center gap-2 border px-3.5 py-2.5 text-sm font-bold transition ${
              draft.isEnabled
                ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                : "border-white/12 bg-white/[0.045] text-white/62"
            }`}
            onClick={() => setDraft((current) => ({ ...current, isEnabled: !current.isEnabled }))}
            type="button"
          >
            <Check className="size-4" />
            {draft.isEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="md:col-span-2">
          <Field label="Config">
            <TextArea
              minRows={7}
              onChange={(value) => setDraft((current) => ({ ...current, configText: value }))}
              value={draft.configText}
            />
          </Field>
        </div>
      </div>
    </section>
  );
}

export function YoolaAdminClient({
  adminLinks,
  cmsBaseUrl,
  initialStudio,
  initialTarget,
  userEmail,
  webAppUrl,
  workspaceId,
}: {
  adminLinks: AdminLink[];
  cmsBaseUrl: string;
  initialStudio: YoolaAdminStudioPayload;
  initialTarget: string | null;
  userEmail: string | null;
  webAppUrl: string;
  workspaceId: string;
}) {
  const queryClient = useQueryClient();
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<YoolaEntryStatus | "all">("all");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    initialStudio.entries[0]?.id ?? null,
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(
    initialStudio.collections[0]?.id ?? null,
  );
  const studioQuery = useQuery({
    initialData: initialStudio,
    queryFn: () => fetchAdminJson<YoolaAdminStudioPayload>("/api/admin/studio"),
    queryKey: STUDIO_QUERY_KEY,
    refetchOnWindowFocus: false,
  });
  const studio = studioQuery.data;
  const advancedLink = adminLinks.find((link) => link.key === initialTarget) ?? adminLinks[0];

  const updateEntryMutation = useMutation({
    mutationFn: ({ entryId, payload }: { entryId: string; payload: Record<string, unknown> }) =>
      fetchAdminJson<YoolaAdminEntry>(`/api/admin/entries/${encodeURIComponent(entryId)}`, {
        body: JSON.stringify(payload),
        method: "PATCH",
      }),
    onSuccess: (entry) => {
      queryClient.setQueryData<YoolaAdminStudioPayload>(STUDIO_QUERY_KEY, (current) =>
        current ? mergeEntry(current, entry) : current,
      );
    },
  });
  const publishEntryMutation = useMutation({
    mutationFn: ({ entryId, eventKind }: { entryId: string; eventKind: "publish" | "unpublish" }) =>
      fetchAdminJson<YoolaAdminEntry>(`/api/admin/entries/${encodeURIComponent(entryId)}/publish`, {
        body: JSON.stringify({ eventKind }),
        method: "POST",
      }),
    onSuccess: (entry) => {
      queryClient.setQueryData<YoolaAdminStudioPayload>(STUDIO_QUERY_KEY, (current) =>
        current ? mergeEntry(current, entry) : current,
      );
    },
  });
  const updateCollectionMutation = useMutation({
    mutationFn: ({
      collectionId,
      payload,
    }: {
      collectionId: string;
      payload: Record<string, unknown>;
    }) =>
      fetchAdminJson<YoolaAdminCollection>(
        `/api/admin/collections/${encodeURIComponent(collectionId)}`,
        {
          body: JSON.stringify(payload),
          method: "PATCH",
        },
      ),
    onSuccess: (collection) => {
      queryClient.setQueryData<YoolaAdminStudioPayload>(STUDIO_QUERY_KEY, (current) =>
        current ? mergeCollection(current, collection) : current,
      );
    },
  });

  const filteredEntries = useMemo(
    () =>
      studio.entries.filter((entry) => {
        const collectionMatches =
          collectionFilter === "all" || entry.collection_id === collectionFilter;
        const statusMatches = statusFilter === "all" || entry.status === statusFilter;
        return collectionMatches && statusMatches;
      }),
    [collectionFilter, statusFilter, studio.entries],
  );
  const selectedEntry =
    studio.entries.find((entry) => entry.id === selectedEntryId) ?? filteredEntries[0] ?? null;
  const selectedCollection =
    studio.collections.find((collection) => collection.id === selectedCollectionId) ??
    studio.collections.find((collection) => collection.id === selectedEntry?.collection_id) ??
    studio.collections[0] ??
    null;
  const counts = useMemo(
    () => ({
      archived: studio.entries.filter((entry) => entry.status === "archived").length,
      draft: studio.entries.filter((entry) => entry.status === "draft").length,
      published: studio.entries.filter((entry) => entry.status === "published").length,
      scheduled: studio.entries.filter((entry) => entry.status === "scheduled").length,
    }),
    [studio.entries],
  );
  const mutationError =
    updateEntryMutation.error ?? publishEntryMutation.error ?? updateCollectionMutation.error;

  useEffect(() => {
    if (selectedEntry && selectedEntry.id !== selectedEntryId) {
      setSelectedEntryId(selectedEntry.id);
    }
  }, [selectedEntry, selectedEntryId]);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#08080a] px-4 pt-24 pb-16 text-white md:px-6">
      <div className="mx-auto max-w-[96rem]">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/48">
              <span className="border border-white/10 bg-white/[0.04] px-2.5 py-1">
                {workspaceId}
              </span>
              <span className="border border-white/10 bg-white/[0.04] px-2.5 py-1">
                {userEmail ?? "Authenticated"}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-black text-white md:text-5xl">
              Yoola content
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton
              disabled={studioQuery.isFetching}
              onClick={() => void studioQuery.refetch()}
            >
              {studioQuery.isFetching ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh
            </AdminButton>
            <a
              className="inline-flex items-center justify-center gap-2 border border-white/12 bg-white/[0.045] px-3.5 py-2.5 text-sm font-bold text-white/78 transition hover:border-white/26 hover:text-white"
              href={advancedLink?.cmsHref ?? cmsBaseUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ArrowUpRight className="size-4" />
              Full CMS
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 border border-white/12 bg-white/[0.045] px-3.5 py-2.5 text-sm font-bold text-white/78 transition hover:border-white/26 hover:text-white"
              href={webAppUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Eye className="size-4" />
              Platform
            </a>
            <AdminButton onClick={signOut}>
              <LogOut className="size-4" />
              Sign out
            </AdminButton>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Collections", studio.collections.length],
            ["Entries", studio.entries.length],
            ["Drafts", counts.draft],
            ["Scheduled", counts.scheduled],
            ["Published", counts.published],
          ].map(([label, value]) => (
            <div className="border border-white/10 bg-white/[0.035] p-4" key={label}>
              <p className="text-xs font-bold text-white/42">{label}</p>
              <p className="mt-2 font-display text-3xl font-black text-white">{value}</p>
            </div>
          ))}
        </section>

        {mutationError ? (
          <div className="mt-5 border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {mutationError instanceof Error ? mutationError.message : "Admin operation failed."}
          </div>
        ) : null}

        <div className="mt-5 grid gap-5 xl:grid-cols-[23rem_minmax(0,1fr)]">
          <aside className="border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-4">
              <div className="grid gap-3">
                <select
                  className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5eead4]/50"
                  onChange={(event) => setCollectionFilter(event.target.value)}
                  value={collectionFilter}
                >
                  <option className="bg-[#111115]" value="all">
                    All collections
                  </option>
                  {studio.collections.map((collection) => (
                    <option className="bg-[#111115]" key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
                <select
                  className="border border-white/10 bg-black/24 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5eead4]/50"
                  onChange={(event) =>
                    setStatusFilter(event.target.value as YoolaEntryStatus | "all")
                  }
                  value={statusFilter}
                >
                  <option className="bg-[#111115]" value="all">
                    All statuses
                  </option>
                  {ENTRY_STATUSES.map((status) => (
                    <option className="bg-[#111115]" key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-h-[38rem] overflow-auto">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <button
                    className={`grid w-full gap-2 border-b border-white/8 px-4 py-3 text-left transition hover:bg-white/[0.045] ${
                      selectedEntry?.id === entry.id ? "bg-white/[0.07]" : ""
                    }`}
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      setSelectedCollectionId(entry.collection_id);
                    }}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="line-clamp-2 text-sm font-bold text-white">
                        {entry.title}
                      </span>
                      <span
                        className={`shrink-0 border px-2 py-0.5 text-[11px] font-bold ${getStatusClass(entry.status)}`}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-white/38">{entry.slug}</span>
                    <span className="text-xs text-white/40">
                      {getCollectionTitle(studio.collections, entry.collection_id)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="grid min-h-48 place-items-center px-4 text-center text-sm text-white/42">
                  No entries match the current filters.
                </div>
              )}
            </div>
          </aside>

          <main className="grid gap-5">
            {selectedEntry ? (
              <EntryEditor
                assets={studio.assets}
                collectionTitle={getCollectionTitle(
                  studio.collections,
                  selectedEntry.collection_id,
                )}
                entry={selectedEntry}
                isPublishing={publishEntryMutation.isPending}
                isSaving={updateEntryMutation.isPending}
                onPublish={(entryId, eventKind) =>
                  publishEntryMutation.mutate({
                    entryId,
                    eventKind,
                  })
                }
                onSave={(entryId, payload) =>
                  updateEntryMutation.mutate({
                    entryId,
                    payload,
                  })
                }
              />
            ) : (
              <section className="grid min-h-[32rem] place-items-center border border-white/10 bg-white/[0.035] text-white/44">
                <div className="grid justify-items-center gap-3">
                  <FileText className="size-8" />
                  <p>No entry selected.</p>
                </div>
              </section>
            )}

            {selectedCollection ? (
              <CollectionEditor
                collection={selectedCollection}
                isSaving={updateCollectionMutation.isPending}
                onSave={(collectionId, payload) =>
                  updateCollectionMutation.mutate({
                    collectionId,
                    payload,
                  })
                }
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
