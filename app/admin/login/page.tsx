"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-on-surface antialiased relative">
      <div className="noise-overlay"></div>

      <div className="w-full max-w-[400px] p-12 bg-surface border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative flex flex-col items-center">
        {/* Subtle decorative corners */}
        <div className="absolute top-1 left-1 w-5 h-5 border-t border-l border-outline opacity-30"></div>
        <div className="absolute bottom-1 right-1 w-5 h-5 border-b border-r border-outline opacity-30"></div>

        {/* Logo */}
        <div className="text-3xl font-bold text-on-surface font-newsreader tracking-tight mb-2">
          Kedai Sinau.
        </div>

        {/* Heading */}
        <h1 className="font-newsreader italic text-on-surface-variant text-lg mb-10 tracking-wider">
          Admin Panel
        </h1>

        {/* Form */}
        <form className="w-full flex flex-col gap-8" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-transparent border-0 border-b border-outline py-3 font-newsreader text-lg text-on-surface focus:outline-none focus:border-b-primary focus:ring-0 placeholder:text-on-surface-variant/50 placeholder:italic transition-all duration-300"
              placeholder="curator@kedaisinau.com"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-transparent border-0 border-b border-outline py-3 font-newsreader text-lg text-on-surface focus:outline-none focus:border-b-primary focus:ring-0 placeholder:text-on-surface-variant/50 placeholder:italic transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full border border-on-surface text-on-surface px-6 py-4 font-newsreader uppercase text-sm tracking-widest hover:bg-on-surface hover:text-white transition-colors duration-500 mt-2"
          >
            Authenticate
          </button>
        </form>
      </div>
      
      {/* Back to Home Link */}
      <Link href="/" className="mt-8 font-label-sm uppercase tracking-widest text-xs text-on-surface-variant hover:text-primary transition-colors z-10 border-b border-transparent hover:border-primary pb-1">
        Return to Storefront
      </Link>
    </div>
  );
}
