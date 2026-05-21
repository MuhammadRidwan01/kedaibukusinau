"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { SearchResults } from "@/components/catalog/SearchResults";
import { MobileSearchModal } from "./MobileSearchModal";

export function PublicNavbar({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Books", href: "/catalog" },
    { name: "Journal", href: "/journal" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className={`${theme === "dark" ? "bg-theme-dark-bg/90 border-theme-dark-text/10" : "bg-[#FAF3E0]/90 border-outline-variant/50"} backdrop-blur-sm sticky top-0 z-50 border-b shadow-sm transition-all duration-300`}>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 h-14">
          <Link href="/" className={`text-3xl font-bold font-headline-h1 tracking-tight ${theme === "dark" ? "text-theme-dark-text" : "text-on-surface"}`}>
            Kedai Sinau.
          </Link>

          <div className="hidden lg:flex gap-6 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              
              const baseClasses = "font-newsreader text-sm uppercase tracking-widest transition-colors duration-200";
              const activeClasses = theme === "dark" ? "text-theme-dark-text border-b border-primary pb-1" : "text-on-surface border-b border-primary pb-1";
              const inactiveClasses = theme === "dark" ? "text-theme-dark-text/70 hover:text-theme-dark-text" : "text-on-surface-variant hover:text-on-surface";
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className={`flex items-center gap-5 h-full ${theme === "dark" ? "text-theme-dark-text" : "text-on-surface"}`}>
            {/* Search Toggle */}
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="material-symbols-outlined font-light hover:text-primary transition-colors text-[22px]"
              >
                search
              </button>

              {/* Search Modal for Desktop */}
              {isSearchOpen && (
                <div className="hidden lg:flex absolute top-full right-0 w-[460px] bg-[#FAF3E0]/98 backdrop-blur-md border-x border-b border-outline-variant/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] flex-col animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-6 pt-5 pb-2 flex items-center justify-between">
                    <span className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                      Search Index
                    </span>
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="material-symbols-outlined font-light text-on-surface-variant hover:text-primary text-[20px]"
                    >
                      close
                    </button>
                  </div>
                  <div className="px-6 pb-6">
                    <SearchResults onNavigate={() => setIsSearchOpen(false)} inline autoFocus={true} />
                  </div>
                </div>
              )}
            </div>

            <Link href="/admin/login" className="hover:text-primary transition-colors duration-200 hidden lg:block">
              <span className="material-symbols-outlined font-light text-[22px]">person</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden hover:text-primary transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="flex justify-between items-center px-6 h-14 border-b border-outline-variant/50">
          <span className="text-lg font-bold font-headline-h1 text-on-surface">
            Menu
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col py-4">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-6 py-3 font-headline-h1 text-sm uppercase tracking-widest transition-colors ${
                  isActive
                    ? "text-primary border-l-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <MobileSearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}
