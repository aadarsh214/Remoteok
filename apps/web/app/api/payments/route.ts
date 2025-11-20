import { NextResponse } from "next/server";

// Placeholder for Razorpay/Stripe webhook handler
export async function POST() {
  // Validate signature, update transactions etc.
  return NextResponse.json({ ok: true, message: "Payment webhook received (stub)" });
}
