import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function AdminDashboard() {
  const session = await auth();
  
  // Parallel fetch stats
  const [
    totalBooks,
    totalArticles,
    unavailableBooksCount,
    totalCategories,
    recentUnavailableBooks,
    recentArticles
  ] = await Promise.all([
    prisma.book.count(),
    prisma.article.count(),
    prisma.book.count({ where: { availability: "Unavailable" } }),
    prisma.category.count(),
    prisma.book.findMany({
      where: { availability: "Unavailable" },
      include: { author: true },
      orderBy: { updatedAt: 'desc' },
      take: 5
    }),
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  return (
    <>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-outline-variant/80 pb-6 mb-12 gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Overview
          </span>
          <h2 className="font-headline-h2 text-4xl lg:text-5xl text-on-surface italic tracking-tight">
            Dashboard Overview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            Logged in as:
          </span>
          <span className="font-newsreader italic text-xl border-b border-outline-variant pb-0.5">
            {session?.user?.name || "Admin User"}
          </span>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* Stat: Total Books */}
        <div className="p-6 bg-white border border-outline-variant/40 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
            <span className="material-symbols-outlined text-9xl">book</span>
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Total Books
            </span>
            <span className="font-headline-h1 text-5xl">{totalBooks.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Stat: Total Articles */}
        <div className="p-6 bg-white border border-outline-variant/40 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
            <span className="material-symbols-outlined text-9xl">article</span>
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Total Articles
            </span>
            <span className="font-headline-h1 text-5xl">{totalArticles.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Stat: Unavailable Books */}
        <div className="p-6 bg-white border border-outline-variant/40 shadow-sm relative overflow-hidden group border-t-2 border-t-primary">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700 text-primary">
            <span className="material-symbols-outlined text-9xl">block</span>
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary">
              Unavailable Books
            </span>
            <span className="font-headline-h1 text-5xl text-primary">{unavailableBooksCount.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Stat: Total Categories */}
        <div className="p-6 bg-white border border-outline-variant/40 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
            <span className="material-symbols-outlined text-9xl">category</span>
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Categories
            </span>
            <span className="font-headline-h1 text-5xl">{totalCategories.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Tables / Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 lg:gap-16">
        {/* Left: Unavailable Books (Editorial Ledger Style) */}
        <div className="xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-baseline border-b border-outline-variant/80 pb-4 mb-2">
            <h3 className="font-headline-h3 text-2xl italic">
              Unavailable Books
            </h3>
            <Link
              href="/admin/books"
              className="font-label-sm text-[10px] uppercase tracking-widest text-primary hover:opacity-70 border-b border-primary/30 pb-1"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-col">
            {/* Table Header (Minimal) */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-center px-4 py-4 border-b border-outline-variant/40 text-on-surface-variant opacity-70">
              <span className="font-label-sm text-[9px] uppercase tracking-widest w-16 text-center">
                Cover
              </span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest">
                Title & Author
              </span>
              <span className="font-label-sm text-[9px] uppercase tracking-widest text-right">
                Status
              </span>
            </div>

            {recentUnavailableBooks.length === 0 ? (
               <div className="py-8 text-center text-on-surface-variant font-newsreader italic">
                 No unavailable books. All inventory is well-stocked.
               </div>
            ) : (
              recentUnavailableBooks.map((book) => (
                <div
                  key={book.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-6 items-center px-4 py-5 border-b border-outline-variant/40 hover:bg-white transition-colors group"
                >
                  {book.imageUrl ? (
                    <img
                      alt={book.title}
                      className="w-12 md:w-16 aspect-[2/3] object-cover editorial-inner shadow-sm"
                      src={book.imageUrl}
                    />
                  ) : (
                    <div className="w-12 md:w-16 aspect-[2/3] bg-surface-variant/30 editorial-inner flex items-center justify-center text-on-surface-variant/40">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <h4 className="font-headline-h3 text-xl group-hover:text-primary transition-colors">
                      {book.title}
                    </h4>
                    <span className="font-newsreader italic text-on-surface-variant text-sm">
                      {book.author?.name || "Unknown Author"}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="px-3 py-1 bg-primary text-white font-label-sm text-[10px] tracking-widest uppercase">
                      {book.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Articles */}
        <div className="flex flex-col">
          <div className="flex justify-between items-baseline border-b border-outline-variant/80 pb-4 mb-2">
            <h3 className="font-headline-h3 text-2xl italic">
              Recent Articles
            </h3>
            <Link
              href="/admin/articles"
              className="font-label-sm text-[10px] uppercase tracking-widest text-primary hover:opacity-70 border-b border-primary/30 pb-1"
            >
              Manage
            </Link>
          </div>

          <div className="flex flex-col">
            {recentArticles.length === 0 ? (
               <div className="py-8 text-center text-on-surface-variant font-newsreader italic">
                 No articles published yet.
               </div>
            ) : (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/editor?id=${article.id}`}
                  className="flex flex-col gap-2 py-5 border-b border-outline-variant/40 hover:pl-2 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-label-sm text-[9px] uppercase tracking-widest ${
                        article.status === "Published"
                          ? "text-primary"
                          : "text-outline"
                      }`}
                    >
                      {article.status}
                    </span>
                    <span className="font-newsreader italic text-sm text-on-surface-variant opacity-70">
                      {new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-headline-h3 text-lg leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
