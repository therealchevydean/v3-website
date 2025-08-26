import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import WalletButton from "./components/WalletButton";

export const metadata: Metadata = {
  title: "V3  Vice Versa Vision",
  description: "The ecosystem that creates space for change.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-zinc-100">
        <header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">V3</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/map" className="hover:text-emerald-400">Live Map</Link>
              <Link href="/biofield-protocol" className="hover:text-emerald-400">Biofield Protocol</Link>
              <WalletButton />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}




