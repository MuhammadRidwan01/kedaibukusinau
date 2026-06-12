import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BookCard } from "@/components/ui/BookCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";

async function getHomeData() {
  "use cache";
  cacheLife("hours");
  cacheTag("home-data");
  return Promise.all([
    prisma.book.findMany({ where: { status: "Active" }, include: { author: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.book.findFirst({ where: { status: "Active", isFeaturedBestseller: true }, include: { author: true, category: true }, orderBy: { updatedAt: "desc" } }),
    prisma.book.findMany({ where: { status: "Active", badge: "New" }, include: { author: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.genre.findMany({ orderBy: { name: "asc" }, take: 10 }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, take: 3 }),
    prisma.article.findMany({ where: { status: "Published" }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ]);
}

export default async function Home() {
  "use cache";
  cacheLife("hours");
  cacheTag("home-page");
  const [curatedBooks, bestseller, newArrivals, genres, testimonials, articles, banners] = await getHomeData();
  return (
    <>
      <PublicNavbar />
      <HeroCarousel slides={banners.map((banner) => ({ src: banner.imageUrl, alt: banner.altText || "Kedai Sinau banner" }))} />

      <section className="max-w-[1200px] mx-auto w-full px-6 pt-16 pb-20">
        <div className="flex flex-col gap-12">
          <div className="flex justify-between items-baseline border-b border-outline-variant pb-4">
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Curated Collection
            </h2>
            <Link
              className="font-newsreader uppercase tracking-widest text-xs text-primary hover:opacity-80 transition-opacity border-b border-primary/30 pb-1"
              href="/catalog"
            >
              View Catalog
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-12">
            {curatedBooks.map((book, index) => (
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

          <div className="flex justify-center pt-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-4 border border-outline text-on-surface font-newsreader uppercase tracking-widest text-sm px-8 sm:px-12 py-4 sm:py-5 hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-500 group"
            >
              Explore Full Collection
              <span className="material-symbols-outlined font-light text-base transform group-hover:translate-x-2 transition-transform duration-500">
                east
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Avant-Garde Bestseller */}
      <section className="w-full bg-[#1E3A5F] text-[#FAF3E0] py-20 sm:py-28 md:py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-[0.03] z-0">
          <h2 className="font-headline-h1 text-[8rem] sm:text-[12rem] md:text-[25rem] whitespace-nowrap leading-none tracking-tighter">
            BESTSELLER
          </h2>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
            <div className="md:col-span-5 flex justify-center mt-8 md:mt-0">
              <div className="relative group cursor-pointer w-[85%] md:w-[80%] overflow-hidden">
                <div className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-14 sm:w-20 h-14 sm:h-20 border-t-[3px] sm:border-t-[4px] border-l-[3px] sm:border-l-[4px] border-[#FAF3E0]/80 transition-all duration-700 group-hover:-top-14 group-hover:-left-14 z-0"></div>
                <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-14 sm:w-20 h-14 sm:h-20 border-b-[3px] sm:border-b-[4px] border-r-[3px] sm:border-r-[4px] border-[#FAF3E0]/80 transition-all duration-700 group-hover:-bottom-14 group-hover:-right-14 z-0"></div>

                <div className="relative z-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] transform transition-transform duration-700 group-hover:scale-[1.03]">
                  <Image
                    alt={bestseller?.title || "Bestseller"}
                    className="w-full aspect-[2/3] object-cover editorial-inner filter contrast-125"
                    src={bestseller?.imageUrl || ""}
                    width={600}
                    height={900}
                    sizes="(max-width: 768px) 70vw, 35vw"
                    priority
                  />

                  <div className="absolute top-12 -right-8 bg-primary text-white font-label-sm text-[10px] tracking-widest uppercase px-6 py-2 rotate-90 origin-bottom-right shadow-xl">
                    No. 1 Bestseller
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7 flex flex-col pt-8 md:pt-0">
              <div className="flex items-center gap-6 mb-8">
                <span className="w-12 h-[1px] bg-[#FAF3E0]/30"></span>
                <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-[#FAF3E0]/60">
                  Bestseller of the Month
                </span>
                <span className="font-newsreader uppercase tracking-[0.3em] text-[10px] text-primary">
                  {bestseller?.updatedAt
                    ? `${String(new Date(bestseller.updatedAt).getMonth() + 1).padStart(2, "0")} . ${String(new Date(bestseller.updatedAt).getFullYear()).slice(-2)}`
                    : ""}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-10">
                <h3 className="font-headline-h1 text-3xl sm:text-5xl md:text-7xl tracking-tight leading-[1.1] mb-2">
                  {bestseller?.title || "Featured Bestseller"}
                </h3>
                <span className="font-newsreader italic text-2xl text-[#FAF3E0]/50">
                  {bestseller?.author?.name || ""}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-[#FAF3E0]/20 py-8 mb-5">
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40">
                    Genre
                  </span>
                  <span className="font-newsreader text-sm tracking-wide">
                    {bestseller?.category?.name || "Fiction"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40">
                    Pages
                  </span>
                  <span className="font-newsreader text-sm tracking-wide">
                    {bestseller?.pages ? `${bestseller.pages} p.` : "—"}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col gap-3 pt-4 border-t border-[#FAF3E0]/10">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40">
                    Synopsis
                  </span>
                  <p className="font-body-md text-sm leading-loose text-[#FAF3E0]/70 text-justify">
                    {bestseller?.synopsis?.split("\n")[0] || ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#FAF3E0]/40 mb-2">
                    Edition Price
                  </span>
                  <div className="flex items-center gap-4">
                    {bestseller?.originalPrice && (
                      <>
                        <span className="font-headline-h3 text-lg text-[#FAF3E0]/40 line-through">
                          Rp {bestseller.originalPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="font-label-sm text-[10px] tracking-widest uppercase bg-primary/90 text-white px-3 py-1">
                          -{Math.round((1 - bestseller.price / bestseller.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="font-headline-h3 text-3xl mt-1">Rp {bestseller?.price.toLocaleString("id-ID") || "0"}</div>
                </div>
                <Link
                  href={`/catalog/${bestseller?.slug || ""}`}
                  className="w-full text-center md:w-auto bg-[#FAF3E0] text-[#1E3A5F] font-newsreader uppercase tracking-widest text-xs px-10 py-5 hover:bg-primary hover:text-white transition-all duration-500"
                >
                  Acquire Book
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Ledger: New Arrivals */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-5 flex flex-col gap-6 border-t border-outline-variant pt-6">
            <span className="font-newsreader uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              Fresh off the press
            </span>
            <h2 className="font-display-lg text-4xl sm:text-6xl md:text-7xl text-on-surface leading-none tracking-tight">
              New
              <br />
              <i className="text-on-surface-variant font-light">Arrivals</i>
            </h2>
            <p className="font-body-md text-on-surface-variant mt-4 md:pr-12 leading-relaxed">
              Discover our latest acquisitions. A curated index of titles that
              challenge the mind and soothe the soul, presented without visual
              noise.
            </p>
          </div>

          <div className="md:col-span-7 flex flex-col border-t border-outline-variant pt-6">
            <div className="-mx-4 md:-mx-8 flex flex-col">
              {newArrivals.map((item, index) => (
                <div
                  key={item.id}
                  className={`group ${index === 0
                    ? "border-b border-outline-variant/30 bg-white shadow-sm hover:[&_.grid]:grid-rows-[1fr] hover:[&_.grid]:opacity-100"
                    : "border-b border-outline-variant/30 cursor-pointer hover:bg-white hover:shadow-sm"
                    } px-4 md:px-8 transition-all duration-500`}
                >
                  <div
                    className={`flex items-center justify-between py-6 transition-colors duration-500 ${index === 0
                      ? "text-primary"
                      : "group-hover:text-primary"
                      }`}
                  >
                    <div className="flex items-center gap-6 md:gap-12 w-full">
                      <span
                        className={`font-newsreader text-sm ${index === 0
                          ? "opacity-100"
                          : "text-on-surface-variant opacity-50 group-hover:text-primary transition-colors duration-500"
                          }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                        <h3
                          className={`font-headline-h3 text-2xl ${index === 0
                            ? ""
                            : "text-on-surface group-hover:text-primary transition-colors duration-500"
                            }`}
                        >
                          {item.title}
                        </h3>
                        <span
                          className={`font-newsreader italic ${index === 0
                            ? "opacity-80"
                            : "text-on-surface-variant transition-colors duration-500"
                            }`}
                        >
                          {item.author?.name || ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <span
                        className={`font-label-sm text-sm hidden md:block ${index === 0
                          ? "text-primary"
                          : "text-on-surface-variant group-hover:text-primary transition-colors"
                          }`}
                      >
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`material-symbols-outlined transform transition-transform duration-500 ${index === 0
                          ? "rotate-180"
                          : "group-hover:rotate-180 text-on-surface-variant group-hover:text-primary"
                          }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div
                    className={`grid opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${index === 0
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] group-hover:grid-rows-[1fr] group-hover:opacity-100"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8 pt-2 flex flex-col md:flex-row gap-6 md:gap-8 ml-0 md:ml-[4.5rem]">
                        <Image
                          alt={item.title}
                          className="w-full md:w-32 aspect-[2/3] object-cover shadow-xl editorial-inner"
                          src={item.imageUrl || ""}
                          width={200}
                          height={300}
                          sizes="(max-width: 768px) 100vw, 128px"
                        />
                        <div className="flex flex-col justify-end">
                          <p className="font-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed">
                            {item.synopsis?.split("\n")[0] || ""}
                          </p>
                          <Link
                            href={`/catalog/${item.slug}`}
                            className="border border-on-surface text-on-surface px-6 py-3 font-newsreader uppercase text-xs tracking-widest hover:bg-on-surface hover:text-white transition-colors w-fit"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genre Browser */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-10">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="font-headline-h1 uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              Browse by
            </span>
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Explore Genres
            </h2>
            <div className="w-12 h-[1px] bg-primary mt-2"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-4 max-w-[800px] mx-auto">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/catalog?genre=${genre.slug}`} className="genre-chip">
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="font-headline-h1 uppercase tracking-[0.2em] text-xs text-on-surface-variant">
              Readers Say
            </span>
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Testimonials
            </h2>
            <div className="w-12 h-[1px] bg-primary mt-2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <p className="font-headline-h1 text-lg italic text-on-surface leading-relaxed pt-8">
                  {t.text}
                </p>
                <div className="mt-6 pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface">
                    {t.name}
                  </div>
                  <div className="font-caption text-caption text-on-surface-variant">
                    {t.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="w-full theme-dark py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
          <div className="flex justify-between items-baseline border-b border-outline-variant pb-4">
            <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">
              Literary Journal
            </h2>
            <Link
              className="font-newsreader uppercase tracking-widest text-xs text-primary hover:opacity-80 transition-opacity border-b border-primary/30 pb-1"
              href="/journal"
            >
              Read All Entries
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/journal/${article.slug}`}
                className={`flex flex-col group cursor-pointer ${index === 1 ? "md:mt-12" : ""}`}
              >
                <div className="overflow-hidden border border-outline-variant bg-white p-2 mb-6">
                  <Image
                    alt={article.title}
                    className="w-full h-64 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                    src={article.imageUrl || ""}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 90vw, 30vw"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="font-newsreader italic text-sm text-on-surface-variant">
                    {article.publishedAt?.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) || ""}
                  </span>
                  <h3 className="font-headline-h3 text-2xl text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-outline-variant"></div>
                  <p className="font-body-md text-on-surface-variant line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
