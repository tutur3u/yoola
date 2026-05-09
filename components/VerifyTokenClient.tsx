"use client";

import { sanitizeYoolaNextPath } from "@/lib/yoola-auth-paths";
import { AlertTriangle, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerificationState = "failed" | "loading" | "success";

type VerificationResponse = {
  error?: string;
  userId?: string;
  valid?: boolean;
};

export default function VerifyTokenClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<VerificationState>("loading");
  const nextPath = useMemo(
    () =>
      sanitizeYoolaNextPath(
        searchParams.get("nextUrl"),
        typeof window === "undefined" ? "http://localhost" : window.location.origin,
        "/admin",
      ),
    [searchParams],
  );

  useEffect(() => {
    let cancelled = false;

    async function verifyToken() {
      const token = searchParams.get("token");

      if (!token) {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-app-token", {
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const data = (await response.json().catch(() => null)) as VerificationResponse | null;

        if (!response.ok || !data?.valid || !data.userId) {
          throw new Error(data?.error || "Token verification failed.");
        }

        if (cancelled) {
          return;
        }

        setState("success");
        router.replace(nextPath);
        router.refresh();
      } catch (verificationError) {
        if (cancelled) {
          return;
        }

        setError(
          verificationError instanceof Error
            ? verificationError.message
            : "Token verification failed.",
        );
        setState("failed");
      }
    }

    void verifyToken();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router, searchParams]);

  if (state === "failed") {
    return (
      <>
        <div className="flex size-12 items-center justify-center border border-red-300/25 bg-red-500/12 text-red-200">
          <AlertTriangle className="size-5" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-black text-white">Authentication failed</h1>
        <p className="mt-3 text-sm leading-6 text-white/64">{error}</p>
        <Link
          className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-3 font-display text-sm font-black text-[#08080a] transition hover:bg-[#ff8edb]"
          href={`/login?nextUrl=${encodeURIComponent(nextPath)}`}
        >
          <LogIn className="size-4" />
          Sign in again
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex size-12 items-center justify-center border border-[#5eead4]/25 bg-[#5eead4]/12 text-[#a8fff1]">
        <LoaderCircle className="size-5 animate-spin" />
      </div>
      <h1 className="mt-5 font-display text-3xl font-black text-white">Connecting Yoola</h1>
      <p className="mt-3 text-sm leading-6 text-white/64">
        Finishing centralized Tuturuuu authentication.
      </p>
    </>
  );
}
