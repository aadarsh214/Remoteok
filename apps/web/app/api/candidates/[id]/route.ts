import { NextResponse } from "next/server";
import { getCandidateById, updateCandidate } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const c = getCandidateById(params.id);
  if (!c) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: c });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const patch = await req.json();
  const updated = updateCandidate(params.id, patch);
  if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: updated });
}
