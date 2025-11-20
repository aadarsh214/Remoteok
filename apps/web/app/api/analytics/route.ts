import { NextResponse } from "next/server";

const counters: Record<string, number> = {};

export async function POST(req: Request) {
  const { event } = await req.json();
  counters[event] = (counters[event] || 0) + 1;
  return NextResponse.json({ ok: true, count: counters[event] });
}
