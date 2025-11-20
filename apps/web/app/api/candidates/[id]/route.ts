import { NextRequest, NextResponse } from "next/server";
import { getCandidateById, updateCandidate } from "../../../../lib/db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCandidateById(id);
  if (!c) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: c });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const patch = await req.json();
  const { id } = await params;
  const updated = updateCandidate(id, patch);
  if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: updated });
}
