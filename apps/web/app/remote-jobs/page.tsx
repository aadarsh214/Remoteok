import Link from "next/link";
import { listJobs } from "../../lib/db";

export const metadata = { title: "RemoteIQ – Remote Jobs" };

export default async function JobsIndexPage() {
  const jobs = listJobs();
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h1 className="caveat-title--lg">All Remote Jobs</h1>
      {jobs.map((job) => (
        <article key={job.id} style={{ padding: 16, borderRadius: 16, background: "#fff", border: "1px solid #E7E2DD" }}>
          <h2 className="caveat-title" style={{ margin: 0 }}>
            <Link href={`/remote-jobs/${job.slug}`}>{job.title}</Link>
          </h2>
          <p style={{ color: "#6B6B6B" }}>{job.location} • {job.tags.join(", ")}</p>
        </article>
      ))}
    </main>
  );
}
