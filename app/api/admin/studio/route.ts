import { getYoolaAdminSession, getYoolaAdminStudio } from "@/lib/yoola-admin-api";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminSession = await getYoolaAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studio = await getYoolaAdminStudio(adminSession.accessToken);
    return NextResponse.json(studio);
  } catch (error) {
    console.error("[yoola:admin] Failed to load studio", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load studio" },
      { status: 500 },
    );
  }
}
