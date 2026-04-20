import YoolaNavigationShell from "@/components/YoolaNavigationShell";
import { LightboxProvider } from "@/components/LightboxContext";
import { YoolaQueryProvider } from "@/components/yoola-query-provider";
import { getYoolaApiBaseUrl, getYoolaWorkspaceId } from "@/lib/archive-data";
import { createTuturuuuClient } from "@/lib/tuturuuu-sdk";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Yol Yoola Archive",
  description: "Archive and showcase of Yol Yoola artworks and writings.",
};

function getYoolaDeliveryQueryKey(workspaceId: string, apiBaseUrl: string) {
  return ["yoola", "delivery", apiBaseUrl, workspaceId] as const;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiBaseUrl = getYoolaApiBaseUrl();
  const workspaceId = getYoolaWorkspaceId();
  const client = await createTuturuuuClient({
    baseUrl: apiBaseUrl,
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: getYoolaDeliveryQueryKey(workspaceId, apiBaseUrl),
    queryFn: () => client.externalProjects.getDelivery(workspaceId),
  });

  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <body
        className="min-h-screen overflow-x-hidden bg-uma-pattern font-sans text-slate-800 selection:bg-pink-500/30 selection:text-pink-900"
        suppressHydrationWarning
      >
        <Analytics />
        <YoolaQueryProvider
          apiBaseUrl={apiBaseUrl}
          state={dehydrate(queryClient)}
          workspaceId={workspaceId}
        >
          <LightboxProvider>
            <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-emerald-400/10 blur-[100px]" />
              <div className="absolute right-[-10%] bottom-[-10%] h-[60vw] w-[60vw] rounded-full bg-pink-400/10 blur-[100px]" />
              <div className="absolute top-[40%] right-[-20%] h-[40vw] w-[40vw] rounded-full bg-cyan-400/10 blur-[100px]" />
            </div>
            <YoolaNavigationShell />
            <main className="w-full">{children}</main>
          </LightboxProvider>
        </YoolaQueryProvider>
      </body>
    </html>
  );
}
