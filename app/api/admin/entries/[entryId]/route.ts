import {
  getYoolaAdminSession,
  revalidateYoolaContent,
  updateYoolaAdminEntry,
} from "@/lib/yoola-admin-api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const adminSession = await getYoolaAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const entry = await updateYoolaAdminEntry(adminSession.accessToken, entryId, body ?? {});

    revalidateYoolaContent();

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[yoola:admin] Failed to update entry", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update entry" },
      { status: 500 },
    );
  }
}
