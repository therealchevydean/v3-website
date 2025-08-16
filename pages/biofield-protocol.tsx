import Image from "next/image";

export default function BiofieldProtocol() {
  return (
    <div style={{ padding: "24px", lineHeight: 1.6, fontFamily: "system-ui, Arial, sans-serif" }}>
      <h1 style={{ fontSize: "32px", marginBottom: 8 }}>Biofield Protocol</h1>
      <p style={{ opacity: 0.9, marginBottom: 16 }}>
        Clean reconstruction of the snapshot: image + extracted text (no trackers). This is a placeholder
        page wired into production so we can refine copy and layout fast.
      </p>

      <div style={{ margin: "16px 0" }}>
        <a href="/biofield/protocol.txt" style={{ textDecoration: "underline" }}>Read extracted text</a>
      </div>

      <div style={{ maxWidth: 960 }}>
        <img src="/biofield/protocol.png" alt="Biofield Protocol" style={{ width: "100%", height: "auto", borderRadius: 8 }} />
      </div>
    </div>
  );
}
