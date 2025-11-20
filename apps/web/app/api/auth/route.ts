import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: false, error: "Use Clerk, NextAuth, or Supabase Auth here." }, { status: 501 });
}
