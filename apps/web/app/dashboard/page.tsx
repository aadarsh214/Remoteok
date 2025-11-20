import { listJobs } from "../../lib/db";

export default function DashboardPage() {
  const jobs = listJobs();
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h1 className="caveat-title--lg">Employer Dashboard</h1>
      <p>Jobs posted: {jobs.length}</p>
    </main>
  );
}
