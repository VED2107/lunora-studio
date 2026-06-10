"use client";

import { useAuth } from "@/providers/auth-provider";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginForm() {
  const { signInWithGoogle, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const error = searchParams.get("error");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-light text-charcoal">
          Welcome
        </h1>
        <p className="text-[13px] leading-relaxed text-muted">
          Sign in to your account
        </p>
      </div>

      {/* Decorative line */}
      <div className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Error */}
      {error && (
        <div className="relative overflow-hidden rounded-xl border border-red-200/60 bg-red-50/40 px-5 py-4">
          <div className="absolute top-0 left-0 h-full w-[3px] bg-red-400/80" />
          <p className="text-[13px] font-medium text-red-800">
            Authentication failed
          </p>
          <p className="mt-1 text-xs leading-relaxed text-red-600/70 break-all">
            {decodeURIComponent(error)}
          </p>
        </div>
      )}

      {/* Sign-in button */}
      <button
        onClick={() => signInWithGoogle(redirect)}
        disabled={isLoading}
        className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-charcoal/8 bg-white px-6 py-4 text-[13px] font-medium text-charcoal shadow-sm transition-all duration-500 hover:border-charcoal/12 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* Hover shimmer */}
        <span
          className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(184,154,106,0.05), transparent)",
          }}
        />
        <GoogleIcon />
        <span className="relative tracking-wide">
          {isLoading ? "Connecting…" : "Continue with Google"}
        </span>
      </button>

      {/* Trust line */}
      <div className="flex items-center justify-center gap-5 pt-1">
        <div className="flex items-center gap-1.5 text-muted/40">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase">
            Encrypted
          </span>
        </div>
        <div className="h-2.5 w-px bg-charcoal/6" />
        <div className="flex items-center gap-1.5 text-muted/40">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[9px] tracking-widest uppercase">
            Private
          </span>
        </div>
      </div>

      {/* Terms */}
      <p className="text-center text-[10px] leading-relaxed text-muted/50">
        By continuing, you agree to our{" "}
        <a
          href="/terms"
          className="text-muted/70 underline decoration-charcoal/10 underline-offset-2 transition-colors hover:text-charcoal/70"
        >
          Terms
        </a>{" "}
        &{" "}
        <a
          href="/privacy-policy"
          className="text-muted/70 underline decoration-charcoal/10 underline-offset-2 transition-colors hover:text-charcoal/70"
        >
          Privacy
        </a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="mx-auto h-7 w-28 animate-pulse rounded bg-charcoal/[0.04]" />
            <div className="mx-auto h-4 w-40 animate-pulse rounded bg-charcoal/[0.04]" />
          </div>
          <div className="mx-auto h-px w-12 bg-charcoal/[0.04]" />
          <div className="h-14 w-full animate-pulse rounded-xl bg-charcoal/[0.04]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
