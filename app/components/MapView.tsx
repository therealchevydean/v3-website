"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

type Checkin = { t: number; lat: number; lng: number; cell: string };
type GetResp = { user: string; points: number; checkins: Checkin[] };
type PostResp = { user: string; awarded: number; total: number; lastCell: string; error?: string };

// Fix default marker icons in Next.js (use CDN to avoid asset path issues)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
(L.Marker.prototype as any).options.icon = DefaultIcon;

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 15), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function MapView() {
  const [status, setStatus] = useState<"idle" | "locating" | "ready" | "tracking" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [user, setUser] = useState<string>(() => (typeof window === "undefined" ? "anon" : localStorage.getItem("v3:account") || "anon"));
  const [points, setPoints] = useState<number>(0);
  const [recent, setRecent] = useState<Checkin[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const canGeo = typeof window !== "undefined" && "geolocation" in navigator;
  const prettyTime = (t: number) => new Date(t).toLocaleString();

  async function fetchSummary(u = user) {
    try {
      const q = new URLSearchParams({ user: u });
      const r = await fetch(`/api/checkin?${q.toString()}`);
      const data = (await r.json()) as GetResp;
      setPoints(data.points);
      setRecent(data.checkins || []);
    } catch (e: any) {
      setErr(String(e));
    }
  }

  async function doCheckin(lat: number, lng: number) {
    const r = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, lat, lng }),
    });
    const data = (await r.json()) as PostResp;
    if ((data as any).error) throw new Error((data as any).error);
    setPoints(data.total);
    await fetchSummary();
    return data;
  }

  function singleCheckin() {
    if (!coords) return;
    doCheckin(coords.lat, coords.lng).catch((e) => setErr(String(e)));
  }

  function startTracking() {
    if (!coords) return;
    stopTracking();
    timerRef.current = setInterval(() => {
      if (!coords) return;
      doCheckin(coords.lat, coords.lng).catch((e) => setErr(String(e)));
    }, 2 * 60 * 1000);
    setStatus("tracking");
  }

  function stopTracking() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("ready");
  }

  useEffect(() => {
    setStatus("locating");
    if (!canGeo) {
      setErr("Geolocation not available in this browser.");
      setStatus("error");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setStatus((s) => (s === "idle" || s === "locating" ? "ready" : s));
      },
      (e) => {
        setErr(e.message || "Failed to get location.");
        setStatus("error");
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 }
    );
    fetchSummary();
    return () => {
      navigator.geolocation.clearWatch(watchId);
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, canGeo]);

  const last = useMemo(() => recent.at(-1), [recent]);
  const center = coords ? [coords.lat, coords.lng] as [number, number] : [32.5783, -93.8969] as [number, number];

  return (
    <div className="grid gap-4">
      {/* Map panel */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="h-[360px] w-full">
          {/* Map must only render on client, we are in a client component already */}
          {/* @ts-ignore react-leaflet types in strict mode */}
          <MapContainer center={center} zoom={15} scrollWheelZoom className="h-full w-full">
            {/* @ts-ignore react-leaflet types in strict mode */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coords && (
              <>
                <Marker position={center}>
                  <Popup>
                    <div className="text-sm">
                      <div><b>User:</b> {user}</div>
                      <div><b>Points:</b> {points}</div>
                      <div><b>Lat/Lng:</b> {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>
                    </div>
                  </Popup>
                </Marker>
                <Recenter lat={coords.lat} lng={coords.lng} />
              </>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Stats / controls */}
      <div className="rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-white/60">User</div>
            <div className="font-mono">{user}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Total Points</div>
            <div className="text-2xl font-bold">{points}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="text-white/60">Status</div>
          <div className="font-mono">{status}{err ? `  ${err}` : ""}</div>
          <div className="text-white/60">Location</div>
          <div className="font-mono">{coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : ""}</div>
          {last && (
            <div>
              <div className="text-white/60">Last Cell</div>
              <div className="font-mono">{last.cell}  {prettyTime(last.t)}</div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button onClick={singleCheckin} disabled={!coords} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50">
            Check in once
          </button>
          {status !== "tracking" ? (
            <button onClick={startTracking} disabled={!coords} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50">
              Start background tracking
            </button>
          ) : (
            <button onClick={stopTracking} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
              Stop tracking
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 p-4">
        <div className="text-sm text-white/60 mb-2">Recent check-ins</div>
        <ul className="max-h-64 overflow-auto text-sm">
          {recent.slice().reverse().map((c, i) => (
            <li key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-b border-white/5 py-2">
              <span className="font-mono">{c.lat.toFixed(4)},{c.lng.toFixed(4)}</span>
              <span className="font-mono hidden sm:block">{c.cell}</span>
              <span className="text-white/70">{prettyTime(c.t)}</span>
            </li>
          ))}
          {recent.length === 0 && <li className="text-white/60">No check-ins yet.</li>}
        </ul>
      </div>

      <p className="text-xs text-white/50">Points award when you move cells (~100m) or when &gt;2 minutes pass in the same cell.</p>
    </div>
  );
}





