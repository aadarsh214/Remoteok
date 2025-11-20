import { notFound } from "next/navigation";
import { getCandidateById } from "../../../lib/db";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const c = getCandidateById(params.id);
  if (!c) return notFound();
  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h1 className="caveat-title--lg">{c.name}</h1>
      <p>{c.aiSummary}</p>
      <p style={{ color: "#6B6B6B" }}>{c.skills.join(", ")}</p>
    </main>
  );
}
