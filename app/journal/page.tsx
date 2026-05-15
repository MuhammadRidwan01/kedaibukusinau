import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import Link from "next/link";

export default function JournalPage() {
  const articles = [
    {
      id: "1",
      slug: "a-conversation-with-sally-rooney",
      category: "Interview",
      date: "May 05, 2026",
      readTime: "5 min",
      title: "A Conversation with Sally Rooney",
      excerpt: "The acclaimed author discusses the inspiration behind her latest novel and the complexities of human connection in the modern digital age.",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "2",
      slug: "analyzing-the-midnight-library",
      category: "Book Review",
      date: "Apr 28, 2026",
      readTime: "4 min",
      title: "Analyzing The Midnight Library",
      excerpt: "Matt Haig's fascinating concept of parallel lives offers comfort, but does the execution live up to the profoundly philosophical premise?",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "3",
      slug: "the-death-of-the-physical-bookstore",
      category: "Essay",
      date: "Apr 21, 2026",
      readTime: "12 min",
      title: "The Death of the Physical Bookstore?",
      excerpt: "With the rise of massive digital retailers and e-readers, independent bookstores are adapting their spaces into cultural community hubs.",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "4",
      slug: "nobel-prize-in-literature-2026-announced",
      category: "News",
      date: "Apr 15, 2026",
      readTime: "3 min",
      title: "Nobel Prize in Literature 2026 Announced",
      excerpt: "A surprising turn of events at the Swedish Academy as the prize goes to an unexpected voice from Southeast Asia.",
      imageUrl: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "5",
      slug: "dune-reevaluating-a-sci-fi-masterpiece",
      category: "Book Review",
      date: "Apr 10, 2026",
      readTime: "6 min",
      title: "Dune: Re-evaluating a Sci-Fi Masterpiece",
      excerpt: "Fifty years later, Frank Herbert's ecological epic remains chillingly relevant. We look back at the text that defined a generation.",
      imageUrl: "https://images.unsplash.com/photo-1629196914225-83c70624cd8c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "6",
      slug: "the-art-of-book-cover-design",
      category: "Editorial",
      date: "Apr 02, 2026",
      readTime: "7 min",
      title: "The Art of Book Cover Design",
      excerpt: "Don't judge a book by its cover? In the visual age of publishing, the jacket design is just as vital as the prose inside.",
      imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-theme-dark-bg min-h-screen flex flex-col text-theme-dark-text theme-dark">
      <PublicNavbar theme="dark" />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12">
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
          <h1 className="font-display-lg text-5xl md:text-6xl text-theme-dark-text tracking-tight mb-4">Articles & Book Reviews</h1>
          <p className="font-newsreader italic text-xl text-theme-dark-text/70 max-w-2xl">
            Essays, interviews, and deep dives into the literary world. A quiet space for thoughtful reading.
          </p>
        </div>

        {/* Featured Article Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          {/* Featured Thumbnail */}
          <div className="lg:col-span-8">
            <Link href="/journal/the-modern-return-to-minimalist-literature" className="relative overflow-hidden group cursor-pointer border border-theme-dark-text/10 block">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
              <img 
                className="w-full aspect-video md:aspect-[16/7] lg:aspect-video object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=1200&auto=format&fit=crop" 
                alt="Featured Article" 
              />
            </Link>
          </div>

          {/* Featured Content */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">Featured</span>
              <div className="flex items-center gap-2 font-newsreader italic text-sm text-theme-dark-text/60">
                <span>May 12, 2026</span>
                <span className="w-1 h-1 rounded-full bg-theme-dark-text/30"></span>
                <span>8 min read</span>
              </div>
            </div>
            <Link href="/journal/the-modern-return-to-minimalist-literature" className="font-headline-h2 text-4xl leading-tight mb-6 text-theme-dark-text cursor-pointer hover:text-primary transition-colors block">
              The Modern Return to Minimalist Literature
            </Link>
            <p className="font-body-md text-theme-dark-text/80 leading-loose mb-8">
              In an era defined by endless digital noise and maximalist content, readers are increasingly turning toward minimalist prose. We explore why authors are stripping back their narratives to the bare essentials, and why less truly is more.
            </p>
            <Link href="/journal/the-modern-return-to-minimalist-literature" className="font-newsreader uppercase tracking-widest text-xs font-semibold text-primary flex items-center gap-2 group w-max">
              Read Full Essay
              <span className="material-symbols-outlined font-light text-[18px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </Link>
          </div>
        </div>

        {/* Filter Tab Kategori */}
        <div className="flex flex-wrap justify-start gap-x-6 gap-y-4 mb-16 border-b border-theme-dark-text/10 pb-6">
          <button className="genre-chip !text-primary !border-b-primary font-newsreader text-lg italic bg-transparent border-b border-transparent pb-1 transition-all">All Articles</button>
          <button className="genre-chip font-newsreader text-lg italic text-theme-dark-text/60 hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Book Reviews</button>
          <button className="genre-chip font-newsreader text-lg italic text-theme-dark-text/60 hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Interviews</button>
          <button className="genre-chip font-newsreader text-lg italic text-theme-dark-text/60 hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">Essays</button>
          <button className="genre-chip font-newsreader text-lg italic text-theme-dark-text/60 hover:text-primary hover:border-b-primary bg-transparent border-b border-transparent pb-1 transition-all">News</button>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {articles.map((article) => (
            <Link key={article.id} href={`/journal/${article.slug}`} className="flex flex-col group cursor-pointer">
              <div className="relative overflow-hidden mb-6 border border-theme-dark-text/10">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                <img 
                  className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  src={article.imageUrl} 
                  alt={article.title} 
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-label-sm text-[9px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 bg-transparent text-theme-dark-text border border-theme-dark-text/40">{article.category}</span>
                <span className="font-newsreader italic text-[13px] text-theme-dark-text/60">{article.date} • {article.readTime}</span>
              </div>
              <h3 className="font-headline-h3 text-2xl text-theme-dark-text mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="font-body-md text-sm text-theme-dark-text/80 leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>

        {/* Editorial Pagination */}
        <div className="mt-24 pt-12 border-t border-theme-dark-text/10 flex justify-center">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="#" className="text-theme-dark-text/50 hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined font-light text-[24px]">arrow_left_alt</span>
              </Link>
            </li>
            <li>
              <Link href="#" className="font-newsreader text-2xl italic text-primary border-b border-primary pb-1">1</Link>
            </li>
            <li>
              <Link href="#" className="font-newsreader text-2xl text-theme-dark-text/50 hover:text-primary transition-colors">2</Link>
            </li>
            <li>
              <Link href="#" className="font-newsreader text-2xl text-theme-dark-text/50 hover:text-primary transition-colors">3</Link>
            </li>
            <li>
              <Link href="#" className="text-theme-dark-text/50 hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined font-light text-[24px]">arrow_right_alt</span>
              </Link>
            </li>
          </ul>
        </div>
      </main>

      <PublicFooter theme="dark" />
    </div>
  );
}
