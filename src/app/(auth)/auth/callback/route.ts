import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Log the full callback URL for debugging
  console.log("[Auth Callback] Full URL:", request.url);
  console.log("[Auth Callback] code:", code ? "present" : "MISSING");
  console.log("[Auth Callback] error param:", errorParam);
  console.log("[Auth Callback] error_description:", errorDescription);

  // If Supabase/Google returned an error directly
  if (errorParam) {
    console.error("[Auth Callback] OAuth error:", errorParam, errorDescription);
    const msg = encodeURIComponent(errorDescription || errorParam);
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[Auth Callback] exchangeCodeForSession error:", error.message);
    const msg = encodeURIComponent(error.message);
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }

  console.error("[Auth Callback] No code and no error — unexpected state");
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
