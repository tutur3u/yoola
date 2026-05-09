"use client";

import { useMutation } from "@tanstack/react-query";
import { GitCompareArrows, LoaderCircle, ShieldAlert, UploadCloud } from "lucide-react";

async function readAdminError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim()
    ? data.error
    : `Request failed with status ${response.status}`;
}

async function postAdminJson<T>(url: string, body?: unknown) {
  const response = await fetch(url, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readAdminError(response));
  }

  return (await response.json()) as T;
}

type SyncDiffResponse = {
  hasDestructiveOperations?: boolean;
  operations?: unknown[];
  summary?: {
    archive?: number;
    create?: number;
    delete?: number;
    noop?: number;
    update?: number;
  };
};

export function YoolaAdminSyncPanel() {
  const diffMutation = useMutation({
    mutationFn: () => postAdminJson<SyncDiffResponse>("/api/admin/sync/diff"),
  });
  const applyMutation = useMutation({
    mutationFn: (force: boolean) =>
      postAdminJson<{
        diff?: SyncDiffResponse;
      }>("/api/admin/sync/apply", { force }),
    onSuccess: (result) => {
      diffMutation.reset();
      if (result.diff) {
        diffMutation.mutate();
      }
    },
  });
  const diff = diffMutation.data ?? applyMutation.data?.diff ?? null;
  const summary = diff?.summary;
  const totalOperations =
    (summary?.archive ?? 0) +
    (summary?.create ?? 0) +
    (summary?.delete ?? 0) +
    (summary?.update ?? 0);
  const error = diffMutation.error ?? applyMutation.error;

  return (
    <section className="mt-5 border border-white/10 bg-white/[0.035] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <GitCompareArrows className="size-4 text-[#5eead4]" />
            <h2 className="font-display text-xl font-black">Tuturuuu sync</h2>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-white/48">
            Diff and push the Yoola manifest against the Tuturuuu CMS workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 border border-white/12 bg-white/[0.045] px-3.5 py-2.5 text-sm font-bold text-white/78 transition hover:border-white/26 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            disabled={diffMutation.isPending || applyMutation.isPending}
            onClick={() => diffMutation.mutate()}
            type="button"
          >
            {diffMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <GitCompareArrows className="size-4" />
            )}
            Check sync
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 border border-white bg-white px-3.5 py-2.5 text-sm font-bold text-[#08080a] transition hover:bg-[#ff8edb] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={applyMutation.isPending || diffMutation.isPending}
            onClick={() => applyMutation.mutate(false)}
            type="button"
          >
            {applyMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            Push manifest
          </button>
        </div>
      </div>

      {diff ? (
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
          {[
            ["Create", summary?.create ?? 0],
            ["Update", summary?.update ?? 0],
            ["Archive", summary?.archive ?? 0],
            ["Delete", summary?.delete ?? 0],
          ].map(([label, value]) => (
            <div className="border border-white/10 bg-black/24 px-3 py-2" key={label}>
              <span className="text-white/44">{label}</span>
              <span className="float-right font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      ) : null}

      {diff?.hasDestructiveOperations ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          <span className="inline-flex items-center gap-2">
            <ShieldAlert className="size-4" />
            Destructive operations require explicit force.
          </span>
          <button
            className="border border-red-200/30 px-3 py-1.5 font-bold text-red-50"
            disabled={applyMutation.isPending}
            onClick={() => applyMutation.mutate(true)}
            type="button"
          >
            Force apply
          </button>
        </div>
      ) : null}

      {diff && !diff.hasDestructiveOperations ? (
        <p className="mt-3 text-sm text-white/48">
          {totalOperations === 0
            ? "Manifest is already in sync."
            : `${totalOperations} changes ready.`}
        </p>
      ) : null}

      {error ? (
        <div className="mt-3 border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error instanceof Error ? error.message : "Sync request failed."}
        </div>
      ) : null}
    </section>
  );
}
