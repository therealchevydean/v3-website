"use client";
import { useEffect, useState } from "react";

function getUserId() {
  if (typeof window === "undefined") return "anon";
  const acct = localStorage.getItem("v3:account");
  if (acct) return acct.toLowerCase();
  let id = localStorage.getItem("v3:deviceId");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("v3:deviceId", id); }
  return `dev:${id}`;
}

export default function CheckinPanel() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const u = getUserId();
    fetch(`/api/checkin?user=${encodeURIComponent(u)}`)
      .then(r => r.json()).then(d => setPoints(d.points ?? 0))
      .catch(() => setPoints(0));
  }, []);

  const checkin = async () => {
    if (!("geolocation" in navigator)) { setMsg("Geolocation not supported"); return; }
    setBusy(true); setMsg("");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const u = getUserId();
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ user: u, lat: pos.coords.latitude, lng: pos.coords.longitude })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Check-in failed");
        setPoints(data.total);
        setMsg(`+${data.awarded} points (total ${data.total})`);
      } catch (e: any) {
        setMsg(e.message || String(e));
      } finally {
        setBusy(false);
      }
    }, (err) => { setMsg(err.message || "Location error"); setBusy(false); }, { enableHighAccuracy: true, timeout: 10000 });
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={checkin} disabled={busy}
        className="rounded bg-emerald-500/90 hover:bg-emerald-400 text-black px-3 py-1.5 text-sm disabled:opacity-60">
        {busy ? "Checking in" : "Check in here"}
      </button>
      <span className="text-sm text-white/80">{points !== null ? `Points: ${points}` : "Points: "}</span>
      {msg && <span className="text-sm text-white/60">{msg}</span>}
    </div>
  );
}
