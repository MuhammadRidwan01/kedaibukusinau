import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";

async function getBookData(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`book-${slug}`);

  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      author: true,
      publisher: true,
      category: true,
      genres: { include: { genre: true } },
    },
  });

  if (!book) return { book: null, relatedBooks: [] };

  const relatedBooks = await prisma.book.findMany({
    where: {
      status: "Active",
      categoryId: book.categoryId,
      id: { not: book.id },
    },
    include: { author: true },
    take: 4,
  });

  return { book, relatedBooks };
}

export async function generateStaticParams() {
  const books = await prisma.book.findMany({
    where: { status: "Active" },
    select: { slug: true },
  });
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { book } = await getBookData(slug);

  if (!book) return {};

  const title = `${book.title} by ${book.author?.name || "Unknown Author"}`;
  const description = book.synopsis?.substring(0, 160) || `Buy ${book.title} at Kedai Sinau.`;

  return {
    title: book.title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: `/catalog/${slug}`,
      images: [
        {
          url: book.imageUrl || "/og-image.png",
          width: 800,
          height: 1200,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [book.imageUrl || "/og-image.png"],
    },
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  "use cache";
  const { slug } = await params;
  cacheLife("hours");
  cacheTag(`book-page-${slug}`);

  const { book, relatedBooks } = await getBookData(slug);

  if (!book) return notFound();

  const synopsisParagraphs = book.synopsis ? book.synopsis.split("\n").filter(Boolean) : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: book.title,
    image: book.imageUrl || undefined,
    description: book.synopsis?.substring(0, 300) || undefined,
    isbn: book.isbn || undefined,
    author: book.author ? { "@type": "Person", name: book.author.name } : undefined,
    publisher: book.publisher ? { "@type": "Organization", name: book.publisher.name } : undefined,
    offers: {
      "@type": "Offer",
      price: book.price,
      priceCurrency: "IDR",
      availability: book.availability === "Available"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/catalog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <PublicNavbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px] flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/catalog" className="hover:text-primary transition-colors">Books</Link>
            <span className="opacity-50">/</span>
            <span className="text-on-surface font-semibold border-b border-primary">{book.title}</span>
          </div>
        </div>

        {/* Book Detail Museum Plaque */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start mb-24">

          {/* Left: Floating Book Cover */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-[80%] sm:w-[65%] md:w-[70%]">
              {/* Deco lines */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-10 sm:w-16 h-10 sm:h-16 border-t-[2px] border-l-[2px] border-outline-variant transition-all duration-700 z-0"></div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-10 sm:w-16 h-10 sm:h-16 border-b-[2px] border-r-[2px] border-outline-variant transition-all duration-700 z-0"></div>

              <div className="relative z-10 shadow-2xl">
                {book.badge && (
                  <span className={`book-badge font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-white/95 backdrop-blur-sm border absolute top-3 left-3 z-10 ${
                    book.badge === "Best Seller" ? "book-badge--bestseller" :
                    book.badge === "New" ? "book-badge--new" :
                    "book-badge--diskon"
                  }`}>
                    {book.badge}
                  </span>
                )}
                <span className={`book-badge font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-white/95 backdrop-blur-sm border absolute top-3 right-3 z-10 ${book.availability === 'Available' ? 'text-secondary border-secondary' : 'text-primary border-primary'}`}>
                  {book.availability}
                </span>
                {book.imageUrl && (
                  <Image alt={book.title} className="w-full aspect-[2/3] object-cover editorial-inner" src={book.imageUrl} width={600} height={900} sizes="(max-width: 768px) 70vw, 35vw" priority />
                )}
              </div>
            </div>
          </div>

          {/* Right: Editorial Details */}
          <div className="md:col-span-6 md:col-start-7 flex flex-col pt-8 md:pt-0">

            {/* Category Labels */}
            <div className="flex items-center gap-6 mb-6">
              <span className="w-12 h-[1px] bg-primary/30"></span>
              <span className="font-label-sm uppercase tracking-[0.2em] text-[10px] text-primary">{book.category?.name || "Uncategorized"}</span>
            </div>

            {/* Title & Action Block */}
            <div className="flex flex-col gap-6 mb-10 border-b border-outline-variant/50 pb-10">
              <div className="flex flex-col gap-2">
                <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-2 text-on-surface">
                  {book.title}
                </h1>
                <span className="font-newsreader italic text-2xl text-on-surface-variant">{book.author?.name || "Unknown"}</span>
              </div>

              {/* Price & CTAs */}
              <div className="flex flex-col gap-6 pt-2">
                <div className="flex items-center gap-4">
                  {book.originalPrice && (
                    <>
                      <span className="font-headline-h3 text-lg text-on-surface-variant/50 line-through">Rp {book.originalPrice.toLocaleString("id-ID")}</span>
                      <span className="font-label-sm text-[10px] tracking-widest uppercase bg-primary/90 text-white px-3 py-1">
                        -{Math.round((1 - book.price / book.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <div className="font-headline-h3 text-4xl text-on-surface">Rp {book.price.toLocaleString("id-ID")}</div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#" className="flex-1 flex items-center justify-center gap-3 bg-primary text-white font-newsreader uppercase tracking-widest text-xs px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /><text x="12" y="16.5" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" fill="currentColor" textAnchor="middle" stroke="none">S</text></svg>
                    Buy on Shopee
                  </a>
                  <a href="https://wa.me/620000000000" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 border border-outline text-on-surface font-newsreader uppercase tracking-widest text-xs px-8 py-4 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 group">
                    <svg className="w-5 h-5 group-hover:fill-white fill-[#1A1A1A] transition-colors" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            {synopsisParagraphs.length > 0 && (
              <div className="mb-10">
                <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant opacity-70 mb-4 block">Synopsis</span>
                {synopsisParagraphs.map((paragraph, idx) => (
                  <p key={idx} className={`font-body-md text-base leading-loose text-on-surface-variant text-justify ${idx > 0 ? "mt-4" : ""}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Data Ledger */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-outline-variant/50 pt-8 mb-10">
              {book.isbn && (
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant opacity-70">ISBN</span>
                  <span className="font-newsreader text-sm tracking-wide text-on-surface">{book.isbn}</span>
                </div>
              )}
              {book.publisher && (
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant opacity-70">Publisher</span>
                  <span className="font-newsreader text-sm tracking-wide text-on-surface">{book.publisher.name}</span>
                </div>
              )}
              {book.year && (
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant opacity-70">Year</span>
                  <span className="font-newsreader text-sm tracking-wide text-on-surface">{book.year}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex flex-col gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant opacity-70">Pages</span>
                  <span className="font-newsreader text-sm tracking-wide text-on-surface">{book.pages} p.</span>
                </div>
              )}
              {book.genres.length > 0 && (
                <div className="flex flex-col gap-2 col-span-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-widest text-on-surface-variant opacity-70">Genres</span>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((bg) => (
                      <span key={bg.genre.id} className="font-newsreader text-sm tracking-wide text-on-surface border border-outline-variant/50 px-3 py-1">
                        {bg.genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <div className="mt-32 pt-16 border-t border-outline-variant">
            <div className="text-center flex flex-col items-center gap-4 mb-16">
              <span className="font-headline-h1 uppercase tracking-[0.2em] text-xs text-on-surface-variant">Further Reading</span>
              <h2 className="font-headline-h2 text-headline-h2 text-on-surface italic">Related Books</h2>
              <div className="w-12 h-[1px] bg-primary mt-2"></div>
            </div>

            {/* The Grid (Gallery Layout) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-16 gap-x-8">
              {relatedBooks.map((relatedBook, index) => (
                <BookCard
                  key={relatedBook.id}
                  slug={relatedBook.slug}
                  title={relatedBook.title}
                  author={relatedBook.author?.name || "Unknown"}
                  price={relatedBook.price}
                  imageUrl={relatedBook.imageUrl || ""}
                  staggered={index % 2 === 1}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      <PublicFooter />
    </>
  );
}
