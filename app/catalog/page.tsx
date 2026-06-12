import { Suspense } from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import { SearchResults } from "@/components/catalog/SearchResults";
import { PriceFilter } from "@/components/catalog/PriceFilter";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { MobileFilterDrawer } from "@/components/catalog/MobileFilterDrawer";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { buildFilterUrl } from "@/lib/url-builder";
import { cacheLife, cacheTag } from "next/cache";

async function getSidebarData() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog-sidebar");
  return Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { books: true } } },
    }),
    prisma.author.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { books: true } } },
      take: 8, // Just top 8 for sidebar to avoid clutter
    }),
    prisma.genre.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { books: true } } },
    }),
  ]);
}

async function getCatalogBooks(where: any, orderBy: any, perPage: number, page: number) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog-books");
  return Promise.all([
    prisma.book.findMany({
      where,
      include: { author: true, category: true },
      orderBy: orderBy as any,
      take: perPage,
      skip: (page - 1) * perPage,
    }),
    prisma.book.count({ where }),
  ]);
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const genre = params.genre;
  const author = params.author;

  let title = "Book Catalog";
  if (category) title = `${category.charAt(0).toUpperCase() + category.slice(1)} Books`;
  if (genre) title = `${genre.charAt(0).toUpperCase() + genre.slice(1)} Genre`;
  if (author) title = `Books by ${author.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`;

  return {
    title: title,
    description: "Browse our complete collection of curated literature, sorted by your preference.",
  };
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
      <aside className="hidden lg:flex flex-col gap-16 col-span-3 pt-4">
        <div className="h-8 bg-surface-variant/30 w-1/2 mb-2"></div>
        <div className="h-32 bg-surface-variant/20 w-full mb-6"></div>
        <div className="h-8 bg-surface-variant/30 w-1/2 mb-2"></div>
        <div className="h-48 bg-surface-variant/20 w-full mb-6"></div>
      </aside>
      <div className="col-span-1 lg:col-span-9 flex flex-col">
        <div className="flex justify-between items-center mb-12 h-10">
          <div className="h-4 bg-surface-variant/30 w-32"></div>
          <div className="h-10 bg-surface-variant/30 w-48 border border-outline-variant/30"></div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-12 sm:gap-y-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[2/3] bg-surface-variant/30 w-full"></div>
              <div className="h-6 bg-surface-variant/30 w-3/4 mt-2"></div>
              <div className="h-4 bg-surface-variant/30 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function CatalogContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const category = params.category;
  const author = params.author;
  const genre = params.genre;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const sort = params.sort || "newest";
  const page = Number(params.page) || 1;
  const perPage = 12;

  // Build Prisma Where
  const where: any = { status: "Active" };
  if (category) where.category = { slug: category };
  if (author) where.author = { slug: author };
  if (genre) where.genres = { some: { genre: { slug: genre } } };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  // Build Prisma OrderBy
  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "bestseller"
      ? { isFeaturedBestseller: "desc" }
      : { createdAt: "desc" };

  // Fetch Data
  const [categories, authors, genres] = await getSidebarData();
  const [books, filteredTotal] = await getCatalogBooks(where, orderBy, perPage, page);

  const totalPages = Math.max(1, Math.ceil(filteredTotal / perPage));
  const hasActiveFilters = category || author || genre || minPrice || maxPrice;

  const currentParams = {
    ...(category && { category }),
    ...(author && { author }),
    ...(genre && { genre }),
    ...(minPrice && { minPrice: minPrice.toString() }),
    ...(maxPrice && { maxPrice: maxPrice.toString() }),
    ...(sort !== "newest" && { sort }),
    ...(page > 1 && { page: page.toString() }),
  };

  const SidebarContent = (
    <>
      {/* Search */}
      <div>
        <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">
          Search Index
        </h3>
        <SearchResults />
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">
          Categories
        </h3>
        <div className="flex flex-col gap-4">
          {categories.map((cat) => {
            const isActive = category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={buildFilterUrl(currentParams, { category: isActive ? null : cat.slug })}
                className={`ledger-link ${
                  isActive ? "text-primary font-semibold border-b border-primary w-fit pb-1" : ""
                }`}
              >
                {cat.name}
                <span className="text-xs text-on-surface-variant/50 ml-2">
                  ({cat._count.books})
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Genre Tags */}
      <div>
        <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">
          Genres
        </h3>
        <div className="flex flex-col gap-4">
          {genres
            .filter((g) => g._count.books > 0)
            .map((g) => {
              const isActive = genre === g.slug;
              return (
                <Link
                  key={g.id}
                  href={buildFilterUrl(currentParams, { genre: isActive ? null : g.slug })}
                  className={`ledger-link ${
                    isActive ? "text-primary font-semibold border-b border-primary w-fit pb-1" : ""
                  }`}
                >
                  {g.name}
                  <span className="text-xs text-on-surface-variant/50 ml-2">
                    ({g._count.books})
                  </span>
                </Link>
              );
            })}
        </div>
      </div>

      {/* Author Filter */}
      <div>
        <h3 className="font-label-sm uppercase tracking-[0.2em] text-on-surface mb-6 text-[11px]">
          Curated Authors
        </h3>
        <div className="flex flex-col gap-4">
          {authors
            .filter((a) => a._count.books > 0)
            .map((a) => {
              const isActive = author === a.slug;
              return (
                <Link
                  key={a.id}
                  href={buildFilterUrl(currentParams, { author: isActive ? null : a.slug })}
                  className={`ledger-link ${
                    isActive ? "text-primary font-semibold border-b border-primary w-fit pb-1" : ""
                  }`}
                >
                  {a.name}
                </Link>
              );
            })}
        </div>
      </div>

      {/* Price Filter (Client Component) */}
      <PriceFilter currentMin={minPrice} currentMax={maxPrice} />

      {/* Clear All */}
      {hasActiveFilters && (
        <Link
          href="/catalog"
          className="text-primary hover:text-on-surface transition-colors font-label-sm uppercase tracking-[0.2em] text-[10px] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
          Clear All Filters
        </Link>
      )}
    </>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-16 col-span-3">
          {SidebarContent}
        </aside>

        {/* Book Grid */}
        <div className="col-span-1 lg:col-span-9 flex flex-col">
          {/* Active Filters Banner */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-surface-variant/20 border border-outline-variant/30">
              <span className="font-label-sm uppercase tracking-widest text-[10px] text-on-surface-variant mr-2">
                Filtered By:
              </span>
              {category && (
                <span className="px-3 py-1 bg-surface border border-outline-variant/50 text-sm font-newsreader italic flex items-center gap-2">
                  {categories.find((c) => c.slug === category)?.name || category}
                  <Link href={buildFilterUrl(currentParams, { category: null })} className="hover:text-primary">✕</Link>
                </span>
              )}
              {genre && (
                <span className="px-3 py-1 bg-surface border border-outline-variant/50 text-sm font-newsreader italic flex items-center gap-2">
                  {genres.find((g) => g.slug === genre)?.name || genre}
                  <Link href={buildFilterUrl(currentParams, { genre: null })} className="hover:text-primary">✕</Link>
                </span>
              )}
              {author && (
                <span className="px-3 py-1 bg-surface border border-outline-variant/50 text-sm font-newsreader italic flex items-center gap-2">
                  {authors.find((a) => a.slug === author)?.name || author}
                  <Link href={buildFilterUrl(currentParams, { author: null })} className="hover:text-primary">✕</Link>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="px-3 py-1 bg-surface border border-outline-variant/50 text-sm font-newsreader italic flex items-center gap-2">
                  {minPrice ? `Rp ${minPrice.toLocaleString("id-ID")}` : "0"} -{" "}
                  {maxPrice ? `Rp ${maxPrice.toLocaleString("id-ID")}` : "Max"}
                  <Link href={buildFilterUrl(currentParams, { minPrice: null, maxPrice: null })} className="hover:text-primary">✕</Link>
                </span>
              )}
            </div>
          )}

          {/* Utility Bar */}
          <div className="flex justify-between items-center mb-12">
            <p className="font-newsreader italic text-on-surface-variant hidden md:block">
              Showing {filteredTotal === 0 ? 0 : (page - 1) * perPage + 1}-
              {Math.min(page * perPage, filteredTotal)} of {filteredTotal} books
            </p>
            
            {/* Mobile Filter Toggle */}
            <MobileFilterDrawer>
              {SidebarContent}
            </MobileFilterDrawer>

            <SortDropdown />
          </div>

          {/* The Grid */}
          {filteredTotal === 0 ? (
            <div className="text-center py-24 border border-outline-variant/30 bg-surface-variant/10">
              <p className="font-newsreader italic text-2xl text-on-surface-variant mb-4">
                No books found matching your criteria.
              </p>
              <Link
                href="/catalog"
                className="font-label-sm uppercase tracking-widest text-primary hover:text-on-surface transition-colors"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-12 sm:gap-y-20">
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

          {/* Editorial Pagination */}
          {totalPages > 1 && (
            <div className="mt-24 pt-12 border-t border-outline-variant/30 flex justify-center">
              <ul className="flex items-center gap-3 sm:gap-6">
                {/* Prev */}
                <li>
                  {page > 1 ? (
                    <Link
                      href={buildFilterUrl(currentParams, { page: (page - 1).toString() })}
                      className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
                    >
                      <span className="material-symbols-outlined font-light text-[24px]">
                        arrow_left_alt
                      </span>
                    </Link>
                  ) : (
                    <span className="text-on-surface-variant opacity-30 flex items-center cursor-not-allowed">
                      <span className="material-symbols-outlined font-light text-[24px]">
                        arrow_left_alt
                      </span>
                    </span>
                  )}
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    const isActive = p === page;
                    return (
                      <li key={p}>
                        <Link
                          href={buildFilterUrl(currentParams, { page: p.toString() })}
                          className={`font-newsreader text-2xl transition-colors ${
                            isActive
                              ? "italic text-primary border-b border-primary pb-1"
                              : "text-on-surface-variant hover:text-primary"
                          }`}
                        >
                          {p}
                        </Link>
                      </li>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return (
                      <li key={p}>
                        <span className="font-newsreader text-2xl text-on-surface-variant opacity-50">
                          ...
                        </span>
                      </li>
                    );
                  }
                  return null;
                })}

                {/* Next */}
                <li>
                  {page < totalPages ? (
                    <Link
                      href={buildFilterUrl(currentParams, { page: (page + 1).toString() })}
                      className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
                    >
                      <span className="material-symbols-outlined font-light text-[24px]">
                        arrow_right_alt
                      </span>
                    </Link>
                  ) : (
                    <span className="text-on-surface-variant opacity-30 flex items-center cursor-not-allowed">
                      <span className="material-symbols-outlined font-light text-[24px]">
                        arrow_right_alt
                      </span>
                    </span>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
        {/* Breadcrumb & Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-on-surface-variant mb-6 uppercase tracking-widest text-[11px]">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-on-surface font-semibold border-b border-primary">
              Books
            </span>
          </div>

          <div className="border-t-2 border-outline pt-8 pb-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl mb-4 text-on-surface tracking-tight">
                All Books
              </h1>
              <p className="font-newsreader italic text-xl text-on-surface-variant max-w-xl">
                Browse our complete collection of curated literature.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={null}>
          <CatalogContent searchParams={searchParams} />
        </Suspense>
      </main>
      <PublicFooter />
    </>
  );
}
