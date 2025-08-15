export default async function handler(req, res) {
  try {
    const webhook = process.env.SYNDICATE_WEBHOOK;
    if (!webhook) return res.status(500).json({ error: "SYNDICATE_WEBHOOK not set" });

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host  = req.headers["host"];
    const base  = `${proto}://${host}`;

    const qRes  = await fetch(`${base}/api/quote-of-the-day`);
    const q     = await qRes.json();

    const payload = {
      message: `${q.quote} #TheWord #IAMTHATIAM #THEWORD`,
      link: `${base}/word`
    };

    const wRes = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({ ok: true, quote: q.quote, webhookStatus: wRes.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
