import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getYoolaWorkspaceId } from "@/lib/archive-data";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const YOOLA_SESSION_COOKIE = "yoola_admin_session";
const SESSION_VERSION = "v1";

export type YoolaAdminSession = {
  accessToken: string;
  app: {
    name: string;
  };
  expiresAt: string;
  tokenType: "Bearer";
  workspaceId: string;
  user: {
    email: string | null;
    id: string;
  };
};

function getSessionSecret() {
  const secret = process.env.YOOLA_SESSION_SECRET ?? process.env.YOOLA_APP_SECRET;

  if (!secret?.trim()) {
    throw new Error("[yoola] Missing YOOLA_SESSION_SECRET or YOOLA_APP_SECRET.");
  }

  return createHash("sha256").update(secret.trim()).digest();
}

function encode(value: Buffer) {
  return value.toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url");
}

function sealSession(session: YoolaAdminSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getSessionSecret(), iv);
  const plaintext = Buffer.from(JSON.stringify(session), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [SESSION_VERSION, encode(iv), encode(tag), encode(ciphertext)].join(".");
}

function unsealSession(value: string): YoolaAdminSession | null {
  const [version, encodedIv, encodedTag, encodedCiphertext] = value.split(".");

  if (version !== SESSION_VERSION || !encodedIv || !encodedTag || !encodedCiphertext) {
    return null;
  }

  try {
    const decipher = createDecipheriv("aes-256-gcm", getSessionSecret(), decode(encodedIv));
    decipher.setAuthTag(decode(encodedTag));
    const plaintext = Buffer.concat([
      decipher.update(decode(encodedCiphertext)),
      decipher.final(),
    ]).toString("utf8");
    const session = JSON.parse(plaintext) as YoolaAdminSession;

    if (!session.accessToken || !session.user?.id || !session.expiresAt || !session.workspaceId) {
      return null;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    if (session.workspaceId !== getYoolaWorkspaceId()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getYoolaSessionFromCookies() {
  const cookieStore = await cookies();
  const value = cookieStore.get(YOOLA_SESSION_COOKIE)?.value;

  return value ? unsealSession(value) : null;
}

export function setYoolaSessionCookie(response: NextResponse, session: YoolaAdminSession) {
  response.cookies.set(YOOLA_SESSION_COOKIE, sealSession(session), {
    expires: new Date(session.expiresAt),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearYoolaSessionCookie(response: NextResponse) {
  response.cookies.set(YOOLA_SESSION_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
