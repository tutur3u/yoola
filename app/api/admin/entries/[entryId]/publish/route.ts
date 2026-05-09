import {
  getYoolaAdminSession,
  publishYoolaAdminEntry,
  revalidateYoolaContent,
} from "@/lib/yoola-admin-api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function resolveEventKind(value: unknown) {
  return value === "preview" || value === "unpublish" ? value : "publish";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const adminSession = await getYoolaAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId } = await params;
    const body = (await request.json().catch(() => null)) as { eventKind?: unknown } | null;
    const entry = await publishYoolaAdminEntry(
      adminSession.accessToken,
      entryId,
      resolveEventKind(body?.eventKind),
    );

    revalidateYoolaContent();

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[yoola:admin] Failed to publish entry", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to publish entry" },
      { status: 500 },
    );
  }
}
