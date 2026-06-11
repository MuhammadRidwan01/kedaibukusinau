"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface relative">
      <div className="noise-overlay"></div>
      <div className="flex flex-col items-center gap-8 relative z-10 px-6">
        <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-on-surface-variant">
          Something Went Wrong
        </span>
        <h1 className="font-headline-h1 text-4xl sm:text-6xl md:text-8xl tracking-tighter leading-none text-on-surface italic">
          Error
        </h1>
        <p className="font-body-md text-on-surface-variant max-w-md text-center leading-relaxed">
          An unexpected error occurred. Please try again or return to the
          storefront.
        </p>
        <div className="w-12 h-[1px] bg-primary"></div>
        <div className="flex gap-6">
          <button
            onClick={reset}
            className="border border-on-surface text-on-surface px-10 py-4 font-newsreader uppercase text-xs tracking-widest hover:bg-on-surface hover:text-white transition-colors duration-500"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-outline-variant text-on-surface-variant px-10 py-4 font-newsreader uppercase text-xs tracking-widest hover:border-on-surface hover:text-on-surface transition-colors duration-500"
          >
            Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
