export default async function handler(req, res){
  const webhook = process.env.SYNDICATE_WEBHOOK;
  if(!webhook){ return res.status(500).json({error:'SYNDICATE_WEBHOOK not set'}); }
  const q = await fetch(${req.headers['x-forwarded-proto'] ?? 'https'}:///api/quote-of-the-day).then(r=>r.json());
  const payload = {
    message: ${q.quote}  #TheWord  I AM THAT I AM  THE WORD,
    link: https:///word,
    source: 'v3-website'
  };
  const out = await fetch(webhook, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
  res.status(200).json({ ok:true, forwarded: out.status, quote:q.quote });
}
