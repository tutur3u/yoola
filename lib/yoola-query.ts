"use client";

import { useQuery } from "@tanstack/react-query";
import { buildYoolaArchiveData } from "@/lib/archive-data";
import { createTuturuuuClient } from "@/lib/tuturuuu-sdk";
import { useYoolaRuntimeConfig } from "@/components/yoola-query-provider";

export function getYoolaDeliveryQueryKey(workspaceId: string, apiBaseUrl: string) {
  return ["yoola", "delivery", apiBaseUrl, workspaceId] as const;
}

const clientPromises = new Map<string, ReturnType<typeof createTuturuuuClient>>();

async function getYoolaClient(apiBaseUrl: string) {
  const cached = clientPromises.get(apiBaseUrl);
  if (cached) {
    return cached;
  }

  const nextClientPromise = createTuturuuuClient({
    baseUrl: apiBaseUrl,
  });
  clientPromises.set(apiBaseUrl, nextClientPromise);
  return nextClientPromise;
}

export function useYoolaArchiveDataQuery() {
  const { apiBaseUrl, workspaceId } = useYoolaRuntimeConfig();

  return useQuery({
    queryKey: getYoolaDeliveryQueryKey(workspaceId, apiBaseUrl),
    queryFn: async () => {
      const client = await getYoolaClient(apiBaseUrl);
      return client.externalProjects.getDelivery(workspaceId);
    },
    select: buildYoolaArchiveData,
  });
}
