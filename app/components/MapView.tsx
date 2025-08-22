"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Checkin = { t: number; lat: number; lng: number; cell: string };
type GetResp = { user: string; points: number; checkins: Checkin[] };
type PostResp = { user: string; awarded: number; total: number; lastCell: string; error?: string };

export default function MapView() {
  const [status, setStatus] = useState<"idle" | "locating" | "ready" | "tracking" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [user, setUser] = useState<string>(() => {
    if (typeof window === "undefined") return "anon";
    return localStorage.getItem("v3:account") || "anon";
  });
  const [points, setPoints] = useState<number>(0);
  const [recent, setRecent] = useState<Checkin[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const canGeo = typeof window !== "undefined" && "geolocation" in navigator;

  const prettyTime = (t: number) => {
    const d = new Date(t);
    return d.toLocaleString();
  };

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
    const body = { user, lat, lng };
    const r = await fetch("/api/checkin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
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
    stopTracking(); // clear any prior timer
    // Server grants points when cell changes or >2min elapsed.
    timerRef.current = setInterval(() => {
      if (!coords) return;
      doCheckin(coords.lat, coords.lng).catch((e) => setErr(String(e)));
    }, 2 * 60 * 1000); // 2 minutes
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
    // initial fetch (points/history)
    fetchSummary();
    return () => {
      navigator.geolocation.clearWatch(watchId);
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, canGeo]);

  const last = useMemo(() => recent.at(-1), [recent]);

  return (
    <div className="grid gap-4">
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
          <div className="font-mono">
            {coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : ""}
          </div>
          {last && (
            <div>
              <div className="text-white/60">Last Cell</div>
              <div className="font-mono">{last.cell}  {prettyTime(last.t)}</div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={singleCheckin}
            disabled={!coords}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
          >
            Check in once
          </button>
          {status !== "tracking" ? (
            <button
              onClick={startTracking}
              disabled={!coords}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
            >
              Start background tracking
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
            >
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

      <p className="text-xs text-white/50">
        Note: Points award when you move cells (~100m) or when >2 minutes pass in the same cell.
      </p>
    </div>
  );
}
