import { notFound } from "next/navigation";
import { getJobBySlug } from "../../../lib/db";

interface Props { params: { slug: string } }

export default function JobDetailPage({ params }: Props) {
  const job = getJobBySlug(params.slug);
  if (!job) return notFound();
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h1 className="caveat-title--lg">{job.title}</h1>
      <p>{job.description}</p>
      <p style={{ color: "#6B6B6B" }}>{job.location} • {job.tags.join(", ")}</p>
    </main>
  );
}
