"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold">V3 Home</h1>
      <p className="mt-2 text-white/80">Welcome to V3.</p>
      <div className="mt-4 flex gap-3">
        <Link href="/map" className="rounded bg-emerald-400 text-black px-4 py-2 text-sm font-semibold">Live Map</Link>
        <Link href="/biofield-protocol" className="rounded border border-white/20 px-4 py-2 text-sm">Biofield Protocol</Link>
      </div>
    </main>
  );
}
