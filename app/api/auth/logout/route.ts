import { clearYoolaSessionCookie } from "@/lib/yoola-session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  clearYoolaSessionCookie(response);
  return response;
}
