"use client";

import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
        <p className="text-base-content/60 max-w-sm mb-2">{error.message || "An unexpected error occurred."}</p>
        {error.digest && (
          <p className="text-xs text-base-content/30">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="btn btn-primary">Try Again</button>
        <Link href="/" className="btn btn-ghost">Go Home</Link>
      </div>
    </div>
  );
}
