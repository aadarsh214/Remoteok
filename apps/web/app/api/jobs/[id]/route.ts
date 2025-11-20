import { NextResponse } from "next/server";
import { deleteJob, getJobById, updateJob } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = getJobById(params.id);
  if (!job) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: job });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const patch = await req.json();
  const updated = updateJob(params.id, patch);
  if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = deleteJob(params.id);
  if (!ok) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
