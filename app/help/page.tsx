"use client";
import { useEffect, useState } from "react";

type Coords = { lat: number; lon: number };

export default function Page(){
  const [coords, setCoords] = useState<Coords | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErr("Geolocation not supported in this browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: +pos.coords.latitude.toFixed(6),
          lon: +pos.coords.longitude.toFixed(6),
        });
        setLoading(false);
      },
      (e) => { setErr(e.message); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Nearest Help</h1>

      {loading && <p>Requesting location</p>}
      {err && <p className="text-red-600">Location error: {err}</p>}

      {coords && (
        <div className="grid gap-4">
          <div className="rounded-2xl p-4 border">
            <h2 className="text-xl font-semibold">Your location</h2>
            <p>Lat: {coords.lat}  Lon: {coords.lon}</p>
            <a
              className="underline"
              href={`https://www.google.com/maps/search/homeless+services/@${coords.lat},${coords.lon},13z`}
              target="_blank"
              rel="noreferrer"
            >
              Open nearby services in Maps
            </a>
          </div>

          <div className="rounded-2xl p-4 border">
            <h2 className="text-xl font-semibold">Nominate a helper</h2>
            <p>Know a person/org doing real work? Tell us and well add them.</p>
            <a className="underline" href="/discord">Post in Discord</a>
          </div>
        </div>
      )}
    </main>
  );
}
