export const YOOLA_APP_NAME = "yoola";

export function getYoolaAppId() {
  return (process.env.YOOLA_APP_ID ?? YOOLA_APP_NAME).trim().toLowerCase();
}

export function getYoolaAppSecret() {
  const secret = process.env.YOOLA_APP_SECRET ?? process.env.TUTURUUU_YOOLA_APP_SECRET;

  if (!secret?.trim()) {
    throw new Error("[yoola] Missing YOOLA_APP_SECRET.");
  }

  return secret.trim();
}

export function sanitizeYoolaNextPath(
  rawValue: string | null | undefined,
  requestOrigin = "http://localhost",
  fallbackPath = "/admin",
) {
  if (!rawValue?.trim()) {
    return fallbackPath;
  }

  if (rawValue.startsWith("//")) {
    return fallbackPath;
  }

  try {
    const parsed = new URL(rawValue, requestOrigin);

    if (parsed.origin !== requestOrigin) {
      return fallbackPath;
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallbackPath;
  }
}

export function getYoolaLoginPath(nextUrl = "/admin") {
  const loginUrl = new URL("/login", "http://yoola.local");
  loginUrl.searchParams.set("nextUrl", nextUrl);
  return `${loginUrl.pathname}${loginUrl.search}`;
}
