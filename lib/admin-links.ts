import { getYoolaWorkspaceId } from "@/lib/archive-data";
import { sanitizeYoolaNextPath } from "@/lib/yoola-auth-paths";

export type YoolaAdminTargetKey = "dashboard" | "library" | "preview" | "members" | "settings";

type YoolaAdminTarget = {
  actionLabel: string;
  description: string;
  key: YoolaAdminTargetKey;
  label: string;
  pathSuffix: string;
};

export const YOOLA_ADMIN_TARGETS: YoolaAdminTarget[] = [
  {
    actionLabel: "Open CMS Home",
    description: "Review workspace status and jump into the content studio.",
    key: "dashboard",
    label: "CMS Home",
    pathSuffix: "",
  },
  {
    actionLabel: "Manage Library",
    description: "Edit collections, entries, assets, and editorial workflow.",
    key: "library",
    label: "Library",
    pathSuffix: "/library",
  },
  {
    actionLabel: "Preview Delivery",
    description: "Inspect the delivered archive experience before publishing.",
    key: "preview",
    label: "Preview",
    pathSuffix: "/preview",
  },
  {
    actionLabel: "Manage Members",
    description: "Open CMS workspace membership and collaborator access.",
    key: "members",
    label: "Members",
    pathSuffix: "/members",
  },
  {
    actionLabel: "Open Settings",
    description: "Tune the external project binding and workspace settings.",
    key: "settings",
    label: "Settings",
    pathSuffix: "/settings",
  },
];

function isEnabled(value: string | undefined) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getAdminDevMode() {
  return isEnabled(process.env.DEV_MODE ?? process.env.NEXT_PUBLIC_DEV_MODE);
}

function getConfiguredUrl({
  envName,
  localUrl,
  productionUrl,
}: {
  envName: string;
  localUrl: string;
  productionUrl: string;
}) {
  const configured = process.env[envName] ?? process.env[`NEXT_PUBLIC_${envName}`];

  if (configured?.trim()) {
    return trimTrailingSlash(configured.trim());
  }

  return getAdminDevMode() ? localUrl : productionUrl;
}

export function getYoolaCmsBaseUrl() {
  return getConfiguredUrl({
    envName: "TUTURUUU_CMS_APP_URL",
    localUrl: "http://localhost:7811",
    productionUrl: "https://cms.tuturuuu.com",
  });
}

export function getYoolaWebAppUrl() {
  return getConfiguredUrl({
    envName: "TUTURUUU_WEB_APP_URL",
    localUrl: "http://localhost:7803",
    productionUrl: "https://tuturuuu.com",
  });
}

export function getYoolaAppBaseUrl(requestOrigin?: string) {
  const configured =
    process.env.YOOLA_APP_URL ??
    process.env.NEXT_PUBLIC_YOOLA_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL;

  if (configured?.trim()) {
    return trimTrailingSlash(configured.trim());
  }

  if (requestOrigin?.trim()) {
    return trimTrailingSlash(requestOrigin.trim());
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${trimTrailingSlash(process.env.VERCEL_URL.trim())}`;
  }

  return "http://localhost:3000";
}

export function resolveYoolaAdminTargetKey(value: string | null | undefined): YoolaAdminTargetKey {
  return YOOLA_ADMIN_TARGETS.some((target) => target.key === value)
    ? (value as YoolaAdminTargetKey)
    : "library";
}

export function getYoolaAdminTarget(key: YoolaAdminTargetKey) {
  return YOOLA_ADMIN_TARGETS.find((target) => target.key === key) ?? YOOLA_ADMIN_TARGETS[1];
}

export function getYoolaCmsWorkspacePath(
  targetKey: YoolaAdminTargetKey,
  workspaceId = getYoolaWorkspaceId(),
) {
  const target = getYoolaAdminTarget(targetKey);
  return `/${encodeURIComponent(workspaceId)}${target.pathSuffix}`;
}

export function buildYoolaCmsUrl({
  cmsBaseUrl = getYoolaCmsBaseUrl(),
  targetKey,
  workspaceId = getYoolaWorkspaceId(),
}: {
  cmsBaseUrl?: string;
  targetKey: YoolaAdminTargetKey;
  workspaceId?: string;
}) {
  return new URL(getYoolaCmsWorkspacePath(targetKey, workspaceId), cmsBaseUrl).toString();
}

export function buildYoolaCmsVerifyUrl({
  cmsBaseUrl = getYoolaCmsBaseUrl(),
  targetKey,
  workspaceId = getYoolaWorkspaceId(),
}: {
  cmsBaseUrl?: string;
  targetKey: YoolaAdminTargetKey;
  workspaceId?: string;
}) {
  const verifyUrl = new URL("/verify-token", cmsBaseUrl);
  verifyUrl.searchParams.set("nextUrl", getYoolaCmsWorkspacePath(targetKey, workspaceId));
  return verifyUrl.toString();
}

export function buildYoolaCentralizedLoginUrl({
  appBaseUrl = getYoolaAppBaseUrl(),
  nextUrl = "/admin",
  webAppUrl = getYoolaWebAppUrl(),
}: {
  appBaseUrl?: string;
  nextUrl?: string;
  webAppUrl?: string;
}) {
  const appOrigin = new URL(appBaseUrl).origin;
  const verifyUrl = new URL("/verify-token", appOrigin);
  verifyUrl.searchParams.set("nextUrl", sanitizeYoolaNextPath(nextUrl, appOrigin, "/admin"));

  const loginUrl = new URL("/login", webAppUrl);
  loginUrl.searchParams.set("returnUrl", verifyUrl.toString());
  return loginUrl.toString();
}

export function getYoolaAdminLoginPath(targetKey: YoolaAdminTargetKey) {
  return `/admin/login?next=${encodeURIComponent(targetKey)}`;
}

export function buildYoolaAdminLinks(workspaceId = getYoolaWorkspaceId()) {
  const cmsBaseUrl = getYoolaCmsBaseUrl();

  return YOOLA_ADMIN_TARGETS.map((target) => ({
    ...target,
    cmsHref: buildYoolaCmsUrl({
      cmsBaseUrl,
      targetKey: target.key,
      workspaceId,
    }),
    loginHref: getYoolaAdminLoginPath(target.key),
  }));
}
