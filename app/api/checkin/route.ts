export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "checkins.json");
type DB = { users: Record<string, { points: number; history: Array<{ t: number; lat: number; lng: number; cell: string }> }> };

function readDB(): DB {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return { users: {} }; }
}
function writeDB(db: DB) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2), "utf8");
}

// cell id ~100m grid so tiny moves don't spam
function cellId(lat: number, lng: number) {
  const r = (n: number) => Math.round(n * 1000) / 1000; // ~0.001  111m
  return `${r(lat)}:${r(lng)}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = url.searchParams.get("user") || "anon";
  const db = readDB();
  const u = db.users[user] || { points: 0, history: [] };
  return NextResponse.json({ user, points: u.points, checkins: u.history.slice(-20) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  let { user, lat, lng } = body || {};
  if (!user) user = "anon";
  lat = Number(lat); lng = Number(lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid lat/lng" }, { status: 400 });
  }

  const db = readDB();
  db.users[user] ||= { points: 0, history: [] };
  const u = db.users[user];

  const now = Date.now();
  const cell = cellId(lat, lng);

  // basic anti-spam: same cell within 2 minutes  0 points
  const last = u.history.at(-1);
  let awarded = 0;
  if (!last || last.cell !== cell || now - last.t > 2 * 60 * 1000) {
    awarded = 10; // 10 pts per unique/recent cell  tweak as you like
    u.points += awarded;
  }

  u.history.push({ t: now, lat, lng, cell });
  if (u.history.length > 1000) u.history.splice(0, u.history.length - 1000);
  writeDB(db);

  return NextResponse.json({ user, awarded, total: u.points, lastCell: cell });
}

