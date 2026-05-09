import { buildYoolaCentralizedLoginUrl } from "@/lib/admin-links";
import { sanitizeYoolaNextPath } from "@/lib/yoola-auth-paths";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const nextUrl = sanitizeYoolaNextPath(
    request.nextUrl.searchParams.get("nextUrl"),
    request.nextUrl.origin,
    "/admin",
  );

  return NextResponse.redirect(
    buildYoolaCentralizedLoginUrl({
      appBaseUrl: request.nextUrl.origin,
      nextUrl,
    }),
  );
}
