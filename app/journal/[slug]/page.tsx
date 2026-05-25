import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BookCard } from "@/components/ui/BookCard";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";

async function getArticleData(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`article-${slug}`);

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) return { article: null, relatedArticles: [], recommendedBooks: [] };

  const relatedArticles = await prisma.article.findMany({
    where: { status: "Published", id: { not: article.id } },
    include: { category: true },
    take: 2,
  });

  const recommendedBooks = await prisma.book.findMany({
    where: { status: "Active" },
    include: { author: true },
    take: 4,
  });

  return { article, relatedArticles, recommendedBooks };
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "Published" },
    select: { slug: true },
  });
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticleData(slug);

  if (!article) return {};

  const title = article.title;
  const description = article.excerpt || article.content.substring(0, 160);

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: `/journal/${slug}`,
      images: [
        {
          url: article.imageUrl || "/og-image.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [article.imageUrl || "/og-image.png"],
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  "use cache";
  const { slug } = await params;
  cacheLife("hours");
  cacheTag(`article-page-${slug}`);

  const { article, relatedArticles, recommendedBooks } = await getArticleData(slug);

  if (!article) return notFound();

  const dateStr = article.publishedAt?.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) || "";

  const readTimeStr = article.readTime ? `${article.readTime} min read` : "5 min read";

  return (
    <div className="bg-theme-dark-bg min-h-screen flex flex-col text-theme-dark-text theme-dark">
      <PublicNavbar theme="dark" />
      
      <main className="flex-grow w-full max-w-[1000px] mx-auto px-6 py-12">
        
        {/* Breadcrumb */}
        <div className="mb-16">
          <div className="flex items-center gap-2 font-label-sm text-theme-dark-text/60 uppercase tracking-widest text-[11px] flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/journal" className="hover:text-primary transition-colors">The Journal</Link>
            <span className="opacity-50">/</span>
            <span className="text-theme-dark-text font-semibold border-b border-primary">{article.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="flex flex-col items-center text-center mb-16 max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">{article.category?.name || "Editorial"}</span>
            <div className="flex items-center gap-2 font-newsreader italic text-sm text-theme-dark-text/60">
              <span>{dateStr}</span>
              <span className="w-1 h-1 rounded-full bg-theme-dark-text/30"></span>
              <span>{readTimeStr}</span>
            </div>
          </div>
          <h1 className="font-display-lg text-5xl md:text-6xl lg:text-7xl text-theme-dark-text tracking-tight leading-[1.1]">
            {article.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="w-full relative mb-20 border border-theme-dark-text/10 shadow-lg">
          <img className="w-full aspect-video md:aspect-[21/9] object-cover grayscale" src={article.imageUrl || ""} alt="Hero Image" />
        </div>

        {/* Article Content */}
        <div 
          className="max-w-[700px] mx-auto prose prose-invert prose-stone prose-lg prose-p:font-body-md prose-p:text-theme-dark-text/80 prose-p:leading-loose prose-p:my-8 prose-headings:font-headline-h2 prose-headings:text-theme-dark-text prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-blockquote:border-l-[3px] prose-blockquote:border-primary prose-blockquote:pl-8 prose-blockquote:font-newsreader prose-blockquote:italic prose-blockquote:text-2xl md:prose-blockquote:text-3xl prose-blockquote:text-theme-dark-text prose-blockquote:my-16 prose-blockquote:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-4 prose-ul:marker:text-primary prose-li:text-theme-dark-text/80 prose-img:w-full prose-img:border prose-img:border-theme-dark-text/10 prose-img:shadow-lg prose-img:grayscale prose-img:my-16 prose-a:text-primary hover:prose-a:text-primary/80 prose-p:first-of-type:first-letter:text-7xl prose-p:first-of-type:first-letter:font-newsreader prose-p:first-of-type:first-letter:text-theme-dark-text prose-p:first-of-type:first-letter:float-left prose-p:first-of-type:first-letter:mr-4 prose-p:first-of-type:first-letter:mt-2 prose-p:first-of-type:first-letter:leading-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <hr className="border-theme-dark-text/10 my-32 max-w-[700px] mx-auto" />

        {/* Related Articles */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="font-headline-h2 text-3xl md:text-4xl text-theme-dark-text italic">Continue Reading</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-[900px] mx-auto">
            {relatedArticles.map((related) => (
              <Link href={`/journal/${related.slug}`} key={related.id} className="flex flex-col group cursor-pointer">
                <div className="relative overflow-hidden mb-6 border border-theme-dark-text/10">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                  <img className="w-full aspect-[16/9] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" src={related.imageUrl || ""} alt={related.title} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">{related.category?.name || "Journal"}</span>
                  <span className="font-newsreader italic text-[13px] text-theme-dark-text/60">{related.publishedAt?.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
                </div>
                <h3 className="font-headline-h3 text-2xl text-theme-dark-text group-hover:text-primary transition-colors">{related.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Books */}
        <div>
          <div className="text-center mb-16">
            <h2 className="font-headline-h2 text-3xl md:text-4xl text-theme-dark-text italic">Books in this Essay</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8">
            {recommendedBooks.map((book, index) => (
              <Link key={book.id} href={`/catalog/${book.slug}`} className={`flex flex-col gap-6 group cursor-pointer ${index % 2 === 1 ? 'md:mt-8' : ''}`}>
                <div className="relative p-4 bg-surface-bright/5 border border-theme-dark-text/10 shadow-sm transition-all duration-500 group-hover:-translate-y-2">
                  <img alt={book.title} className="book-cover w-full object-cover" src={book.imageUrl || ""} />
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <span className="font-label-sm text-[10px] uppercase tracking-[0.2em] text-theme-dark-text/60">{book.author?.name || "Unknown"}</span>
                  <h3 className="font-headline-h3 text-lg text-theme-dark-text line-clamp-2">{book.title}</h3>
                  <span className="font-newsreader font-semibold text-base text-primary mt-1">Rp {book.price.toLocaleString("id-ID")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <PublicFooter theme="dark" />
    </div>
  );
}
