"use client";
import dynamic from "next/dynamic";
import ErrorBoundary from "../components/ErrorBoundary";
import CheckinPanel from "../components/CheckinPanel";

const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => <div className="rounded border border-white/10 p-4 text-sm">Loading map</div>,
});

export default function MapPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Live Map</h1>
      <p className="mt-2 text-white/80">Your location on OpenStreetMap tiles. Toggle tracking anytime.</p>

      <div className="mt-4"><CheckinPanel /></div>

      <div className="mt-6">
        <ErrorBoundary>
          <MapView />
        </ErrorBoundary>
      </div>
    </section>
  );
}
