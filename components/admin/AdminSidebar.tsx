"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/books", label: "Manage Books", icon: "book" },
    { href: "/admin/articles", label: "Manage Articles", icon: "article" },
    { href: "/admin/metadata", label: "Manage Metadata", icon: "label" },
    { href: "/admin/admins", label: "Manage Admins", icon: "group" },
    { href: "/admin/settings", label: "Store Settings", icon: "settings" },
  ];

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleToggle = useCallback(() => setIsOpen((v) => !v), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#FAF3E0] border-b border-outline-variant/60">
        <h1 className="text-xl font-bold text-on-surface font-newsreader tracking-tight">
          Kedai Sinau.
        </h1>
        <button
          type="button"
          onClick={handleToggle}
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* ── Mobile Backdrop ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 border-r border-outline-variant/60 bg-[#FAF3E0]
          flex flex-col h-screen md:sticky top-0 shrink-0
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-8 border-b border-outline-variant/60">
          <h1 className="text-3xl font-bold text-on-surface font-newsreader tracking-tight">
            Kedai Sinau.
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-4 font-label-sm uppercase tracking-widest flex items-center gap-4 transition-all ${
                  isActive
                    ? "text-primary border-l-2 border-primary bg-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/50 border-l-2 border-transparent hover:border-outline-variant/50"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-4 font-label-sm uppercase tracking-widest text-primary hover:opacity-70 transition-opacity px-3"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
