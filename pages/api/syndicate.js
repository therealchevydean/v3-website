export default async function handler(req, res) {
  const webhook = process.env.SYNDICATE_WEBHOOK;
  if (!webhook) {
    return res.status(500).json({ error: "SYNDICATE_WEBHOOK not set" });
  }

  const scheme = (req.headers["x-forwarded-proto"] ?? "https");
  const host   = (req.headers.host ?? "localhost:3000");
  const base   = `${scheme}://${host}`;

  const q = await fetch(`${base}/api/quote-of-the-day`).then(r => r.json());
  const payload = {
    message: `${q.quote} #TheWord #IAMTHATIAM`,
    link: `${base}/word`
  };

  const resp = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    return res.status(502).json({ error: "Webhook failed", status: resp.status, body: txt });
    }

  res.status(200).json({ ok: true, sent: payload });
}
