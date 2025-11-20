"use client";
import { useState } from "react";

export default function AiMatchingDemoPage() {
  const [jd, setJd] = useState("Senior Node.js engineer with SQL and queues");
  const [results, setResults] = useState<any[]>([]);

  async function run() {
    const res = await fetch("/api/match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jdText: jd, title: "Backend Engineer", tags: ["Node.js", "SQL"] }) });
    const data = await res.json();
    setResults(data.data || []);
  }

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h1 className="caveat-title--lg">AI Matching Demo</h1>
      <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={6} />
      <button onClick={run}>Match Candidates</button>
      <ul>
        {results.map((r) => (
          <li key={r.candidateId}>{r.name} — score {r.score}</li>
        ))}
      </ul>
    </main>
  );
}
