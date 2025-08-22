"use client";
import React from "react";
import { ethers } from "ethers";

const CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as string;
const RPC_URL  = process.env.NEXT_PUBLIC_RPC_URL  as string;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_NFT_CHAIN_ID || 1);

const abi = ["function tokenURI(uint256) view returns (string)"];

function parseIds(spec: string | undefined): number[] {
  const s = (spec || "1-12").trim();
  const out: number[] = [];
  for (const part of s.split(",")) {
    const p = part.trim();
    if (!p) continue;
    if (p.includes("-")) {
      const [a,b] = p.split("-").map(n => parseInt(n.trim(),10));
      if (!isNaN(a) && !isNaN(b)) { for (let i=a; i<=b; i++) out.push(i); }
    } else {
      const n = parseInt(p,10); if (!isNaN(n)) out.push(n);
    }
  }
  return out;
}
function ipfsToHttp(u: string) { return u?.startsWith("ipfs://") ? "https://ipfs.io/ipfs/" + u.slice(7) : u; }

export default function NFTPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [err, setErr] = React.useState<string | null>(null);
  const ids = React.useMemo(() => parseIds(process.env.NEXT_PUBLIC_NFT_IDS as string), []);

  React.useEffect(() => {
    (async () => {
      try {
        if (!CONTRACT || !RPC_URL) throw new Error("Missing NEXT_PUBLIC_NFT_CONTRACT or NEXT_PUBLIC_RPC_URL");
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const c = new ethers.Contract(CONTRACT, abi, provider);
        const out:any[] = [];
        for (const id of ids) {
          try {
            const uri = await c.tokenURI(id);
            const metaUrl = ipfsToHttp(uri);
            const res = await fetch(metaUrl, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const meta = await res.json();
            out.push({ id, name: meta.name || `#${id}`, image: ipfsToHttp(meta.image), description: meta.description });
          } catch (e:any) {
            out.push({ id, error: e?.message || String(e) });
          }
        }
        setItems(out);
      } catch (e:any) { setErr(e?.message || String(e)); }
    })();
  }, []);

  function osLink(id:number) {
    const base = CHAIN_ID === 8453 ? "base" : "ethereum";
    return `https://opensea.io/assets/${base}/${CONTRACT}/${id}`;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>V3 NFTs</h1>
      {err && <p style={{ color:"red" }}>Error: {err}</p>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:16 }}>
        {items.map((it) => (
          <a key={it.id} href={osLink(it.id)} target="_blank" rel="noreferrer"
             style={{ border:"1px solid #ddd", borderRadius:12, padding:12, textDecoration:"none", color:"inherit" }}>
            <div style={{ aspectRatio:"1/1", overflow:"hidden", borderRadius:8, background:"#fafafa" }}>
              {it.image ? <img src={it.image} alt={it.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{padding:12}}>No image</div>}
            </div>
            <div style={{ marginTop:8, fontWeight:600 }}>{it.name || `#${it.id}`}</div>
            {it.error && <div style={{ color:"crimson", fontSize:12 }}>Error: {it.error}</div>}
            {it.description && <div style={{ fontSize:12, opacity:.8, marginTop:4 }}>{it.description}</div>}
          </a>
        ))}
      </div>
    </main>
  );
}