import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Essays, interviews, and deep dives into the literary world. A quiet space for thoughtful reading.",
};

export default async function JournalPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("journal-page");
  const [articles, featuredArticle, articleCategories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "Published" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.article.findFirst({
      where: { status: "Published", isFeatured: true },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.articleCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true } } },
    }),
  ]);

  // Non-featured articles for the grid
  const gridArticles = articles.filter((a) => a.id !== featuredArticle?.id);
  const featured = featuredArticle || articles[0];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  return (
    <div className="bg-theme-dark-bg min-h-screen flex flex-col text-theme-dark-text">
      <PublicNavbar theme="dark" />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 theme-dark">
        {/* Breadcrumb */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-theme-dark-text/60 uppercase tracking-widest text-[11px]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-theme-dark-text font-semibold border-b border-primary">The Journal</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col mb-16 border-b border-theme-dark-text/10 pb-12">
          <h1 className="font-display-lg text-3xl sm:text-5xl md:text-6xl text-theme-dark-text tracking-tight mb-4">Articles & Book Reviews</h1>
          <p className="font-newsreader italic text-lg sm:text-xl text-theme-dark-text/70 max-w-2xl">
            Essays, interviews, and deep dives into the literary world. A quiet space for thoughtful reading.
          </p>
        </div>

        {/* Featured Article Block */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-8">
              <Link href={`/journal/${featured.slug}`} className="relative overflow-hidden group cursor-pointer border border-theme-dark-text/10 block">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                <Image 
                  className="w-full aspect-video md:aspect-[16/7] lg:aspect-video object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                  src={featured.imageUrl || ""} 
                  alt={featured.title}
                  width={900}
                  height={506}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </Link>
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">
                  {featured.category?.name || "Featured"}
                </span>
                <div className="flex items-center gap-2 font-newsreader italic text-sm text-theme-dark-text/60">
                  <span>{formatDate(featured.publishedAt)}</span>
                  {featured.readTime && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-theme-dark-text/30"></span>
                      <span>{featured.readTime} min read</span>
                    </>
                  )}
                </div>
              </div>
              <Link href={`/journal/${featured.slug}`} className="font-headline-h2 text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6 text-theme-dark-text cursor-pointer hover:text-primary transition-colors block">
                {featured.title}
              </Link>
              <p className="font-body-md text-theme-dark-text/80 leading-loose mb-8">
                {featured.excerpt}
              </p>
              <Link href={`/journal/${featured.slug}`} className="font-newsreader uppercase tracking-widest text-xs font-semibold text-primary flex items-center gap-2 group w-max">
                Read Full Essay
                <span className="material-symbols-outlined font-light text-[18px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
              </Link>
            </div>
          </div>
        )}

        {/* Filter Tab Kategori */}
        <div className="flex flex-wrap justify-start gap-x-6 gap-y-4 mb-16 border-b border-theme-dark-text/10 pb-6">
          <button className="genre-chip !text-primary !border-b-primary font-newsreader text-lg italic bg-transparent border-b border-transparent pb-1 transition-all">All Articles</button>
          {articleCategories.map((cat) => (
            <button key={cat.id} className="genre-chip font-newsreader text-lg italic text-theme-dark-text/60 hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">
              {cat.name}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {gridArticles.map((article) => (
            <Link key={article.id} href={`/journal/${article.slug}`} className="flex flex-col group cursor-pointer">
              <div className="relative overflow-hidden mb-6 border border-theme-dark-text/10">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                <Image 
                  className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  src={article.imageUrl || ""} 
                  alt={article.title}
                  width={500}
                  height={375}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">
                  {article.category?.name || "Article"}
                </span>
                <span className="font-newsreader italic text-[13px] text-theme-dark-text/60">
                  {formatDate(article.publishedAt)}
                  {article.readTime && ` • ${article.readTime} min`}
                </span>
              </div>
              <h3 className="font-headline-h3 text-2xl text-theme-dark-text mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="font-body-md text-sm text-theme-dark-text/80 leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <PublicFooter theme="dark" />
    </div>
  );
}
