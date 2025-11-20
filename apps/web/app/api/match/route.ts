import { NextResponse } from "next/server";
import { getJobById, listCandidates } from "../../../lib/db";
import { rankCandidatesForJob } from "../../../lib/match";

export async function POST(req: Request) {
  const body = await req.json();
  let job = null;

  if (body?.jobId) {
    job = getJobById(String(body.jobId));
  }

  if (!job && body?.jdText) {
    // Create a transient job object from raw text
    job = {
      id: "temp",
      title: String(body.title || "Untitled role"),
      slug: "temp",
      companyId: "temp",
      description: String(body.jdText),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      location: String(body.location || "Worldwide"),
      currency: "INR",
      remote: true,
      createdAt: new Date().toISOString(),
      salaryMin: undefined,
      salaryMax: undefined,
    } as any;
  }

  if (!job) {
    return NextResponse.json({ ok: false, error: "Provide jobId or jdText" }, { status: 400 });
  }

  const ranked = rankCandidatesForJob(job, listCandidates(), 5);
  return NextResponse.json({
    ok: true,
    data: ranked.map((r) => ({
      candidateId: r.candidate.id,
      name: r.candidate.name,
      email: r.candidate.email,
      skills: r.candidate.skills,
      score: Number(r.score.toFixed(4)),
    })),
  });
}
