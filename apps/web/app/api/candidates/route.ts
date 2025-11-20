import { NextResponse } from "next/server";
import { createCandidate, listCandidates } from "../../../lib/db";

export async function GET() {
  return NextResponse.json({ ok: true, data: listCandidates() });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.name || !body?.email) {
    return NextResponse.json({ ok: false, error: "name and email are required" }, { status: 400 });
  }
  const created = createCandidate({
    name: String(body.name),
    email: String(body.email),
    resumeUrl: body.resumeUrl ? String(body.resumeUrl) : undefined,
    skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
    experience: String(body.experience || ""),
    aiSummary: body.aiSummary ? String(body.aiSummary) : undefined,
  });
  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}
