import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Payment webhook handler — built in Phase 6
  // Supports Razorpay / Stripe webhook verification
  return NextResponse.json({ received: true });
}
