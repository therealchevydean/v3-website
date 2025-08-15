import { useEffect, useState } from "react";

export default function Word() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("/api/quote-of-the-day")
      .then(r => r.json())
      .then(setData)
      .catch(setErr);
  }, []);

  if (err) return <p>Error loading.</p>;
  if (!data) return <p>Loading</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", lineHeight: 1.5 }}>
      <h1>The Word of I AM</h1>
      <p>{data.quote}</p>
      <p style={{ marginTop: 16 }}>
        <a href="/the-word" style={{ textDecoration: "underline" }}>Read the full text </a>
      </p>
    </div>
  );
}
