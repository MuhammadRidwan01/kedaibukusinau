"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/books", label: "Manage Books", icon: "book" },
    { href: "/admin/articles", label: "Manage Articles", icon: "article" },
    { href: "/admin/metadata", label: "Manage Metadata", icon: "label" },
    { href: "/admin/admins", label: "Manage Admins", icon: "group" },
    { href: "/admin/settings", label: "Store Settings", icon: "settings" },
  ];

  return (
    <aside className="w-64 border-r border-outline-variant/60 bg-[#FAF3E0] flex flex-col h-screen sticky top-0 z-10 shrink-0">
      {/* Logo */}
      <div className="p-8 border-b border-outline-variant/60">
        <h1 className="text-3xl font-bold text-on-surface font-newsreader tracking-tight">Kedai Sinau.</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
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
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
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
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
