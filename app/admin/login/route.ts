import { buildYoolaCentralizedLoginUrl, resolveYoolaAdminTargetKey } from "@/lib/admin-links";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const targetKey = resolveYoolaAdminTargetKey(request.nextUrl.searchParams.get("next"));

  return NextResponse.redirect(
    buildYoolaCentralizedLoginUrl({
      targetKey,
    }),
  );
}
