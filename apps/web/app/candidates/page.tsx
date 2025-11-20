import Link from "next/link";
import { listCandidates } from "../../lib/db";

export default function CandidatesPage() {
  const list = listCandidates();
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h1 className="caveat-title--lg">AI‑Vetted Candidates</h1>
      <ul>
        {list.map((c) => (
          <li key={c.id}><Link href={`/profile/${c.id}`}>{c.name}</Link> — {c.skills.join(", ")}</li>
        ))}
      </ul>
    </main>
  );
}
