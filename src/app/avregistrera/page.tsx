"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/unsubscribe?token=${token}`)
      .then((res) => setStatus(res.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      {status === "loading" && <p className="text-zinc-600">Avregistrerar...</p>}
      {status === "success" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-bold text-zinc-900">Du är avregistrerad</h1>
          <p className="mt-3 text-zinc-600">
            Du kommer inte längre få mejl från Bytesjakten.
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-zinc-900">Något gick fel</h1>
          <p className="mt-3 text-zinc-600">Länken är ogiltig eller har redan använts.</p>
        </>
      )}
      <Link
        href="/"
        className="mt-8 inline-block text-emerald-600 hover:underline"
      >
        Tillbaka till Bytesjakten
      </Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<p className="py-20 text-center">Laddar...</p>}>
        <UnsubscribeContent />
      </Suspense>
    </>
  );
}
