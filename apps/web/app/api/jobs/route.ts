import { NextResponse } from "next/server";
import { createJob, listJobs, Job } from "../../../lib/db";

export async function GET() {
  return NextResponse.json({ ok: true, data: listJobs() });
}

export async function POST(req: Request) {
  const body = await req.json();
  // very light validation
  if (!body?.title || !body?.companyId) {
    return NextResponse.json({ ok: false, error: "title and companyId are required" }, { status: 400 });
  }
  const created = createJob({
    title: String(body.title),
    companyId: String(body.companyId),
    description: String(body.description || ""),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    location: String(body.location || "Worldwide"),
    salaryMin: body.salaryMin ? Number(body.salaryMin) : undefined,
    salaryMax: body.salaryMax ? Number(body.salaryMax) : undefined,
    currency: String(body.currency || "INR"),
    remote: body.remote !== false,
  });
  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}
