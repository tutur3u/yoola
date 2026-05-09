import VerifyTokenClient from "@/components/VerifyTokenClient";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

function VerifyTokenFallback() {
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

export default function VerifyTokenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080a] px-6 text-white">
      <section className="w-full max-w-md border border-white/12 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
        <Suspense fallback={<VerifyTokenFallback />}>
          <VerifyTokenClient />
        </Suspense>
      </section>
    </main>
  );
}
