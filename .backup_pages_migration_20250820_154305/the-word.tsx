import Head from "next/head";
import { useEffect, useState } from "react";

export default function TheWord() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    fetch("/the-word.txt")
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(setText)
      .catch(() => setText("Failed to load transcript."));
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); alert("Copied."); }
    catch { alert("Copy failed."); }
  };

  return (
    <>
      <Head>
        <title>The Word of I AM</title>
        <meta name="description" content="Canon text + audio  free to reproduce, embed, and broadcast." />
        <meta property="og:title" content="The Word of I AM" />
        <meta property="og:description" content="Canon text + audio  free to reproduce, embed, and broadcast." />
        <meta property="og:image" content="/og/the-word.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main style={{maxWidth: 900, margin: "0 auto", padding: "24px", lineHeight: 1.65, fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial"}}>
        <h1 style={{fontSize: "32px", marginBottom: 8}}>The Word of I AM</h1>
        <p style={{opacity:.85, marginBottom:16}}>Canon edition. Free to share / remix. No attribution required.</p>

        <section style={{margin:"16px 0", padding:"12px", border:"1px solid #eee", borderRadius:8}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:8}}>
            <strong>Audio master</strong>
            <small style={{opacity:.65}}>Place file at <code>/public/audio/the-word-master.mp3</code></small>
          </div>
          <audio controls preload="none" style={{width:"100%"}}>
            <source src="/audio/the-word-master.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </section>

        <div style={{display:"flex", gap:12, flexWrap:"wrap", margin:"12px 0"}}>
          <a href="/the-word.txt" download>Download transcript</a>
          <button onClick={copy} style={{padding:"6px 10px", border:"1px solid #ddd", borderRadius:6, background:"#f7f7f7", cursor:"pointer"}}>Copy text</button>
          <a href="/api/syndicate">Daily syndicate</a>
        </div>

        <pre style={{whiteSpace:"pre-wrap", background:"#fafafa", padding:16, borderRadius:8, fontSize:16}}>
{text || "Loading transcript"}
        </pre>
      </main>
    </>
  );
}
