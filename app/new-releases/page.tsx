import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Releases",
  description: "Browse the newest titles at Kedai Sinau. Handpicked books, fresh off the press, to inspire your next reading journey.",
};

async function getNewReleases() {
  "use cache";
  cacheLife("hours");
  cacheTag("new-releases");

  return prisma.book.findMany({
    where: { status: "Active", badge: "New" },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function NewReleasesPage() {
  const books = await getNewReleases();

  return (
    <>
      <PublicNavbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-on-surface font-semibold border-b border-primary">New Releases</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-label-sm uppercase tracking-[0.2em] text-xs text-on-surface-variant mb-4">Fresh off the press</span>
          <h1 className="font-display-lg text-4xl sm:text-6xl md:text-7xl text-on-surface tracking-tight mb-4">New Arrivals</h1>
          <p className="font-newsreader italic text-xl text-on-surface-variant max-w-xl">
            Browse the newest titles in our store. Handpicked books to inspire your next reading journey.
          </p>
        </div>

        {/* Utility Bar */}
        <div className="flex justify-between items-center mb-12 border-b border-outline-variant/30 pb-4">
          <p className="font-newsreader italic text-on-surface-variant">
            Showing {books.length} {books.length === 1 ? "title" : "titles"}
          </p>
        </div>

        {/* The Grid */}
        {books.length === 0 ? (
          <div className="text-center py-24 border border-outline-variant/30 bg-surface-variant/10">
            <p className="font-newsreader italic text-2xl text-on-surface-variant mb-4">
              No new releases at the moment.
            </p>
            <Link
              href="/catalog"
              className="font-label-sm uppercase tracking-widest text-primary hover:text-on-surface transition-colors"
            >
              Browse Full Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-20 gap-x-4 sm:gap-x-8">
            {books.map((book, index) => (
              <BookCard
                key={book.id}
                slug={book.slug}
                title={book.title}
                author={book.author?.name || "Unknown"}
                price={book.price}
                originalPrice={book.originalPrice ?? undefined}
                imageUrl={book.imageUrl || ""}
                badge={book.badge as "Best Seller" | "New" | "Sale" | undefined}
                staggered={index % 2 === 1}
              />
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </>
  );
}
