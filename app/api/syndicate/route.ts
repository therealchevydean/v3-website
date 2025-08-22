// Real logic ported via legacy adapter on 2025-08-20 17:25:17
export const runtime = 'node';

import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Load original Pages API handler (CommonJS)
const legacy = require('./legacy.cjs');

async function runLegacy(req: NextRequest) {
  // Build a Node/Pages-like req object
  const url = new URL(req.url);
  const headers = Object.fromEntries(req.headers);
  let body: any = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try { body = await req.json(); } catch { /* ignore */ }
  }
  const nodeReq: any = {
    method: req.method,
    url: req.url,
    headers,
    query: Object.fromEntries(url.searchParams),
    body,
  };

  return await new Promise<NextResponse>((resolve) => {
    const res: any = {
      statusCode: 200,
      status(code: number) { this.statusCode = code; return this; },
      setHeader() { /* no-op */ return this; },
      json(data: any) { resolve(NextResponse.json(data, { status: this.statusCode })); },
      send(data: any) { resolve(new NextResponse(typeof data === 'string' ? data : JSON.stringify(data), { status: this.statusCode, headers: { 'content-type': 'application/json' } })); },
      end() { resolve(new NextResponse(null, { status: this.statusCode })); },
    };
    // Support module.exports = handler OR { default: handler }
    const handler = (typeof legacy === 'function') ? legacy : (legacy.default || legacy.handler || legacy);
    handler(nodeReq, res);
  });
}

export async function POST(req: NextRequest) {
  return runLegacy(req);
}

export async function GET() {
  return NextResponse.json({ status: 'ok', source: 'app\api\syndicate' });
}
