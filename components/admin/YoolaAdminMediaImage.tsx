"use client";

import { getYoolaAdminAssetSources, type YoolaAdminImageAsset } from "@/lib/yoola-admin-assets";
import { ImageIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export function YoolaAdminMediaImage({
  alt,
  asset,
}: {
  alt: string;
  asset: YoolaAdminImageAsset | null | undefined;
}) {
  const sources = useMemo(() => getYoolaAdminAssetSources(asset), [asset]);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const currentSource = sources.find((source) => !failedSources.includes(source));
  const isLoading = Boolean(currentSource && loadedSource !== currentSource);

  if (!currentSource) {
    return (
      <div className="grid h-full w-full place-items-center text-white/24">
        <ImageIcon className="size-10" />
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/20 text-white/38">
          <LoaderCircle className="size-6 animate-spin" />
        </div>
      ) : null}
      <Image
        alt={alt}
        className="object-cover"
        fill
        onError={() => setFailedSources((current) => [...current, currentSource])}
        onLoad={() => setLoadedSource(currentSource)}
        sizes="(max-width: 1024px) 88vw, 32vw"
        src={currentSource}
        unoptimized={currentSource.startsWith("/api/")}
      />
    </>
  );
}
