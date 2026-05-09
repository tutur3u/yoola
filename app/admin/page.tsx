import { YoolaAdminClient } from "@/components/admin/YoolaAdminClient";
import {
  buildYoolaAdminLinks,
  getYoolaCmsBaseUrl,
  getYoolaWebAppUrl,
  resolveYoolaAdminTargetKey,
} from "@/lib/admin-links";
import { getYoolaAdminSession, getYoolaAdminStudio } from "@/lib/yoola-admin-api";
import { getYoolaLoginPath } from "@/lib/yoola-auth-paths";
import { getYoolaWorkspaceId } from "@/lib/archive-data";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yoola Admin",
  description: "Authenticated Yoola content management backed by Tuturuuu CMS APIs.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ target?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const adminSession = await getYoolaAdminSession();

  if (!adminSession) {
    redirect(getYoolaLoginPath("/admin"));
  }

  const workspaceId = getYoolaWorkspaceId();
  const studio = await getYoolaAdminStudio(adminSession.accessToken);
  const targetKey = resolveYoolaAdminTargetKey(resolvedSearchParams?.target);

  return (
    <YoolaAdminClient
      adminLinks={buildYoolaAdminLinks(workspaceId)}
      cmsBaseUrl={getYoolaCmsBaseUrl()}
      initialStudio={studio}
      initialTarget={targetKey}
      userEmail={adminSession.user.email ?? null}
      webAppUrl={getYoolaWebAppUrl()}
      workspaceId={workspaceId}
    />
  );
}
