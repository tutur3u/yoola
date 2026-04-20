"use client";

import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type YoolaRuntimeConfig = {
  apiBaseUrl: string;
  workspaceId: string;
};

const YoolaRuntimeConfigContext = createContext<YoolaRuntimeConfig | null>(null);

export function YoolaQueryProvider({
  apiBaseUrl,
  children,
  state,
  workspaceId,
}: {
  apiBaseUrl: string;
  children: ReactNode;
  state: DehydratedState;
  workspaceId: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
        },
      }),
  );
  const value = useMemo(() => ({ apiBaseUrl, workspaceId }), [apiBaseUrl, workspaceId]);

  return (
    <YoolaRuntimeConfigContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={state}>{children}</HydrationBoundary>
      </QueryClientProvider>
    </YoolaRuntimeConfigContext.Provider>
  );
}

export function useYoolaRuntimeConfig() {
  const value = useContext(YoolaRuntimeConfigContext);

  if (!value) {
    throw new Error("useYoolaRuntimeConfig must be used within YoolaQueryProvider");
  }

  return value;
}
